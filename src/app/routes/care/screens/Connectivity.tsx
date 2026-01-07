// src/app/routes/care/screens/Connectivity.tsx
import type React from "react";
import { useHydration } from "../../../../core/state/useHydration";
import { CareCard } from "../components/CareCard";
import { StatusPill } from "../components/StatusPill";

export function Connectivity() {
  const s = useHydration();

  return (
    <div style={styles.wrap}>
      <div style={styles.column}>
        <CareCard
          title="Live connectivity"
          subtitle="How the device is talking to the world."
        >
          <div style={styles.stack}>
            <div style={styles.row}>
              <span>Wi-Fi</span>
              <StatusPill
                tone={s.wifiConnected ? "ok" : "offline"}
                label={s.wifiConnected ? "Online" : "Offline – local only"}
              />
            </div>
            <div style={styles.row}>
              <span>Mobile companion</span>
              <StatusPill
                tone={s.paired ? "ok" : "info"}
                label={s.paired ? "Paired" : "Ready to pair"}
              />
            </div>
            <div style={styles.row}>
              <span>Cloud sync</span>
              <StatusPill tone="info" label="Prototype: mocked state" />
            </div>
          </div>
          <p style={styles.text}>
            Even when Wi-Fi is offline, core functions continue locally. Cloud
            features (history backup, remote notifications, etc.) resume when
            connection returns.
          </p>
        </CareCard>
      </div>

      <div style={styles.column}>
        <CareCard
          title="Offline & fallback behavior"
          subtitle="Designing for imperfect networks."
          emphasis="soft"
        >
          <ul style={styles.list}>
            <li>Dispense, cooling, and safety checks continue fully offline.</li>
            <li>
              We clearly label when data shown is “last synced” versus truly real-time.
            </li>
            <li>
              If settings can’t sync to the cloud, they are still applied locally and
              queued.
            </li>
            <li>
              If pairing is broken, we surface “Ready to pair” instead of a generic
              error.
            </li>
          </ul>
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
  stack: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 13,
  },
  text: {
    marginTop: 10,
    fontSize: 12,
    opacity: 0.9,
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
};
