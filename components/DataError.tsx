import styles from "./DataError.module.css";

/**
 * tarkov.dev 페칭 실패 시 폴백. 무료 커뮤니티 API의 일시 장애로
 * 페이지(빌드) 전체가 죽지 않도록 페이지 레벨에서 이걸 대신 렌더한다.
 * ISR 주기가 돌면 자동으로 정상 데이터로 복구된다.
 */
export default function DataError({ title, desc }: { title: string; desc: string }) {
  return (
    <div className={styles.box} role="alert">
      <p className={styles.title}>{title}</p>
      <p className={styles.desc}>{desc}</p>
    </div>
  );
}
