import type { Metadata } from "next";
import AdBanner from "@/components/AdBanner";
import DataError from "@/components/DataError";
import AmmoView from "@/components/ammo/AmmoView";
import GuideSection from "@/components/GuideSection";
import { getDict } from "@/lib/i18n/dictionaries";
import { LOCALES, isLocale, localePath, type Locale } from "@/lib/i18n/locales";
import { getGuide } from "@/lib/i18n/guides";
import { getAmmoGroups } from "@/lib/tarkov/ammo";
import type { AmmoGroup } from "@/lib/tarkov/types";
import styles from "./page.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "ko";
  const dict = getDict(locale);
  return {
    // 루트 세그먼트 page에는 layout의 title.template이 적용되지 않아 절대값으로 지정
    title: { absolute: dict.metaHomeTitle },
    description: dict.metaHomeDesc,
    alternates: {
      canonical: localePath(locale, "/"),
      languages: Object.fromEntries([
        ...LOCALES.map((l) => [l, localePath(l, "/")]),
        ["x-default", "/"],
      ]),
    },
  };
}

// 탄약 스펙 fetch는 자체적으로 1시간 캐시되고,
// 상세 패널의 팩 시세(5분 캐시)를 위해 페이지는 5분마다 재생성한다
export const revalidate = 300;

export default async function AmmoPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "ko";
  const dict = getDict(locale);

  // API 일시 장애가 빌드·페이지를 죽이면 안 된다 — 폴백 렌더 후 다음 ISR 주기에 복구
  let groups: AmmoGroup[] | null = null;
  try {
    groups = await getAmmoGroups(locale);
  } catch {
    groups = null;
  }

  return (
    <>
      {groups && (
        <div className={styles.topAd}>
          <AdBanner />
        </div>
      )}
      <main className={styles.main}>
        <h1 className={styles.srOnly}>{dict.h1Home}</h1>
        {groups ? <AmmoView groups={groups} /> : <DataError title={dict.errTitle} desc={dict.errDesc} />}
        <GuideSection guide={getGuide(locale, "ammo")} />
      </main>
    </>
  );
}
