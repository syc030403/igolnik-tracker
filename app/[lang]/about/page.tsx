import type { Metadata } from "next";
import { getAbout } from "@/lib/i18n/about";
import { LOCALES, isLocale, localePath, type Locale } from "@/lib/i18n/locales";
import styles from "../privacy/privacy.module.css";

interface Params {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "ko";
  const a = getAbout(locale);
  return {
    title: `${a.title} | Igolnik Tracker`,
    description: a.paragraphs[0],
    alternates: {
      canonical: localePath(locale, "/about"),
      languages: Object.fromEntries([
        ...LOCALES.map((l) => [l, localePath(l, "/about")]),
        ["x-default", "/about"],
      ]),
    },
  };
}

export default async function AboutPage({ params }: Params) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "ko";
  const a = getAbout(locale);

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>{a.title}</h1>
      {a.paragraphs.map((p, i) => (
        <p key={i} className={styles.body}>
          {p}
        </p>
      ))}
      <section className={styles.section}>
        <h2 className={styles.heading}>{a.featuresHeading}</h2>
        <ul className={styles.list}>
          {a.features.map((f, i) => (
            <li key={i} className={styles.body}>
              {f}
            </li>
          ))}
        </ul>
      </section>
      <section className={styles.section}>
        <h2 className={styles.heading}>{a.dataHeading}</h2>
        {a.dataBody.map((p, i) => (
          <p key={i} className={styles.body}>
            {p}
          </p>
        ))}
      </section>
    </main>
  );
}
