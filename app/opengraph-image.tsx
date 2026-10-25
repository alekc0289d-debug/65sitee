import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Maktabim+ — 65-maktab";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
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
          background: "linear-gradient(135deg, #fef3c7 0%, #fdf9f3 50%, #fed7aa 100%)",
          fontFamily: "system-ui",
          position: "relative",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: -100,
            left: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(251, 191, 36, 0.15)",
            filter: "blur(60px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(217, 119, 6, 0.15)",
            filter: "blur(60px)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: 24,
              background: "linear-gradient(135deg, #f59e0b, #b45309)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 60,
              color: "white",
              fontWeight: "bold",
              boxShadow: "0 20px 40px rgba(245, 158, 11, 0.4)",
            }}
          >
            🎓
          </div>
          <div
            style={{
              fontSize: 88,
              fontWeight: 800,
              color: "#78350f",
              letterSpacing: -2,
            }}
          >
            Maktabim<span style={{ color: "#f59e0b" }}>+</span>
          </div>
        </div>

        <div
          style={{
            fontSize: 44,
            fontWeight: 600,
            color: "#92400e",
            marginBottom: 16,
          }}
        >
          Maktabingizni raqamlashtiring
        </div>

        <div
          style={{
            fontSize: 28,
            color: "#78716c",
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          Baholar · Reyting · Sovg'alar · Ota-onalar bilan aloqa
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 40,
            right: 60,
            fontSize: 24,
            color: "#a8a29e",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span>🍂</span>
          <span>65-maktab</span>
        </div>
      </div>
    ),
    { ...size }
  );
}