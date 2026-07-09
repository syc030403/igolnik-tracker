"use client";

import Image from "next/image";
import { Fragment, useMemo, useState } from "react";
import AdBanner from "@/components/AdBanner";
import { useI18n } from "@/components/LocaleProvider";
import { useSearch } from "@/components/SearchProvider";
import { SHOW_ITEM_ICONS } from "@/lib/flags";
import { normalizeSearch } from "@/lib/tarkov/aliases";
import type { QuestItem } from "@/lib/tarkov/types";
import styles from "./QuestView.module.css";

type Filter = "all" | "fir" | "kappa";

export default function QuestView({ items }: { items: QuestItem[] }) {
  const { dict } = useI18n();
  const { query } = useSearch();
  const [filter, setFilter] = useState<Filter>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const rows = useMemo(() => {
    const nq = normalizeSearch(query.trim());
    return items.filter((it) => {
      if (filter === "fir" && it.firCount === 0) return false;
      if (filter === "kappa" && !it.kappa) return false;
      if (nq && !it.searchText.includes(nq)) return false;
      return true;
    });
  }, [items, query, filter]);

  return (
    <section>
      <div className={styles.controls}>
        <h2 className={styles.title}>
          {dict.questTitle}
          <span className={styles.count}>
            {rows.length}
            {dict.kindsSuffix}
          </span>
        </h2>
        <div className={styles.seg}>
          <button
            className={filter === "all" ? styles.segActive : styles.segBtn}
            onClick={() => setFilter("all")}
          >
            {dict.all}
          </button>
          <button
            className={filter === "fir" ? styles.segActive : styles.segBtn}
            onClick={() => setFilter("fir")}
          >
            {dict.questFirOnly}
          </button>
          <button
            className={filter === "kappa" ? styles.segActive : styles.segBtn}
            onClick={() => setFilter("kappa")}
          >
            {dict.questKappaOnly}
          </button>
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
                  <Image
                    src={it.iconLink}
                    alt={it.name}
                    width={46}
                    height={46}
                    unoptimized
                    loading="lazy"
                    style={{ objectFit: "contain" }}
                  />
                ) : (
                  <span className={styles.iconFallback}>{it.shortName.slice(0, 5)}</span>
                )}
              </div>
              <div className={styles.names}>
                <span className={styles.nameKr}>{it.name}</span>
                <span className={styles.nameEnRow}>
                  <span className={styles.nameEn}>{it.shortName}</span>
                  {it.kappa && <span className={styles.kappaBadge}>Kappa</span>}
                </span>
              </div>
              <div className={styles.stats}>
                <div className={styles.statCol}>
                  <span className={styles.statLabel}>{dict.questTotal}</span>
                  <span className={styles.statTotal}>×{it.totalCount}</span>
                </div>
                <div className={styles.statCol}>
                  <span className={styles.statLabel}>{dict.questFir}</span>
                  <span className={it.firCount > 0 ? styles.statFir : styles.statFirZero}>
                    {it.firCount > 0 ? `×${it.firCount}` : "—"}
                  </span>
                </div>
                <div className={styles.statColNarrow}>
                  <span className={styles.statLabel}>{dict.questNeededIn}</span>
                  <span className={styles.statQuests}>{it.needs.length}</span>
                </div>
              </div>

              {expandedId === it.id && (
                <div className={styles.detail} onClick={(e) => e.stopPropagation()}>
                  {it.needs.map((n, ni) => (
                    <div key={ni} className={styles.needRow}>
                      <span className={styles.needTrader}>{n.trader}</span>
                      <span className={styles.needName}>{n.taskName}</span>
                      <span className={styles.needMeta}>
                        {dict.questLevel} {n.minLevel}
                      </span>
                      <span className={styles.needCount}>
                        ×{n.count}
                        {n.foundInRaid && <span className={styles.firTag}>FIR</span>}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </article>
            {i === 6 && rows.length > 8 && (
              <div className={styles.midAd}>
                <AdBanner />
              </div>
            )}
          </Fragment>
        ))}
        {rows.length === 0 && (
          <div className={styles.empty}>
            {dict.emptyResult} — &ldquo;{query}&rdquo;
          </div>
        )}
      </div>
    </section>
  );
}
