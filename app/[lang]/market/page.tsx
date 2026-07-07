import type { Metadata } from "next";
import AdBanner from "@/components/AdBanner";
import DataError from "@/components/DataError";
import MarketView from "@/components/market/MarketView";
import { getDict } from "@/lib/i18n/dictionaries";
import { LOCALES, isLocale, localePath, type Locale } from "@/lib/i18n/locales";
import { getMarketItems } from "@/lib/tarkov/market";
import type { MarketItem } from "@/lib/tarkov/types";
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
    title: { absolute: `${dict.metaMarketTitle} | Igolnik Tracker` },
    description: dict.metaMarketDesc,
    alternates: {
      canonical: localePath(locale, "/market"),
      languages: Object.fromEntries([
        ...LOCALES.map((l) => [l, localePath(l, "/market")]),
        ["x-default", "/market"],
      ]),
    },
  };
}

export const revalidate = 300;

export default async function MarketPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "ko";
  const dict = getDict(locale);

  let items: MarketItem[] | null = null;
  try {
    items = await getMarketItems("regular", locale);
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
        <h1 className={styles.srOnly}>{dict.h1Market}</h1>
        {items ? <MarketView items={items} mode="regular" /> : <DataError title={dict.errTitle} desc={dict.errDesc} />}
      </main>
    </>
  );
}
