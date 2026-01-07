// src/app/routes/care/screens/Overview.tsx
import type React from "react";
import { useHydration } from "../../../../core/state/useHydration";
import { CareCard } from "../components/CareCard";
import { ProgressRing } from "../components/ProgressRing";
import { StatusPill } from "../components/StatusPill";

export function Overview() {
  const s = useHydration();

  const goalMl = (s.goalGlasses ?? 8) * 240;
  const todayMl = s.todayMl ?? 0;
  const pctDay = goalMl > 0 ? Math.min(100, Math.round((todayMl / goalMl) * 100)) : 0;

  const filterPct = s.filterPercent ?? 90;

  return (
    <div style={styles.wrap}>
      <div style={styles.grid}>
        <CareCard title="Today’s hydration" subtitle="How today looks so far">
          <div style={styles.mainRow}>
            <ProgressRing value={pctDay} label="of today’s target" />
            <div style={styles.mainStats}>
              <div>
                <div style={styles.metricLabel}>Today</div>
                <div style={styles.metricValue}>{Math.round(todayMl)} ml</div>
                <div style={styles.metricSub}>
                  {s.glassesToday ?? 0}/{s.goalGlasses ?? 8} glasses
                </div>
              </div>
              <div>
                <div style={styles.metricLabel}>Points</div>
                <div style={styles.metricValue}>{s.pointsToday ?? 0}</div>
                <div style={styles.metricSub}>Total: {s.pointsTotal ?? 0}</div>
              </div>
            </div>
          </div>
        </CareCard>

        <CareCard title="Filter & water" subtitle="How healthy your system looks">
          <div style={styles.row}>
            <StatusPill
              tone={filterPct > 30 ? "ok" : "warn"}
              label={
                filterPct > 60
                  ? `Filter healthy • ${filterPct}%`
                  : filterPct > 30
                  ? `Filter mid-life • ${filterPct}%`
                  : `Filter low • ${filterPct}%`
              }
            />
          </div>
          <div style={styles.metaRow}>
            <span style={styles.metaLabel}>Estimated days remaining</span>
            <span style={styles.metaValue}>
              ~{Math.round(filterPct * 1.2)} days
            </span>
          </div>
          <div style={styles.hint}>
            We’ll surface a gentle reminder before performance is affected.
          </div>
        </CareCard>

        <CareCard
          title="System status"
          subtitle="Is everything behaving as expected?"
          emphasis="soft"
        >
          <div style={styles.stack}>
            <div style={styles.statusRow}>
              <span>Dispense system</span>
              <StatusPill tone="ok" label="Ready" />
            </div>
            <div style={styles.statusRow}>
              <span>Temperature</span>
              <StatusPill
                tone={s.tempPreset === "COLD" || s.tempPreset === "COOL" ? "ok" : "info"}
                label={
                  s.tempPreset === "COLD"
                    ? "Chilled"
                    : s.tempPreset === "COOL"
                    ? "Cool"
                    : s.tempPreset === "ROOM"
                    ? "Room temp"
                    : "Hot mode"
                }
              />
            </div>
            <div style={styles.statusRow}>
              <span>Ice</span>
              <StatusPill
                tone={s.iceEnabled ? "ok" : "info"}
                label={s.iceEnabled ? "Enabled" : "Temporarily paused"}
              />
            </div>
          </div>
        </CareCard>

        <CareCard
          title="Connectivity"
          subtitle="How your device stays in sync"
          emphasis="soft"
        >
          <div style={styles.stack}>
            <div style={styles.statusRow}>
              <span>Wi-Fi</span>
              <StatusPill
                tone={s.wifiConnected ? "ok" : "offline"}
                label={s.wifiConnected ? "Online" : "Offline – local only"}
              />
            </div>
            <div style={styles.statusRow}>
              <span>Mobile companion</span>
              <StatusPill
                tone={s.paired ? "ok" : "info"}
                label={s.paired ? "Paired" : "Ready to pair"}
              />
            </div>
          </div>
          <div style={styles.hint}>
            All core functions continue locally, even if cloud features are offline.
          </div>
        </CareCard>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    width: "100%",
    maxWidth: 1120,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1.3fr)",
    gap: 14,
  },
  mainRow: {
    display: "flex",
    gap: 14,
    alignItems: "center",
    flexWrap: "wrap",
  },
  mainStats: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    minWidth: 0,
  },
  metricLabel: {
    fontSize: 11,
    opacity: 0.78,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 900,
    letterSpacing: -0.4,
  },
  metricSub: {
    fontSize: 12,
    opacity: 0.8,
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metaRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 8,
    fontSize: 12,
  },
  metaLabel: {
    opacity: 0.8,
  },
  metaValue: {
    fontWeight: 600,
  },
  hint: {
    marginTop: 8,
    fontSize: 12,
    opacity: 0.8,
  },
  stack: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  statusRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 13,
    alignItems: "center",
  },
};
