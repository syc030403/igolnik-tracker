/**
 * 한글 별칭 매핑. API가 lang:ko를 지원하지만 탄약명은 한국어화에서도
 * 라틴 표기가 유지되므로, 커뮤니티에서 쓰는 한글 호칭을 수동 관리한다.
 * 키는 영문 shortName 또는 name의 부분 문자열 (normalize 후 매칭).
 */
export const AMMO_ALIASES: Record<string, string> = {
  "ppbs gs": "이골닉 이골니크",
  "bs gs": "비에스",
  "bp gzh": "비피",
  "bt gzh": "비티",
  "ps gzh": "피에스",
  m995: "엠995",
  m855a1: "엠855a1",
  m855: "엠855",
  m856a1: "엠856",
  m61: "엠61",
  m62: "엠62 예광탄",
  m80: "엠80",
  m993: "엠993",
  warmageddon: "워마게돈",
  "rip ": "알아이피 립",
  "us gzh": "아음속 무탄",
  igolnik: "이골닉 이골니크",
  "ssa ap": "에스에스에이",
  "mai ap": "마이에이피",
  "7n40": "칠엔사십",
  "m67 ball": "엠67",
  "ap 6.3": "에이피",
  "pbp gzh": "피비피",
  "pst gzh": "피에스티",
  "7n31": "칠엔31",
  slap: "슬랩",
  "ap-m": "에이피엠",
  flechette: "플레셰트 화살탄",
  "ap 20": "슬러그 에이피",
  "star ": "스타",
  "zvezda ": "즈베즈다",
};

export const MARKET_ALIASES: Record<string, string> = {
  ledx: "레드엑스 렛드엑스 스킨트랜스일루미네이터",
  bitcoin: "비트코인 비코",
  "graphics card": "그래픽카드 그카",
  gpu: "그래픽카드 그카",
  cofdm: "코프덤 무선신호전송기",
  ophthalmoscope: "검안경 오프탈모",
  toolset: "공구세트 툴셋",
  "ripstop fabric": "립스탑 원단",
  salewa: "살레와 구급킷",
  "gas analyzer": "가스분석기 가스",
  "golden neck chain": "금목걸이",
  bolts: "볼트",
  paracord: "파라코드 낙하산줄",
  defibrillator: "제세동기 디핍",
  "water filter": "정수필터 정수기",
  "corrugated hose": "주름호스 호스",
  "fuel tank": "연료통",
  intelligence: "정보폴더 인텔",
  tetriz: "테트리즈 게임기",
  prokill: "프로킬 메달",
  rfid: "알에프아이디 리더기",
  "insulating tape": "절연테이프",
  kektape: "덕트테이프 켁테이프",
  filter: "정화통 방독면필터",
  wires: "전선",
  "military cable": "군용케이블",
};

/** 검색 정규화: 소문자, × → x, 공백/따옴표/쉼표 제거 */
export function normalizeSearch(s: string): string {
  return s
    .toLowerCase()
    .replace(/×/g, "x")
    .replace(/["'’,]/g, "")
    .replace(/\s+/g, "");
}

/** 이름에 매칭되는 별칭들을 모아 반환 */
export function aliasesFor(
  table: Record<string, string>,
  ...names: (string | null | undefined)[]
): string {
  const hay = names.filter(Boolean).join(" ").toLowerCase();
  const found: string[] = [];
  for (const [key, value] of Object.entries(table)) {
    if (hay.includes(key)) found.push(value);
  }
  return found.join(" ");
}
