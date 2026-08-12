import { ImageResponse } from "next/og";

export const alt = "EveryVerse.online — Every Verse, Every Nation";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const dots = Array.from({ length: 26 }).map((_, i) => ({
  left: (i * 137) % 1200,
  top: (i * 89) % 630,
  size: 3 + (i % 3) * 2,
  opacity: 0.05 + (i % 4) * 0.03,
}));

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          display: "flex",
          backgroundImage:
            "linear-gradient(135deg, #17181a 0%, #3a3c3f 45%, #7a0009 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 8, backgroundColor: "#c6000e", display: "flex" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 8, backgroundColor: "#c6000e", display: "flex" }} />

        {dots.map((d, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: d.left,
              top: d.top,
              width: d.size,
              height: d.size,
              borderRadius: 999,
              backgroundColor: "#ffffff",
              opacity: d.opacity,
              display: "flex",
            }}
          />
        ))}

        <div style={{ position: "absolute", top: 46, left: "50%", width: 260, height: 260, transform: "translateX(-50%)", display: "flex" }}>
          <div style={{ position: "absolute", left: 123, top: 0, width: 14, height: 260, borderRadius: 7, backgroundColor: "#ffffff", opacity: 0.08, display: "flex" }} />
          <div style={{ position: "absolute", left: 20, top: 68, width: 220, height: 14, borderRadius: 7, backgroundColor: "#ffffff", opacity: 0.08, display: "flex" }} />
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 44,
            left: 64,
            display: "flex",
            maxWidth: 520,
            fontSize: 20,
            fontStyle: "italic",
            color: "#ffffff",
            opacity: 0.45,
            lineHeight: 1.4,
          }}
        >
          &ldquo;In the beginning God created the heaven and the earth.&rdquo; — Genesis 1:1
        </div>

        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              padding: "8px 22px",
              borderRadius: 999,
              border: "1.5px solid rgba(255,255,255,0.35)",
              color: "#ffffff",
              fontSize: 20,
              letterSpacing: 4,
              textTransform: "uppercase",
              opacity: 0.85,
            }}
          >
            Practical Bible Commentary
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginTop: 34 }}>
            <span
              style={{
                fontSize: 108,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: "#ffffff",
              }}
            >
              EveryVerse
            </span>
            <span style={{ fontSize: 42, color: "#f4b8bd", fontWeight: 400 }}>
              .online
            </span>
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 36,
              padding: "12px 40px",
              borderRadius: 999,
              backgroundColor: "#c6000e",
              fontSize: 30,
              fontWeight: 600,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#ffffff",
            }}
          >
            Every Verse, Every Nation
          </div>

          <div style={{ display: "flex", marginTop: 46, alignItems: "center", gap: 18 }}>
            {["SCRIPTURE", "SERMONS", "OUTLINES"].map((label, i) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 18 }}>
                {i > 0 && (
                  <div style={{ width: 5, height: 5, borderRadius: 999, backgroundColor: "#ffffff", opacity: 0.4, display: "flex" }} />
                )}
                <div
                  style={{
                    display: "flex",
                    fontSize: 18,
                    letterSpacing: 3,
                    color: "#ffffff",
                    opacity: 0.65,
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
