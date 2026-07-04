import { NextRequest, NextResponse } from "next/server";

const ENDPOINT = "https://api.tarkov.dev/graphql";

const HISTORY_QUERY = /* GraphQL */ `
  query History($id: ID!, $days: Int, $gameMode: GameMode) {
    historicalItemPrices(id: $id, days: $days, gameMode: $gameMode) {
      price
      timestamp
    }
  }
`;

/**
 * 가격 이력 프록시. 클라이언트가 tarkov.dev를 직접 치지 않도록
 * 서버에서 페칭하고 5분 캐시를 태운다.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!/^[a-f0-9]{24}$/.test(id)) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }
  const daysParam = req.nextUrl.searchParams.get("days");
  const days = daysParam === "30" ? 30 : daysParam === "7" ? 7 : 1;
  // 시세는 게임모드별로 별도 데이터 — 쿼리·캐시 모두 모드별로 분리된다
  const gameMode = req.nextUrl.searchParams.get("mode") === "pve" ? "pve" : "regular";

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: HISTORY_QUERY, variables: { id, days, gameMode } }),
    next: { revalidate: 300 },
  });
  if (!res.ok) {
    return NextResponse.json({ error: "upstream error" }, { status: 502 });
  }
  const json = (await res.json()) as {
    data?: { historicalItemPrices: { price: number; timestamp: string }[] };
  };
  const points = (json.data?.historicalItemPrices ?? []).map((p) => ({
    price: p.price,
    timestamp: Number(p.timestamp),
  }));

  return NextResponse.json(points, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
  });
}
