/**
 * 런타임 플래그.
 *
 * SHOW_ITEM_ICONS: 아이템 아이콘(assets.tarkov.dev, BSG 저작물) 렌더 여부.
 * 기본 노출이지만, 저작권 이의 제기 등으로 즉시 내려야 할 때
 * Vercel 환경변수 NEXT_PUBLIC_SHOW_ITEM_ICONS=0 만 설정하면
 * 코드 배포 없이 아이콘을 끄고 텍스트 폴백으로 대체한다.
 */
export const SHOW_ITEM_ICONS = process.env.NEXT_PUBLIC_SHOW_ITEM_ICONS !== "0";
