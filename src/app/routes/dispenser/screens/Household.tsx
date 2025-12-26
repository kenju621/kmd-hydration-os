import { useMemo } from "react";
import { useHydration } from "../../../../core/state/useHydration";
import { setMode } from "../../../../core/state/hydrationStore";

type HouseholdMember = {
  id: string;
  name: string;
  glassesToday: number;
  pointsToday: number;
  streakDays: number;
};

type HydrationStateWithHousehold = {
  todayMl: number;
  pointsToday: number;
  pointsTotal: number;
  householdMembers?: HouseholdMember[];
};

function isHouseholdMemberArray(value: unknown): value is HouseholdMember[] {
  if (!Array.isArray(value)) return false;
  return value.every((m) => {
    if (typeof m !== "object" || m === null) return false;
    const o = m as Record<string, unknown>;
    return (
      typeof o.id === "string" &&
      typeof o.name === "string" &&
      typeof o.glassesToday === "number" &&
      typeof o.pointsToday === "number" &&
      typeof o.streakDays === "number"
    );
  });
}

export function Household({ onBack }: { onBack: () => void }) {
  const sRaw = useHydration();
  const s = sRaw as unknown as HydrationStateWithHousehold;

  const members: HouseholdMember[] = useMemo(() => {
    const maybe = (sRaw as unknown as HydrationStateWithHousehold).householdMembers as unknown;
    if (isHouseholdMemberArray(maybe) && maybe.length) return maybe;

    const yourGlasses = Math.max(0, Math.round(s.todayMl / 240));
    return [
      { id: "you", name: "You", glassesToday: yourGlasses, pointsToday: s.pointsToday, streakDays: 3 },
      { id: "a", name: "Alice", glassesToday: 2, pointsToday: 6, streakDays: 5 },
      { id: "m", name: "Miles", glassesToday: 1, pointsToday: 3, streakDays: 2 },
      { id: "g", name: "Guest", glassesToday: 0, pointsToday: 0, streakDays: 0 },
    ];
  }, [sRaw, s.todayMl, s.pointsToday]);

  const totalGlasses = members.reduce((acc, m) => acc + m.glassesToday, 0);
  const totalPoints = members.reduce((acc, m) => acc + m.pointsToday, 0);

  const ranked = useMemo(() => {
    return [...members].sort((a, b) => b.pointsToday - a.pointsToday || b.glassesToday - a.glassesToday);
  }, [members]);

  return (
    <div style={styles.shell}>
      <div style={styles.bg} />

      <div style={styles.header}>
        <div>
          <div style={styles.title}>Household Hydration</div>
          <div style={styles.sub}>Friendly competition that keeps everyone drinking water.</div>
        </div>

        <div style={styles.headerActions}>
          <button onClick={onBack}>Back</button>
          <button onClick={() => setMode("GAME")}>Play Game</button>
        </div>
      </div>

      <div style={styles.body}>
        <div style={styles.summaryRow}>
          <div style={styles.summaryCard}>
            <div style={styles.kpiLabel}>Household Today</div>
            <div style={styles.kpiValue}>
              {totalGlasses} <span style={styles.kpiUnit}>glasses</span>
            </div>
            <div style={styles.kpiHint}>Everyone counts.</div>
          </div>

          <div style={styles.summaryCard}>
            <div style={styles.kpiLabel}>Points</div>
            <div style={styles.kpiValue}>
              {totalPoints} <span style={styles.kpiUnit}>today</span>
            </div>
            <div style={styles.kpiHint}>Quests + games.</div>
          </div>
        </div>

        <div style={styles.sectionHeader}>
          <div style={styles.sectionTitle}>Leaderboard</div>
          <div style={styles.sectionMeta}>Ranked by points</div>
        </div>

        <div style={styles.list}>
          {ranked.map((m, idx) => (
            <div key={m.id} style={styles.row}>
              <div style={styles.left}>
                <div style={styles.rank}>{idx + 1}</div>
                <div>
                  <div style={styles.name}>{m.name}</div>
                  <div style={styles.meta}>
                    {m.glassesToday} glasses • {m.streakDays} day streak
                  </div>
                </div>
              </div>

              <div style={styles.right}>
                <div style={styles.points}>{m.pointsToday} pts</div>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.actions}>
          <button onClick={() => setMode("IDLE")}>Return to Idle</button>
          <button onClick={() => setMode("GAME")}>Start Perfect Pour</button>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  shell: {
    position: "relative",
    width: "min(820px, 100%)",
    height: "100%",
    margin: "0 auto",
    borderRadius: 20,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.02)",
    color: "white",
    display: "flex",
    flexDirection: "column",
    minHeight: 0,
  },

  bg: {
    position: "absolute",
    inset: 0,
    zIndex: 0,
    background:
      "radial-gradient(circle at 25% 25%, rgba(33,177,255,0.18), transparent 55%), radial-gradient(circle at 70% 75%, rgba(33,177,255,0.10), transparent 55%), linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.00))",
  },

  header: {
    position: "relative",
    zIndex: 2,
    padding: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(0,0,0,0.06)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
  },

  headerActions: { display: "flex", gap: 10, flexWrap: "wrap" },

  title: { fontSize: 22, fontWeight: 900, letterSpacing: -0.6 },
  sub: { fontSize: 12, opacity: 0.75, marginTop: 2 },

  body: {
    position: "relative",
    zIndex: 2,
    flex: 1,
    minHeight: 0,
    overflowY: "auto",
    padding: 12,
    paddingBottom: 12,
    display: "grid",
    gap: 10,
  },

  summaryRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
  },

  summaryCard: {
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.14)",
    padding: 8,
    display: "grid",
    gap: 2,
  },

  kpiLabel: { fontSize: 11, opacity: 0.75, fontWeight: 900 },
  kpiValue: { fontSize: 16, fontWeight: 900, letterSpacing: -0.3 },
  kpiUnit: { fontSize: 11, opacity: 0.75, fontWeight: 900, marginLeft: 6 },
  kpiHint: { fontSize: 11, opacity: 0.72 },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: 10,
  },
  sectionTitle: { fontWeight: 900, opacity: 0.95 },
  sectionMeta: { fontSize: 11, opacity: 0.7, fontWeight: 900 },

  list: {
    display: "grid",
    gap: 10,
  },

  row: {
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.04)",
    padding: "10px 10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },

  left: { display: "flex", alignItems: "center", gap: 10 },
  rank: {
    width: 24,
    height: 24,
    borderRadius: 999,
    background: "rgba(0,0,0,0.18)",
    border: "1px solid rgba(255,255,255,0.10)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 900,
    fontSize: 12,
  },
  name: { fontWeight: 900 },
  meta: { fontSize: 11, opacity: 0.7, fontWeight: 800 },

  right: { display: "flex", alignItems: "center", gap: 10 },
  points: { fontWeight: 900, opacity: 0.9, fontSize: 12 },

  actions: { display: "flex", gap: 10, flexWrap: "wrap" },
};
