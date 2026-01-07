// src/app/routes/care/CareShell.tsx
import type React from "react";
import { useHydration } from "../../../core/state/useHydration";

export function CareShell() {
  const s = useHydration();

  const goalMl = s.goalMl ?? s.goalGlasses * 240;
  const progressPct = Math.min(100, Math.round((s.todayMl / goalMl) * 100));

  const goBackToDispenser = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    window.location.href = "/dispenser";
  };

  const recentPours = s.pourHistory.slice(0, 6);

  return (
    <div style={styles.shell}>
      {/* Top bar */}
      <div style={styles.topBar}>
        <div>
          <div style={styles.title}>KMD Care OS</div>
          <div style={styles.subTitle}>
            Device health • Household hydration • History
          </div>
        </div>

        <div style={styles.topBarRight}>
          <button style={styles.backButton} onClick={goBackToDispenser}>
            Back to Hydration&nbsp;OS
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={styles.main}>
        {/* Left column: Today + Household */}
        <div style={styles.leftColumn}>
          {/* Today card */}
          <div style={styles.card}>
            <div style={styles.cardHeaderRow}>
              <div>
                <div style={styles.cardTitle}>Today’s hydration</div>
                <div style={styles.cardSub}>
                  {Math.round(s.todayMl)} ml • {s.glassesToday} / {s.goalGlasses} glasses
                </div>
              </div>
              <div style={styles.badgeSoft}>
                {progressPct}% of goal
              </div>
            </div>

            <div style={styles.progressBarTrack}>
              <div
                style={{
                  ...styles.progressBarFill,
                  width: `${progressPct}%`,
                }}
              />
            </div>

            <div style={styles.cardFooterRow}>
              <span style={styles.cardHint}>
                Points today: <strong>{s.pointsToday}</strong> • Lifetime:{" "}
                <strong>{s.pointsTotal}</strong>
              </span>
            </div>
          </div>

          {/* Household card */}
          <div style={styles.card}>
            <div style={styles.cardHeaderRow}>
              <div>
                <div style={styles.cardTitle}>Household hydration</div>
                <div style={styles.cardSub}>
                  Everyone sharing this dispenser today
                </div>
              </div>
            </div>

            <div style={styles.householdList}>
              {s.householdMembers.map((m) => (
                <div key={m.id} style={styles.householdRow}>
                  <div style={styles.avatarCircle}>
                    {m.name.slice(0, 1).toUpperCase()}
                  </div>
                  <div style={styles.householdMain}>
                    <div style={styles.householdName}>{m.name}</div>
                    <div style={styles.householdMeta}>
                      {m.glassesToday} glasses • {m.pointsToday} pts
                    </div>
                  </div>
                  <div style={styles.streakPill}>
                    {m.streakDays}d streak
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Device + History */}
        <div style={styles.rightColumn}>
          {/* Device health */}
          <div style={styles.card}>
            <div style={styles.cardHeaderRow}>
              <div style={styles.cardTitle}>Device status</div>
            </div>

            <div style={styles.statusGrid}>
              <div style={styles.statusItem}>
                <div style={styles.statusLabel}>Filter</div>
                <div style={styles.statusValue}>{s.filterPercent}%</div>
                <div style={styles.statusHint}>
                  {s.filterPercent > 20 ? "OK" : "Replace soon"}
                </div>
              </div>
              <div style={styles.statusItem}>
                <div style={styles.statusLabel}>Wi-Fi</div>
                <div style={styles.statusValue}>
                  {s.wifiConnected ? "Connected" : "Offline"}
                </div>
                <div style={styles.statusHint}>
                  {s.wifiConnected ? "Syncing activities" : "Local only"}
                </div>
              </div>
              <div style={styles.statusItem}>
                <div style={styles.statusLabel}>Ice mode</div>
                <div style={styles.statusValue}>
                  {s.iceEnabled ? "On" : "Off"}
                </div>
                <div style={styles.statusHint}>
                  {s.iceEnabled ? "Chilled & ready" : "Ice disabled"}
                </div>
              </div>
              <div style={styles.statusItem}>
                <div style={styles.statusLabel}>Preset</div>
                <div style={styles.statusValue}>{s.tempPreset}</div>
                <div style={styles.statusHint}>Current pour temperature</div>
              </div>
            </div>
          </div>

          {/* History */}
          <div style={styles.card}>
            <div style={styles.cardHeaderRow}>
              <div style={styles.cardTitle}>Recent pours</div>
              <div style={styles.cardSub}>
                Last {recentPours.length} sessions
              </div>
            </div>

            {recentPours.length === 0 ? (
              <div style={styles.emptyState}>
                No pours logged yet today. First pour will appear here.
              </div>
            ) : (
              <div style={styles.historyList}>
                {recentPours.map((p) => (
                  <div key={p.id} style={styles.historyRow}>
                    <div style={styles.historyMl}>
                      {Math.round(p.ml)} ml
                    </div>
                    <div style={styles.historyMeta}>
                      {p.pointsEarned} pts •{" "}
                      <span style={{ opacity: 0.8 }}>
                        {p.note ?? "Pour"}
                      </span>
                    </div>
                    <div style={styles.historySource}>
                      {(p.source ?? "dispenser").toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CareShell;

const styles: Record<string, React.CSSProperties> = {
  shell: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    background:
      "radial-gradient(circle at 0% 0%, #1d4ed8 0, #020617 55%)",
    color: "#e5f0ff",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, system-ui, -system-ui, sans-serif",
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    borderBottom: "1px solid rgba(148,163,255,0.25)",
  },
  title: {
    fontSize: 22,
    fontWeight: 800,
    letterSpacing: -0.3,
  },
  subTitle: {
    fontSize: 12,
    opacity: 0.8,
    marginTop: 2,
  },
  topBarRight: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  backButton: {
    padding: "7px 14px",
    borderRadius: 999,
    border: "1px solid rgba(148,163,255,0.9)",
    background: "rgba(15,23,42,0.9)",
    color: "#e5e7eb",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
  },

  main: {
    flex: 1,
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)",
    gap: 20,
    padding: 20,
    boxSizing: "border-box",
  },

  leftColumn: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  rightColumn: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },

  card: {
    background: "rgba(15,23,42,0.96)",
    borderRadius: 18,
    padding: 16,
    border: "1px solid rgba(148,163,255,0.25)",
    boxShadow: "0 14px 40px rgba(15,23,42,0.70)",
  },
  cardHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 700,
  },
  cardSub: {
    fontSize: 12,
    opacity: 0.78,
    marginTop: 2,
  },
  cardFooterRow: {
    marginTop: 10,
    display: "flex",
    justifyContent: "space-between",
    fontSize: 12,
    opacity: 0.85,
  },
  cardHint: {
    opacity: 0.9,
  },

  badgeSoft: {
    padding: "4px 9px",
    borderRadius: 999,
    border: "1px solid rgba(129, 230, 217, 0.8)",
    background:
      "linear-gradient(135deg, rgba(56,189,248,0.15), rgba(59,130,246,0.15))",
    fontSize: 11,
    fontWeight: 600,
    whiteSpace: "nowrap",
  },

  progressBarTrack: {
    marginTop: 10,
    height: 8,
    borderRadius: 999,
    background: "rgba(30,64,175,0.7)",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 999,
    background:
      "linear-gradient(90deg, #38bdf8, #22c55e, #a3e635)",
    boxShadow: "0 0 12px rgba(56,189,248,0.9)",
    transition: "width 0.25s ease-out",
  },

  householdList: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginTop: 4,
  },
  householdRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "6px 4px",
    borderRadius: 10,
  },
  avatarCircle: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    background:
      "radial-gradient(circle at 30% 0%, #4ade80, #22c55e)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    fontWeight: 700,
    color: "#020617",
  },
  householdMain: {
    flex: 1,
  },
  householdName: {
    fontSize: 13,
    fontWeight: 600,
  },
  householdMeta: {
    fontSize: 11,
    opacity: 0.8,
  },
  streakPill: {
    padding: "3px 8px",
    borderRadius: 999,
    border: "1px solid rgba(252,211,77,0.9)",
    fontSize: 11,
  },

  statusGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 10,
    marginTop: 6,
  },
  statusItem: {
    padding: 10,
    borderRadius: 12,
    background: "rgba(15,23,42,0.95)",
    border: "1px solid rgba(51,65,85,0.9)",
  },
  statusLabel: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.14,
    opacity: 0.75,
  },
  statusValue: {
    fontSize: 15,
    fontWeight: 700,
    marginTop: 2,
  },
  statusHint: {
    fontSize: 11,
    opacity: 0.8,
    marginTop: 2,
  },

  historyList: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    marginTop: 6,
    maxHeight: 220,
    overflowY: "auto",
  },
  historyRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 4px",
    borderRadius: 10,
    background: "rgba(15,23,42,0.9)",
  },
  historyMl: {
    fontSize: 13,
    fontWeight: 700,
    minWidth: 64,
  },
  historyMeta: {
    fontSize: 11,
    opacity: 0.86,
    flex: 1,
  },
  historySource: {
    fontSize: 10,
    padding: "3px 7px",
    borderRadius: 999,
    border: "1px solid rgba(148,163,255,0.8)",
    opacity: 0.9,
  },

  emptyState: {
    marginTop: 10,
    fontSize: 12,
    opacity: 0.8,
    fontStyle: "italic",
  },
};
