"use client";

import { createContext, useContext } from "react";
import type { Dict } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/locales";

interface I18n {
  lang: Locale;
  dict: Dict;
}

const I18nContext = createContext<I18n | null>(null);

export function LocaleProvider({
  lang,
  dict,
  children,
}: I18n & { children: React.ReactNode }) {
  return <I18nContext.Provider value={{ lang, dict }}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18n {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within LocaleProvider");
  return ctx;
}
