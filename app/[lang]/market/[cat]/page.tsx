import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import DataError from "@/components/DataError";
import MarketView from "@/components/market/MarketView";
import { getDict } from "@/lib/i18n/dictionaries";
import { LOCALES, isLocale, localePath, type Locale } from "@/lib/i18n/locales";
import { findCategory } from "@/lib/tarkov/categories";
import { getMarketItemsByCategory } from "@/lib/tarkov/market";
import type { MarketItem } from "@/lib/tarkov/types";
import styles from "../../page.module.css";

// 카테고리 페이지는 빌드 타임에 프리렌더하지 않는다 —
// 카테고리×모드×언어 조합마다 API를 두들기면 무료 API에 부담이고 빌드도 느려진다.
// 첫 방문 시 렌더 후 ISR(5분) 캐시.
export function generateStaticParams() {
  return [];
}
export const dynamicParams = true;
export const revalidate = 300;

interface Params {
  params: Promise<{ lang: string; cat: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { lang, cat } = await params;
  const locale: Locale = isLocale(lang) ? lang : "ko";
  const dict = getDict(locale);
  const category = findCategory(cat);
  if (!category) return {};
  const label = dict.categories[category.slug] ?? category.slug;
  return {
    title: {
      absolute: `${dict.metaCatTitle.replace("{cat}", label).replace("{mode}", "PvP")} | Igolnik Tracker`,
    },
    description: dict.metaCatDesc.replace("{cat}", label).replace("{mode}", "PvP"),
    alternates: {
      canonical: localePath(locale, `/market/${category.slug}`),
      languages: Object.fromEntries([
        ...LOCALES.map((l) => [l, localePath(l, `/market/${category.slug}`)]),
        ["x-default", `/market/${category.slug}`],
      ]),
    },
  };
}

export default async function MarketCategoryPage({ params }: Params) {
  const { lang, cat } = await params;
  const locale: Locale = isLocale(lang) ? lang : "ko";
  const dict = getDict(locale);
  const category = findCategory(cat);
  if (!category) notFound();

  let items: MarketItem[] | null = null;
  try {
    items = await getMarketItemsByCategory(category, "regular", locale);
  } catch {
    items = null;
  }

  const label = dict.categories[category.slug] ?? category.slug;

  return (
    <>
      <div className={styles.topAd}>
        <AdSlot />
      </div>
      <main className={styles.main}>
        <h1 className={styles.srOnly}>
          {dict.metaCatTitle.replace("{cat}", label).replace("{mode}", "PvP")}
        </h1>
        {items ? (
          <MarketView items={items} mode="regular" cat={category.slug} />
        ) : (
          <DataError title={dict.errTitle} desc={dict.errDesc} />
        )}
      </main>
    </>
  );
}
