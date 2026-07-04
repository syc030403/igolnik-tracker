/** API 캘리버 코드 → 표시명 */
const CALIBER_NAMES: Record<string, string> = {
  Caliber545x39: "5.45×39",
  Caliber556x45NATO: "5.56×45",
  Caliber762x39: "7.62×39",
  Caliber762x51: "7.62×51",
  Caliber762x54R: "7.62×54R",
  Caliber9x39: "9×39",
  Caliber762x35: ".300 BLK",
  Caliber9x19PARA: "9×19",
  Caliber9x18PM: "9×18",
  Caliber9x18PMM: "9×18 PMM",
  Caliber9x21: "9×21",
  Caliber1143x23ACP: ".45 ACP",
  Caliber762x25TT: "7.62×25",
  Caliber46x30: "4.6×30",
  Caliber57x28: "5.7×28",
  Caliber366TKM: ".366 TKM",
  Caliber127x55: "12.7×55",
  Caliber86x70: ".338 Lapua",
  Caliber68x51: "6.8×51",
  Caliber9x33R: ".357 Magnum",
  Caliber127x33: ".50 AE",
  Caliber12g: "12게이지",
  Caliber20g: "20게이지",
  Caliber23x75: "23×75",
  Caliber762x67: ".300 Win Mag",
  Caliber127x99: ".50 BMG",
  Caliber93x64: "9.3×64",
  Caliber784x49: ".308 ME",
  Caliber20x1mm: "20×1mm",
};

/** 조명탄·유탄 등 표에서 제외할 캘리버 */
export const EXCLUDED_CALIBERS = new Set(["Caliber26x75", "Caliber40x46"]);

/** 필터 탭/그룹 정렬 순서. 앞쪽이 주력 소총탄. 목록에 없으면 뒤로. */
const CALIBER_ORDER = [
  "5.45×39",
  "5.56×45",
  "7.62×39",
  "7.62×51",
  "7.62×54R",
  "9×39",
  ".300 BLK",
  "6.8×51",
  ".338 Lapua",
  ".300 Win Mag",
  "12.7×55",
  ".366 TKM",
  ".50 BMG",
  "9.3×64",
  ".308 ME",
  "9×19",
  "9×18",
  "9×18 PMM",
  "9×21",
  "7.62×25",
  ".45 ACP",
  "4.6×30",
  "5.7×28",
  ".357 Magnum",
  ".50 AE",
  "12게이지",
  "20게이지",
  "23×75",
];

export function caliberDisplayName(apiCaliber: string | null): string {
  if (!apiCaliber) return "기타";
  return CALIBER_NAMES[apiCaliber] ?? apiCaliber.replace(/^Caliber/, "");
}

export function caliberSortIndex(display: string): number {
  const i = CALIBER_ORDER.indexOf(display);
  return i === -1 ? CALIBER_ORDER.length : i;
}
