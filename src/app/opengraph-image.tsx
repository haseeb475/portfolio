import { ImageResponse } from "next/og";
import { hero, profile } from "@/content/profile";

export const alt = `${profile.name}, ${profile.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

const states = ["PLAN", "RETRIEVE", "EDIT", "TEST", "DONE"];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f1eee6",
          color: "#141512",
          padding: "64px 72px",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, fontFamily: "monospace", color: "#67665f", letterSpacing: 2 }}>
          <span>{profile.location.toUpperCase()}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 12, height: 12, borderRadius: 6, background: "#17703c" }} />
            {hero.availability.label.toUpperCase()}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 112, lineHeight: 1, letterSpacing: -3 }}>{profile.name}</div>
          <div style={{ fontSize: 40, marginTop: 20, color: "#3a3b36", fontFamily: "sans-serif" }}>{profile.title}</div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            background: "#0e0f0c",
            borderRadius: 16,
            padding: "22px 28px",
            fontFamily: "monospace",
            fontSize: 22,
          }}
        >
          {states.map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span
                style={{
                  padding: "8px 14px",
                  borderRadius: 8,
                  border: `1px solid ${i === states.length - 1 ? "#4be38a" : "#2a2d25"}`,
                  color: i === states.length - 1 ? "#4be38a" : "#e9e7df",
                }}
              >
                {s}
              </span>
              {i < states.length - 1 && <span style={{ color: "#8a8c82" }}>→</span>}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
