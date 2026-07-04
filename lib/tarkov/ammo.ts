import { tarkovQuery } from "./api";
import { AMMO_ALIASES, aliasesFor, normalizeSearch } from "./aliases";
import { EXCLUDED_CALIBERS, caliberDisplayName, caliberSortIndex } from "./calibers";
import type { Locale } from "@/lib/i18n/locales";
import type { AmmoEntry, AmmoGroup, AmmoPackInfo, GameMode, ModePrice } from "./types";

const AMMO_QUERY = /* GraphQL */ `
  query AmmoTable($lang: LanguageCode) {
    ammo(lang: $lang) {
      caliber
      ammoType
      damage
      projectileCount
      penetrationPower
      armorDamage
      fragmentationChance
      initialSpeed
      recoilModifier
      accuracyModifier
      item {
        id
        name
        shortName
        types
        iconLink
        wikiLink
        lastLowPrice
        avg24hPrice
        changeLast48hPercent
        buyFor {
          price
          priceRUB
          currency
          vendor {
            name
            normalizedName
            ... on TraderOffer {
              minTraderLevel
            }
          }
        }
        bartersFor {
          level
          trader {
            name
          }
          requiredItems {
            count
            item {
              name
              shortName
            }
          }
        }
        craftsFor {
          level
          station {
            name
          }
          requiredItems {
            count
            item {
              name
              shortName
            }
          }
        }
      }
    }
  }
`;

interface RawAmmo {
  caliber: string | null;
  ammoType: string;
  damage: number;
  projectileCount: number | null;
  penetrationPower: number;
  armorDamage: number;
  fragmentationChance: number;
  initialSpeed: number | null;
  recoilModifier: number | null;
  accuracyModifier: number | null;
  item: {
    id: string;
    name: string;
    shortName: string;
    types: string[];
    iconLink: string | null;
    wikiLink: string | null;
    lastLowPrice: number | null;
    avg24hPrice: number | null;
    changeLast48hPercent: number | null;
    buyFor: {
      price: number;
      priceRUB: number;
      currency: string;
      vendor: { name: string; normalizedName: string; minTraderLevel?: number | null };
    }[];
    bartersFor: {
      level: number;
      trader: { name: string };
      requiredItems: { count: number; item: { name: string; shortName: string } }[];
    }[];
    craftsFor: {
      level: number;
      station: { name: string };
      requiredItems: { count: number; item: { name: string; shortName: string } }[];
    }[];
  };
}

/** 탄약 스펙은 변동이 드묾 — 1시간 ISR */
export const AMMO_REVALIDATE = 3600;

/** 팩 시세는 시세 정책(5분)을 따른다 */
const PACK_REVALIDATE = 300;

const PACKS_QUERY = /* GraphQL */ `
  query AmmoPacks($gameMode: GameMode, $lang: LanguageCode) {
    items(type: ammoBox, gameMode: $gameMode, lang: $lang, limit: 500) {
      id
      name
      types
      lastLowPrice
      lastOfferCount
      changeLast48hPercent
      containsItems {
        count
        item {
          id
        }
      }
    }
  }
`;

interface RawPack {
  id: string;
  name: string;
  types: string[];
  lastLowPrice: number | null;
  lastOfferCount: number | null;
  changeLast48hPercent: number | null;
  containsItems: { count: number; item: { id: string } }[] | null;
}

/**
 * 탄약 단품 id → 플리마켓 거래 가능한 팩 시세 매핑.
 * 같은 탄약의 팩이 여러 개인 경우가 있다 (용량 차이 + 데이터가 빈 유령 중복까지).
 * 가격이 전무한 팩은 버리고, 남은 것 중 호가 수(유동성)가 가장 많은 팩을 대표로 쓴다
 * — 최대 용량 기준은 호가 1개짜리 비유동 팩의 튀는 가격을 집어올 수 있다.
 * 시세는 부가 정보라 실패해도 탄약표 자체는 떠야 한다 → null 폴백.
 */
async function getPackMap(lang: Locale): Promise<Map<string, AmmoPackInfo>> {
  const map = new Map<string, AmmoPackInfo>();
  try {
    const [pvp, pve] = await Promise.all(
      (["regular", "pve"] as GameMode[]).map((gameMode) =>
        tarkovQuery<{ items: RawPack[] }>(PACKS_QUERY, { gameMode, lang }, PACK_REVALIDATE),
      ),
    );
    const pveById = new Map(pve.items.map((p) => [p.id, p]));
    const candidates = new Map<
      string,
      { pack: RawPack; count: number; pvePrice: ModePrice; liquidity: number }[]
    >();

    for (const pack of pvp.items) {
      if (pack.types.includes("noFlea")) continue;
      const contained = pack.containsItems?.[0];
      if (!contained) continue;
      const pvePack = pveById.get(pack.id);
      const pvePrice: ModePrice = {
        lastLowPrice: pvePack?.lastLowPrice ?? null,
        changeLast48hPercent: pvePack?.changeLast48hPercent ?? null,
      };
      if (pack.lastLowPrice == null && pvePrice.lastLowPrice == null) continue;
      const liquidity = (pack.lastOfferCount ?? 0) + (pvePack?.lastOfferCount ?? 0);
      const list = candidates.get(contained.item.id) ?? [];
      list.push({ pack, count: contained.count, pvePrice, liquidity });
      candidates.set(contained.item.id, list);
    }

    for (const [roundId, list] of candidates) {
      const best = list.sort((a, b) => b.liquidity - a.liquidity || b.count - a.count)[0];
      map.set(roundId, {
        id: best.pack.id,
        name: best.pack.name,
        count: best.count,
        pvp: {
          lastLowPrice: best.pack.lastLowPrice,
          changeLast48hPercent: best.pack.changeLast48hPercent,
        },
        pve: best.pvePrice,
      });
    }
  } catch {
    // 팩 시세 실패 시 조용히 생략 (탄약표는 정상 노출)
  }
  return map;
}

export async function getAmmoGroups(lang: Locale): Promise<AmmoGroup[]> {
  const [data, packMap] = await Promise.all([
    tarkovQuery<{ ammo: RawAmmo[] }>(AMMO_QUERY, { lang }, AMMO_REVALIDATE),
    getPackMap(lang),
  ]);

  const entries: AmmoEntry[] = data.ammo
    // 총기 탄약만 (조명탄·유탄 제외)
    .filter(
      (a) =>
        (a.ammoType === "bullet" || a.ammoType === "buckshot") &&
        !EXCLUDED_CALIBERS.has(a.caliber ?? ""),
    )
    .map((a) => {
      const caliber = caliberDisplayName(a.caliber);
      const alias = aliasesFor(AMMO_ALIASES, a.item.name, a.item.shortName);
      return {
        id: a.item.id,
        caliber,
        name: a.item.name,
        shortName: a.item.shortName,
        searchText: normalizeSearch(`${a.item.name} ${a.item.shortName} ${caliber} ${alias}`),
        damage: a.damage,
        projectileCount: a.projectileCount ?? 1,
        penetrationPower: a.penetrationPower,
        armorDamage: a.armorDamage,
        fragmentationChance: a.fragmentationChance,
        initialSpeed: a.initialSpeed,
        recoilModifier: a.recoilModifier,
        accuracyModifier: a.accuracyModifier,
        fleaBanned: a.item.types.includes("noFlea"),
        lastLowPrice: a.item.lastLowPrice,
        avg24hPrice: a.item.avg24hPrice,
        changeLast48hPercent: a.item.changeLast48hPercent,
        iconLink: a.item.iconLink,
        wikiLink: a.item.wikiLink,
        traderPrices: a.item.buyFor
          .filter((b) => b.vendor.normalizedName !== "flea-market")
          .map((b) => ({
            price: b.price,
            priceRUB: b.priceRUB,
            currency: b.currency,
            vendorName: b.vendor.name,
            minTraderLevel: b.vendor.minTraderLevel ?? null,
          }))
          .sort((x, y) => x.priceRUB - y.priceRUB),
        barters: a.item.bartersFor.map((b) => ({
          traderName: b.trader.name,
          level: b.level,
          requiredItems: b.requiredItems.map((r) => ({
            count: r.count,
            name: r.item.shortName || r.item.name,
          })),
        })),
        crafts: a.item.craftsFor.map((c) => ({
          stationName: c.station.name,
          level: c.level,
          requiredItems: c.requiredItems.map((r) => ({
            count: r.count,
            name: r.item.shortName || r.item.name,
          })),
        })),
        pack: packMap.get(a.item.id) ?? null,
      };
    });

  const byCaliber = new Map<string, AmmoEntry[]>();
  for (const e of entries) {
    const list = byCaliber.get(e.caliber) ?? [];
    list.push(e);
    byCaliber.set(e.caliber, list);
  }

  return [...byCaliber.entries()]
    .map(([caliber, rows]) => ({
      caliber,
      rows: rows.sort((a, b) => b.penetrationPower - a.penetrationPower),
    }))
    .sort(
      (a, b) =>
        caliberSortIndex(a.caliber) - caliberSortIndex(b.caliber) ||
        a.caliber.localeCompare(b.caliber),
    );
}
