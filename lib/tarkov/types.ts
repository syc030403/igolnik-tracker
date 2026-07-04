/** tarkov.dev gameMode 파라미터. API 기본값은 regular(PvP) */
export type GameMode = "regular" | "pve";

export interface TraderPrice {
  price: number;
  priceRUB: number;
  currency: string;
  vendorName: string;
  minTraderLevel: number | null;
}

export interface BarterSource {
  traderName: string;
  level: number;
  requiredItems: { count: number; name: string }[];
}

export interface CraftSource {
  stationName: string;
  level: number;
  requiredItems: { count: number; name: string }[];
}

/** 게임모드별 플리마켓 시세 스냅샷 */
export interface ModePrice {
  lastLowPrice: number | null;
  changeLast48hPercent: number | null;
}

/**
 * 탄약 팩(ammoBox) 시세. 탄약 단품은 플리마켓 거래 금지지만
 * 팩은 거래 가능하며 PvP/PvE 가격이 다르다.
 */
export interface AmmoPackInfo {
  id: string;
  name: string;
  count: number;
  pvp: ModePrice;
  pve: ModePrice;
}

export interface AmmoEntry {
  id: string;
  /** 표시용 캘리버 (예: "5.45×39") */
  caliber: string;
  name: string;
  shortName: string;
  /** 한/영/약칭 검색용으로 정규화해 합쳐둔 문자열 */
  searchText: string;
  damage: number;
  projectileCount: number;
  penetrationPower: number;
  armorDamage: number;
  fragmentationChance: number;
  initialSpeed: number | null;
  recoilModifier: number | null;
  accuracyModifier: number | null;
  fleaBanned: boolean;
  lastLowPrice: number | null;
  avg24hPrice: number | null;
  changeLast48hPercent: number | null;
  iconLink: string | null;
  wikiLink: string | null;
  traderPrices: TraderPrice[];
  barters: BarterSource[];
  crafts: CraftSource[];
  /** 플리마켓 거래 가능한 탄약 팩 (없으면 null) */
  pack: AmmoPackInfo | null;
}

export interface AmmoGroup {
  caliber: string;
  rows: AmmoEntry[];
}

export interface MarketItem {
  id: string;
  name: string;
  shortName: string;
  searchText: string;
  iconLink: string | null;
  width: number;
  height: number;
  fleaBanned: boolean;
  lastLowPrice: number | null;
  changeLast48hPercent: number | null;
  /** 플리마켓 제외 트레이더 최고 매입가 (RUB 환산) */
  bestTraderPrice: number | null;
  bestTraderName: string | null;
}

export interface PricePoint {
  price: number;
  timestamp: number;
}
