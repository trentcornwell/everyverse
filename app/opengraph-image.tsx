import { ImageResponse } from "next/og";

export const alt = "EveryVerse.online — Every Verse, Every Nation";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
          backgroundColor: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
          <span
            style={{
              fontSize: 100,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#3a3c3f",
              fontFamily: "sans-serif",
            }}
          >
            EveryVerse
          </span>
          <span style={{ fontSize: 38, color: "#94a3b8", fontFamily: "sans-serif" }}>
            .online
          </span>
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 32,
            fontWeight: 600,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#c6000e",
            fontFamily: "sans-serif",
          }}
        >
          Every Verse, Every Nation
        </div>
        <div
          style={{
            marginTop: 44,
            width: 160,
            height: 6,
            backgroundColor: "#c6000e",
            borderRadius: 999,
          }}
        />
      </div>
    ),
    { ...size }
  );
}
