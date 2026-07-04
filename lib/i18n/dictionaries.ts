import type { Locale } from "./locales";

/** UI 문자열 사전. 아이템·트레이더명은 API lang 파라미터로 현지화되고, 여기는 UI 고정 문구만. */
export interface Dict {
  brandSub: string;
  searchPlaceholder: string;
  searchAria: string;
  navAmmo: string;
  navMarket: string;
  navQuest: string;
  soon: string;
  langAria: string;

  all: string;
  sort: string;
  penetration: string;
  damage: string;
  ammoName: string;
  legendTitle: string;
  legendPen: string;
  legendMid: string;
  legendLow: string;
  legendBlock: string;
  kindsSuffix: string;
  emptyResult: string;
  tableCaption: string;

  armorDamage: string;
  fragChance: string;
  velocity: string;
  recoilMod: string;
  accuracyMod: string;
  fleaCurrent: string;
  fleaBanned: string;
  packNote: string;
  /** {n} 자리에 수량 치환 */
  packPrice: string;
  perRound: string;
  sources: string;
  noSources: string;
  trader: string;
  barter: string;
  craft: string;
  footnote: string;
  noModeData: string;
  loading: string;
  noHistory: string;
  chartAria: string;

  vsPrev: string;
  vsDayAgo: string;
  vsWeekAgo: string;
  ttOpen: string;
  ttHigh: string;
  ttLow: string;
  ttClose: string;

  marketTitle: string;
  perSlot: string;
  fleaPrice: string;
  changeRate: string;
  fleaMarket: string;
  traderLabel: string;
  fleaBannedBadge: string;
  fleaBannedDetail: string;
  modeAria: string;

  footerNotice: string;

  errTitle: string;
  errDesc: string;

  metaHomeTitle: string;
  metaHomeDesc: string;
  metaMarketTitle: string;
  metaMarketDesc: string;
  metaPveTitle: string;
  metaPveDesc: string;
  h1Home: string;
  h1Market: string;
  h1Pve: string;
}

const ko: Dict = {
  brandSub: "타르코프 탄약 · 시세 유틸",
  searchPlaceholder: "탄약 · 아이템 검색 (한 / 영 / 약칭)",
  searchAria: "탄약 및 아이템 검색",
  navAmmo: "탄약표",
  navMarket: "시세",
  navQuest: "퀘스트템",
  soon: "SOON",
  langAria: "언어 선택",

  all: "전체",
  sort: "정렬",
  penetration: "관통력",
  damage: "데미지",
  ammoName: "탄약명",
  legendTitle: "방어구 관통 확률",
  legendPen: "관통 (70%+)",
  legendMid: "애매 (40~69%)",
  legendLow: "불안정 (18~39%)",
  legendBlock: "막힘 (~17%)",
  kindsSuffix: "종",
  emptyResult: "검색 결과 없음",
  tableCaption: "Escape from Tarkov 탄약 성능표: 캘리버별 데미지, 관통력, 방어구 등급별 관통 확률",

  armorDamage: "방어구 데미지",
  fragChance: "파편 확률",
  velocity: "탄속",
  recoilMod: "반동 보정",
  accuracyMod: "정확도 보정",
  fleaCurrent: "플리마켓 현재가",
  fleaBanned: "플리마켓 거래 불가",
  packNote: "단품은 플리마켓 거래 불가 · 탄약 팩 기준 시세",
  packPrice: "탄약 팩 시세 ({n}발)",
  perRound: "발당",
  sources: "획득처",
  noSources: "현재 확인된 획득처 없음",
  trader: "트레이더",
  barter: "물물교환",
  craft: "제작",
  footnote: "* 관통 확률은 방어구 내구도 100% 기준 추정치",
  noModeData: "이 모드의 시세 데이터 없음",
  loading: "불러오는 중…",
  noHistory: "가격 이력 데이터 없음",
  chartAria: "가격 캔들 차트",

  vsPrev: "직전 대비",
  vsDayAgo: "1일 전 대비",
  vsWeekAgo: "1주 전 대비",
  ttOpen: "시",
  ttHigh: "고",
  ttLow: "저",
  ttClose: "종",

  marketTitle: "아이템 시세",
  perSlot: "슬롯당",
  fleaPrice: "플리가",
  changeRate: "변동률",
  fleaMarket: "플리마켓",
  traderLabel: "트레이더",
  fleaBannedBadge: "플리마켓 불가",
  fleaBannedDetail: "플리마켓 거래 불가 아이템 — 트레이더 매각가 기준",
  modeAria: "게임모드 선택",

  footerNotice:
    "본 사이트는 비공식 팬 제작 사이트이며, Battlestate Games 및 Escape from Tarkov와 어떠한 제휴 관계도 없습니다. 모든 상표권은 각 소유자에게 있습니다.",

  errTitle: "데이터를 불러오지 못했습니다",
  errDesc: "tarkov.dev API가 일시적으로 응답하지 않습니다. 잠시 후 새로고침해 주세요.",

  metaHomeTitle: "타르코프 탄약표 — 관통력 · 방어구 관통 확률 | Igolnik Tracker",
  metaHomeDesc:
    "Escape from Tarkov 전 캘리버 탄약 성능표. 관통력, 데미지, 방어구 등급 1~6 관통 확률을 색상으로 한눈에. 탄약별 시세와 획득처까지 확인.",
  metaMarketTitle: "타르코프 시세 — 플리마켓 · 트레이더 아이템 가격 (PvP)",
  metaMarketDesc:
    "Escape from Tarkov PvP 인기 아이템 실시간 시세. 플리마켓 가격, 트레이더 최고 매입가, 슬롯당 가격, 변동률을 정렬해서 비교.",
  metaPveTitle: "타르코프 PVE 시세 — 플리마켓 · 트레이더 아이템 가격",
  metaPveDesc:
    "Escape from Tarkov PVE 모드 인기 아이템 실시간 시세. PVE 플리마켓 가격, 트레이더 최고 매입가, 슬롯당 가격, 변동률을 정렬해서 비교.",
  h1Home: "타르코프 탄약 성능표 — 캘리버별 관통력·데미지",
  h1Market: "타르코프 아이템 시세 — 플리마켓·트레이더 가격 비교 (PvP)",
  h1Pve: "타르코프 PVE 아이템 시세 — 플리마켓·트레이더 가격 비교",
};

const en: Dict = {
  brandSub: "Tarkov ammo & market util",
  searchPlaceholder: "Search ammo · items",
  searchAria: "Search ammo and items",
  navAmmo: "Ammo",
  navMarket: "Market",
  navQuest: "Quest items",
  soon: "SOON",
  langAria: "Select language",

  all: "All",
  sort: "Sort",
  penetration: "Pen",
  damage: "Damage",
  ammoName: "Ammo",
  legendTitle: "Armor penetration chance",
  legendPen: "Pens (70%+)",
  legendMid: "Coin flip (40–69%)",
  legendLow: "Unreliable (18–39%)",
  legendBlock: "Blocked (~17%)",
  kindsSuffix: " types",
  emptyResult: "No results",
  tableCaption:
    "Escape from Tarkov ammo table: damage, penetration and per-class armor penetration chance by caliber",

  armorDamage: "Armor damage",
  fragChance: "Fragmentation",
  velocity: "Velocity",
  recoilMod: "Recoil",
  accuracyMod: "Accuracy",
  fleaCurrent: "Flea market price",
  fleaBanned: "Banned on flea market",
  packNote: "Single rounds are flea-banned · pack price shown",
  packPrice: "Ammo pack price ({n} pcs)",
  perRound: "per round",
  sources: "How to obtain",
  noSources: "No known sources right now",
  trader: "Trader",
  barter: "Barter",
  craft: "Craft",
  footnote: "* Pen chance is an estimate at 100% armor durability",
  noModeData: "No price data for this mode",
  loading: "Loading…",
  noHistory: "No price history",
  chartAria: "Price candlestick chart",

  vsPrev: "vs prev",
  vsDayAgo: "vs 1d ago",
  vsWeekAgo: "vs 1w ago",
  ttOpen: "O",
  ttHigh: "H",
  ttLow: "L",
  ttClose: "C",

  marketTitle: "Item prices",
  perSlot: "Per slot",
  fleaPrice: "Flea",
  changeRate: "Change",
  fleaMarket: "Flea market",
  traderLabel: "Trader",
  fleaBannedBadge: "No flea",
  fleaBannedDetail: "Flea-banned item — trader sell price basis",
  modeAria: "Select game mode",

  footerNotice:
    "This is an unofficial fan-made site and is not affiliated with Battlestate Games or Escape from Tarkov. All trademarks belong to their respective owners.",

  errTitle: "Failed to load data",
  errDesc: "The tarkov.dev API is temporarily unavailable. Please refresh in a moment.",

  metaHomeTitle: "Tarkov Ammo Chart — Penetration & Armor Pen Chance | Igolnik Tracker",
  metaHomeDesc:
    "Escape from Tarkov ammo table for every caliber. Penetration, damage and class 1–6 armor pen chance at a glance, with prices and how to obtain.",
  metaMarketTitle: "Tarkov Market — Flea & Trader Prices (PvP)",
  metaMarketDesc:
    "Live Escape from Tarkov PvP item prices. Compare flea market price, best trader sell price, price per slot and change rate.",
  metaPveTitle: "Tarkov PVE Market — Flea & Trader Prices",
  metaPveDesc:
    "Live Escape from Tarkov PVE item prices. Compare PVE flea market price, best trader sell price, price per slot and change rate.",
  h1Home: "Tarkov ammo performance table — penetration & damage by caliber",
  h1Market: "Tarkov item prices — flea vs trader (PvP)",
  h1Pve: "Tarkov PVE item prices — flea vs trader",
};

const ja: Dict = {
  brandSub: "タルコフ弾薬・相場ツール",
  searchPlaceholder: "弾薬・アイテム検索",
  searchAria: "弾薬とアイテムを検索",
  navAmmo: "弾薬表",
  navMarket: "相場",
  navQuest: "タスク品",
  soon: "近日",
  langAria: "言語を選択",

  all: "すべて",
  sort: "並び替え",
  penetration: "貫通力",
  damage: "ダメージ",
  ammoName: "弾薬名",
  legendTitle: "アーマー貫通確率",
  legendPen: "貫通 (70%+)",
  legendMid: "五分 (40~69%)",
  legendLow: "不安定 (18~39%)",
  legendBlock: "防がれる (~17%)",
  kindsSuffix: "種",
  emptyResult: "検索結果なし",
  tableCaption:
    "Escape from Tarkov 弾薬性能表: 口径別ダメージ・貫通力・アーマークラス別貫通確率",

  armorDamage: "アーマーダメージ",
  fragChance: "破片化率",
  velocity: "弾速",
  recoilMod: "反動補正",
  accuracyMod: "精度補正",
  fleaCurrent: "フリーマーケット価格",
  fleaBanned: "フリマ出品不可",
  packNote: "単発はフリマ不可・弾薬パック基準の相場",
  packPrice: "弾薬パック相場 ({n}発)",
  perRound: "1発あたり",
  sources: "入手方法",
  noSources: "現在確認できる入手先なし",
  trader: "トレーダー",
  barter: "バーター",
  craft: "クラフト",
  footnote: "* 貫通確率はアーマー耐久100%基準の推定値",
  noModeData: "このモードの価格データなし",
  loading: "読み込み中…",
  noHistory: "価格履歴なし",
  chartAria: "価格ローソク足チャート",

  vsPrev: "直前比",
  vsDayAgo: "1日前比",
  vsWeekAgo: "1週間前比",
  ttOpen: "始",
  ttHigh: "高",
  ttLow: "安",
  ttClose: "終",

  marketTitle: "アイテム相場",
  perSlot: "スロット単価",
  fleaPrice: "フリマ",
  changeRate: "変動率",
  fleaMarket: "フリマ",
  traderLabel: "トレーダー",
  fleaBannedBadge: "フリマ不可",
  fleaBannedDetail: "フリマ出品不可アイテム — トレーダー売却価格基準",
  modeAria: "ゲームモード選択",

  footerNotice:
    "本サイトは非公式のファンメイドサイトであり、Battlestate Games および Escape from Tarkov とは一切提携していません。すべての商標は各所有者に帰属します。",

  errTitle: "データを取得できませんでした",
  errDesc: "tarkov.dev API が一時的に応答していません。しばらくしてから再読み込みしてください。",

  metaHomeTitle: "タルコフ弾薬表 — 貫通力・アーマー貫通確率 | Igolnik Tracker",
  metaHomeDesc:
    "Escape from Tarkov 全口径の弾薬性能表。貫通力・ダメージ・アーマークラス1~6の貫通確率を色分けで一目確認。相場と入手方法も。",
  metaMarketTitle: "タルコフ相場 — フリマ・トレーダー価格 (PvP)",
  metaMarketDesc:
    "Escape from Tarkov PvP 人気アイテムのリアルタイム相場。フリマ価格・トレーダー最高売値・スロット単価・変動率を比較。",
  metaPveTitle: "タルコフ PVE 相場 — フリマ・トレーダー価格",
  metaPveDesc:
    "Escape from Tarkov PVE モードのリアルタイム相場。PVE フリマ価格・トレーダー最高売値・スロット単価・変動率を比較。",
  h1Home: "タルコフ弾薬性能表 — 口径別貫通力・ダメージ",
  h1Market: "タルコフアイテム相場 — フリマ・トレーダー比較 (PvP)",
  h1Pve: "タルコフ PVE アイテム相場 — フリマ・トレーダー比較",
};

const ru: Dict = {
  brandSub: "Патроны и цены Таркова",
  searchPlaceholder: "Поиск патронов · предметов",
  searchAria: "Поиск патронов и предметов",
  navAmmo: "Патроны",
  navMarket: "Барахолка",
  navQuest: "Квестовые",
  soon: "СКОРО",
  langAria: "Выбор языка",

  all: "Все",
  sort: "Сортировка",
  penetration: "Пробитие",
  damage: "Урон",
  ammoName: "Патрон",
  legendTitle: "Шанс пробития брони",
  legendPen: "Пробивает (70%+)",
  legendMid: "50/50 (40–69%)",
  legendLow: "Ненадёжно (18–39%)",
  legendBlock: "Блок (~17%)",
  kindsSuffix: " шт.",
  emptyResult: "Ничего не найдено",
  tableCaption:
    "Таблица патронов Escape from Tarkov: урон, пробитие и шанс пробития брони по классам",

  armorDamage: "Урон по броне",
  fragChance: "Фрагментация",
  velocity: "Скорость",
  recoilMod: "Отдача",
  accuracyMod: "Точность",
  fleaCurrent: "Цена на барахолке",
  fleaBanned: "Запрещено на барахолке",
  packNote: "Патроны поштучно запрещены · цена за пачку",
  packPrice: "Пачка патронов ({n} шт.)",
  perRound: "за патрон",
  sources: "Где получить",
  noSources: "Источники не найдены",
  trader: "Торговец",
  barter: "Обмен",
  craft: "Крафт",
  footnote: "* Шанс пробития — оценка при 100% прочности брони",
  noModeData: "Нет данных для этого режима",
  loading: "Загрузка…",
  noHistory: "Нет истории цен",
  chartAria: "Свечной график цены",

  vsPrev: "к пред.",
  vsDayAgo: "к 1 дн. назад",
  vsWeekAgo: "к 1 нед. назад",
  ttOpen: "О",
  ttHigh: "В",
  ttLow: "Н",
  ttClose: "З",

  marketTitle: "Цены предметов",
  perSlot: "За слот",
  fleaPrice: "Барахолка",
  changeRate: "Изменение",
  fleaMarket: "Барахолка",
  traderLabel: "Торговец",
  fleaBannedBadge: "Не на барахолке",
  fleaBannedDetail: "Запрещено на барахолке — цена продажи торговцу",
  modeAria: "Выбор режима игры",

  footerNotice:
    "Это неофициальный фанатский сайт, не связанный с Battlestate Games и Escape from Tarkov. Все товарные знаки принадлежат их владельцам.",

  errTitle: "Не удалось загрузить данные",
  errDesc: "API tarkov.dev временно недоступен. Обновите страницу чуть позже.",

  metaHomeTitle: "Таблица патронов Таркова — пробитие и шанс пробития брони | Igolnik Tracker",
  metaHomeDesc:
    "Таблица патронов Escape from Tarkov по всем калибрам: пробитие, урон и шанс пробития брони классов 1–6, цены и способы получения.",
  metaMarketTitle: "Цены Таркова — барахолка и торговцы (PvP)",
  metaMarketDesc:
    "Актуальные цены предметов Escape from Tarkov (PvP): барахолка, лучшая цена торговца, цена за слот и изменение.",
  metaPveTitle: "Цены Таркова PVE — барахолка и торговцы",
  metaPveDesc:
    "Актуальные цены предметов Escape from Tarkov в режиме PVE: барахолка, лучшая цена торговца, цена за слот и изменение.",
  h1Home: "Таблица патронов Таркова — пробитие и урон по калибрам",
  h1Market: "Цены предметов Таркова — барахолка и торговцы (PvP)",
  h1Pve: "Цены предметов Таркова PVE — барахолка и торговцы",
};

const zh: Dict = {
  brandSub: "塔科夫弹药·价格工具",
  searchPlaceholder: "搜索弹药 · 物品",
  searchAria: "搜索弹药和物品",
  navAmmo: "弹药表",
  navMarket: "行情",
  navQuest: "任务物品",
  soon: "即将上线",
  langAria: "选择语言",

  all: "全部",
  sort: "排序",
  penetration: "穿透力",
  damage: "伤害",
  ammoName: "弹药",
  legendTitle: "护甲穿透概率",
  legendPen: "可穿透 (70%+)",
  legendMid: "五五开 (40~69%)",
  legendLow: "不稳定 (18~39%)",
  legendBlock: "挡住 (~17%)",
  kindsSuffix: "种",
  emptyResult: "无搜索结果",
  tableCaption: "逃离塔科夫弹药性能表：按口径的伤害、穿透力及各级护甲穿透概率",

  armorDamage: "护甲伤害",
  fragChance: "碎裂概率",
  velocity: "初速",
  recoilMod: "后坐力修正",
  accuracyMod: "精度修正",
  fleaCurrent: "跳蚤市场现价",
  fleaBanned: "跳蚤市场禁售",
  packNote: "单发禁售 · 显示弹药包价格",
  packPrice: "弹药包价格 ({n}发)",
  perRound: "每发",
  sources: "获取途径",
  noSources: "暂无已知获取途径",
  trader: "商人",
  barter: "以物换物",
  craft: "制作",
  footnote: "* 穿透概率为护甲耐久100%时的估算值",
  noModeData: "该模式暂无价格数据",
  loading: "加载中…",
  noHistory: "暂无价格历史",
  chartAria: "价格K线图",

  vsPrev: "较上一根",
  vsDayAgo: "较1天前",
  vsWeekAgo: "较1周前",
  ttOpen: "开",
  ttHigh: "高",
  ttLow: "低",
  ttClose: "收",

  marketTitle: "物品行情",
  perSlot: "每格",
  fleaPrice: "跳蚤",
  changeRate: "涨跌",
  fleaMarket: "跳蚤市场",
  traderLabel: "商人",
  fleaBannedBadge: "禁售",
  fleaBannedDetail: "跳蚤市场禁售物品 — 以商人收购价为准",
  modeAria: "选择游戏模式",

  footerNotice:
    "本站为非官方粉丝网站，与 Battlestate Games 及《逃离塔科夫》无任何关联。所有商标归各自所有者所有。",

  errTitle: "数据加载失败",
  errDesc: "tarkov.dev API 暂时无响应，请稍后刷新。",

  metaHomeTitle: "塔科夫弹药表 — 穿透力·护甲穿透概率 | Igolnik Tracker",
  metaHomeDesc:
    "逃离塔科夫全口径弹药性能表。穿透力、伤害、1~6级护甲穿透概率一目了然，附价格与获取途径。",
  metaMarketTitle: "塔科夫行情 — 跳蚤市场·商人价格 (PvP)",
  metaMarketDesc:
    "逃离塔科夫 PvP 热门物品实时行情。对比跳蚤市场价、商人最高收购价、每格价格与涨跌幅。",
  metaPveTitle: "塔科夫 PVE 行情 — 跳蚤市场·商人价格",
  metaPveDesc:
    "逃离塔科夫 PVE 模式实时行情。对比 PVE 跳蚤市场价、商人最高收购价、每格价格与涨跌幅。",
  h1Home: "塔科夫弹药性能表 — 按口径的穿透力·伤害",
  h1Market: "塔科夫物品行情 — 跳蚤市场·商人对比 (PvP)",
  h1Pve: "塔科夫 PVE 物品行情 — 跳蚤市场·商人对比",
};

const DICTS: Record<Locale, Dict> = { ko, en, ja, ru, zh };

export function getDict(locale: Locale): Dict {
  return DICTS[locale];
}
