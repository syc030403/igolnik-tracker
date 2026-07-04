import styles from "./AdSlot.module.css";

/**
 * 카카오 애드핏 슬롯 자리. 매체 심사 통과 후 스크립트 삽입 예정.
 * 프로덕션에서는 빈 슬롯을 노출하지 않는다.
 */
export default function AdSlot({ label = "728×90 / 모바일 320×50" }: { label?: string }) {
  if (process.env.NODE_ENV === "production") return null;
  return (
    <div className={styles.slot} aria-hidden>
      <span className={styles.label}>AD SLOT · {label}</span>
    </div>
  );
}
