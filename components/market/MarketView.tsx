"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useMemo, useState } from "react";
import AdBanner from "@/components/AdBanner";
import { useI18n } from "@/components/LocaleProvider";
import PriceChart from "@/components/ammo/PriceChart";
import { useSearch } from "@/components/SearchProvider";
import { fmtChangePercent, fmtRub } from "@/lib/format";
import { SHOW_ITEM_ICONS } from "@/lib/flags";
import { localePath } from "@/lib/i18n/locales";
import { normalizeSearch } from "@/lib/tarkov/aliases";
import { MARKET_CATEGORIES, type CategorySlug } from "@/lib/tarkov/categories";
import type { GameMode, MarketItem } from "@/lib/tarkov/types";
import styles from "./MarketView.module.css";

type SortKey = "perSlot" | "flea" | "change";

export default function MarketView({
  items,
  mode,
  cat = null,
}: {
  items: MarketItem[];
  mode: GameMode;
  /** null = 인기(큐레이션) */
  cat?: CategorySlug | null;
}) {
  const { lang, dict } = useI18n();
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

  const modeBase = mode === "pve" ? "/market/pve" : "/market";

  return (
    <section>
      {/* 카테고리 칩 — 탄약표의 캘리버 칩과 동일한 패턴 (URL 분리로 SEO) */}
      <nav className={styles.chips} aria-label={dict.marketTitle}>
        <Link
          href={localePath(lang, modeBase)}
          className={cat === null ? styles.chipActive : styles.chip}
        >
          {dict.catPopular}
        </Link>
        {MARKET_CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            href={localePath(lang, `${modeBase}/${c.slug}`)}
            className={cat === c.slug ? styles.chipActive : styles.chip}
          >
            {dict.categories[c.slug] ?? c.slug}
          </Link>
        ))}
      </nav>

      <div className={styles.controls}>
        <h2 className={styles.title}>
          {dict.marketTitle}<span className={styles.count}>{rows.length}{dict.kindsSuffix}</span>
        </h2>
        {/* 모드별 URL 분리 (SEO) — 클라이언트 상태가 아니라 링크 이동 */}
        <nav className={styles.modeSeg} aria-label={dict.modeAria}>
          <Link
            href={localePath(lang, cat ? `/market/${cat}` : "/market")}
            className={mode === "regular" ? styles.modeActive : styles.modeBtn}
          >
            PvP
          </Link>
          <Link
            href={localePath(lang, cat ? `/market/pve/${cat}` : "/market/pve")}
            className={mode === "pve" ? styles.modeActive : styles.modeBtn}
          >
            PvE
          </Link>
        </nav>
        <div className={styles.sortWrap}>
          <span className={styles.sortLabel}>{dict.sort}</span>
          <div className={styles.seg}>
            <button
              className={sort === "perSlot" ? styles.segActive : styles.segBtn}
              onClick={() => setSort("perSlot")}
            >
              {dict.perSlot}
            </button>
            <button
              className={sort === "flea" ? styles.segActive : styles.segBtn}
              onClick={() => setSort("flea")}
            >
              {dict.fleaPrice}
            </button>
            <button
              className={sort === "change" ? styles.segActive : styles.segBtn}
              onClick={() => setSort("change")}
            >
              {dict.changeRate}
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
                {SHOW_ITEM_ICONS && it.iconLink ? (
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
                  {it.fleaBanned && <span className={styles.bannedBadge}>{dict.fleaBannedBadge}</span>}
                </span>
              </div>
              <div className={styles.prices}>
                <div className={styles.priceCol}>
                  <span className={styles.priceLabel}>{dict.fleaMarket}</span>
                  <span className={styles.priceVal}>{fmtRub(it.lastLowPrice)}</span>
                </div>
                <div className={styles.priceCol}>
                  <span className={styles.priceLabel}>
                    {dict.traderLabel}{it.bestTraderName ? ` · ${it.bestTraderName}` : ""}
                  </span>
                  <span className={styles.priceValDim}>{fmtRub(it.bestTraderPrice)}</span>
                </div>
                <div className={styles.priceCol}>
                  <span className={styles.priceLabelGold}>{dict.perSlot}</span>
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
                      {dict.fleaBannedDetail}
                    </div>
                  ) : (
                    <PriceChart itemId={it.id} mode={mode} />
                  )}
                </div>
              )}
            </article>
            {/* 리스트 중간 광고: 6번째부터 30개 간격, 최대 5개 (정책 안전선) */}
            {i >= 5 && (i - 5) % 30 === 0 && (i - 5) / 30 < 5 && rows.length > 7 && (
              <div className={styles.midAd}>
                <AdBanner />
              </div>
            )}
          </Fragment>
        ))}
        {rows.length === 0 && (
          <div className={styles.empty}>{dict.emptyResult} — &ldquo;{query}&rdquo;</div>
        )}
      </div>
    </section>
  );
}
