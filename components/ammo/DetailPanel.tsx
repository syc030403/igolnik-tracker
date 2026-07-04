"use client";

import { fmtChangePercent, fmtModifier, fmtPercent, fmtRub } from "@/lib/format";
import type { AmmoEntry } from "@/lib/tarkov/types";
import PriceChart from "./PriceChart";
import styles from "./DetailPanel.module.css";

export default function DetailPanel({ ammo }: { ammo: AmmoEntry }) {
  const stats = [
    { label: "방어구 데미지", value: `${ammo.armorDamage}%` },
    { label: "파편 확률", value: fmtPercent(ammo.fragmentationChance) },
    { label: "탄속", value: ammo.initialSpeed ? `${ammo.initialSpeed} m/s` : "—" },
    { label: "반동 보정", value: fmtModifier(ammo.recoilModifier) },
    { label: "정확도 보정", value: fmtModifier(ammo.accuracyModifier) },
  ];

  const tradable = !ammo.fleaBanned && ammo.lastLowPrice != null;

  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <div className={styles.caliber}>{ammo.caliber}</div>
        <h2 className={styles.name}>{ammo.name}</h2>
      </div>

      <div className={styles.bigRow}>
        <div className={styles.bigCell}>
          <div className={styles.bigLabel}>데미지</div>
          <div className={styles.bigValue}>
            {ammo.projectileCount > 1 ? `${ammo.damage}×${ammo.projectileCount}` : ammo.damage}
          </div>
        </div>
        <div className={styles.bigCellLast}>
          <div className={styles.bigLabelGold}>관통력</div>
          <div className={styles.bigValueGold}>{ammo.penetrationPower}</div>
        </div>
      </div>

      <dl className={styles.stats}>
        {stats.map((s) => (
          <div key={s.label} className={styles.statRow}>
            <dt className={styles.statLabel}>{s.label}</dt>
            <dd className={styles.statValue}>{s.value}</dd>
          </div>
        ))}
      </dl>

      <div className={styles.marketSection}>
        {tradable ? (
          <TradableMarket ammo={ammo} />
        ) : (
          <BannedMarket ammo={ammo} />
        )}
      </div>

      <div className={styles.footnote}>
        <span>* 관통 확률은 방어구 내구도 100% 기준 추정치</span>
      </div>
    </div>
  );
}

function TradableMarket({ ammo }: { ammo: AmmoEntry }) {
  const change = ammo.changeLast48hPercent;
  const up = (change ?? 0) >= 0;
  return (
    <>
      <div className={styles.priceHead}>
        <div>
          <div className={styles.priceLabel}>벼룩시장 현재가</div>
          <div className={styles.priceRow}>
            <span className={styles.price}>{fmtRub(ammo.lastLowPrice)}</span>
            {change != null && (
              <span className={up ? styles.changeUp : styles.changeDown}>
                {fmtChangePercent(change)}
              </span>
            )}
          </div>
        </div>
      </div>
      <PriceChart itemId={ammo.id} up={up} />
    </>
  );
}

function BannedMarket({ ammo }: { ammo: AmmoEntry }) {
  const hasSources =
    ammo.traderPrices.length > 0 || ammo.barters.length > 0 || ammo.crafts.length > 0;

  return (
    <>
      <div className={styles.bannedBadge}>
        <span className={styles.bannedDot} aria-hidden />
        <span className={styles.bannedText}>벼룩시장 거래 불가</span>
      </div>
      <div className={styles.sourceTitle}>획득처</div>
      {!hasSources && <div className={styles.noSource}>현재 확인된 획득처 없음</div>}
      {ammo.traderPrices.map((t, i) => (
        <div key={`t${i}`} className={styles.sourceRow}>
          <span className={`${styles.tag} ${styles.tagTrader}`}>트레이더</span>
          <span className={styles.sourceBody}>
            <span className={styles.sourceName}>{t.vendorName}</span>
            <span className={styles.sourceMeta}>
              {t.minTraderLevel ? `LL${t.minTraderLevel}` : ""}
            </span>
          </span>
          <span className={styles.sourcePrice}>
            {t.currency === "RUB" ? fmtRub(t.price) : `${t.price} ${currencySymbol(t.currency)}`}
          </span>
        </div>
      ))}
      {ammo.barters.map((b, i) => (
        <div key={`b${i}`} className={styles.sourceRow}>
          <span className={`${styles.tag} ${styles.tagBarter}`}>물물교환</span>
          <span className={styles.sourceBody}>
            <span className={styles.sourceName}>
              {b.traderName} LL{b.level}
            </span>
            <span className={styles.sourceMeta}>
              {b.requiredItems.map((r) => `${r.name} ×${r.count}`).join(" + ")}
            </span>
          </span>
        </div>
      ))}
      {ammo.crafts.map((c, i) => (
        <div key={`c${i}`} className={styles.sourceRow}>
          <span className={`${styles.tag} ${styles.tagCraft}`}>제작</span>
          <span className={styles.sourceBody}>
            <span className={styles.sourceName}>
              {c.stationName} Lv{c.level}
            </span>
            <span className={styles.sourceMeta}>
              {c.requiredItems.map((r) => `${r.name} ×${r.count}`).join(" · ")}
            </span>
          </span>
        </div>
      ))}
    </>
  );
}

function currencySymbol(code: string): string {
  if (code === "USD") return "$";
  if (code === "EUR") return "€";
  return code;
}
