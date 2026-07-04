import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import DataError from "@/components/DataError";
import MarketView from "@/components/market/MarketView";
import { getMarketItems } from "@/lib/tarkov/market";
import type { MarketItem } from "@/lib/tarkov/types";
import styles from "../page.module.css";

export const metadata: Metadata = {
  title: "타르코프 시세 — 벼룩시장 · 트레이더 아이템 가격 (PvP)",
  description:
    "Escape from Tarkov PvP 인기 아이템 실시간 시세. 벼룩시장 가격, 트레이더 최고 매입가, 슬롯당 가격, 변동률을 정렬해서 비교.",
  alternates: { canonical: "/market" },
};

export const revalidate = 300;

export default async function MarketPage() {
  let items: MarketItem[] | null = null;
  try {
    items = await getMarketItems("regular");
  } catch {
    items = null;
  }

  return (
    <>
      <div className={styles.topAd}>
        <AdSlot />
      </div>
      <main className={styles.main}>
        <h1 className={styles.srOnly}>타르코프 아이템 시세 — 벼룩시장·트레이더 가격 비교 (PvP)</h1>
        {items ? <MarketView items={items} mode="regular" /> : <DataError />}
      </main>
    </>
  );
}
