"use client";

import { useEffect, useState } from "react";
import { useI18n } from "./LocaleProvider";
import { ADFIT_ENABLED } from "@/lib/ads";
import styles from "./AdBlockNotice.module.css";

/**
 * 애드블록 감지 — 미끼 요소가 차단되면 정중한 안내 배너를 띄운다.
 * 콘텐츠는 그대로 보여준다(하드 게이팅 금지 — 사용자 반감·정책 리스크).
 * 광고가 켜져 있을 때만(ADFIT_ENABLED) 동작.
 */
export default function AdBlockNotice() {
  const { dict } = useI18n();
  const [blocked, setBlocked] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!ADFIT_ENABLED) return;
    // 광고 차단기가 흔히 숨기는 클래스명의 미끼 요소를 만들어 렌더를 확인
    const bait = document.createElement("div");
    bait.className = "adsbox ad-banner ad-placement pub_300x250";
    bait.style.cssText = "position:absolute;left:-9999px;height:1px;width:1px;";
    document.body.appendChild(bait);
    const t = window.setTimeout(() => {
      const hidden =
        bait.offsetParent === null || bait.offsetHeight === 0 || bait.clientHeight === 0;
      if (hidden) setBlocked(true);
      bait.remove();
    }, 200);
    return () => {
      window.clearTimeout(t);
      bait.remove();
    };
  }, []);

  if (!blocked || dismissed) return null;

  return (
    <div className={styles.bar} role="note">
      <span className={styles.text}>{dict.adblockNotice}</span>
      <button className={styles.close} onClick={() => setDismissed(true)} aria-label="close">
        ✕
      </button>
    </div>
  );
}
