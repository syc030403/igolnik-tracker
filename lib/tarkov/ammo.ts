import { tarkovQuery } from "./api";
import { AMMO_ALIASES, aliasesFor, normalizeSearch } from "./aliases";
import { EXCLUDED_CALIBERS, caliberDisplayName, caliberSortIndex } from "./calibers";
import type { AmmoEntry, AmmoGroup } from "./types";

const AMMO_QUERY = /* GraphQL */ `
  query AmmoTable {
    ammo(lang: ko) {
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

export async function getAmmoGroups(): Promise<AmmoGroup[]> {
  const data = await tarkovQuery<{ ammo: RawAmmo[] }>(AMMO_QUERY, undefined, AMMO_REVALIDATE);

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
