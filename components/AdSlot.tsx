"use client";

import { useEffect, useRef } from "react";
import { useI18n } from "./LocaleProvider";
import { AD_DIMENSIONS, ADFIT_ENABLED, adUnitId, type AdFormat } from "@/lib/ads";
import styles from "./AdSlot.module.css";

/**
 * 광고 슬롯. 애드핏 심사 통과 전(ADFIT_ENABLED=false)에는
 *  - 개발: 규격이 보이는 플레이스홀더
 *  - 프로덕션: 아무것도 렌더하지 않음(빈 광고 노출 금지)
 * 통과 후에는 규격만큼 공간을 예약(CLS 방지)하고 애드핏 ins를 렌더한다.
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
  const unit = adUnitId(format);
  const ref = useRef<HTMLModElement>(null);

  const active = ADFIT_ENABLED && !!unit;

  useEffect(() => {
    if (!active || !ref.current) return;
    // 애드핏 스크립트는 마운트 시 삽입 — SPA 라우팅에서도 매번 새 ins를 스캔한다.
    const s = document.createElement("script");
    s.src = "https://t1.daumcdn.net/kas/static/ba.min.js";
    s.async = true;
    ref.current.after(s);
    return () => {
      s.remove();
    };
  }, [active]);

  if (active) {
    return (
      <div
        className={className ? `${styles.wrap} ${className}` : styles.wrap}
        style={{ minHeight: height }}
      >
        <span className={styles.tag}>AD</span>
        {/* eslint-disable-next-line @next/next/no-unknown-property */}
        <ins
          ref={ref}
          className="kakao_ad_area"
          style={{ display: "none" }}
          data-ad-unit={unit}
          data-ad-width={width}
          data-ad-height={height}
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
