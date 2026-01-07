// src/app/routes/care/screens/Maintenance.tsx
import type React from "react";
import { CareCard } from "../components/CareCard";
import { StatusPill } from "../components/StatusPill";

export function Maintenance() {
  return (
    <div style={styles.wrap}>
      <div style={styles.column}>
        <CareCard
          title="Maintenance modes"
          subtitle="Clear language instead of error codes."
        >
          <div style={styles.stack}>
            <MaintenanceRow
              label="Sanitize cycle"
              pill={<StatusPill tone="info" label="Scheduled nightly" />}
              desc="Dispense is paused briefly while the system cleans internal lines."
              eta="~9 minutes"
            />
            <MaintenanceRow
              label="Cooling recovery"
              pill={<StatusPill tone="info" label="Auto-managed" />}
              desc="After heavy use, cooling may recover before the next round of ice-cold water."
              eta="Up to 15 minutes"
            />
            <MaintenanceRow
              label="Filter replacement"
              pill={<StatusPill tone="warn" label="User action" />}
              desc="We guide you when performance could be affected, with step-by-step instructions."
              eta="5–10 minutes with user"
            />
          </div>
        </CareCard>

        <CareCard
          title="When dispense is paused"
          subtitle="Supportive, not alarming."
          emphasis="soft"
        >
          <p style={styles.text}>
            In cases where the safest action is to pause dispense (e.g., during
            sanitization or a critical fault), Care OS surfaces a calm, time-bound
            explanation instead of a red error code.
          </p>
          <p style={styles.example}>
            <strong>Example copy:</strong> “To keep your water safe, we’re completing a
            sanitization cycle. This will finish in about 9 minutes. You’ll be able to
            pour again as soon as it’s done.”
          </p>
        </CareCard>
      </div>

      <div style={styles.column}>
        <CareCard
          title="Recommended cadence"
          subtitle="Defaults that can be tuned per product."
          emphasis="soft"
        >
          <ul style={styles.list}>
            <li>Sanitize cycle: nightly, during low use hours.</li>
            <li>Filter check: quick health scan daily; deep check weekly.</li>
            <li>
              User-visible reminder: start gentle notices when ~25–30% filter life
              remains.
            </li>
            <li>Full lockout only when water quality cannot be guaranteed.</li>
          </ul>
        </CareCard>
      </div>
    </div>
  );
}

type MaintenanceRowProps = {
  label: string;
  pill: React.ReactNode;
  desc: string;
  eta?: string;
};

function MaintenanceRow({ label, pill, desc, eta }: MaintenanceRowProps) {
  return (
    <div style={styles.rowBlock}>
      <div style={styles.rowHeader}>
        <span>{label}</span>
        {pill}
      </div>
      <div style={styles.rowDesc}>{desc}</div>
      {eta && (
        <div style={styles.rowMeta}>
          Typical duration: <strong>{eta}</strong>
        </div>
      )}
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
  stack: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  text: {
    fontSize: 13,
    opacity: 0.96,
  },
  example: {
    fontSize: 12,
    opacity: 0.9,
    marginTop: 6,
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
  rowBlock: {
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.35)",
    padding: 10,
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  rowHeader: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 13,
    alignItems: "center",
  },
  rowDesc: {
    fontSize: 12,
    opacity: 0.9,
  },
  rowMeta: {
    fontSize: 11,
    opacity: 0.8,
  },
};
