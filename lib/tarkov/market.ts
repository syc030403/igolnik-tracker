import { tarkovQuery } from "./api";
import { MARKET_ALIASES, aliasesFor, normalizeSearch } from "./aliases";
import type { Locale } from "@/lib/i18n/locales";
import type { GameMode, MarketItem } from "./types";

/**
 * 시세 페이지 큐레이션 목록 (인기 물물교환/하이드아웃 아이템).
 * 전체 아이템 페칭은 무료 API에 부담이므로 대표 품목만 고정 관리한다.
 */
const MARKET_ITEM_IDS = [
  "5c0530ee86f774697952d952", // LEDX
  "59faff1d86f7746c51718c9c", // Physical Bitcoin
  "57347ca924597744596b4e71", // Graphics card
  "5c052fb986f7746b2101e909", // UHF RFID Reader
  "5c12613b86f7743bbe2c3f76", // Intelligence folder
  "5c1267ee86f77416ec610f72", // Prokill medallion
  "5c052e6986f7746b207bc3c9", // Portable defibrillator
  "5af0534a86f7743b6f354284", // Ophthalmoscope
  "5d1b36a186f7742523398433", // Metal fuel tank
  "5d1b385e86f774252167b98a", // Water filter
  "59e35cbb86f7741778269d83", // Corrugated hose
  "590c2e1186f77425357b6124", // Toolset
  "590a3efd86f77437d351a25b", // Gas analyzer
  "5c12688486f77426843c7d32", // Paracord
  "544fb45d4bdc2dee738b4568", // Salewa
  "590c595c86f7747884343ad7", // Gas mask air filter
  "5734758f24597738025ee253", // Golden neck chain
  "5e2af29386f7746d4159f077", // KEKTAPE duct tape
  "5734795124597738002c6176", // Insulating tape
  "57347c5b245977448d35f6e1", // Bolts
] as const;

const MARKET_QUERY = /* GraphQL */ `
  query MarketItems($ids: [ID], $gameMode: GameMode, $lang: LanguageCode) {
    items(lang: $lang, ids: $ids, gameMode: $gameMode) {
      id
      name
      shortName
      types
      iconLink
      width
      height
      lastLowPrice
      changeLast48hPercent
      sellFor {
        priceRUB
        vendor {
          name
          normalizedName
        }
      }
    }
  }
`;

interface RawMarketItem {
  id: string;
  name: string;
  shortName: string;
  types: string[];
  iconLink: string | null;
  width: number;
  height: number;
  lastLowPrice: number | null;
  changeLast48hPercent: number | null;
  sellFor: { priceRUB: number; vendor: { name: string; normalizedName: string } }[];
}

/** 시세는 자주 변함 — 5분 ISR */
export const MARKET_REVALIDATE = 300;

function mapRawItem(it: RawMarketItem): MarketItem {
  const traderOffers = it.sellFor.filter((s) => s.vendor.normalizedName !== "flea-market");
  const best = traderOffers.reduce<RawMarketItem["sellFor"][number] | null>(
    (acc, cur) => (acc === null || cur.priceRUB > acc.priceRUB ? cur : acc),
    null,
  );
  const alias = aliasesFor(MARKET_ALIASES, it.name, it.shortName);
  return {
    id: it.id,
    // API 데이터에 끝 공백이 붙은 이름이 있다 (예: "USEC 인식표 ")
    name: it.name.trim(),
    shortName: it.shortName.trim(),
    searchText: normalizeSearch(`${it.name} ${it.shortName} ${alias}`),
    iconLink: it.iconLink,
    width: it.width,
    height: it.height,
    fleaBanned: it.types.includes("noFlea"),
    lastLowPrice: it.lastLowPrice,
    changeLast48hPercent: it.changeLast48hPercent,
    bestTraderPrice: best?.priceRUB ?? null,
    bestTraderName: best?.vendor.name ?? null,
  };
}

/** 시세는 게임모드별로 다르므로 모드마다 따로 페칭·캐싱한다 */
export async function getMarketItems(gameMode: GameMode, lang: Locale): Promise<MarketItem[]> {
  const data = await tarkovQuery<{ items: RawMarketItem[] }>(
    MARKET_QUERY,
    { ids: [...MARKET_ITEM_IDS], gameMode, lang },
    MARKET_REVALIDATE,
  );
  return data.items.map(mapRawItem);
}

const HANDBOOK_QUERY = /* GraphQL */ `
  query HandbookNames($lang: LanguageCode) {
    handbookCategories(lang: $lang) {
      name
      normalizedName
    }
  }
`;

/**
 * handbookCategoryNames 필터는 요청 언어로 현지화된 이름과 매칭되므로
 * normalizedName → 해당 언어 이름을 먼저 해석한다. 목록은 거의 안 변함 — 1시간 캐시.
 */
async function resolveHandbookName(
  normalized: string,
  english: string,
  lang: Locale,
): Promise<string> {
  try {
    const data = await tarkovQuery<{
      handbookCategories: { name: string; normalizedName: string }[];
    }>(HANDBOOK_QUERY, { lang }, 3600);
    return data.handbookCategories.find((c) => c.normalizedName === normalized)?.name ?? english;
  } catch {
    return english;
  }
}

const CATEGORY_QUERY = /* GraphQL */ `
  query MarketCategory($categories: [String!], $gameMode: GameMode, $lang: LanguageCode) {
    items(handbookCategoryNames: $categories, gameMode: $gameMode, lang: $lang, limit: 3000) {
      id
      name
      shortName
      types
      iconLink
      width
      height
      lastLowPrice
      changeLast48hPercent
      sellFor {
        priceRUB
        vendor {
          name
          normalizedName
        }
      }
    }
  }
`;

/**
 * 카테고리 전체 아이템 시세. 파츠처럼 2천 종이 넘는 카테고리도 있으므로
 * 빌드 타임 프리렌더 없이 온디맨드 ISR로만 쓴다.
 * 플리마켓·트레이더 어느 쪽에도 가격이 없는 아이템(기본 주머니 등)은 뺀다.
 */
export async function getMarketItemsByCategory(
  category: { normalized: string; english: string },
  gameMode: GameMode,
  lang: Locale,
): Promise<MarketItem[]> {
  const localizedName = await resolveHandbookName(category.normalized, category.english, lang);
  const data = await tarkovQuery<{ items: RawMarketItem[] }>(
    CATEGORY_QUERY,
    { categories: [localizedName], gameMode, lang },
    MARKET_REVALIDATE,
  );
  const items = data.items
    .map(mapRawItem)
    .filter((it) => it.lastLowPrice != null || it.bestTraderPrice != null);
  return dedupeTraderOnlyVariants(items);
}

/**
 * 이름까지 완전히 같은 트레이더 전용 변형 정리 (독택 이벤트/프레스티지 변형 등 —
 * 영문 기준으로도 동일명이라 구분 정보가 없다). 트레이더가가 가장 높은 1개만 남긴다.
 * 플리 가격이 있는 동명 아이템(포스터 등 실제 구분되는 매물)은 그대로 둔다.
 */
function dedupeTraderOnlyVariants(items: MarketItem[]): MarketItem[] {
  const bestByName = new Map<string, MarketItem>();
  for (const it of items) {
    if (it.lastLowPrice != null) continue;
    const cur = bestByName.get(it.name);
    if (!cur || (it.bestTraderPrice ?? 0) > (cur.bestTraderPrice ?? 0)) {
      bestByName.set(it.name, it);
    }
  }
  return items.filter((it) => it.lastLowPrice != null || bestByName.get(it.name) === it);
}
