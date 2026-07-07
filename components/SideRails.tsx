import AdSlot from "./AdSlot";
import styles from "./SideRails.module.css";

/**
 * 데스크톱 사이드 광고(160×600). 본문(최대 1160px) 바깥 여백에 sticky로 고정.
 * 폭이 좁으면(≤1559px) CSS로 숨겨 콘텐츠와 겹치지 않게 한다 — 모바일 노출 없음.
 */
export default function SideRails() {
  return (
    <>
      <div className={`${styles.rail} ${styles.left}`} aria-hidden>
        <AdSlot format="skyscraper" />
      </div>
      <div className={`${styles.rail} ${styles.right}`} aria-hidden>
        <AdSlot format="skyscraper" />
      </div>
    </>
  );
}
