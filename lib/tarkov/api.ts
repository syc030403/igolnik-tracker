import "server-only";

const ENDPOINT = "https://api.tarkov.dev/graphql";

/**
 * tarkov.dev GraphQL 호출. 반드시 서버에서만 사용하고,
 * 호출부에서 revalidate를 지정해 ISR 캐시를 태운다 (무료 API 호출 최소화).
 * 무료 커뮤니티 API라 간헐적 503이 있어 짧게 재시도한다 —
 * 빌드 타임 프리렌더가 일시 장애로 통째로 실패하면 안 된다.
 */
export async function tarkovQuery<T>(
  query: string,
  variables: Record<string, unknown> | undefined,
  revalidate: number,
): Promise<T> {
  const attempts = 3;
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
        next: { revalidate },
      });
      if (!res.ok) {
        throw new Error(`tarkov.dev HTTP ${res.status}`);
      }
      const json = (await res.json()) as { data?: T; errors?: unknown[] };
      if (!json.data) {
        throw new Error(`tarkov.dev GraphQL error: ${JSON.stringify(json.errors)}`);
      }
      return json.data;
    } catch (err) {
      lastError = err;
      if (i < attempts - 1) {
        await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
      }
    }
  }
  throw lastError;
}
