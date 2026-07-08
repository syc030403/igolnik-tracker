"use client";

import { useEffect, useRef } from "react";
import { useI18n } from "./LocaleProvider";
import { AD_DIMENSIONS, ADSENSE_CLIENT, ADS_ENABLED, adSlotId, type AdFormat } from "@/lib/ads";
import styles from "./AdSlot.module.css";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * 광고 슬롯(구글 애드센스). 게시자 ID·슬롯 ID가 설정되기 전에는
 *  - 개발: 규격이 보이는 플레이스홀더
 *  - 프로덕션: 아무것도 렌더하지 않음(빈 광고 노출 금지)
 * 설정 후에는 규격만큼 공간을 예약(CLS 방지)하고 adsbygoogle ins를 렌더한다.
 */
export default function AdSlot({
  format,
  className,
}: {
  format: AdFormat;
  className?: string;
}) {
  const { dict } = useI18n();
  const { width, height } = AD_DIMENSIONS[format];
  const slot = adSlotId(format);
  const insRef = useRef<HTMLModElement>(null);

  const active = ADS_ENABLED && !!slot;

  useEffect(() => {
    if (!active) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // 광고 차단기 등으로 push 실패 시 무시
    }
  }, [active]);

  if (active) {
    return (
      <div
        className={className ? `${styles.wrap} ${className}` : styles.wrap}
        style={{ minHeight: height }}
      >
        <span className={styles.tag}>{dict.adLabel}</span>
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{ display: "inline-block", width, height }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={slot}
        />
      </div>
    );
  }

  if (process.env.NODE_ENV === "production") return null;

  // 개발용 플레이스홀더 — 실제 배치·규격 확인용
  return (
    <div
      className={className ? `${styles.placeholder} ${className}` : styles.placeholder}
      style={{ width, height, maxWidth: "100%" }}
      aria-hidden
    >
      <span className={styles.phLabel}>
        {dict.adLabel} · {width}×{height}
      </span>
    </div>
  );
}
