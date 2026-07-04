"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "./LocaleProvider";
import { useSearch } from "./SearchProvider";
import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_LABELS,
  localePath,
  type Locale,
} from "@/lib/i18n/locales";
import styles from "./Header.module.css";

/** 현재 경로에서 로케일 접두어를 제거한 "순수 경로" */
function stripLocale(pathname: string): string {
  for (const l of LOCALES) {
    if (l === DEFAULT_LOCALE) continue;
    if (pathname === `/${l}`) return "/";
    if (pathname.startsWith(`/${l}/`)) return pathname.slice(l.length + 1);
  }
  return pathname;
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { lang, dict } = useI18n();
  const { query, setQuery } = useSearch();
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const basePath = stripLocale(pathname);

  useEffect(() => {
    if (!langOpen) return;
    const close = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [langOpen]);

  const switchLang = (l: Locale) => {
    setLangOpen(false);
    if (l !== lang) router.push(localePath(l, basePath));
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href={localePath(lang, "/")} className={styles.brand} aria-label="Igolnik Tracker">
          <span className={styles.logoDiamond} aria-hidden>
            <span className={styles.logoCore} />
          </span>
          <span className={styles.brandText}>
            <span className={styles.brandTitle}>
              IGOLNIK<span className={styles.brandGold}>.TRACKER</span>
            </span>
            <span className={styles.brandSub}>{dict.brandSub}</span>
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
            placeholder={dict.searchPlaceholder}
            aria-label={dict.searchAria}
          />
        </div>

        <nav className={styles.nav} aria-label="menu">
          <Link
            href={localePath(lang, "/")}
            className={basePath === "/" ? styles.tabActive : styles.tab}
          >
            {dict.navAmmo}
          </Link>
          <Link
            href={localePath(lang, "/market")}
            className={basePath.startsWith("/market") ? styles.tabActive : styles.tab}
          >
            {dict.navMarket}
          </Link>
          <span className={styles.tabDisabled} aria-disabled title={dict.soon}>
            {dict.navQuest}
            <span className={styles.soon}>{dict.soon}</span>
          </span>

          <div className={styles.langWrap} ref={langRef}>
            <button
              className={styles.langBtn}
              onClick={() => setLangOpen((v) => !v)}
              aria-haspopup="listbox"
              aria-expanded={langOpen}
              aria-label={dict.langAria}
            >
              <span aria-hidden>🌐</span> {lang.toUpperCase()}
              <span className={styles.langCaret} aria-hidden>
                ▾
              </span>
            </button>
            {langOpen && (
              <ul className={styles.langMenu} role="listbox" aria-label={dict.langAria}>
                {LOCALES.map((l) => (
                  <li key={l}>
                    <button
                      role="option"
                      aria-selected={l === lang}
                      className={l === lang ? styles.langItemActive : styles.langItem}
                      onClick={() => switchLang(l)}
                    >
                      {LOCALE_LABELS[l]}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
