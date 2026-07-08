import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { IBM_Plex_Sans_KR, JetBrains_Mono, Oswald } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";
import AdBlockNotice from "@/components/AdBlockNotice";
import SideRails from "@/components/SideRails";
import { LocaleProvider } from "@/components/LocaleProvider";
import { SearchProvider } from "@/components/SearchProvider";
import { ADSENSE_CLIENT } from "@/lib/ads";
import { getDict } from "@/lib/i18n/dictionaries";
import { getPrivacy } from "@/lib/i18n/privacy";
import { LOCALES, isLocale, localePath, type Locale } from "@/lib/i18n/locales";
import { SITE_URL } from "@/lib/site";
import "../globals.css";

const plexKr = IBM_Plex_Sans_KR({
  variable: "--font-plex-kr",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

const jbMono = JetBrains_Mono({
  variable: "--font-jbmono",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

// dynamicParams=false를 여기 두면 하위 [cat] 같은 동적 세그먼트까지 잠겨
// 온디맨드 ISR 페이지가 프로덕션에서 404가 된다.
// 잘못된 로케일은 RootLayout의 notFound() 가드가 처리한다.

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "ko";
  const dict = getDict(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: dict.metaHomeTitle,
      template: "%s | Igolnik Tracker",
    },
    description: dict.metaHomeDesc,
    // 검색엔진 소유확인 (구글 서치콘솔 / 네이버 서치어드바이저)
    verification: {
      google: "M5xsUL3S3W6nv49pfe-08AjDlIRwjBI8bDm5lcZIwdw",
    },
    keywords: [
      "타르코프",
      "타르코프 탄약",
      "타르코프 탄약표",
      "타르코프 시세",
      "Escape from Tarkov",
      "Tarkov ammo chart",
    ],
    openGraph: {
      type: "website",
      locale: locale === "ko" ? "ko_KR" : locale,
      siteName: "Igolnik Tracker",
      title: dict.metaHomeTitle,
      description: dict.metaHomeDesc,
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDict(lang);
  const privacy = getPrivacy(lang);

  return (
    <html lang={lang} className={`${plexKr.variable} ${oswald.variable} ${jbMono.variable}`}>
      {ADSENSE_CLIENT && (
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      )}
      <body>
        <LocaleProvider lang={lang} dict={dict}>
          <SearchProvider>
            <AdBlockNotice />
            <Header />
            <SideRails />
            {children}
            <div className="bottomBanner">
              <AdBanner />
            </div>
            <Footer
              notice={dict.footerNotice}
              privacyHref={localePath(lang, "/privacy")}
              privacyLabel={privacy.navLabel}
            />
          </SearchProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
