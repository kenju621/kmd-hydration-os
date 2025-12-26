// src/app/routes/dispenser/screens/Pour.tsx
import { useMemo } from "react";
import { useHydration } from "../../../../core/state/useHydration";
import { POUR_TARGET_ML, PERFECT_WINDOW_ML } from "../../../../core/state/hydrationStore";

export function Pour({ onStop }: { onStop: () => void }) {
  const s = useHydration();

  const ml = Math.max(0, s.currentPourMl ?? 0);

  const pct = useMemo(() => {
    const v = (ml / POUR_TARGET_ML) * 100;
    return Math.max(0, Math.min(100, v));
  }, [ml]);

  // rising fill uses translateY (no top math)
  const fillTranslate = useMemo(() => {
    const inv = 100 - pct;
    return `translateY(${inv}%)`;
  }, [pct]);

  // glow increases near target
  const nearTargetGlow = useMemo(() => {
    const dist = Math.abs(ml - POUR_TARGET_ML);
    const t = 1 - Math.min(1, dist / 80); // within ~80ml starts glowing
    const g = 0.15 + t * 0.55;
    return g;
  }, [ml]);

  const inPerfectZone = useMemo(() => {
    return Math.abs(ml - POUR_TARGET_ML) <= PERFECT_WINDOW_ML;
  }, [ml]);

  const pctLabel = Math.round(pct);

  return (
    <div style={styles.wrap}>
      <style>{css}</style>

      <div style={styles.header}>
        <div>
          <div style={styles.title}>Pouring…</div>
          <div style={styles.sub}>
            {pctLabel}% • {Math.round(ml)}ml
          </div>
        </div>

        <div style={styles.badgeRow}>
          <div style={styles.badge}>{s.tempPreset ?? "COLD"}</div>
          <div style={styles.badge}>{s.iceEnabled ? "ICE ON" : "ICE OFF"}</div>
        </div>
      </div>

      <div style={styles.stage}>
        {/* Cup */}
        <div style={styles.cup}>
          {/* glass rim */}
          <div style={styles.rim} />

          {/* glass sheen */}
          <div style={styles.sheen} />

          {/* fill */}
          <div style={styles.fillMask}>
            <div style={{ ...styles.fill, transform: fillTranslate }} />

            {/* water surface shimmer line */}
            <div
              style={{
                ...styles.surface,
                top: `${Math.max(8, Math.min(92, 100 - pct))}%`,
                opacity: 0.35 + nearTargetGlow * 0.55,
              }}
            />

            {/* inside motion wave */}
            <div style={{ ...styles.fillWave, animation: "kmdFillWave 2.8s linear infinite" }} />
          </div>

          {/* target line */}
          <div style={styles.targetLine} />
          <div style={{ ...styles.targetGlow, opacity: nearTargetGlow }} />

          {/* perfect hint */}
          <div style={{ ...styles.perfectHint, opacity: inPerfectZone ? 1 : 0 }}>
            PERFECT ZONE
          </div>
        </div>

        {/* Side cards */}
        <div style={styles.stats}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Target</div>
            <div style={styles.statValue}>{POUR_TARGET_ML}ml</div>
            <div style={styles.statHint}>Stop near the bright line</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statLabel}>Perfect Window</div>
            <div style={styles.statValue}>±{PERFECT_WINDOW_ML}ml</div>
            <div style={styles.statHint}>Bonus points on lock</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statLabel}>Today</div>
            <div style={styles.statValue}>{s.glassesToday ?? 0}/{s.goalGlasses ?? 8}</div>
            <div style={styles.statHint}>Keep the streak alive</div>
          </div>
        </div>
      </div>

      <div style={styles.footerRow}>
        <button style={styles.stopBtn} onClick={onStop}>
          Stop • Lock In
        </button>
        <div style={styles.hint}>Tip: when the fill “kisses” the bright line, stop.</div>
      </div>
    </div>
  );
}

const css = `
@keyframes kmdFillWave {
  from { transform: translateX(0); }
  to { transform: translateX(-180px); }
}
`;

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    width: "min(980px, 100%)",
    height: "min(620px, calc(100vh - 190px))",
    display: "flex",
    flexDirection: "column",
    gap: 14,
    padding: 14,
    borderRadius: 20,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.02)",
    overflow: "hidden",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "flex-start",
  },
  title: { fontSize: 22, fontWeight: 900, letterSpacing: -0.6 },
  sub: { fontSize: 13, opacity: 0.8, fontWeight: 800, marginTop: 2 },

  badgeRow: { display: "flex", gap: 10, flexWrap: "wrap" },
  badge: {
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(0,0,0,0.18)",
    padding: "8px 10px",
    fontSize: 12,
    fontWeight: 900,
    opacity: 0.92,
  },

  stage: {
    flex: 1,
    minHeight: 0,
    display: "grid",
    gridTemplateColumns: "1fr 300px",
    gap: 14,
    alignItems: "stretch",
  },

  cup: {
    position: "relative",
    height: "100%",
    minHeight: 0,
    borderRadius: 22,
    border: "1px solid rgba(255,255,255,0.14)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.01))",
    overflow: "hidden",
  },

  rim: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 10,
    background: "linear-gradient(90deg, rgba(33,177,255,0.35), rgba(255,255,255,0.22))",
    opacity: 0.55,
    pointerEvents: "none",
  },

  sheen: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    background:
      "linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.10) 25%, transparent 60%)",
    opacity: 0.35,
    mixBlendMode: "screen",
  },

  fillMask: {
    position: "absolute",
    inset: 0,
    overflow: "hidden",
  },

  fill: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%",
    background:
      "linear-gradient(180deg, rgba(33,177,255,0.72), rgba(33,177,255,0.12))",
    filter: "drop-shadow(0 0 14px rgba(33,177,255,0.20))",
    willChange: "transform",
  },

  surface: {
    position: "absolute",
    left: 18,
    right: 18,
    height: 2,
    borderRadius: 999,
    background: "rgba(255,255,255,0.85)",
    pointerEvents: "none",
  },

  fillWave: {
    position: "absolute",
    left: 0,
    right: "-180px",
    bottom: "42%",
    height: 40,
    opacity: 0.22,
    background:
      "repeating-linear-gradient(90deg, rgba(255,255,255,0.65) 0px, rgba(255,255,255,0.65) 30px, rgba(255,255,255,0.0) 60px)",
    pointerEvents: "none",
    willChange: "transform",
  },

  targetLine: {
    position: "absolute",
    left: 18,
    right: 18,
    top: "42%",
    height: 2,
    background: "rgba(255,255,255,0.75)",
    borderRadius: 999,
    pointerEvents: "none",
  },

  targetGlow: {
    position: "absolute",
    left: 16,
    right: 16,
    top: "42%",
    height: 2,
    background: "rgba(33,177,255,0.65)",
    borderRadius: 999,
    filter: "blur(7px)",
    pointerEvents: "none",
  },

  perfectHint: {
    position: "absolute",
    left: 18,
    top: 14,
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid rgba(33,177,255,0.24)",
    background: "rgba(33,177,255,0.10)",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 0.6,
    transition: "opacity 180ms ease",
    pointerEvents: "none",
  },

  stats: {
    height: "100%",
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    justifyContent: "center",
  },

  statCard: {
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.14)",
    padding: 12,
  },
  statLabel: { fontSize: 11, opacity: 0.75, fontWeight: 900 },
  statValue: { fontSize: 16, fontWeight: 900, letterSpacing: -0.2, marginTop: 2 },
  statHint: { fontSize: 12, opacity: 0.75, fontWeight: 800, marginTop: 4 },

  footerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },

  stopBtn: {
    borderRadius: 999,
    padding: "10px 14px",
    fontWeight: 900,
    border: "1px solid rgba(33,177,255,0.22)",
    background: "linear-gradient(180deg, rgba(33,177,255,0.28), rgba(33,177,255,0.12))",
    color: "white",
    cursor: "pointer",
  },

  hint: { fontSize: 12, opacity: 0.75, fontWeight: 800 },
};
