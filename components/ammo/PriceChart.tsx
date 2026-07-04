"use client";

import { useEffect, useMemo, useState } from "react";
import { fmtRub, fmtRubCompact } from "@/lib/format";
import type { GameMode, PricePoint } from "@/lib/tarkov/types";
import styles from "./DetailPanel.module.css";

type Range = "24h" | "7d";

// 세션 내 간단 캐시 — 같은 탄약을 다시 눌러도 재요청하지 않는다
const cache = new Map<string, PricePoint[]>();

export default function PriceChart({
  itemId,
  up,
  mode = "regular",
}: {
  itemId: string;
  up: boolean;
  mode?: GameMode;
}) {
  const [range, setRange] = useState<Range>("24h");
  const [points, setPoints] = useState<PricePoint[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const key = `${itemId}:${range}:${mode}`;
    const cached = cache.get(key);
    if (cached) {
      setPoints(cached);
      return;
    }
    let cancelled = false;
    setPoints(null);
    setFailed(false);
    fetch(`/api/history/${itemId}?days=${range === "7d" ? 7 : 1}&mode=${mode}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: PricePoint[]) => {
        if (cancelled) return;
        cache.set(key, data);
        setPoints(data);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [itemId, range, mode]);

  const color = up ? "var(--up)" : "var(--down)";

  return (
    <>
      <div className={styles.rangeTabs}>
        {(["24h", "7d"] as const).map((r) => (
          <button
            key={r}
            className={range === r ? styles.rangeTabActive : styles.rangeTab}
            onClick={() => setRange(r)}
          >
            {r === "24h" ? "24H" : "7일"}
          </button>
        ))}
      </div>
      {failed || (points && points.length < 2) ? (
        <div className={styles.chartEmpty}>가격 이력 데이터 없음</div>
      ) : !points ? (
        <div className={styles.chartEmpty}>불러오는 중…</div>
      ) : (
        <Chart points={points} color={color} range={range} />
      )}
    </>
  );
}

// 뷰박스 좌표계 (viewBox 고정, 가로만 스케일)
const W = 274;
const H = 118;
const M = { top: 8, right: 42, bottom: 16, left: 4 } as const;
const PLOT_W = W - M.left - M.right;
const PLOT_H = H - M.top - M.bottom;

function fmtTick(ts: number, range: Range): string {
  const d = new Date(ts);
  if (range === "7d") return `${d.getMonth() + 1}/${d.getDate()}`;
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function fmtTooltipTime(ts: number): string {
  const d = new Date(ts);
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes(),
  ).padStart(2, "0")}`;
}

function Chart({ points, color, range }: { points: PricePoint[]; color: string; range: Range }) {
  const [hover, setHover] = useState<number | null>(null);

  const { coords, poly, area, min, max, xTicks } = useMemo(() => {
    const prices = points.map((p) => p.price);
    const dataMin = Math.min(...prices);
    const dataMax = Math.max(...prices);
    // Y축 도메인 보정: 변동 폭이 작을 때(예: ±1%) 그대로 스케일하면
    // 미세한 등락이 차트 전체 높이를 채워 급등락처럼 보인다.
    // 중간값의 최소 12% 범위를 보장하고 위아래 8% 여유를 둔다.
    const mid = (dataMin + dataMax) / 2;
    const minSpan = Math.max(mid * 0.12, 1);
    const rawSpan = Math.max(dataMax - dataMin, minSpan);
    const pad = rawSpan * 0.08;
    const min = mid - rawSpan / 2 - pad;
    const max = mid + rawSpan / 2 + pad;
    const span = max - min;
    const t0 = points[0].timestamp;
    const t1 = points[points.length - 1].timestamp;
    const tSpan = t1 - t0 || 1;
    const coords = points.map((p) => ({
      x: M.left + ((p.timestamp - t0) / tSpan) * PLOT_W,
      y: M.top + (1 - (p.price - min) / span) * PLOT_H,
    }));
    const poly = coords.map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(" ");
    const area = `${coords[0].x.toFixed(1)},${M.top + PLOT_H} ${poly} ${coords[coords.length - 1].x.toFixed(1)},${M.top + PLOT_H}`;
    // 시간축 눈금 3개 (시작/중간/끝)
    const xTicks = [0, 0.5, 1].map((f) => ({
      x: M.left + f * PLOT_W,
      label: fmtTick(t0 + f * tSpan, range),
      anchor: f === 0 ? "start" : f === 1 ? "end" : "middle",
    }));
    return { coords, poly, area, min, max, xTicks };
  }, [points, range]);

  const yOf = (price: number) =>
    M.top + (1 - (price - min) / (max - min || 1)) * PLOT_H;

  const last = points[points.length - 1];
  const lastY = yOf(last.price);
  const yTicks = [
    { y: yOf(max), label: fmtRubCompact(max) },
    { y: yOf((min + max) / 2), label: fmtRubCompact((min + max) / 2) },
    { y: yOf(min), label: fmtRubCompact(min) },
  ];

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    let best = 0;
    let bestDist = Infinity;
    coords.forEach((c, i) => {
      const d = Math.abs(c.x - x);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    setHover(best);
  };

  const hv = hover != null ? { p: points[hover], c: coords[hover] } : null;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={styles.chart}
      role="img"
      aria-label="가격 추이 그래프"
      onPointerMove={onMove}
      onPointerLeave={() => setHover(null)}
    >
      {/* 가격 그리드라인 + 우측 가격축 */}
      {yTicks.map((t, i) => (
        <g key={i}>
          <line
            x1={M.left}
            x2={M.left + PLOT_W}
            y1={t.y}
            y2={t.y}
            stroke="var(--row-line)"
            strokeWidth="1"
          />
          <text x={W - M.right + 5} y={t.y + 3} className={styles.axisLabel}>
            {t.label}
          </text>
        </g>
      ))}
      {/* 시간축 */}
      {xTicks.map((t, i) => (
        <text
          key={i}
          x={t.x}
          y={H - 4}
          textAnchor={t.anchor as "start" | "middle" | "end"}
          className={styles.axisLabel}
        >
          {t.label}
        </text>
      ))}

      <polygon points={area} fill={color} fillOpacity="0.09" stroke="none" />
      <polyline
        points={poly}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* 현재가 태그 (우측 축, 강조색) */}
      <rect
        x={W - M.right + 2}
        y={lastY - 7}
        width={M.right - 4}
        height={14}
        rx={2}
        fill={color}
        fillOpacity="0.18"
      />
      <text x={W - M.right + 5} y={lastY + 3} className={styles.axisLabelStrong} fill={color}>
        {fmtRubCompact(last.price)}
      </text>
      <circle cx={coords[coords.length - 1].x} cy={lastY} r="2.2" fill={color} />

      {/* 호버 십자선 + 툴팁 */}
      {hv && (
        <g pointerEvents="none">
          <line
            x1={hv.c.x}
            x2={hv.c.x}
            y1={M.top}
            y2={M.top + PLOT_H}
            stroke="var(--text-faint)"
            strokeWidth="0.8"
            strokeDasharray="3 2"
          />
          <circle cx={hv.c.x} cy={hv.c.y} r="3" fill={color} stroke="var(--bg)" strokeWidth="1" />
          <text
            x={hv.c.x < W / 2 ? hv.c.x + 6 : hv.c.x - 6}
            y={M.top + 9}
            textAnchor={hv.c.x < W / 2 ? "start" : "end"}
            className={styles.tooltipText}
          >
            {fmtTooltipTime(hv.p.timestamp)} · {fmtRub(hv.p.price)}
          </text>
        </g>
      )}
    </svg>
  );
}
