// src/app/routes/dispenser/screens/Idle.tsx
import { useMemo } from "react";
import { useHydration } from "../../../../core/state/useHydration";
import { ensureDailyQuests } from "../../../../core/state/hydrationStore";

export function Idle({ onTap }: { onTap: () => void }) {
  const s = useHydration();
  ensureDailyQuests();

  const goal = s.goalGlasses ?? 8;
  const glasses = s.glassesToday ?? 0;

  const progressText = useMemo(() => `${glasses}/${goal} glasses`, [glasses, goal]);
  const progressPct = useMemo(() => {
    const g = Math.max(1, goal);
    return Math.round((Math.max(0, glasses) / g) * 100);
  }, [glasses, goal]);

  const quests = s.dailyQuests ?? [];

  return (
    <div
      style={styles.wrap}
      onClick={onTap}
      role="button"
      tabIndex={0}
      aria-label="Tap to start pour"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onTap();
        }
      }}
    >
      <style>{css}</style>

      {/* background wash */}
      <div style={styles.bg} />

      {/* waves live UNDER content */}
      <div style={{ ...styles.wave, ...styles.waveBack }} />
      <div style={{ ...styles.wave, ...styles.waveFront }} />

      {/* shimmer */}
      <div style={styles.shimmer} />

      {/* CONTENT (scrolls) */}
      <div
        style={styles.content}
        onClick={(e) => e.stopPropagation()} // ✅ scrolling/clicking content won't start pour
      >
        <div style={styles.headerRow}>
          <div style={{ minWidth: 0 }}>
            <div style={styles.title}>Today’s hydration is on track</div>
            <div style={styles.sub}>Tap Start Pour • Lift to dispense</div>
          </div>

          <div style={styles.points}>
            <div style={styles.pointsLabel}>Points</div>
            <div style={styles.pointsValue}>{s.pointsToday ?? 0}</div>
          </div>
        </div>

        <div style={styles.hintRow}>
          <span style={styles.pill}>Filter OK</span>
          <span style={styles.pill}>{s.iceEnabled ? "Ice ✓" : "Ice ✕"}</span>
          <span style={styles.pill}>{s.wifiConnected ? "Wi-Fi ✓" : "Wi-Fi ✕"}</span>
        </div>

        {/* Daily progress */}
        <div style={styles.card}>
          <div style={styles.cardTop}>
            <div style={{ fontWeight: 900 }}>Daily Progress</div>
            <div style={{ opacity: 0.85, fontWeight: 900 }}>{progressText}</div>
          </div>

          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${progressPct}%` }} />
          </div>

          <div style={styles.metaRow}>
            <span style={{ opacity: 0.75 }}>{progressPct}%</span>
            <span style={{ opacity: 0.75 }}>Goal: {goal}</span>
          </div>
        </div>

        {/* Quests */}
        <div style={styles.card}>
          <div style={styles.cardTop}>
            <div style={{ fontWeight: 900 }}>Daily Quests</div>
            <div style={{ opacity: 0.75, fontWeight: 800 }}>Complete for points</div>
          </div>

          <div style={{ display: "grid", gap: 10 }}>
            {quests.map((q) => {
              const pct = Math.round(
                (Math.min(q.progress, q.target) / Math.max(1, q.target)) * 100
              );
              return (
                <div key={q.id} style={styles.questRow}>
                  <div style={styles.questTitleRow}>
                    <div style={styles.questTitle}>
                      {q.done ? "✓ " : ""}
                      {q.title}
                    </div>
                    <div style={styles.rewardChip}>+{q.reward}</div>
                  </div>

                  <div style={styles.questDetail}>{q.detail}</div>

                  <div style={styles.questBar}>
                    <div style={{ ...styles.questFill, width: `${pct}%` }} />
                  </div>

                  <div style={styles.questMeta}>
                    {Math.min(q.progress, q.target)}/{q.target}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div style={styles.ctaRow}>
          <button style={styles.primaryBtn} onClick={onTap}>
            Start Pour
          </button>
          <div style={styles.ctaHint}>Tip: lock a perfect pour for bonus points.</div>
        </div>

        {/* ✅ spacer so last quest isn't hidden by waves */}
        <div style={{ height: 220 }} />
      </div>
    </div>
  );
}

// --- Seamless wave tile ---
const WAVE_W = 800;

const waveSvg = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="${WAVE_W}" height="220" viewBox="0 0 ${WAVE_W} 220" preserveAspectRatio="none">
  <rect width="${WAVE_W}" height="220" fill="transparent" />
  <path d="
    M 0 120
    C 100 80, 200 160, 300 120
    S 500 160, 600 120
    S 700 80, ${WAVE_W} 120
    L ${WAVE_W} 220
    L 0 220
    Z" fill="white"/>
</svg>
`);

const css = `
@keyframes kmdWaveLeft { from { background-position: 0 0; } to { background-position: -${WAVE_W}px 0; } }
@keyframes kmdWaveRight { from { background-position: 0 0; } to { background-position: ${WAVE_W}px 0; } }
@keyframes kmdShimmer { from { background-position: -140% 0; } to { background-position: 140% 0; } }
`;

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    position: "relative",
    width: "min(820px, 100%)",
    // ✅ IMPORTANT: don’t force a short fixed card — let content scroll inside
    height: "min(620px, calc(100vh - 190px))",
    borderRadius: 20,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.02)",
    isolation: "isolate",
  },

  bg: {
    position: "absolute",
    inset: 0,
    zIndex: 0,
    pointerEvents: "none",
    background:
      "radial-gradient(circle at 25% 25%, rgba(33,177,255,0.22), transparent 55%), radial-gradient(circle at 70% 75%, rgba(33,177,255,0.12), transparent 55%), linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.00))",
  },

  wave: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 220,
    bottom: -10,
    zIndex: 1,
    pointerEvents: "none",
    backgroundRepeat: "repeat-x",
    backgroundSize: `${WAVE_W}px 220px`,
    backgroundImage: `url("data:image/svg+xml,${waveSvg}")`,
    maskImage: "linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))",
    WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))",
    transform: "translateZ(0)",
  },

  waveBack: {
    opacity: 0.22,
    filter: "blur(0.2px)",
    animation: "kmdWaveRight 11s linear infinite",
    transform: "translateY(-12px) translateZ(0)",
  },

  waveFront: {
    opacity: 0.38,
    animation: "kmdWaveLeft 7s linear infinite",
    transform: "translateZ(0)",
  },

  shimmer: {
    position: "absolute",
    inset: 0,
    zIndex: 2,
    pointerEvents: "none",
    mixBlendMode: "screen",
    opacity: 0.45,
    backgroundImage:
      "linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.08) 35%, transparent 70%)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "200% 100%",
    backgroundPosition: "-140% 0",
    animation: "kmdShimmer 6s linear infinite",
  },

  // ✅ Scrollable content layer above waves
  content: {
    position: "relative",
    zIndex: 3,
    height: "100%",
    overflowY: "auto",
    padding: 14,
    display: "grid",
    gap: 10,
    alignContent: "start",
  },

  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "flex-start",
  },

  title: { fontSize: 22, fontWeight: 900, letterSpacing: -0.6 },
  sub: { fontSize: 12, opacity: 0.75, marginTop: 2 },

  points: {
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.18)",
    padding: "10px 12px",
    minWidth: 110,
    textAlign: "right",
  },
  pointsLabel: { fontSize: 11, opacity: 0.75, fontWeight: 900 },
  pointsValue: { fontSize: 18, fontWeight: 900, letterSpacing: -0.3 },

  hintRow: { display: "flex", gap: 10, flexWrap: "wrap" },
  pill: {
    fontSize: 12,
    padding: "8px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(0,0,0,0.15)",
    opacity: 0.92,
    fontWeight: 800,
  },

  card: {
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.14)",
    padding: 12,
    display: "grid",
    gap: 10,
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
    alignItems: "baseline",
  },

  progressBar: {
    height: 10,
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.04)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    background: "linear-gradient(90deg, rgba(33,177,255,0.70), rgba(33,177,255,0.25))",
  },
  metaRow: { display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 900 },

  questRow: {
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.12)",
    padding: 10,
  },
  questTitleRow: { display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" },
  questTitle: {
    fontWeight: 900,
    fontSize: 13,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  rewardChip: {
    borderRadius: 999,
    border: "1px solid rgba(33,177,255,0.22)",
    background: "rgba(33,177,255,0.10)",
    padding: "4px 8px",
    fontSize: 11,
    fontWeight: 900,
    flex: "0 0 auto",
  },
  questDetail: { fontSize: 11, opacity: 0.75, marginTop: 2, lineHeight: 1.3 },

  questBar: {
    marginTop: 8,
    height: 8,
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.04)",
    overflow: "hidden",
  },
  questFill: {
    height: "100%",
    borderRadius: 999,
    background: "linear-gradient(90deg, rgba(255,255,255,0.70), rgba(33,177,255,0.25))",
  },
  questMeta: { marginTop: 6, fontSize: 11, opacity: 0.75, fontWeight: 900 },

  ctaRow: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    flexWrap: "wrap",
  },
  primaryBtn: {
    borderRadius: 999,
    padding: "10px 14px",
    fontWeight: 900,
    border: "1px solid rgba(33,177,255,0.22)",
    background: "linear-gradient(180deg, rgba(33,177,255,0.28), rgba(33,177,255,0.12))",
    color: "white",
    cursor: "pointer",
  },
  ctaHint: { fontSize: 11, opacity: 0.75, fontWeight: 800 },
};
