import { tarkovQuery } from "./api";
import { normalizeSearch } from "./aliases";
import type { Locale } from "@/lib/i18n/locales";
import type { QuestItem, QuestNeed } from "./types";

const QUESTS_QUERY = /* GraphQL */ `
  query QuestItems($lang: LanguageCode) {
    tasks(lang: $lang) {
      name
      minPlayerLevel
      kappaRequired
      trader {
        name
      }
      objectives {
        type
        ... on TaskObjectiveItem {
          count
          foundInRaid
          items {
            id
            name
            shortName
            iconLink
            width
            height
          }
        }
      }
    }
  }
`;

interface RawTask {
  name: string;
  minPlayerLevel: number;
  kappaRequired: boolean;
  trader: { name: string };
  objectives: {
    type: string;
    count?: number | null;
    foundInRaid?: boolean | null;
    items?: {
      id: string;
      name: string;
      shortName: string;
      iconLink: string | null;
      width: number;
      height: number;
    }[] | null;
  }[];
}

/** 통화 아이템(루블·달러·유로) — 체크리스트에서 제외 */
const CURRENCY_IDS = new Set([
  "5449016a4bdc2d6f028b456f", // RUB
  "5696686a4bdc2da3298b456a", // USD
  "569668774bdc2da2298b4568", // EUR
]);

/** 퀘스트 데이터는 패치 때만 변함 — 1시간 ISR */
export const QUESTS_REVALIDATE = 3600;

export async function getQuestItems(lang: Locale): Promise<QuestItem[]> {
  const data = await tarkovQuery<{ tasks: RawTask[] }>(
    QUESTS_QUERY,
    { lang },
    QUESTS_REVALIDATE,
  );

  const byItem = new Map<string, QuestItem>();

  for (const task of data.tasks) {
    for (const obj of task.objectives) {
      if (obj.type !== "giveItem" || !obj.items || obj.items.length === 0) continue;
      // 넘길 아이템 목표. items 배열은 "이 중 아무거나" 후보인데,
      // 대부분 1종이라 대표(첫 항목) 기준으로 집계한다.
      const it = obj.items[0];
      if (CURRENCY_IDS.has(it.id)) continue;
      const count = obj.count ?? 1;
      const fir = !!obj.foundInRaid;

      const need: QuestNeed = {
        taskName: task.name,
        trader: task.trader.name,
        count,
        foundInRaid: fir,
        minLevel: task.minPlayerLevel,
        kappa: task.kappaRequired,
      };

      const existing = byItem.get(it.id);
      if (existing) {
        existing.totalCount += count;
        if (fir) existing.firCount += count;
        existing.kappa = existing.kappa || task.kappaRequired;
        existing.needs.push(need);
      } else {
        byItem.set(it.id, {
          id: it.id,
          name: it.name,
          shortName: it.shortName,
          searchText: normalizeSearch(`${it.name} ${it.shortName}`),
          iconLink: it.iconLink,
          width: it.width,
          height: it.height,
          totalCount: count,
          firCount: fir ? count : 0,
          kappa: task.kappaRequired,
          needs: [need],
        });
      }
    }
  }

  // 여러 퀘스트에 걸친 아이템 우선, 그다음 총 수량 많은 순
  return [...byItem.values()]
    .map((q) => ({
      ...q,
      needs: q.needs.sort((a, b) => a.minLevel - b.minLevel),
    }))
    .sort(
      (a, b) => b.needs.length - a.needs.length || b.totalCount - a.totalCount,
    );
}
