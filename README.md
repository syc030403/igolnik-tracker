# Igolnik Tracker

Escape from Tarkov 한국어 유틸 사이트 — 탄약 성능표 + 아이템 시세.

## 기능

**탄약표 (`/`)**
- 캘리버별 그룹핑, 필터, 관통력/데미지 정렬
- 방어구 등급 1~6 관통 확률을 색상 + 퍼센트 숫자로 표기 (색약 접근성 고려)
- 관통 확률은 커뮤니티에 문서화된 인게임 탄도 공식으로 계산 (방어구 내구도 100% 기준)

**탄약 상세** (행 클릭 — 데스크톱 사이드 패널 / 모바일 바텀 시트)
- 방어구 데미지, 파편 확률, 탄속, 반동·정확도 보정
- 벼룩시장 거래 가능 시 시세 그래프(24H/7일), 거래 금지 시 획득처(트레이더·물물교환·제작) 표시

**아이템 시세 (`/market`)**
- 인기 아이템의 벼룩가 · 트레이더 최고가 · 슬롯당 가격 · 변동률
- 슬롯당 / 벼룩가 / 변동률 정렬

**전역 검색**
- 한글명 / 영문명 / 약칭 매칭 (예: "이골닉" = "Igolnik" = "PPBS")

## 스택

- Next.js (App Router) + TypeScript, CSS Modules
- 서버 컴포넌트 중심, 외부 상태 라이브러리 없음
- 데이터: [tarkov.dev](https://tarkov.dev) 공개 GraphQL API
  - 전부 서버 사이드 페칭 + ISR 캐싱 (탄약 스펙 1시간, 시세 5분) — 무료 커뮤니티 API 호출 최소화
  - 아이템 아이콘은 next/image 최적화 경유

## 개발

```bash
npm install
npm run dev    # http://localhost:3000
npm run build
```

`NEXT_PUBLIC_SITE_URL` — sitemap/robots/OG에 쓰는 사이트 절대 URL (미설정 시 기본값 사용).

## 고지

본 사이트는 비공식 팬 제작 사이트이며, Battlestate Games 및 Escape from Tarkov와 어떠한 제휴 관계도 없습니다. 모든 상표권은 각 소유자에게 있습니다.

Data: [tarkov.dev](https://tarkov.dev)
