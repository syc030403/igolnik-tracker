/**
 * 시세 카테고리 — tarkov.dev handbook 카테고리 기반.
 * slug는 URL 세그먼트라 게임모드 세그먼트("pve")와 겹치면 안 된다.
 * Maps(6종)·Money(3종)는 거래 대상이 아니라서, Task items는 퀘스트 페이지 몫이라 제외.
 */
/**
 * handbook은 normalizedName으로 다룬다 — items(handbookCategoryNames:)는
 * "현지화된" 카테고리명과 매칭되므로 언어별 이름을 API에서 먼저 해석해야 한다.
 * english는 해석 실패 시 폴백.
 */
export const MARKET_CATEGORIES = [
  { slug: "barter", normalized: "barter-items", english: "Barter items" },
  { slug: "keys", normalized: "keys", english: "Keys" },
  { slug: "meds", normalized: "medication", english: "Medication" },
  { slug: "food", normalized: "provisions", english: "Provisions" },
  { slug: "gear", normalized: "gear", english: "Gear" },
  { slug: "weapons", normalized: "weapons", english: "Weapons" },
  { slug: "mods", normalized: "weapon-parts-mods", english: "Weapon parts & mods" },
  { slug: "special", normalized: "special-equipment", english: "Special equipment" },
  { slug: "info", normalized: "info-items", english: "Info items" },
] as const;

export type CategorySlug = (typeof MARKET_CATEGORIES)[number]["slug"];

export function findCategory(slug: string) {
  return MARKET_CATEGORIES.find((c) => c.slug === slug) ?? null;
}
