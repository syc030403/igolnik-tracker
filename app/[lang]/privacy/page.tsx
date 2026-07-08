import type { Metadata } from "next";
import { getPrivacy } from "@/lib/i18n/privacy";
import { LOCALES, isLocale, localePath, type Locale } from "@/lib/i18n/locales";
import styles from "./privacy.module.css";

interface Params {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "ko";
  const p = getPrivacy(locale);
  return {
    title: `${p.title} | Igolnik Tracker`,
    description: p.title,
    alternates: {
      canonical: localePath(locale, "/privacy"),
      languages: Object.fromEntries([
        ...LOCALES.map((l) => [l, localePath(l, "/privacy")]),
        ["x-default", "/privacy"],
      ]),
    },
  };
}

export default async function PrivacyPage({ params }: Params) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "ko";
  const p = getPrivacy(locale);

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>{p.title}</h1>
      <p className={styles.updated}>{p.updated}</p>
      {p.sections.map((s) => (
        <section key={s.heading} className={styles.section}>
          <h2 className={styles.heading}>{s.heading}</h2>
          {s.body.map((b, i) => (
            <p key={i} className={styles.body}>
              {b}
            </p>
          ))}
        </section>
      ))}
    </main>
  );
}
