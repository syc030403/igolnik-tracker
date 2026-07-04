"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSearch } from "./SearchProvider";
import styles from "./Header.module.css";

export default function Header() {
  const pathname = usePathname();
  const { query, setQuery } = useSearch();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} aria-label="Igolnik Tracker 홈">
          <span className={styles.logoDiamond} aria-hidden>
            <span className={styles.logoCore} />
          </span>
          <span className={styles.brandText}>
            <span className={styles.brandTitle}>
              IGOLNIK<span className={styles.brandGold}>.TRACKER</span>
            </span>
            <span className={styles.brandSub}>타르코프 탄약 · 시세 유틸</span>
          </span>
        </Link>

        <div className={styles.searchWrap} role="search">
          <span className={styles.searchIcon} aria-hidden>
            ⌕
          </span>
          <input
            className={styles.searchInput}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="탄약 · 아이템 검색 (한 / 영 / 약칭)"
            aria-label="탄약 및 아이템 검색"
          />
        </div>

        <nav className={styles.nav} aria-label="주 메뉴">
          <Link href="/" className={pathname === "/" ? styles.tabActive : styles.tab}>
            탄약표
          </Link>
          <Link
            href="/market"
            className={pathname === "/market" ? styles.tabActive : styles.tab}
          >
            시세
          </Link>
          <span className={styles.tabDisabled} aria-disabled title="준비 중">
            퀘스트템<span className={styles.soon}>SOON</span>
          </span>
        </nav>
      </div>
    </header>
  );
}
