// src/app/routes/dispenser/screens/Idle.tsx
import type React from "react";

export function Idle({ onTap }: { onTap: () => void }) {
  // Navigate to Care OS without triggering the pour tap
  const goToCare = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    window.location.href = "/dispenser?view=care";
  };

  return (
    <div style={styles.wrap} onClick={onTap} role="button" tabIndex={0}>
      {/* background wash */}
      <div style={styles.bg} />

      {/* (Optional) wave layers — keep or remove as you like */}
      {/* <div style={{ ...styles.wave, ...styles.wave1 }} />
      <div style={{ ...styles.wave, ...styles.wave2 }} /> */}

      {/* shimmer sweep */}
      <div style={styles.shimmer} />

      <div style={styles.content}>
        <div style={styles.headerRow}>
          <div>
            <div style={styles.title}>Today’s hydration is on track</div>
            <div style={styles.sub}>
              Tap anywhere to pour • Lift to dispense
            </div>
          </div>

          {/* Top-right nav to Care OS */}
          <div style={styles.navRow}>
            <button style={styles.navButton} onClick={goToCare}>
              Open Care&nbsp;OS
            </button>
          </div>
        </div>

        <div style={styles.hintRow}>
          <span style={styles.pill}>Filter OK</span>
          <span style={styles.pill}>Cold ready</span>
          <span style={styles.pill}>Wi-Fi ✓</span>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    position: "relative",
    width: "min(1100px, 100%)",
    height: 480,
    maxHeight: "calc(100vh - 210px)",
    borderRadius: 22,
    overflow: "hidden",
    isolation: "isolate",
    cursor: "pointer",
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(15,23,42,0.96)",
  },

  bg: {
    position: "absolute",
    inset: 0,
    zIndex: 0,
    background:
      "radial-gradient(circle at 25% 25%, rgba(33,177,255,0.28), transparent 50%), radial-gradient(circle at 70% 75%, rgba(33,177,255,0.14), transparent 55%), linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
  },

  // If you later want the waves back, re-enable in JSX above and set these:
  wave: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 220,
    bottom: 10,
    zIndex: 1,
    pointerEvents: "none",
    backgroundRepeat: "repeat-x",
    backgroundSize: "720px 220px",
    filter: "blur(0.2px)",
    maskImage: "linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))",
    WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))",
  },
  wave1: {
    bottom: -5,
    opacity: 0.55,
    backgroundImage: "var(--kmd-wave1)", // optional: defined in global CSS
    animation: "kmdWaveScrollLeft 6.5s linear infinite",
  },
  wave2: {
    bottom: 15,
    opacity: 0.35,
    backgroundImage: "var(--kmd-wave2)", // optional
    animation: "kmdWaveScrollRight 10.5s linear infinite",
  },

  shimmer: {
    position: "absolute",
    inset: 0,
    zIndex: 1,
    pointerEvents: "none",
    mixBlendMode: "screen",
    opacity: 0.5,
    backgroundImage:
      "linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.08) 35%, transparent 70%)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "200% 100%",
    backgroundPosition: "-140% 0",
    animation: "kmdShimmerScroll 5.5s linear infinite",
  },

  content: {
    position: "relative",
    zIndex: 2,
    padding: 24,
    paddingBottom: 110,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    justifyContent: "space-between",
    height: "100%",
  },

  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
  },

  title: { fontSize: 32, fontWeight: 800, letterSpacing: -0.6 },
  sub: { fontSize: 14, opacity: 0.8 },

  hintRow: {
    marginTop: 14,
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },
  pill: {
    fontSize: 13,
    padding: "8px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(0,0,0,0.15)",
    opacity: 0.92,
  },

  navRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },

  navButton: {
    padding: "8px 14px",
    borderRadius: 999,
    border: "1px solid rgba(120,220,255,0.9)",
    background:
      "linear-gradient(135deg, rgba(32,155,255,0.95), rgba(120,220,255,0.9))",
    color: "#020617",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(15, 118, 255, 0.45)",
    whiteSpace: "nowrap",
  },
};
