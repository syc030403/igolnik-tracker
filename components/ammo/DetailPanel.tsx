"use client";

import { useState } from "react";
import { useI18n } from "@/components/LocaleProvider";
import { fmtChangePercent, fmtModifier, fmtPercent, fmtRub } from "@/lib/format";
import type { AmmoEntry, AmmoPackInfo, GameMode } from "@/lib/tarkov/types";
import PriceChart from "./PriceChart";
import styles from "./DetailPanel.module.css";

export default function DetailPanel({ ammo }: { ammo: AmmoEntry }) {
  const { dict } = useI18n();
  const stats = [
    { label: dict.armorDamage, value: `${ammo.armorDamage}%` },
    { label: dict.fragChance, value: fmtPercent(ammo.fragmentationChance) },
    { label: dict.velocity, value: ammo.initialSpeed ? `${ammo.initialSpeed} m/s` : "—" },
    { label: dict.recoilMod, value: fmtModifier(ammo.recoilModifier) },
    { label: dict.accuracyMod, value: fmtModifier(ammo.accuracyModifier) },
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
          <div className={styles.bigLabel}>{dict.damage}</div>
          <div className={styles.bigValue}>
            {ammo.projectileCount > 1 ? `${ammo.damage}×${ammo.projectileCount}` : ammo.damage}
          </div>
        </div>
        <div className={styles.bigCellLast}>
          <div className={styles.bigLabelGold}>{dict.penetration}</div>
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
        <span>{dict.footnote}</span>
      </div>
    </div>
  );
}

function TradableMarket({ ammo }: { ammo: AmmoEntry }) {
  const { dict } = useI18n();
  return (
    <>
      <div className={styles.priceHead}>
        <div>
          <div className={styles.priceLabel}>{dict.fleaCurrent}</div>
          <div className={styles.priceRow}>
            <span className={styles.price}>{fmtRub(ammo.lastLowPrice)}</span>
          </div>
        </div>
      </div>
      <PriceChart itemId={ammo.id} />
    </>
  );
}

function BannedMarket({ ammo }: { ammo: AmmoEntry }) {
  const { dict } = useI18n();
  const hasSources =
    ammo.traderPrices.length > 0 || ammo.barters.length > 0 || ammo.crafts.length > 0;

  return (
    <>
      {ammo.pack ? (
        // 팩이 플리마켓 거래되면 시세를 보여주는 게 맞다 — 빨간 뱃지 대신 안내만
        <PackMarket pack={ammo.pack} />
      ) : (
        <div className={styles.bannedBadge}>
          <span className={styles.bannedDot} aria-hidden />
          <span className={styles.bannedText}>{dict.fleaBanned}</span>
        </div>
      )}
      <div className={styles.sourceTitle}>{dict.sources}</div>
      {!hasSources && <div className={styles.noSource}>{dict.noSources}</div>}
      {ammo.traderPrices.map((t, i) => (
        <div key={`t${i}`} className={styles.sourceRow}>
          <span className={`${styles.tag} ${styles.tagTrader}`}>{dict.trader}</span>
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
          <span className={`${styles.tag} ${styles.tagBarter}`}>{dict.barter}</span>
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
          <span className={`${styles.tag} ${styles.tagCraft}`}>{dict.craft}</span>
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

/** 탄약 팩 시세 — 팩은 플리마켓 거래 가능하고 PvP/PvE 가격이 다르다 */
function PackMarket({ pack }: { pack: AmmoPackInfo }) {
  const { dict } = useI18n();
  const [mode, setMode] = useState<GameMode>("regular");
  const price = mode === "pve" ? pack.pve : pack.pvp;
  const perRound =
    price.lastLowPrice != null ? Math.round(price.lastLowPrice / pack.count) : null;

  return (
    <div className={styles.packSection}>
      <div className={styles.packNote}>{dict.packNote}</div>
      <div className={styles.priceHead}>
        <div>
          <div className={styles.priceLabel}>{dict.packPrice.replace("{n}", String(pack.count))}</div>
          <div className={styles.priceRow}>
            <span className={styles.price}>{fmtRub(price.lastLowPrice)}</span>
          </div>
          {perRound != null && (
            <div className={styles.perRound}>{dict.perRound} {fmtRub(perRound)}</div>
          )}
        </div>
        <div className={styles.modeTabs}>
          {(["regular", "pve"] as const).map((m) => (
            <button
              key={m}
              className={mode === m ? styles.rangeTabActive : styles.rangeTab}
              onClick={() => setMode(m)}
            >
              {m === "regular" ? "PvP" : "PvE"}
            </button>
          ))}
        </div>
      </div>
      {price.lastLowPrice != null ? (
        <PriceChart itemId={pack.id} mode={mode} />
      ) : (
        <div className={styles.chartEmpty}>{dict.noModeData}</div>
      )}
    </div>
  );
}

function currencySymbol(code: string): string {
  if (code === "USD") return "$";
  if (code === "EUR") return "€";
  return code;
}
