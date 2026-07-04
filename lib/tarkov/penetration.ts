/**
 * 방어구 관통 확률 (커뮤니티에 문서화된 BSG 탄도 공식, 내구도 100% 기준).
 * https://escapefromtarkov.fandom.com/wiki/Ballistics
 *
 * 내구도 D(%)에서 방어구의 유효 저항:
 *   f = (121 - 5000 / (45 + 2D)) * class * 10 * 0.01
 * D=100이면 f ≈ class * 10.
 *
 * - pen >= f          : (100 + pen / (0.9f - pen)) %
 * - f-15 < pen < f    : 0.4 * (f - pen - 15)^2 %
 * - pen <= f-15       : 0 %
 */
export function penetrationChance(penetrationPower: number, armorClass: number): number {
  const d = 100;
  const f = (121 - 5000 / (45 + d * 2)) * armorClass * 10 * 0.01;
  let chance: number;
  if (penetrationPower >= f) {
    chance = 100 + penetrationPower / (0.9 * f - penetrationPower);
  } else if (penetrationPower > f - 15) {
    chance = 0.4 * (f - penetrationPower - 15) ** 2;
  } else {
    chance = 0;
  }
  return Math.max(0, Math.min(100, Math.round(chance)));
}

export type PenTier = "good" | "mid" | "low" | "block";

/** 4단계 구간: 관통 70%+ / 애매 40~69% / 불안정 18~39% / 막힘 ~17% */
export function penTier(pct: number): PenTier {
  if (pct >= 70) return "good";
  if (pct >= 40) return "mid";
  if (pct >= 18) return "low";
  return "block";
}
