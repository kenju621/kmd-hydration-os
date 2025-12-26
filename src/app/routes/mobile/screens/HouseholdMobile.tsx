// src/app/routes/mobile/screens/HouseholdMobile.tsx
import { useHydration } from "../../../../core/state/useHydration";
import type { HouseholdMember } from "../../../../core/state/hydrationStore";

export function HouseholdMobile() {
  const s = useHydration();

  const members: HouseholdMember[] = s.householdMembers ?? [];

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <div style={styles.title}>Household</div>
        <div style={styles.sub}>Glasses and points today</div>
      </div>

      <div style={styles.list}>
        {members.map((m) => (
          <div key={m.id} style={styles.card}>
            <div style={styles.nameRow}>
              <span style={styles.name}>{m.name}</span>
              <span style={styles.streak}>{m.streakDays} day streak</span>
            </div>
            <div style={styles.metricsRow}>
              <span>{m.glassesToday} glasses</span>
              <span>{m.pointsToday} pts</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  header: { display: "flex", flexDirection: "column", gap: 2 },
  title: { fontSize: 20, fontWeight: 900 },
  sub: { fontSize: 13, opacity: 0.8 },

  list: { display: "flex", flexDirection: "column", gap: 8 },

  card: {
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.25)",
    padding: 10,
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  nameRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  name: { fontSize: 14, fontWeight: 900 },
  streak: { fontSize: 11, opacity: 0.75 },
  metricsRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 13,
    opacity: 0.9,
  },
};
