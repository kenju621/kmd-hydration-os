export function WaterGlass({
  intensity = "idle",
  waterLevel = null, // 0..1 or null
}: {
  intensity?: "idle" | "pour";
  waterLevel?: number | null;
}) {
  const isPour = intensity === "pour";

  // Faster + slightly brighter during pour
  const wave1Dur = isPour ? "3.2s" : "6.5s";
  const wave2Dur = isPour ? "6.0s" : "10.5s";
  const wave1Opacity = isPour ? 0.75 : 0.55;
  const wave2Opacity = isPour ? 0.45 : 0.35;
  const shimmerOpacity = isPour ? 0.65 : 0.5;

  // Waterline position (0 = empty, 1 = full)
  // We place it inside the lower half of the panel so it feels like a “reservoir”.
  const level = waterLevel === null ? null : Math.max(0, Math.min(1, waterLevel));
  const waterlineTop = level === null ? null : 340 - level * 170; // tweak for taste

  return (
    <>
      <div style={styles.bg} />

      {/* Waves */}
      <div
        style={{
          ...styles.wave,
          ...styles.wave1,
          opacity: wave1Opacity,
          animationDuration: wave1Dur,
        }}
      />
      <div
        style={{
          ...styles.wave,
          ...styles.wave2,
          opacity: wave2Opacity,
          animationDuration: wave2Dur,
        }}
      />

      {/* Rising waterline */}
      {waterlineTop !== null && (
        <>
          <div style={{ ...styles.fillGlow, top: waterlineTop + 10 }} />
          <div style={{ ...styles.waterline, top: waterlineTop }} />
          <div style={{ ...styles.surfaceRipples, top: waterlineTop - 10 }} />
  
        </>
      )}

      {/* Shimmer */}
      <div style={{ ...styles.shimmer, opacity: shimmerOpacity }} />
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  bg: {
    position: "absolute",
    inset: 0,
    zIndex: 0,
    background:
      "radial-gradient(circle at 25% 25%, rgba(33,177,255,0.28), transparent 50%), radial-gradient(circle at 70% 75%, rgba(33,177,255,0.14), transparent 55%), linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
  },

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
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='720' height='220' viewBox='0 0 720 220'%3E%3Cpath d='M0 130 C 120 90, 240 170, 360 130 C 480 90, 600 170, 720 130 L720 220 L0 220 Z' fill='rgba(33,177,255,0.55)'/%3E%3C/svg%3E\")",
    animationName: "kmdWaveScrollLeft",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
    animationDuration: "6.5s",
  },

  wave2: {
    bottom: 15,
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='720' height='220' viewBox='0 0 720 220'%3E%3Cpath d='M0 140 C 140 110, 220 170, 360 140 C 500 110, 580 170, 720 140 L720 220 L0 220 Z' fill='rgba(255,255,255,0.18)'/%3E%3C/svg%3E\")",
    animationName: "kmdWaveScrollRight",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
    animationDuration: "10.5s",
  },

  waterline: {
  position: "absolute",
  left: 22,
  right: 22,
  height: 4,
  zIndex: 2,
  borderRadius: 999,
  pointerEvents: "none",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.65) 0%, rgba(33,177,255,0.22) 55%, rgba(255,255,255,0.12) 100%)",
  boxShadow:
    "0 0 22px rgba(33,177,255,0.35), 0 0 8px rgba(255,255,255,0.15)",
},

  fillGlow: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 260,
    zIndex: 1,
    pointerEvents: "none",
    background:
        "linear-gradient(180deg, rgba(33,177,255,0.00) 0%, rgba(33,177,255,0.10) 35%, rgba(33,177,255,0.24) 100%)",
    opacity: 0.9,
    filter: "blur(0.2px)",
    },
    surfaceRipples: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 40,
    zIndex: 2,
    pointerEvents: "none",
    opacity: 0.35,
    backgroundRepeat: "repeat-x",
    backgroundSize: "520px 40px",
    backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='520' height='40' viewBox='0 0 520 40'%3E%3Cpath d='M0 22 C 60 10, 120 34, 180 22 C 240 10, 300 34, 360 22 C 420 10, 480 34, 520 22' fill='none' stroke='rgba(255,255,255,0.55)' stroke-width='2'/%3E%3C/svg%3E\")",
    animation: "kmdSurfaceScroll 2.4s linear infinite",
    filter: "blur(0.2px)",
    },


  shimmer: {
    position: "absolute",
    inset: 0,
    zIndex: 3,
    pointerEvents: "none",
    mixBlendMode: "screen",
    backgroundImage:
      "linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.08) 35%, transparent 70%)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "200% 100%",
    backgroundPosition: "-140% 0",
    animation: "kmdShimmerScroll 5.5s linear infinite",
  },
};

