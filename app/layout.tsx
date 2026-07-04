import type { Metadata } from "next";
import { IBM_Plex_Sans_KR, JetBrains_Mono, Oswald } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SearchProvider } from "@/components/SearchProvider";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "타르코프 탄약표 · 시세 | Igolnik Tracker",
    template: "%s | Igolnik Tracker",
  },
  description:
    "Escape from Tarkov 탄약 성능표와 아이템 시세를 한국어로. 캘리버별 관통력·데미지·방어구 관통 확률, 벼룩시장 시세 실시간 확인.",
  keywords: ["타르코프", "타르코프 탄약", "타르코프 탄약표", "타르코프 시세", "Escape from Tarkov"],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "Igolnik Tracker",
    title: "타르코프 탄약표 · 시세 | Igolnik Tracker",
    description:
      "Escape from Tarkov 탄약 성능표와 아이템 시세를 한국어로. 방어구 관통 확률과 벼룩시장 시세 확인.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${plexKr.variable} ${oswald.variable} ${jbMono.variable}`}>
      <body>
        <SearchProvider>
          <Header />
          {children}
          <Footer />
        </SearchProvider>
      </body>
    </html>
  );
}
