import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer({
  notice,
  privacyHref,
  privacyLabel,
  aboutHref,
  aboutLabel,
}: {
  notice: string;
  privacyHref: string;
  privacyLabel: string;
  aboutHref: string;
  aboutLabel: string;
}) {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.notice}>{notice}</p>
        <div className={styles.links}>
          <Link className={styles.privacy} href={aboutHref}>
            {aboutLabel}
          </Link>
          <Link className={styles.privacy} href={privacyHref}>
            {privacyLabel}
          </Link>
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
      </div>
    </footer>
  );
}
