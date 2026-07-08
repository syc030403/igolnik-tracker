/**
 * 광고(구글 애드센스) 설정.
 *
 * 심사·게재 절차:
 *  1. adsense.google.com 가입 → 사이트 igolniktracker.com 추가
 *  2. 발급받은 게시자 ID(ca-pub-XXXXXXXXXXXXXXXX)를
 *     Vercel 환경변수 NEXT_PUBLIC_ADSENSE_CLIENT 에 입력 → 재배포
 *     (그러면 <head>에 애드센스 로더가 삽입되어 심사 요청 가능)
 *  3. public/ads.txt 에 애드센스 라인 입력
 *  4. 승인 후 광고 단위를 만들고 슬롯 ID를 NEXT_PUBLIC_ADSENSE_SLOT_* 에 입력
 *
 * 정책 안전 원칙(계정 정지 방지):
 *  - 콘텐츠가 없는 화면(에러·빈 결과)에는 광고를 넣지 않는다 → 호출부에서 통제
 *  - 각 슬롯에 라벨과 충분한 여백, 모바일에서는 사이드 미노출
 *  - CLS 방지를 위해 항상 광고 규격만큼 공간을 예약한다
 */
export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT; // ca-pub-XXXXXXXXXXXXXXXX
export const ADS_ENABLED = !!ADSENSE_CLIENT;

export type AdFormat = "leaderboard" | "rectangle" | "skyscraper" | "mobileBanner";

export interface AdDimension {
  width: number;
  height: number;
}

/** IAB 표준 규격 */
export const AD_DIMENSIONS: Record<AdFormat, AdDimension> = {
  leaderboard: { width: 728, height: 90 },
  rectangle: { width: 300, height: 250 },
  skyscraper: { width: 160, height: 600 },
  mobileBanner: { width: 320, height: 100 },
};

/** 포맷별 애드센스 광고 슬롯 ID (환경변수, 승인 후 입력) */
export function adSlotId(format: AdFormat): string | undefined {
  switch (format) {
    case "leaderboard":
      return process.env.NEXT_PUBLIC_ADSENSE_SLOT_LEADERBOARD;
    case "rectangle":
      return process.env.NEXT_PUBLIC_ADSENSE_SLOT_RECTANGLE;
    case "skyscraper":
      return process.env.NEXT_PUBLIC_ADSENSE_SLOT_SKYSCRAPER;
    case "mobileBanner":
      return process.env.NEXT_PUBLIC_ADSENSE_SLOT_MOBILE;
  }
}
