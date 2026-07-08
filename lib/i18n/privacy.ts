import type { Locale } from "./locales";

export interface PrivacySection {
  heading: string;
  body: string[];
}

export interface PrivacyContent {
  title: string;
  updated: string;
  navLabel: string;
  sections: PrivacySection[];
}

const ko: PrivacyContent = {
  title: "개인정보처리방침",
  updated: "최종 업데이트: 2026-07-07",
  navLabel: "개인정보처리방침",
  sections: [
    {
      heading: "1. 개요",
      body: [
        "Igolnik Tracker(이하 “본 사이트”)는 Escape from Tarkov 관련 정보를 제공하는 비공식 팬 제작 사이트입니다. 본 사이트는 회원가입이나 로그인 기능이 없으며, 이용자에게 이름·이메일·연락처 등 개인을 식별할 수 있는 정보를 직접 수집하지 않습니다.",
      ],
    },
    {
      heading: "2. 자동으로 수집되는 정보",
      body: [
        "본 사이트는 서비스 제공 과정에서 접속 로그, 브라우저 종류, 기기 정보, IP 주소 등 일반적인 웹 로그 정보가 인프라(호스팅·CDN) 제공사에 의해 자동으로 기록될 수 있습니다. 이 정보는 서비스 운영과 보안 목적으로만 사용됩니다.",
      ],
    },
    {
      heading: "3. 쿠키 및 광고",
      body: [
        "본 사이트는 Google 애드센스를 통해 광고를 게재합니다. Google을 포함한 제3자 광고 공급업체는 쿠키를 사용하여 이용자의 이전 방문 기록을 기반으로 광고를 게재할 수 있습니다.",
        "Google의 광고 쿠키 사용은 이용자가 본 사이트 및 다른 사이트를 방문한 정보를 바탕으로 광고를 표시할 수 있게 합니다. 이용자는 Google 광고 설정(https://www.google.com/settings/ads)에서 개인 맞춤 광고를 비활성화할 수 있습니다.",
        "또한 https://www.aboutads.info 에서 제3자 공급업체의 맞춤 광고 쿠키 사용을 거부할 수 있습니다.",
      ],
    },
    {
      heading: "4. 데이터 출처",
      body: [
        "본 사이트의 게임 데이터(탄약 성능, 아이템 시세 등)는 tarkov.dev 공개 API에서 제공받습니다. 본 사이트는 해당 데이터의 정확성을 보증하지 않으며, 참고용으로만 제공합니다.",
      ],
    },
    {
      heading: "5. 문의",
      body: [
        "개인정보 처리에 관한 문의는 사이트 운영자에게 연락해 주시기 바랍니다.",
      ],
    },
  ],
};

const en: PrivacyContent = {
  title: "Privacy Policy",
  updated: "Last updated: 2026-07-07",
  navLabel: "Privacy Policy",
  sections: [
    {
      heading: "1. Overview",
      body: [
        "Igolnik Tracker (the “Site”) is an unofficial fan-made site providing information about Escape from Tarkov. The Site has no sign-up or login, and does not directly collect personally identifiable information such as your name, email, or contact details.",
      ],
    },
    {
      heading: "2. Information collected automatically",
      body: [
        "Standard web log data — access logs, browser type, device information, and IP address — may be recorded automatically by our infrastructure providers (hosting and CDN) as part of delivering the service. This data is used solely for operation and security.",
      ],
    },
    {
      heading: "3. Cookies and advertising",
      body: [
        "The Site displays ads through Google AdSense. Third-party vendors, including Google, use cookies to serve ads based on a user’s prior visits to this and other websites.",
        "Google’s use of advertising cookies enables it and its partners to serve ads based on your visits to this and other sites. You may opt out of personalized advertising by visiting Google Ads Settings (https://www.google.com/settings/ads).",
        "You may also opt out of third-party vendors’ use of cookies for personalized advertising at https://www.aboutads.info.",
      ],
    },
    {
      heading: "4. Data source",
      body: [
        "Game data on this Site (ammo stats, item prices, etc.) is provided by the public tarkov.dev API. The Site does not guarantee the accuracy of this data and provides it for reference only.",
      ],
    },
    {
      heading: "5. Contact",
      body: ["For questions about this policy, please contact the site operator."],
    },
  ],
};

const ja: PrivacyContent = {
  ...en,
  title: "プライバシーポリシー",
  navLabel: "プライバシーポリシー",
};
const ru: PrivacyContent = {
  ...en,
  title: "Политика конфиденциальности",
  navLabel: "Конфиденциальность",
};
const zh: PrivacyContent = {
  ...en,
  title: "隐私政策",
  navLabel: "隐私政策",
};

const CONTENT: Record<Locale, PrivacyContent> = { ko, en, ja, ru, zh };

export function getPrivacy(locale: Locale): PrivacyContent {
  return CONTENT[locale];
}
