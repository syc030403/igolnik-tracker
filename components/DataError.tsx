import styles from "./DataError.module.css";

/**
 * tarkov.dev 페칭 실패 시 폴백. 무료 커뮤니티 API의 일시 장애로
 * 페이지(빌드) 전체가 죽지 않도록 페이지 레벨에서 이걸 대신 렌더한다.
 * ISR 주기가 돌면 자동으로 정상 데이터로 복구된다.
 */
export default function DataError() {
  return (
    <div className={styles.box} role="alert">
      <p className={styles.title}>데이터를 불러오지 못했습니다</p>
      <p className={styles.desc}>
        tarkov.dev API가 일시적으로 응답하지 않습니다. 잠시 후 새로고침해 주세요.
      </p>
    </div>
  );
}
