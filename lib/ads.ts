/**
 * 광고(카카오 애드핏) 설정.
 *
 * 매체 심사 통과 전에는 실제 광고를 렌더하지 않는다. 통과 후:
 *  1. Vercel 환경변수 NEXT_PUBLIC_ADFIT_ENABLED=1
 *  2. 각 포맷의 애드핏 광고단위 ID를 NEXT_PUBLIC_ADFIT_UNIT_* 에 입력
 *  3. public/ads.txt 에 애드핏이 발급한 라인 입력
 *
 * 정책 안전 원칙(계정 정지 방지):
 *  - 콘텐츠가 없는 화면(에러·빈 결과)에는 광고를 넣지 않는다 → 호출부에서 통제
 *  - 각 슬롯에 "AD" 라벨과 충분한 여백을 둔다
 *  - 모바일에서는 사이드/스카이스크래퍼를 렌더하지 않는다
 *  - CLS 방지를 위해 항상 광고 규격만큼 공간을 예약한다
 */
export const ADFIT_ENABLED = process.env.NEXT_PUBLIC_ADFIT_ENABLED === "1";

export type AdFormat = "leaderboard" | "rectangle" | "skyscraper" | "mobileBanner";

export interface AdDimension {
  width: number;
  height: number;
}

/** 애드핏/IAB 표준 규격 */
export const AD_DIMENSIONS: Record<AdFormat, AdDimension> = {
  leaderboard: { width: 728, height: 90 },
  rectangle: { width: 300, height: 250 },
  skyscraper: { width: 160, height: 600 },
  mobileBanner: { width: 320, height: 100 },
};

/** 포맷별 애드핏 광고단위 ID (환경변수) */
export function adUnitId(format: AdFormat): string | undefined {
  switch (format) {
    case "leaderboard":
      return process.env.NEXT_PUBLIC_ADFIT_UNIT_LEADERBOARD;
    case "rectangle":
      return process.env.NEXT_PUBLIC_ADFIT_UNIT_RECTANGLE;
    case "skyscraper":
      return process.env.NEXT_PUBLIC_ADFIT_UNIT_SKYSCRAPER;
    case "mobileBanner":
      return process.env.NEXT_PUBLIC_ADFIT_UNIT_MOBILE;
  }
}
