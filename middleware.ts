import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_LOCALE, LOCALES } from "@/lib/i18n/locales";

/**
 * 로케일 라우팅:
 * - 한국어(기본)는 접두어 없는 URL 그대로 (/, /market …) → 내부적으로 /ko/... 로 rewrite
 * - 다른 언어는 /en /ja /ru /zh 접두어
 * - /ko/... 로 직접 접근하면 접두어 없는 정식 URL로 redirect (중복 URL 방지)
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 기본 로케일 접두어는 정식 URL이 아니다 → 301
  if (pathname === `/${DEFAULT_LOCALE}` || pathname.startsWith(`/${DEFAULT_LOCALE}/`)) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.slice(DEFAULT_LOCALE.length + 1) || "/";
    return NextResponse.redirect(url, 301);
  }

  const hasLocale = LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (!hasLocale) {
    const url = req.nextUrl.clone();
    url.pathname = `/${DEFAULT_LOCALE}${pathname}`;
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}

export const config = {
  // API·정적 파일·메타데이터 라우트는 로케일 처리 제외
  matcher: ["/((?!api|_next|favicon.ico|robots.txt|sitemap.xml|opengraph-image|.*\\.).*)"],
};
