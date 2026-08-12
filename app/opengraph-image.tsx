import { ImageResponse } from "next/og";

export const alt = "EveryVerse.online — Every Verse, Every Nation";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const RED = "#7a1116";
const CREAM = "#f4ead6";
const GOLD = "#caa63d";

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
          backgroundColor: RED,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            width: 260,
            height: 320,
            borderRadius: 16,
            backgroundColor: CREAM,
            border: `8px solid ${GOLD}`,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: -8,
              top: -8,
              width: 26,
              height: 336,
              backgroundColor: GOLD,
              borderTopLeftRadius: 16,
              borderBottomLeftRadius: 16,
              display: "flex",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 117,
              top: 70,
              width: 26,
              height: 190,
              borderRadius: 4,
              backgroundColor: RED,
              display: "flex",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 75,
              top: 120,
              width: 110,
              height: 26,
              borderRadius: 4,
              backgroundColor: RED,
              display: "flex",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 44,
            fontSize: 48,
            fontWeight: 700,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: CREAM,
          }}
        >
          EveryVerse.online
        </div>
      </div>
    ),
    { ...size }
  );
}
