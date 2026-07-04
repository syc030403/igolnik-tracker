export function fmtRub(n: number | null | undefined): string {
  if (n == null || n === 0) return "—";
  return n.toLocaleString("en-US") + "₽";
}

export function fmtChangePercent(n: number | null | undefined): string {
  if (n == null) return "—";
  return (n >= 0 ? "+" : "") + n.toFixed(1) + "%";
}

/** 반동/정확도 보정: API의 소수 비율(0.1 = +10%)을 퍼센트로 */
export function fmtModifier(n: number | null | undefined): string {
  if (n == null) return "—";
  const pct = Math.round(n * 100);
  if (pct === 0) return "—";
  return (pct > 0 ? "+" : "") + pct + "%";
}

/** 축 라벨용 축약 표기: 1,234,567 → 1.23M, 70,000 → 70K */
export function fmtRubCompact(n: number): string {
  if (Math.abs(n) >= 1_000_000) {
    return (n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 2).replace(/\.?0+$/, "") + "M";
  }
  if (Math.abs(n) >= 1_000) {
    return (n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1).replace(/\.0$/, "") + "K";
  }
  return String(Math.round(n));
}

export function fmtPercent(n: number | null | undefined): string {
  if (n == null) return "—";
  return Math.round(n * 100) + "%";
}
