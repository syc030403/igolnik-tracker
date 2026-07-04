"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useMemo, useState } from "react";
import AdSlot from "@/components/AdSlot";
import PriceChart from "@/components/ammo/PriceChart";
import { useSearch } from "@/components/SearchProvider";
import { fmtChangePercent, fmtRub } from "@/lib/format";
import { normalizeSearch } from "@/lib/tarkov/aliases";
import type { GameMode, MarketItem } from "@/lib/tarkov/types";
import styles from "./MarketView.module.css";

type SortKey = "perSlot" | "flea" | "change";

export default function MarketView({ items, mode }: { items: MarketItem[]; mode: GameMode }) {
  const { query } = useSearch();
  const [sort, setSort] = useState<SortKey>("perSlot");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const rows = useMemo(() => {
    const nq = normalizeSearch(query.trim());
    let list = items.map((it) => ({
      ...it,
      slots: it.width * it.height,
      perSlot:
        it.lastLowPrice != null ? Math.round(it.lastLowPrice / (it.width * it.height)) : null,
    }));
    if (nq) list = list.filter((it) => it.searchText.includes(nq));
    const val = (x: (typeof list)[number]) => {
      if (sort === "flea") return x.lastLowPrice ?? -1;
      if (sort === "change") return x.changeLast48hPercent ?? -Infinity;
      return x.perSlot ?? -1;
    };
    return list.sort((a, b) => val(b) - val(a));
  }, [items, query, sort]);

  return (
    <section>
      <div className={styles.controls}>
        <h2 className={styles.title}>
          아이템 시세<span className={styles.count}>{rows.length}종</span>
        </h2>
        {/* 모드별 URL 분리 (SEO) — 클라이언트 상태가 아니라 링크 이동 */}
        <nav className={styles.modeSeg} aria-label="게임모드 선택">
          <Link
            href="/market"
            className={mode === "regular" ? styles.modeActive : styles.modeBtn}
          >
            PvP
          </Link>
          <Link
            href="/market/pve"
            className={mode === "pve" ? styles.modeActive : styles.modeBtn}
          >
            PvE
          </Link>
        </nav>
        <div className={styles.sortWrap}>
          <span className={styles.sortLabel}>정렬</span>
          <div className={styles.seg}>
            <button
              className={sort === "perSlot" ? styles.segActive : styles.segBtn}
              onClick={() => setSort("perSlot")}
            >
              슬롯당
            </button>
            <button
              className={sort === "flea" ? styles.segActive : styles.segBtn}
              onClick={() => setSort("flea")}
            >
              벼룩가
            </button>
            <button
              className={sort === "change" ? styles.segActive : styles.segBtn}
              onClick={() => setSort("change")}
            >
              변동률
            </button>
          </div>
        </div>
      </div>

      <div className={styles.list}>
        {rows.map((it, i) => (
          <Fragment key={it.id}>
            <article
              className={expandedId === it.id ? `${styles.card} ${styles.cardOpen}` : styles.card}
              onClick={() => setExpandedId(expandedId === it.id ? null : it.id)}
              aria-expanded={expandedId === it.id}
            >
              <div className={styles.icon}>
                {it.iconLink ? (
                  <Image src={it.iconLink} alt={it.name} width={46} height={46} unoptimized={false} />
                ) : (
                  <span className={styles.iconFallback}>{it.shortName.slice(0, 5)}</span>
                )}
              </div>
              <div className={styles.names}>
                <span className={styles.nameKr}>{it.name}</span>
                <span className={styles.nameEnRow}>
                  <span className={styles.nameEn}>{it.shortName}</span>
                  <span className={styles.slotBadge}>
                    {it.width}×{it.height}
                  </span>
                  {it.fleaBanned && <span className={styles.bannedBadge}>벼룩 불가</span>}
                </span>
              </div>
              <div className={styles.prices}>
                <div className={styles.priceCol}>
                  <span className={styles.priceLabel}>벼룩시장</span>
                  <span className={styles.priceVal}>{fmtRub(it.lastLowPrice)}</span>
                </div>
                <div className={styles.priceCol}>
                  <span className={styles.priceLabel}>
                    트레이더{it.bestTraderName ? ` · ${it.bestTraderName}` : ""}
                  </span>
                  <span className={styles.priceValDim}>{fmtRub(it.bestTraderPrice)}</span>
                </div>
                <div className={styles.priceCol}>
                  <span className={styles.priceLabelGold}>슬롯당</span>
                  <span className={styles.priceValGold}>{fmtRub(it.perSlot)}</span>
                </div>
                <div className={styles.priceColNarrow}>
                  <span className={styles.priceLabel}>48H</span>
                  <span
                    className={
                      (it.changeLast48hPercent ?? 0) >= 0 ? styles.changeUp : styles.changeDown
                    }
                  >
                    {fmtChangePercent(it.changeLast48hPercent)}
                  </span>
                </div>
              </div>
              {expandedId === it.id && (
                <div className={styles.detail} onClick={(e) => e.stopPropagation()}>
                  {it.fleaBanned ? (
                    <div className={styles.detailBanned}>
                      벼룩시장 거래 불가 아이템 — 트레이더 매각가 기준
                    </div>
                  ) : (
                    <PriceChart
                      itemId={it.id}
                      up={(it.changeLast48hPercent ?? 0) >= 0}
                      mode={mode}
                    />
                  )}
                </div>
              )}
            </article>
            {i === 5 && rows.length > 7 && (
              <div className={styles.midAd}>
                <AdSlot label="본문 중간" />
              </div>
            )}
          </Fragment>
        ))}
        {rows.length === 0 && (
          <div className={styles.empty}>검색 결과 없음 — &ldquo;{query}&rdquo;</div>
        )}
      </div>
    </section>
  );
}
