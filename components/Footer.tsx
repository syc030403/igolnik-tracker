import styles from "./Footer.module.css";

export default function Footer({ notice }: { notice: string }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.notice}>{notice}</p>
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
