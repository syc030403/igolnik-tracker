"use client";

import { useEffect, useState } from "react";
import { fmtRub } from "@/lib/format";
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
        <Chart points={points} color={color} />
      )}
    </>
  );
}

function Chart({ points, color }: { points: PricePoint[]; color: string }) {
  const W = 274;
  const H = 68;
  const pad = 6;
  const prices = points.map((p) => p.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const span = max - min || 1;
  const coords = points.map((p, i) => {
    const x = pad + (i * (W - 2 * pad)) / (points.length - 1);
    const y = pad + (1 - (p.price - min) / span) * (H - 2 * pad);
    return [x, y] as const;
  });
  const poly = coords.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${coords[0][0].toFixed(1)},${H - pad} ${poly} ${coords[coords.length - 1][0].toFixed(1)},${H - pad}`;

  return (
    <>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className={styles.chart}
        role="img"
        aria-label="가격 추이 그래프"
      >
        <polygon points={area} fill={color} fillOpacity="0.09" stroke="none" />
        <polyline
          points={poly}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
      <div className={styles.chartMinMax}>
        <span>저 {fmtRub(min)}</span>
        <span>고 {fmtRub(max)}</span>
      </div>
    </>
  );
}
