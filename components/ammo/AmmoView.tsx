"use client";

import { useMemo, useState } from "react";
import { useSearch } from "@/components/SearchProvider";
import { normalizeSearch } from "@/lib/tarkov/aliases";
import { penetrationChance, penTier } from "@/lib/tarkov/penetration";
import type { AmmoEntry, AmmoGroup } from "@/lib/tarkov/types";
import AdSlot from "@/components/AdSlot";
import DetailPanel from "./DetailPanel";
import styles from "./AmmoView.module.css";

const ARMOR_CLASSES = [1, 2, 3, 4, 5, 6] as const;

type SortKey = "pen" | "dmg";

export default function AmmoView({ groups }: { groups: AmmoGroup[] }) {
  const { query } = useSearch();
  const [caliber, setCaliber] = useState("전체");
  const [sort, setSort] = useState<SortKey>("pen");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const calibers = useMemo(() => groups.map((g) => g.caliber), [groups]);

  const filtered = useMemo(() => {
    const nq = normalizeSearch(query.trim());
    let gs = groups;
    if (caliber !== "전체") gs = gs.filter((g) => g.caliber === caliber);
    if (nq) {
      gs = gs
        .map((g) => ({
          caliber: g.caliber,
          rows: g.rows.filter((r) => r.searchText.includes(nq)),
        }))
        .filter((g) => g.rows.length > 0);
    }
    return gs.map((g) => ({
      caliber: g.caliber,
      rows: [...g.rows].sort((a, b) =>
        sort === "dmg"
          ? b.damage * b.projectileCount - a.damage * a.projectileCount
          : b.penetrationPower - a.penetrationPower,
      ),
    }));
  }, [groups, caliber, sort, query]);

  const allRows = useMemo(() => filtered.flatMap((g) => g.rows), [filtered]);
  const selected: AmmoEntry | null =
    allRows.find((r) => r.id === selectedId) ?? allRows[0] ?? null;

  const onSelect = (row: AmmoEntry) => {
    setSelectedId(row.id);
    setSheetOpen(true);
  };

  return (
    <section>
      <div className={styles.controls}>
        <div className={styles.chips} role="tablist" aria-label="캘리버 필터">
          {["전체", ...calibers].map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={c === caliber}
              className={c === caliber ? styles.chipActive : styles.chip}
              onClick={() => setCaliber(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div className={styles.sortWrap}>
          <span className={styles.sortLabel}>정렬</span>
          <div className={styles.seg}>
            <button
              className={sort === "pen" ? styles.segActive : styles.segBtn}
              onClick={() => setSort("pen")}
            >
              관통력
            </button>
            <button
              className={sort === "dmg" ? styles.segActive : styles.segBtn}
              onClick={() => setSort("dmg")}
            >
              데미지
            </button>
          </div>
        </div>
      </div>

      <div className={styles.legend}>
        <span className={styles.legendTitle}>방어구 관통 확률</span>
        <span className={styles.legendItem}>
          <span className={`${styles.swatch} ${styles.swGood}`} />
          관통 (70%+)
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.swatch} ${styles.swMid}`} />
          애매 (40~69%)
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.swatch} ${styles.swLow}`} />
          불안정 (18~39%)
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.swatch} ${styles.swBlock}`} />
          막힘 (~17%)
        </span>
      </div>

      <div className={styles.layout}>
        <div className={styles.tableCol}>
          {filtered.length === 0 ? (
            <div className={styles.empty}>검색 결과 없음 — &ldquo;{query}&rdquo;</div>
          ) : (
            <div className={styles.tableCard}>
              <div className={styles.tableScroll}>
                <table className={styles.table}>
                  <caption className={styles.srOnly}>
                    Escape from Tarkov 탄약 성능표: 캘리버별 데미지, 관통력, 방어구 등급별 관통
                    확률
                  </caption>
                  {filtered.map((g, gi) => (
                    <tbody key={g.caliber}>
                      <tr>
                        <th
                          colSpan={9}
                          scope="colgroup"
                          className={gi > 0 ? `${styles.groupHead} ${styles.groupHeadGap}` : styles.groupHead}
                        >
                          <span className={styles.groupName}>{g.caliber}</span>
                          <span className={styles.groupCount}>{g.rows.length}종</span>
                        </th>
                      </tr>
                      <tr className={styles.colHead}>
                        <th scope="col" className={styles.thName}>
                          탄약명
                        </th>
                        <th scope="col" className={styles.thDmg}>
                          데미지
                        </th>
                        <th scope="col" className={styles.thPen}>
                          관통력
                        </th>
                        {ARMOR_CLASSES.map((c) => (
                          <th
                            scope="col"
                            key={c}
                            className={c === 1 ? `${styles.thArmor} ${styles.armorFirst}` : styles.thArmor}
                          >
                            {c}
                          </th>
                        ))}
                      </tr>
                      {g.rows.map((r) => (
                        <tr
                          key={r.id}
                          className={
                            selected?.id === r.id ? `${styles.row} ${styles.rowSelected}` : styles.row
                          }
                          onClick={() => onSelect(r)}
                        >
                          <td className={styles.tdName}>
                            {/* 모바일은 그룹 헤더에 캘리버가 있으므로 짧은 이름으로 대체 */}
                            <span className={styles.nameText} title={r.name}>
                              <span className={styles.nameFull}>{r.name}</span>
                              <span className={styles.nameShort}>{r.shortName}</span>
                            </span>
                            <span className={styles.nameSub}>데미지 {fmtDamage(r)}</span>
                          </td>
                          <td className={styles.tdDmg}>{fmtDamage(r)}</td>
                          <td className={styles.tdPen}>{r.penetrationPower}</td>
                          {ARMOR_CLASSES.map((c) => {
                            const pct = penetrationChance(r.penetrationPower, c);
                            return (
                              <td
                                key={c}
                                className={c === 1 ? `${styles.tdArmor} ${styles.armorFirst}` : styles.tdArmor}
                              >
                                <span className={`${styles.penCell} ${tierClass(pct)}`}>
                                  {pct}%
                                </span>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  ))}
                </table>
              </div>
            </div>
          )}
        </div>

        <aside className={styles.panelCol}>
          {selected && <DetailPanel ammo={selected} />}
        </aside>
      </div>

      {sheetOpen && selected && (
        <div className={styles.sheetBackdrop} onClick={() => setSheetOpen(false)}>
          <div
            className={styles.sheet}
            role="dialog"
            aria-modal
            aria-label={`${selected.name} 상세 정보`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.sheetClose}
              onClick={() => setSheetOpen(false)}
              aria-label="닫기"
            >
              ✕
            </button>
            <DetailPanel ammo={selected} />
          </div>
        </div>
      )}

      <div className={styles.midAd}>
        <AdSlot label="본문 중간" />
      </div>
    </section>
  );
}

function fmtDamage(r: AmmoEntry): string {
  return r.projectileCount > 1 ? `${r.damage}×${r.projectileCount}` : String(r.damage);
}

function tierClass(pct: number): string {
  switch (penTier(pct)) {
    case "good":
      return styles.penGood;
    case "mid":
      return styles.penMid;
    case "low":
      return styles.penLow;
    default:
      return styles.penBlock;
  }
}
