import { ImageResponse } from "next/og";

export const alt = "Igolnik Tracker — 타르코프 탄약표 · 시세";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#14150F",
          color: "#E8E6D9",
        }}
      >
        <div
          style={{
            width: 140,
            height: 140,
            border: "10px solid #C9A24B",
            transform: "rotate(45deg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 60,
          }}
        >
          <div style={{ width: 56, height: 56, background: "#C9A24B" }} />
        </div>
        <div
          style={{
            fontSize: 84,
            fontWeight: 700,
            letterSpacing: 8,
            display: "flex",
          }}
        >
          IGOLNIK<span style={{ color: "#C9A24B" }}>.TRACKER</span>
        </div>
        <div
          style={{
            fontSize: 30,
            letterSpacing: 4,
            color: "#8A8878",
            marginTop: 18,
          }}
        >
          타르코프 탄약표 · 아이템 시세
        </div>
      </div>
    ),
    { ...size },
  );
}
