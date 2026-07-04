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

export function fmtPercent(n: number | null | undefined): string {
  if (n == null) return "—";
  return Math.round(n * 100) + "%";
}
