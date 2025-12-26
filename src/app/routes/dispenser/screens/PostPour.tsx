// src/app/routes/dispenser/screens/PostPour.tsx
import { useHydration } from "../../../../core/state/useHydration";

type Props = {
  onGame: () => void;
  onSkip: () => void;
  onHousehold: () => void;
};

export function PostPour({ onGame, onSkip, onHousehold }: Props) {
  const s = useHydration();

  // assume ~240ml per glass for a daily goal
  const goalMl = (s.goalGlasses ?? 8) * 240;
  const todayMl = s.todayMl ?? 0;
  const pct = goalMl > 0 ? Math.min(100, Math.round((todayMl / goalMl) * 100)) : 0;

  const glassesLabel = `${s.glassesToday ?? 0}/${s.goalGlasses ?? 8} glasses`;

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <div style={styles.title}>Nice pour.</div>
        <div style={styles.sub}>We’ve added this to today’s hydration.</div>
      </div>

      <div style={styles.cardRow}>
        <div style={styles.progressCard}>
          <div style={styles.progressLabel}>Today’s progress</div>
          <div style={styles.progressNumber}>{pct}%</div>
          <div style={styles.progressSub}>
            {Math.round(todayMl)} ml • {glassesLabel}
          </div>

          <div style={styles.progressBarOuter}>
            <div style={{ ...styles.progressBarInner, width: `${pct}%` }} />
          </div>
        </div>

        <div style={styles.pointsCard}>
          <div style={styles.pointsLabel}>Points earned</div>
          <div style={styles.pointsNumber}>{s.pointsToday ?? 0}</div>
          <div style={styles.pointsSub}>Total: {s.pointsTotal ?? 0}</div>
        </div>
      </div>

      <div style={styles.ctaRow}>
        <button style={styles.primaryBtn} onClick={onGame}>
          Try perfect pour game
        </button>
        <button style={styles.secondaryBtn} onClick={onHousehold}>
          View household
        </button>
        <button style={styles.ghostBtn} onClick={onSkip}>
          Back to idle
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    width: "min(980px, 100%)",
    height: "min(520px, calc(100vh - 190px))",
    borderRadius: 20,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    padding: 18,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  title: { fontSize: 22, fontWeight: 900, letterSpacing: -0.6 },
  sub: { fontSize: 13, opacity: 0.8 },

  cardRow: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: 14,
    flex: 1,
    minHeight: 0,
  },

  progressCard: {
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.18)",
    padding: 14,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    justifyContent: "center",
  },
  progressLabel: { fontSize: 12, opacity: 0.8, fontWeight: 900 },
  progressNumber: { fontSize: 28, fontWeight: 900, letterSpacing: -0.6 },
  progressSub: { fontSize: 13, opacity: 0.8 },

  progressBarOuter: {
    marginTop: 10,
    borderRadius: 999,
    background: "rgba(255,255,255,0.06)",
    height: 8,
    overflow: "hidden",
  },
  progressBarInner: {
    height: "100%",
    borderRadius: 999,
    background:
      "linear-gradient(90deg, rgba(33,177,255,0.85), rgba(33,177,255,0.30))",
  },

  pointsCard: {
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.22)",
    padding: 14,
    display: "flex",
    flexDirection: "column",
    gap: 6,
    justifyContent: "center",
  },
  pointsLabel: { fontSize: 12, opacity: 0.8, fontWeight: 900 },
  pointsNumber: { fontSize: 24, fontWeight: 900 },
  pointsSub: { fontSize: 13, opacity: 0.8 },

  ctaRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 4,
  },
  primaryBtn: {
    borderRadius: 999,
    padding: "9px 14px",
    border: "1px solid rgba(33,177,255,0.40)",
    background:
      "linear-gradient(180deg, rgba(33,177,255,0.30), rgba(33,177,255,0.10))",
    fontWeight: 900,
    cursor: "pointer",
    color: "white",
  },
  secondaryBtn: {
    borderRadius: 999,
    padding: "9px 14px",
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(0,0,0,0.18)",
    fontWeight: 900,
    cursor: "pointer",
    color: "white",
  },
  ghostBtn: {
    borderRadius: 999,
    padding: "9px 14px",
    border: "1px solid transparent",
    background: "transparent",
    fontWeight: 900,
    cursor: "pointer",
    color: "rgba(255,255,255,0.75)",
  },
};
