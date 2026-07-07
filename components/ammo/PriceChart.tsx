"use client";

import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/components/LocaleProvider";
import { fmtChangePercent, fmtRubCompact } from "@/lib/format";
import type { GameMode, PricePoint } from "@/lib/tarkov/types";
import styles from "./DetailPanel.module.css";

/**
 * 캔들스틱 시세 차트.
 * API가 이력을 30일까지만 보관하므로 (진짜 주봉·월봉은 불가)
 * 1D=1시간봉 / 7D=6시간봉 / 1M=일봉으로 구성한다.
 */
type Range = "1d" | "7d" | "1m";

const RANGE_CONFIG: Record<
  Range,
  { days: 1 | 7 | 30; bucketMs: number; label: string; baseOffsetMs: number; baseLabelKey: 'vsPrev' | 'vsDayAgo' | 'vsWeekAgo' }
> = {
  "1d": {
    days: 1,
    bucketMs: 3_600_000,
    label: "1D",
    baseOffsetMs: 0, // 0 = 직전 봉 대비
    baseLabelKey: "vsPrev",
  },
  "7d": {
    days: 7,
    bucketMs: 21_600_000,
    label: "7D",
    baseOffsetMs: 86_400_000,
    baseLabelKey: "vsDayAgo",
  },
  "1m": {
    days: 30,
    bucketMs: 86_400_000,
    label: "1M",
    baseOffsetMs: 604_800_000,
    baseLabelKey: "vsWeekAgo",
  },
};

interface Candle {
  t: number; // 버킷 시작 시각
  open: number;
  high: number;
  low: number;
  close: number;
}

// 세션 내 간단 캐시 — 같은 아이템을 다시 눌러도 재요청하지 않는다
const cache = new Map<string, PricePoint[]>();

export default function PriceChart({
  itemId,
  mode = "regular",
}: {
  itemId: string;
  mode?: GameMode;
}) {
  const { dict } = useI18n();
  const [range, setRange] = useState<Range>("7d");
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
    fetch(`/api/history/${itemId}?days=${RANGE_CONFIG[range].days}&mode=${mode}`)
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

  const candles = useMemo(
    () => (points ? toCandles(points, RANGE_CONFIG[range].bucketMs) : null),
    [points, range],
  );

  // 탭별 변동률: 1D는 직전 봉, 7D는 1일 전, 1M은 1주 전 종가 대비
  const change = useMemo(() => {
    if (!candles || candles.length < 2) return null;
    const cfg = RANGE_CONFIG[range];
    const last = candles[candles.length - 1];
    let base: Candle;
    if (cfg.baseOffsetMs === 0) {
      base = candles[candles.length - 2];
    } else {
      const target = last.t - cfg.baseOffsetMs;
      base = candles.reduce(
        (best, c) => (Math.abs(c.t - target) < Math.abs(best.t - target) ? c : best),
        candles[0],
      );
    }
    if (!base.close) return null;
    return {
      pct: ((last.close - base.close) / base.close) * 100,
      label: dict[cfg.baseLabelKey],
    };
  }, [candles, range, dict]);

  return (
    <>
      <div className={styles.rangeRow}>
        <div className={styles.rangeTabs}>
          {(Object.keys(RANGE_CONFIG) as Range[]).map((r) => (
            <button
              key={r}
              className={range === r ? styles.rangeTabActive : styles.rangeTab}
              onClick={() => setRange(r)}
            >
              {RANGE_CONFIG[r].label}
            </button>
          ))}
        </div>
        {change && (
          <span className={change.pct >= 0 ? styles.changeUp : styles.changeDown}>
            {fmtChangePercent(change.pct)}
            <span className={styles.changePeriod}>{change.label}</span>
          </span>
        )}
      </div>
      {failed || (candles && candles.length < 2) ? (
        <div className={styles.chartEmpty}>{dict.noHistory}</div>
      ) : !candles ? (
        <div className={styles.chartEmpty}>{dict.loading}</div>
      ) : (
        <LineChart candles={candles} range={range} up={change ? change.pct >= 0 : true} />
      )}
    </>
  );
}

/** 포인트를 버킷 단위 OHLC 캔들로 집계. 빈 버킷은 건너뛴다. */
function toCandles(points: PricePoint[], bucketMs: number): Candle[] {
  const byBucket = new Map<number, PricePoint[]>();
  for (const p of points) {
    const b = Math.floor(p.timestamp / bucketMs) * bucketMs;
    const list = byBucket.get(b) ?? [];
    list.push(p);
    byBucket.set(b, list);
  }
  return [...byBucket.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([t, list]) => {
      const prices = list.map((p) => p.price);
      return {
        t,
        open: list[0].price,
        close: list[list.length - 1].price,
        high: Math.max(...prices),
        low: Math.min(...prices),
      };
    });
}

// 뷰박스 좌표계 (viewBox 고정, 가로만 스케일).
// 탄약표·시세 차트를 통일하려고 .chart에 max-width를 두어 렌더 폭을 맞춘다.
const W = 274;
const H = 216;
const M = { top: 11, right: 47, bottom: 19, left: 6 } as const;
const PLOT_W = W - M.left - M.right;
const PLOT_H = H - M.top - M.bottom;

function fmtTick(ts: number, range: Range): string {
  const d = new Date(ts);
  if (range === "1d")
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function fmtTooltipTime(ts: number, range: Range): string {
  const d = new Date(ts);
  const md = `${d.getMonth() + 1}/${d.getDate()}`;
  if (range === "1m") return md;
  return `${md} ${String(d.getHours()).padStart(2, "0")}:00`;
}

function LineChart({
  candles,
  range,
  up,
}: {
  candles: Candle[];
  range: Range;
  up: boolean;
}) {
  const { dict } = useI18n();
  const [hover, setHover] = useState<number | null>(null);

  const { xOf, yOf, min, max, line, area, xTicks } = useMemo(() => {
    // 꺾은선은 각 구간의 종가를 잇는다.
    // 플리마켓 스캔 데이터에는 단발 이상 호가(평소의 10배 등)가 끼므로
    // 종가의 5~95 퍼센타일로 스케일을 잡고 그 밖은 플롯 경계에 클램프한다.
    const closes = candles.map((c) => c.close);
    const q = (arr: number[], f: number) => {
      const s = [...arr].sort((a, b) => a - b);
      return s[Math.min(s.length - 1, Math.max(0, Math.round((s.length - 1) * f)))];
    };
    const lastClose = closes[closes.length - 1];
    const dataMin = Math.min(q(closes, 0.05), lastClose);
    const dataMax = Math.max(q(closes, 0.95), lastClose);
    // 변동 폭이 작을 때 미세 등락이 급등락처럼 보이지 않도록
    // 중간값의 최소 12% 범위를 보장하고 위아래 8% 여유를 둔다. 가격은 음수 불가.
    const mid = (dataMin + dataMax) / 2;
    const rawSpan = Math.max(dataMax - dataMin, Math.max(mid * 0.12, 1));
    const pad = rawSpan * 0.08;
    const min = Math.max(0, mid - rawSpan / 2 - pad);
    const max = mid + rawSpan / 2 + pad;

    const bucketMs = RANGE_CONFIG[range].bucketMs;
    const t0 = candles[0].t;
    const t1 = candles[candles.length - 1].t + bucketMs;
    const tSpan = t1 - t0;
    const xOf = (t: number) => M.left + ((t + bucketMs / 2 - t0) / tSpan) * PLOT_W;
    const yOf = (price: number) => {
      const y = M.top + (1 - (price - min) / (max - min)) * PLOT_H;
      return Math.max(M.top, Math.min(M.top + PLOT_H, y));
    };

    const pts = candles.map((c) => [xOf(c.t), yOf(c.close)] as const);
    const line = pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
    const baseY = M.top + PLOT_H;
    const area = `${pts[0][0].toFixed(1)},${baseY} ${line} ${pts[pts.length - 1][0].toFixed(1)},${baseY}`;

    const xTicks = [0, 0.5, 1].map((f) => ({
      x: M.left + f * PLOT_W,
      label: fmtTick(t0 + f * (t1 - t0), range),
      anchor: f === 0 ? "start" : f === 1 ? "end" : "middle",
    }));
    return { xOf, yOf, min, max, line, area, xTicks };
  }, [candles, range]);

  const last = candles[candles.length - 1];
  const lastY = yOf(last.close);
  // 선·현재가 태그 색은 변동률(+초록/−빨강)과 일치시킨다
  const color = up ? "var(--up)" : "var(--down)";
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
    candles.forEach((c, i) => {
      const d = Math.abs(xOf(c.t) - x);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    setHover(best);
  };

  const hv = hover != null ? candles[hover] : null;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={styles.chart}
      role="img"
      aria-label={dict.chartAria}
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
          y={H - 5}
          textAnchor={t.anchor as "start" | "middle" | "end"}
          className={styles.axisLabel}
        >
          {t.label}
        </text>
      ))}

      {/* 영역 + 꺾은선 */}
      <polygon points={area} fill={color} fillOpacity="0.09" stroke="none" />
      <polyline
        points={line}
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* 현재가(마지막 종가) 태그 */}
      <line
        x1={M.left}
        x2={M.left + PLOT_W}
        y1={lastY}
        y2={lastY}
        stroke={color}
        strokeWidth="0.6"
        strokeDasharray="2 3"
        opacity="0.7"
      />
      <circle cx={xOf(last.t)} cy={lastY} r="2.4" fill={color} />
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
        {fmtRubCompact(last.close)}
      </text>

      {/* 호버 십자선 + 툴팁(시각 · 종가) */}
      {hv && (
        <g pointerEvents="none">
          <line
            x1={xOf(hv.t)}
            x2={xOf(hv.t)}
            y1={M.top}
            y2={M.top + PLOT_H}
            stroke="var(--text-faint)"
            strokeWidth="0.8"
            strokeDasharray="3 2"
          />
          <circle cx={xOf(hv.t)} cy={yOf(hv.close)} r="2.6" fill={color} stroke="var(--bg)" strokeWidth="1" />
          <text
            x={xOf(hv.t) < W / 2 ? xOf(hv.t) + 5 : xOf(hv.t) - 5}
            y={M.top + 9}
            textAnchor={xOf(hv.t) < W / 2 ? "start" : "end"}
            className={styles.tooltipText}
          >
            {fmtTooltipTime(hv.t, range)} · {fmtRubCompact(hv.close)}
          </text>
        </g>
      )}
    </svg>
  );
}
