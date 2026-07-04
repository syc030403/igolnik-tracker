import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.notice}>
          본 사이트는 비공식 팬 제작 사이트이며, Battlestate Games 및 Escape from Tarkov와
          어떠한 제휴 관계도 없습니다. 모든 상표권은 각 소유자에게 있습니다.
        </p>
        <a
          className={styles.source}
          href="https://tarkov.dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className={styles.dot} aria-hidden />
          Data: tarkov.dev
        </a>
      </div>
    </footer>
  );
}
