// src/app/routes/mobile/screens/Overview.tsx
import { useHydration } from "../../../../core/state/useHydration";

export function OverviewMobile() {
  const s = useHydration();

  const todayMl = s.todayMl ?? 0;
  const goalMl = (s.goalGlasses ?? 8) * 240;
  const pct = goalMl > 0 ? Math.min(100, Math.round((todayMl / goalMl) * 100)) : 0;

  const bestStreak = (s.householdMembers ?? []).reduce(
    (max, m) => Math.max(max, m.streakDays),
    0
  );

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <div style={styles.title}>Today</div>
        <div style={styles.sub}>Quick snapshot</div>
      </div>

      <div style={styles.card}>
        <div style={styles.row}>
          <div>
            <div style={styles.label}>Hydration</div>
            <div style={styles.value}>{pct}%</div>
            <div style={styles.meta}>
              {Math.round(todayMl)} ml of {goalMl} ml
            </div>
          </div>
        </div>

        <div style={styles.row}>
          <div>
            <div style={styles.label}>Glasses</div>
            <div style={styles.value}>
              {s.glassesToday ?? 0}/{s.goalGlasses ?? 8}
            </div>
          </div>
          <div>
            <div style={styles.label}>Best streak</div>
            <div style={styles.value}>{bestStreak} days</div>
          </div>
        </div>

        <div style={styles.row}>
          <div>
            <div style={styles.label}>Points today</div>
            <div style={styles.value}>{s.pointsToday ?? 0}</div>
          </div>
          <div>
            <div style={styles.label}>Total points</div>
            <div style={styles.value}>{s.pointsTotal ?? 0}</div>
          </div>
        </div>
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

  card: {
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.24)",
    padding: 14,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
  },
  label: { fontSize: 12, opacity: 0.8, fontWeight: 900 },
  value: { fontSize: 18, fontWeight: 900 },
  meta: { fontSize: 12, opacity: 0.8 },
};
