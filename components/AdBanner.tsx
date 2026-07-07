import AdSlot from "./AdSlot";
import styles from "./AdBanner.module.css";

/**
 * 반응형 가로 배너 — 데스크톱은 728×90, 모바일은 320×100.
 * 상단·본문·하단 배너 위치에 공용으로 쓴다.
 */
export default function AdBanner({ className }: { className?: string }) {
  return (
    <div className={className ? `${styles.banner} ${className}` : styles.banner}>
      <div className={styles.desktop}>
        <AdSlot format="leaderboard" />
      </div>
      <div className={styles.mobile}>
        <AdSlot format="mobileBanner" />
      </div>
    </div>
  );
}
