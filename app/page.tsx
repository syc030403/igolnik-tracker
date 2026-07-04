import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import AmmoView from "@/components/ammo/AmmoView";
import { getAmmoGroups } from "@/lib/tarkov/ammo";
import styles from "./page.module.css";

export const metadata: Metadata = {
  // 루트 세그먼트 page에는 layout의 title.template이 적용되지 않아 절대값으로 지정
  title: { absolute: "타르코프 탄약표 — 관통력 · 방어구 관통 확률 | Igolnik Tracker" },
  description:
    "Escape from Tarkov 전 캘리버 탄약 성능표. 관통력, 데미지, 방어구 등급 1~6 관통 확률을 색상으로 한눈에. 탄약별 시세와 획득처(트레이더·물물교환·제작)까지 확인.",
  alternates: { canonical: "/" },
};

export const revalidate = 3600;

export default async function AmmoPage() {
  const groups = await getAmmoGroups();

  return (
    <>
      <div className={styles.topAd}>
        <AdSlot />
      </div>
      <main className={styles.main}>
        <h1 className={styles.srOnly}>타르코프 탄약 성능표 — 캘리버별 관통력·데미지</h1>
        <AmmoView groups={groups} />
      </main>
    </>
  );
}
