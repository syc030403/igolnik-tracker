/** 지원 로케일. ko가 기본(URL 접두어 없음), 나머지는 /en /ja /ru /zh */
export const LOCALES = ["ko", "en", "ja", "ru", "zh"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "ko";

export const LOCALE_LABELS: Record<Locale, string> = {
  ko: "한국어",
  en: "English",
  ja: "日本語",
  ru: "Русский",
  zh: "中文",
};

export function isLocale(v: string): v is Locale {
  return (LOCALES as readonly string[]).includes(v);
}

/** 로케일별 경로 생성: ko는 접두어 없음 */
export function localePath(locale: Locale, path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return p === "" ? "/" : p;
  return p === "/" ? `/${locale}` : `/${locale}${p}`;
}
