/**
 * 방어구 관통 확률 근사 (내구도 100% 기준 추정치).
 *
 * BSG는 정확한 공식을 공개하지 않는다. 아래는 커뮤니티가 게임 코드 분석으로
 * 확인해 탄도 계산기들(Desmos armor pen calculator, tarkov-ballistics 등)이
 * 공용하는 근사식이다. UI에도 "추정치" 문구를 반드시 유지할 것.
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
