import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import MarketView from "@/components/market/MarketView";
import { getMarketItems } from "@/lib/tarkov/market";
import styles from "../../page.module.css";

export const metadata: Metadata = {
  title: "타르코프 PVE 시세 — 벼룩시장 · 트레이더 아이템 가격",
  description:
    "Escape from Tarkov PVE 모드 인기 아이템 실시간 시세. PVE 벼룩시장 가격, 트레이더 최고 매입가, 슬롯당 가격, 변동률을 정렬해서 비교.",
  alternates: { canonical: "/market/pve" },
};

export const revalidate = 300;

export default async function MarketPvePage() {
  const items = await getMarketItems("pve");

  return (
    <>
      <div className={styles.topAd}>
        <AdSlot />
      </div>
      <main className={styles.main}>
        <h1 className={styles.srOnly}>타르코프 PVE 아이템 시세 — 벼룩시장·트레이더 가격 비교</h1>
        <MarketView items={items} mode="pve" />
      </main>
    </>
  );
}
