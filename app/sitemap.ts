import type { MetadataRoute } from "next";
import { LOCALES, localePath } from "@/lib/i18n/locales";
import { SITE_URL } from "@/lib/site";

const PATHS: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/market", priority: 0.8 },
  { path: "/market/pve", priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.flatMap(({ path, priority }) =>
    LOCALES.map((locale) => ({
      url: `${SITE_URL}${localePath(locale, path)}`,
      changeFrequency: "hourly" as const,
      // 한국어(기본)가 대표, 번역본은 살짝 낮게
      priority: locale === "ko" ? priority : priority - 0.2,
    })),
  );
}
