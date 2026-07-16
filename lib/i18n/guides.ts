import type { Locale } from "./locales";

/**
 * 페이지 하단 가이드/FAQ — 크롤러와 처음 온 유저를 위한 고유 설명 텍스트.
 * 표·숫자 위주 툴 페이지가 "내용 없는 페이지"로 읽히지 않도록 하는 역할도 한다.
 */
export interface GuideSection {
  heading: string;
  body: string[];
}

export interface PageGuide {
  title: string;
  sections: GuideSection[];
}

type GuideKey = "ammo" | "market" | "quests";

const ko: Record<GuideKey, PageGuide> = {
  ammo: {
    title: "탄약표 읽는 법",
    sections: [
      {
        heading: "방어구 관통 확률이란?",
        body: [
          "표의 1~6 열은 Escape from Tarkov의 방어구 등급을 뜻합니다. 각 셀의 퍼센트는 해당 등급 방어구(내구도 100% 기준)를 향해 쐈을 때 탄이 관통할 확률의 추정치입니다. 색이 초록에 가까울수록 잘 뚫리고, 붉을수록 막힙니다.",
          "게임 내 실제 판정은 방어구의 남은 내구도에 따라 달라집니다. 내구도가 깎일수록 관통 확률은 표시된 값보다 높아지므로, 여기 값은 '최악의 경우(새 방어구)' 기준으로 보면 됩니다.",
        ],
      },
      {
        heading: "관통력과 데미지, 뭘 봐야 하나?",
        body: [
          "상대가 방어구를 입었다면 관통력이 우선입니다. 관통력이 낮은 탄은 데미지가 높아도 방어구에 흡수되어 몸에 거의 피해를 주지 못합니다. 반대로 무방비 부위(다리·팔)를 노리는 전략이라면 순수 데미지가 높은 탄이 유리합니다.",
          "같은 캘리버 안에서도 탄종에 따라 성능 차이가 큽니다. 캘리버 칩으로 필터링한 뒤 관통력 정렬로 비교해 보세요.",
        ],
      },
      {
        heading: "자주 묻는 질문",
        body: [
          "Q. 탄약 시세가 왜 팩 기준인가요? — 현재 밸런스에서 탄약 단품은 플리마켓 거래가 금지되어 있습니다. 대신 거래 가능한 탄약 팩의 시세와 발당 환산가를 보여줍니다.",
          "Q. 데이터는 얼마나 자주 갱신되나요? — 탄약 스펙은 1시간, 시세는 약 5분 주기로 tarkov.dev 데이터를 반영합니다. 패치로 스펙이 바뀌면 자동으로 따라갑니다.",
          "Q. 관통 확률이 다른 사이트와 조금 다른데요? — 정확한 공식은 비공개라 커뮤니티가 검증한 근사식을 사용합니다. 사이트마다 가정(내구도 등)이 달라 수치가 약간 다를 수 있습니다.",
        ],
      },
    ],
  },
  market: {
    title: "시세 보는 법",
    sections: [
      {
        heading: "슬롯당 가격이 중요한 이유",
        body: [
          "타르코프의 인벤토리는 칸 수가 곧 돈입니다. 같은 100만 루블어치를 들고 나와도 1×1 아이템이 2×3 아이템보다 훨씬 효율적이죠. 슬롯당 가격 정렬은 '가방 한 칸의 가치'가 높은 순서로 보여줘서, 뭘 챙기고 뭘 버릴지 빠르게 판단할 수 있습니다.",
        ],
      },
      {
        heading: "PvP와 PvE 시세가 다른 이유",
        body: [
          "PvE 모드는 별도의 경제를 갖고 있어 같은 아이템도 가격이 크게 다를 수 있습니다. 상단의 PvP/PvE 토글로 자신이 플레이하는 모드의 시세를 확인하세요. 두 모드는 별도 페이지로 분리되어 있어 북마크도 따로 할 수 있습니다.",
        ],
      },
      {
        heading: "자주 묻는 질문",
        body: [
          "Q. 트레이더 가격은 뭔가요? — 플리마켓을 제외하고 상인에게 팔 때 가장 비싸게 쳐주는 가격(루블 환산)입니다. 플리 수수료를 감안하면 상인 판매가 이득인 경우도 많습니다.",
          "Q. 변동률 48H는 무슨 뜻인가요? — 48시간 전 대비 플리마켓 가격 변화율입니다. 카드를 눌러 펼치면 기간별(1D/7D/1M) 가격 그래프를 볼 수 있습니다.",
          "Q. 가격이 실제 게임과 조금 다른데요? — 시세는 커뮤니티 스캐너가 주기적으로 수집한 관측치라 수 분에서 수십 분의 시차가 있을 수 있습니다.",
        ],
      },
    ],
  },
  quests: {
    title: "퀘스트템 체크리스트 사용법",
    sections: [
      {
        heading: "현장 획득(FIR)이란?",
        body: [
          "일부 퀘스트는 '레이드에서 직접 주운(Found in Raid)' 아이템만 인정합니다. 플리마켓에서 산 아이템은 FIR 표시가 없어 제출할 수 없죠. 이 목록의 '현장 획득' 수량은 반드시 레이드에서 직접 확보해야 하는 개수입니다.",
          "레이드 중 아이템을 주웠는데 버릴지 고민된다면, 여기서 검색해 보세요. 퀘스트에 쓰이는 아이템이면 총 필요 수량과 어느 퀘스트인지 바로 나옵니다.",
        ],
      },
      {
        heading: "카파(Kappa) 전용 필터",
        body: [
          "카파 컨테이너는 대부분의 퀘스트를 완료해야 얻는 최종 보상입니다. '카파 전용' 필터를 켜면 카파 달성에 필요한 퀘스트에서 요구하는 아이템만 추려서 보여줍니다. 카파를 노린다면 이 목록의 아이템은 절대 팔지 마세요.",
        ],
      },
      {
        heading: "자주 묻는 질문",
        body: [
          "Q. 수량은 어떻게 계산되나요? — 모든 트레이더 퀘스트의 '아이템 제출' 목표를 아이템 단위로 합산한 값입니다. 카드를 펼치면 퀘스트별 필요 수량과 최소 레벨이 나옵니다.",
          "Q. 돈(루블 등)도 퀘스트에 필요하지 않나요? — 통화는 체크리스트의 의미가 없어 목록에서 제외했습니다.",
        ],
      },
    ],
  },
};

const en: Record<GuideKey, PageGuide> = {
  ammo: {
    title: "How to read the ammo chart",
    sections: [
      {
        heading: "What is armor penetration chance?",
        body: [
          "Columns 1–6 represent armor classes in Escape from Tarkov. Each cell shows the estimated chance that a round penetrates armor of that class at 100% durability. Greener cells penetrate reliably; redder cells get stopped.",
          "In-game rolls depend on the armor's remaining durability — as armor wears down, real penetration chance rises above the value shown here. Treat these numbers as the worst case against fresh armor.",
        ],
      },
      {
        heading: "Penetration vs damage — which matters?",
        body: [
          "Against armored targets, penetration wins. A high-damage round that can't penetrate gets absorbed and deals almost nothing to the body. If you leg-meta or target unarmored limbs, raw damage is what counts.",
          "Rounds within the same caliber vary wildly. Filter by caliber chip, then sort by penetration to compare your realistic options.",
        ],
      },
      {
        heading: "FAQ",
        body: [
          "Q. Why are ammo prices shown per pack? — Single rounds are currently banned from the flea market, so we show the tradable ammo pack price with a per-round conversion.",
          "Q. How fresh is the data? — Ammo stats refresh hourly and prices about every 5 minutes from tarkov.dev. Balance patches are picked up automatically.",
          "Q. Why do numbers differ slightly from other sites? — The exact formula is unpublished; we use the community-verified approximation. Sites differ in assumptions like durability.",
        ],
      },
    ],
  },
  market: {
    title: "How to use the price board",
    sections: [
      {
        heading: "Why price-per-slot matters",
        body: [
          "In Tarkov, inventory space is money. A 1×1 item worth the same as a 2×3 item is six times more efficient to extract with. Sorting by per-slot value tells you instantly what to keep and what to drop when your bag is full.",
        ],
      },
      {
        heading: "Why PvP and PvE prices differ",
        body: [
          "PvE runs its own economy, so the same item can trade at a very different price. Use the PvP/PvE toggle to match your mode — each mode has its own URL, so you can bookmark the one you play.",
        ],
      },
      {
        heading: "FAQ",
        body: [
          "Q. What is the trader price? — The best price any trader pays (in rubles), excluding the flea. After flea fees, vendoring is often the better deal.",
          "Q. What does the 48H change mean? — Flea price change versus 48 hours ago. Click a card to expand the 1D/7D/1M price chart.",
          "Q. Prices look slightly off from in-game? — Prices are periodic observations from a community scanner, so expect a lag of minutes.",
        ],
      },
    ],
  },
  quests: {
    title: "Using the quest item checklist",
    sections: [
      {
        heading: "What does Found in Raid (FIR) mean?",
        body: [
          "Some quests only accept items you personally looted in a raid. Flea-bought items lack the FIR mark and can't be handed in. The 'Found in raid' number here is how many you must loot yourself.",
          "Not sure whether to drop something mid-raid? Search it here — if a quest needs it, you'll see the total count and exactly which quests.",
        ],
      },
      {
        heading: "The Kappa filter",
        body: [
          "The Kappa container is the endgame reward for completing nearly every quest. The 'Kappa only' filter narrows the list to items required by Kappa-mandatory quests — never sell these if you're going for it.",
        ],
      },
      {
        heading: "FAQ",
        body: [
          "Q. How are counts calculated? — We aggregate every trader quest's hand-in objectives per item. Expand a card for per-quest counts and minimum level.",
          "Q. What about money hand-ins? — Currencies are excluded; they don't belong in a hoarding checklist.",
        ],
      },
    ],
  },
};

const ja: Record<GuideKey, PageGuide> = {
  ammo: {
    title: "弾薬表の読み方",
    sections: [
      {
        heading: "アーマー貫通確率とは",
        body: [
          "1~6の列はアーマークラスを表します。各セルの数値は、耐久100%のアーマーに対して弾が貫通する推定確率です。緑に近いほど貫通し、赤いほど防がれます。",
          "実際の判定はアーマーの残耐久で変わり、削れるほど貫通率は表示値より上がります。ここの値は「新品アーマー相手の最悪ケース」と考えてください。",
        ],
      },
      {
        heading: "貫通力とダメージ、どちらを見る?",
        body: [
          "相手がアーマーを着ているなら貫通力が優先です。貫通できない弾はダメージが高くても吸収されます。脚などの無防備部位を狙うなら素のダメージが有効です。",
        ],
      },
      {
        heading: "よくある質問",
        body: [
          "Q. 弾薬の相場がパック基準なのは? — 現在のバランスでは単発弾はフリマ出品不可のため、取引可能な弾薬パックの相場と1発あたり換算を表示しています。",
          "Q. データの更新頻度は? — スペックは1時間、相場は約5分間隔で tarkov.dev のデータを反映します。",
        ],
      },
    ],
  },
  market: {
    title: "相場ボードの使い方",
    sections: [
      {
        heading: "スロット単価が重要な理由",
        body: [
          "タルコフではインベントリの枠がそのままお金です。スロット単価の並び替えで「1マスあたりの価値」が高い順に確認でき、持ち帰る物と捨てる物を素早く判断できます。",
        ],
      },
      {
        heading: "PvPとPvEで価格が違う理由",
        body: [
          "PvEは独立した経済圏のため、同じアイテムでも価格が大きく異なることがあります。上部のトグルで自分のモードの相場を確認してください。",
        ],
      },
      {
        heading: "よくある質問",
        body: [
          "Q. トレーダー価格とは? — フリマを除き、商人が最も高く買い取る価格(ルーブル換算)です。",
          "Q. 48Hの変動率とは? — 48時間前と比べたフリマ価格の変化率です。カードを開くと期間別チャートが見られます。",
        ],
      },
    ],
  },
  quests: {
    title: "タスクアイテム チェックリストの使い方",
    sections: [
      {
        heading: "レイド内取得(FIR)とは",
        body: [
          "一部のタスクはレイドで自分が拾ったアイテムしか受け付けません。フリマ購入品はFIRマークが付かず納品できません。「レイド内取得」の数は自力で確保すべき個数です。",
        ],
      },
      {
        heading: "カッパ限定フィルター",
        body: [
          "カッパコンテナはほぼ全タスク完了の最終報酬です。「カッパ限定」フィルターで、カッパ達成に必要なタスクが要求するアイテムだけを表示します。",
        ],
      },
      {
        heading: "よくある質問",
        body: [
          "Q. 数量の計算方法は? — 全トレーダータスクの納品目標をアイテム単位で合算しています。カードを開くとタスク別の必要数と最低レベルが見られます。",
        ],
      },
    ],
  },
};

const ru: Record<GuideKey, PageGuide> = {
  ammo: {
    title: "Как читать таблицу патронов",
    sections: [
      {
        heading: "Что такое шанс пробития брони?",
        body: [
          "Столбцы 1–6 — классы брони. В каждой ячейке — оценочный шанс пробития брони этого класса при 100% прочности. Зелёные ячейки пробивают надёжно, красные — блокируются.",
          "В игре бросок зависит от оставшейся прочности брони: чем она ниже, тем выше реальный шанс. Считайте эти цифры худшим случаем против новой брони.",
        ],
      },
      {
        heading: "Пробитие или урон?",
        body: [
          "Против бронированных целей решает пробитие: непробивающий патрон почти не наносит урона телу. Если стреляете по ногам — важен чистый урон.",
        ],
      },
      {
        heading: "FAQ",
        body: [
          "В. Почему цены за пачку? — Поштучно патроны сейчас запрещены на барахолке, поэтому показываем цену пачки и пересчёт за патрон.",
          "В. Как часто обновляются данные? — Характеристики — раз в час, цены — примерно раз в 5 минут (tarkov.dev).",
        ],
      },
    ],
  },
  market: {
    title: "Как пользоваться ценами",
    sections: [
      {
        heading: "Почему важна цена за слот",
        body: [
          "В Таркове место в инвентаре — это деньги. Сортировка по цене за слот показывает, что выгоднее выносить, когда рюкзак полон.",
        ],
      },
      {
        heading: "Почему цены PvP и PvE различаются",
        body: [
          "У PvE отдельная экономика, поэтому один и тот же предмет может стоить по-разному. Переключайтесь тумблером PvP/PvE — у каждого режима свой URL.",
        ],
      },
      {
        heading: "FAQ",
        body: [
          "В. Что такое цена торговца? — Лучшая цена продажи торговцу (в рублях) без учёта барахолки.",
          "В. Что значит 48H? — Изменение цены на барахолке за 48 часов. Разверните карточку для графика 1D/7D/1M.",
        ],
      },
    ],
  },
  quests: {
    title: "Как пользоваться чек-листом",
    sections: [
      {
        heading: "Что значит «найдено в рейде» (FIR)?",
        body: [
          "Часть квестов принимает только предметы, поднятые лично в рейде. Купленное на барахолке сдать нельзя. Число FIR — сколько нужно добыть самому.",
          "Сомневаетесь, выбрасывать ли предмет в рейде? Поищите его здесь — сразу видно, каким квестам он нужен и сколько.",
        ],
      },
      {
        heading: "Фильтр «только Каппа»",
        body: [
          "Контейнер Каппа — награда за выполнение почти всех квестов. Фильтр показывает только предметы, нужные для обязательных квестов Каппы.",
        ],
      },
      {
        heading: "FAQ",
        body: [
          "В. Как считаются количества? — Суммируем цели сдачи предметов по всем квестам торговцев. В карточке — разбивка по квестам и минимальный уровень.",
        ],
      },
    ],
  },
};

const zh: Record<GuideKey, PageGuide> = {
  ammo: {
    title: "如何阅读弹药表",
    sections: [
      {
        heading: "什么是护甲穿透概率?",
        body: [
          "第1~6列代表护甲等级。每个单元格显示子弹对该等级护甲(耐久100%)的穿透概率估算值。越绿越容易穿透，越红越容易被挡住。",
          "游戏内的实际判定取决于护甲剩余耐久——耐久越低，实际穿透率越高于表中数值。请把这些数字视为面对全新护甲的最坏情况。",
        ],
      },
      {
        heading: "穿透力和伤害该看哪个?",
        body: [
          "对抗穿甲目标时穿透力优先：穿不透的子弹再高的伤害也会被吸收。若打腿等无甲部位，则看纯伤害。",
        ],
      },
      {
        heading: "常见问题",
        body: [
          "问：弹药价格为何按弹药包计? — 当前版本单发弹药禁止在跳蚤市场交易，因此展示可交易弹药包的价格及每发换算价。",
          "问：数据多久更新? — 弹药数据每小时、价格约每5分钟同步 tarkov.dev。",
        ],
      },
    ],
  },
  market: {
    title: "行情页使用说明",
    sections: [
      {
        heading: "为什么每格价格重要",
        body: [
          "塔科夫里背包格子就是钱。按每格价格排序能立刻看出背包满时该带走什么、丢掉什么。",
        ],
      },
      {
        heading: "PvP 与 PvE 价格为何不同",
        body: [
          "PvE 拥有独立经济，同一物品价格可能差异很大。用顶部的 PvP/PvE 开关切换到你玩的模式，两个模式有各自的网址。",
        ],
      },
      {
        heading: "常见问题",
        body: [
          "问：商人价格是什么? — 除跳蚤市场外，商人给出的最高收购价(卢布换算)。",
          "问：48H 涨跌是什么? — 与48小时前相比的跳蚤价格变化。点开卡片可查看 1D/7D/1M 走势图。",
        ],
      },
    ],
  },
  quests: {
    title: "任务物品清单使用说明",
    sections: [
      {
        heading: "什么是战局内获取(FIR)?",
        body: [
          "部分任务只接受你在战局中亲自拾取的物品，跳蚤购买的没有 FIR 标记无法上交。这里的「战局内获取」数量就是必须自己捡到的数量。",
          "战局中犹豫要不要扔掉某件物品时，在这里搜一下——马上就能看到哪些任务需要它、需要多少。",
        ],
      },
      {
        heading: "「仅卡帕」筛选",
        body: [
          "卡帕容器是完成几乎全部任务的终极奖励。开启「仅卡帕」筛选后，只显示卡帕必做任务所需的物品。",
        ],
      },
      {
        heading: "常见问题",
        body: [
          "问：数量如何计算? — 将所有商人任务的上交目标按物品汇总。点开卡片可见每个任务的需求量与最低等级。",
        ],
      },
    ],
  },
};

const GUIDES: Record<Locale, Record<GuideKey, PageGuide>> = { ko, en, ja, ru, zh };

export function getGuide(locale: Locale, key: GuideKey): PageGuide {
  return GUIDES[locale][key];
}
