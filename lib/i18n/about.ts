import type { Locale } from "./locales";

export interface AboutContent {
  title: string;
  navLabel: string;
  paragraphs: string[];
  featuresHeading: string;
  features: string[];
  dataHeading: string;
  dataBody: string[];
}

const ko: AboutContent = {
  title: "Igolnik Tracker 소개",
  navLabel: "소개",
  paragraphs: [
    "Igolnik Tracker는 Escape from Tarkov 플레이어를 위한 무료 유틸리티 사이트입니다. 레이드 준비에 필요한 탄약 성능 비교, 아이템 시세 확인, 퀘스트 아이템 관리를 한곳에서 해결하는 것을 목표로 만들었습니다.",
    "사이트 이름은 5.45×39mm 최상위 탄약인 PPBS gs \"Igolnik\"(러시아어로 '바늘')에서 따왔습니다.",
  ],
  featuresHeading: "제공 기능",
  features: [
    "탄약표 — 전 캘리버 탄약의 관통력·데미지와 방어구 등급 1~6 관통 확률",
    "시세 — 플리마켓·트레이더 가격, 슬롯당 가치, 기간별 가격 차트 (PvP/PvE 분리)",
    "퀘스트템 — 퀘스트별 필요 아이템·수량·현장획득(FIR) 체크리스트",
    "한국어·영어·일본어·러시아어·중국어 지원",
  ],
  dataHeading: "데이터 출처와 갱신",
  dataBody: [
    "모든 게임 데이터는 커뮤니티가 운영하는 공개 API인 tarkov.dev에서 제공받습니다. 탄약 스펙과 퀘스트는 1시간, 시세는 약 5분 주기로 갱신됩니다.",
    "본 사이트는 비공식 팬 제작 사이트로, Battlestate Games와 아무런 제휴 관계가 없습니다. 게임 콘텐츠·이미지·상표의 저작권은 Battlestate Games Limited에 있습니다.",
  ],
};

const en: AboutContent = {
  title: "About Igolnik Tracker",
  navLabel: "About",
  paragraphs: [
    "Igolnik Tracker is a free utility site for Escape from Tarkov players. It brings ammo comparison, market prices, and quest item management into one place for raid preparation.",
    "The name comes from PPBS gs \"Igolnik\" — the top-tier 5.45×39mm round, Russian for “needle”.",
  ],
  featuresHeading: "Features",
  features: [
    "Ammo chart — penetration, damage, and class 1–6 armor pen chance for every caliber",
    "Market — flea and trader prices, per-slot value, historical price charts (PvP/PvE split)",
    "Quest items — per-quest required items, counts, and Found-in-Raid checklist",
    "Available in Korean, English, Japanese, Russian, and Chinese",
  ],
  dataHeading: "Data source & freshness",
  dataBody: [
    "All game data comes from tarkov.dev, a community-run public API. Ammo stats and quests refresh hourly; prices refresh about every 5 minutes.",
    "This is an unofficial fan-made site with no affiliation to Battlestate Games. All game content, images, and trademarks are the property of Battlestate Games Limited.",
  ],
};

const ja: AboutContent = {
  ...en,
  title: "Igolnik Tracker について",
  navLabel: "サイトについて",
  paragraphs: [
    "Igolnik Tracker は Escape from Tarkov プレイヤーのための無料ユーティリティサイトです。弾薬比較・相場確認・タスクアイテム管理をレイド準備のために一か所にまとめました。",
    "名前は 5.45×39mm 最上位弾 PPBS gs「Igolnik」(ロシア語で「針」)に由来します。",
  ],
};

const ru: AboutContent = {
  ...en,
  title: "О сайте Igolnik Tracker",
  navLabel: "О сайте",
  paragraphs: [
    "Igolnik Tracker — бесплатный сайт-утилита для игроков Escape from Tarkov: сравнение патронов, цены рынка и чек-лист квестовых предметов в одном месте.",
    "Название происходит от ППБС гс «Игольник» — топового патрона 5.45×39.",
  ],
};

const zh: AboutContent = {
  ...en,
  title: "关于 Igolnik Tracker",
  navLabel: "关于本站",
  paragraphs: [
    "Igolnik Tracker 是为《逃离塔科夫》玩家打造的免费工具站：弹药对比、行情查询、任务物品清单，一站式完成战局准备。",
    "站名取自 5.45×39mm 顶级弹药 PPBS gs「Igolnik」(俄语意为「针」)。",
  ],
};

const CONTENT: Record<Locale, AboutContent> = { ko, en, ja, ru, zh };

export function getAbout(locale: Locale): AboutContent {
  return CONTENT[locale];
}
