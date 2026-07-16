import type { Metadata } from "next";
import AdBanner from "@/components/AdBanner";
import DataError from "@/components/DataError";
import GuideSection from "@/components/GuideSection";
import QuestView from "@/components/quest/QuestView";
import { getDict } from "@/lib/i18n/dictionaries";
import { getGuide } from "@/lib/i18n/guides";
import { LOCALES, isLocale, localePath, type Locale } from "@/lib/i18n/locales";
import { getQuestItems } from "@/lib/tarkov/quests";
import type { QuestItem } from "@/lib/tarkov/types";
import styles from "../page.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "ko";
  const dict = getDict(locale);
  return {
    title: { absolute: `${dict.metaQuestTitle} | Igolnik Tracker` },
    description: dict.metaQuestDesc,
    alternates: {
      canonical: localePath(locale, "/quests"),
      languages: Object.fromEntries([
        ...LOCALES.map((l) => [l, localePath(l, "/quests")]),
        ["x-default", "/quests"],
      ]),
    },
  };
}

// 퀘스트 데이터는 패치 때만 변함 — 1시간 ISR
export const revalidate = 3600;

export default async function QuestsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "ko";
  const dict = getDict(locale);

  let items: QuestItem[] | null = null;
  try {
    items = await getQuestItems(locale);
  } catch {
    items = null;
  }

  return (
    <>
      {items && (
        <div className={styles.topAd}>
          <AdBanner />
        </div>
      )}
      <main className={styles.main}>
        <h1 className={styles.srOnly}>{dict.h1Quest}</h1>
        {items ? (
          <QuestView items={items} />
        ) : (
          <DataError title={dict.errTitle} desc={dict.errDesc} />
        )}
        <GuideSection guide={getGuide(locale, "quests")} />
      </main>
    </>
  );
}
