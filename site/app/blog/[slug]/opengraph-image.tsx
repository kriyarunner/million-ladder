import { ImageResponse } from "next/og";
import { getPost } from "@/lib/posts";

export const alt = "Million Ladder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost("da", slug);
  const title = post?.title ?? "Million Ladder";
  const tag = post?.tag ?? "Guide";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background:
            "radial-gradient(900px 500px at 80% -10%, #0f2a1c 0%, #050608 55%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "linear-gradient(135deg, #2bd576, #1fa863)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              fontWeight: 800,
              color: "#ffcf4a",
            }}
          >
            M
          </div>
          <div style={{ fontSize: 30, fontWeight: 700 }}>Million Ladder</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              fontSize: 24,
              fontWeight: 700,
              color: "#2bd576",
              background: "rgba(43,213,118,0.12)",
              border: "1px solid rgba(43,213,118,0.3)",
              padding: "8px 20px",
              borderRadius: 999,
              marginBottom: 28,
              textTransform: "uppercase",
              letterSpacing: 2,
            }}
          >
            {tag}
          </div>
          <div
            style={{
              fontSize: 68,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: -2,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 26,
            color: "#8a909a",
          }}
        >
          <div style={{ display: "flex", color: "#ffcf4a", fontWeight: 700 }}>
            millionladder.com
          </div>
          <div style={{ display: "flex" }}>Guides &amp; mindset</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
