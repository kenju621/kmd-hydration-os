// src/app/routes/care/screens/FilterHealth.tsx
import type React from "react";
import { useHydration } from "../../../../core/state/useHydration";
import { CareCard } from "../components/CareCard";
import { ProgressRing } from "../components/ProgressRing";
import { StatusPill } from "../components/StatusPill";

export function FilterHealth() {
  const s = useHydration();
  const filterPct = s.filterPercent ?? 90;
  const estDays = Math.round(filterPct * 1.2);

  return (
    <div style={styles.wrap}>
      <div style={styles.column}>
        <CareCard
          title="Filter lifecycle"
          subtitle="We’ll guide you before performance drops."
        >
          <div style={styles.mainRow}>
            <ProgressRing value={filterPct} label="filter life" />
            <div style={styles.stats}>
              <div style={styles.label}>Estimated days remaining</div>
              <div style={styles.value}>~{estDays} days</div>
              <div style={styles.sub}>
                Based on your recent household usage. This adjusts automatically.
              </div>

              <div style={styles.chipsRow}>
                <StatusPill
                  tone={filterPct > 60 ? "ok" : filterPct > 30 ? "info" : "warn"}
                  label={
                    filterPct > 60
                      ? "Healthy range"
                      : filterPct > 30
                      ? "Mid-life"
                      : "Low – plan to replace"
                  }
                />
              </div>
            </div>
          </div>
        </CareCard>

        <CareCard
          title="What happens when filter is low?"
          subtitle="No surprises — just clear steps."
          emphasis="soft"
        >
          <ul style={styles.list}>
            <li>We first surface a gentle reminder on the main screen.</li>
            <li>You’ll see clear language instead of error codes.</li>
            <li>
              If performance could be affected, we’ll mark water as “Use with caution”
              rather than silently continue.
            </li>
            <li>You decide when to replace — we simply keep you informed.</li>
          </ul>
        </CareCard>
      </div>

      <div style={styles.column}>
        <CareCard
          title="Water profile"
          subtitle="High-level summary for peace of mind."
          emphasis="soft"
        >
          <div style={styles.stack}>
            <div style={styles.row}>
              <span>Flow</span>
              <StatusPill tone="ok" label="Normal" />
            </div>
            <div style={styles.row}>
              <span>Temperature system</span>
              <StatusPill tone="ok" label="Stable" />
            </div>
            <div style={styles.row}>
              <span>Sanitize schedule</span>
              <StatusPill tone="info" label="Nightly, off-peak" />
            </div>
          </div>
          <div style={styles.subNote}>
            Exact values would be driven by internal sensors; this UI is designed to
            surface them calmly and clearly.
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
    display: "grid",
    gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1.2fr)",
    gap: 14,
  },
  column: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  mainRow: {
    display: "flex",
    gap: 14,
    alignItems: "center",
    flexWrap: "wrap",
  },
  stats: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    minWidth: 0,
  },
  label: {
    fontSize: 11,
    opacity: 0.78,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  value: {
    fontSize: 20,
    fontWeight: 900,
  },
  sub: {
    fontSize: 12,
    opacity: 0.85,
  },
  chipsRow: {
    marginTop: 4,
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },
  list: {
    margin: 0,
    paddingLeft: 18,
    display: "flex",
    flexDirection: "column",
    gap: 4,
    fontSize: 13,
    opacity: 0.95,
  },
  stack: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 13,
    alignItems: "center",
  },
  subNote: {
    marginTop: 8,
    fontSize: 12,
    opacity: 0.8,
  },
};
