import { GlassPanel } from "../../../../components/GlassPanel";
import { WaterGlass } from "../../../../components/WaterGlass";
import { useHydration } from "../../../../core/state/useHydration";

export function PostPour({
  onGame,
  onSkip,
  onHousehold,
}: {
  onGame: () => void;
  onSkip: () => void;
  onHousehold: () => void;
}) {
  const s = useHydration();

  return (
    <GlassPanel height={480}>
      <WaterGlass intensity="idle" waterLevel={null} />

      <div style={styles.frame}>
        <div style={styles.h1}>Nice pour.</div>
        <div style={styles.sub}>
          Session: <b>{s.sessionMl}</b> ml • Today: <b>{s.todayMl}</b> / <b>{s.goalMl}</b> ml
        </div>

        <div style={styles.row}>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Points today</div>
            <div style={styles.cardValue}>{s.pointsToday}</div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardTitle}>Total points</div>
            <div style={styles.cardValue}>{s.pointsTotal}</div>
          </div>
        </div>

        <div style={styles.actions}>
          <button onClick={onGame}>Play Perfect Pour</button>
          <button onClick={onHousehold}>Household</button>
          <button onClick={onSkip}>Back to Idle</button>
        </div>

        <div style={styles.note}>
          Habit loop: pour → earn points → optional game → streak + quests.
        </div>
      </div>
    </GlassPanel>
  );
}

const styles: Record<string, React.CSSProperties> = {
  frame: {
    position: "relative",
    zIndex: 6,
    height: "100%",
    padding: 18,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    justifyContent: "center",
  },
  h1: { fontSize: 30, fontWeight: 900, letterSpacing: -0.5 },
  sub: { opacity: 0.8, lineHeight: 1.4 },

  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 6 },

  card: {
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.16)",
    padding: 14,
    display: "grid",
    gap: 6,
  },
  cardTitle: { fontSize: 13, opacity: 0.75 },
  cardValue: { fontSize: 22, fontWeight: 900 },

  actions: { display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 },
  note: { marginTop: 6, fontSize: 12, opacity: 0.65, lineHeight: 1.35 },
};
