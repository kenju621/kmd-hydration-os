// src/app/routes/mobile/MobileCompanion.tsx
import { QRCodeCanvas } from "qrcode.react";
import { useHydration } from "../../../core/state/useHydration";
import { regeneratePairingCode, setPaired } from "../../../core/state/hydrationStore";

// Local copy of the history item shape (keeps this file self-contained)
type PourHistoryItem = {
  id: string;
  ts: number;
  ml: number;
  pointsEarned: number;
  note?: string;
};

export function MobileCompanion() {
  const s = useHydration();

  // Simple QR payload – no Date.now in render
  const qrPayload = JSON.stringify({
    code: s.pairingCode,
  });

  const recent: PourHistoryItem[] = (s.pourHistory ?? []).slice(0, 5);

  const goBackToHydration = () => {
    window.location.assign("/");
  };

  const handlePairToggle = () => {
    setPaired(!s.paired);
  };

  const handleRegenerate = () => {
    regeneratePairingCode();
  };

  return (
    <div style={styles.screen}>
      {/* Top bar + back button */}
      <div style={styles.topBar}>
        <button style={styles.backButton} onClick={goBackToHydration}>
          ← Hydration OS
        </button>
        <div style={{ fontWeight: 600, fontSize: 14, opacity: 0.9 }}>
          KMD Mobile Companion
        </div>
      </div>

      <div style={styles.body}>
        {/* Left column: pairing / status */}
        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.cardTitle}>Pair with dispenser</div>
            <span
              style={{
                ...styles.statusPill,
                backgroundColor: s.paired ? "#22c55e1a" : "#ef44441a",
                borderColor: s.paired ? "#22c55e" : "#ef4444",
                color: s.paired ? "#bbf7d0" : "#fecaca",
              }}
            >
              {s.paired ? "Paired" : "Not paired"}
            </span>
          </div>

          <div style={styles.qrRow}>
            <div style={styles.qrBox}>
              <QRCodeCanvas value={qrPayload} size={140} />
            </div>
            <div style={styles.qrInfo}>
              <div style={styles.label}>Pairing code</div>
              <div style={styles.code}>{s.pairingCode}</div>
              <div style={styles.helperText}>
                Open the KMD mobile app, choose{" "}
                <strong>“Pair with dispenser”</strong>, and scan this QR.
              </div>

              <div style={styles.buttonRow}>
                <button style={styles.secondaryButton} onClick={handleRegenerate}>
                  New code
                </button>
                <button style={styles.primaryButton} onClick={handlePairToggle}>
                  {s.paired ? "Mark as unpaired" : "Mark as paired"}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Right column: recent pours */}
        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.cardTitle}>Today’s pours</div>
            <div style={styles.subtleLabel}>
              {recent.length === 0 ? "No pours yet" : `${recent.length} recent`}
            </div>
          </div>

          {recent.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={{ fontWeight: 500, marginBottom: 4 }}>
                Waiting on that first glass 💧
              </div>
              <div style={styles.helperText}>
                Start a pour on the dispenser and you’ll see it appear here in
                real time.
              </div>
            </div>
          ) : (
            <ul style={styles.list}>
              {recent.map((item) => (
                <li key={item.id} style={styles.listItem}>
                  <div>
                    <div style={styles.listTitle}>
                      {Math.round(item.ml)} ml
                      {item.note ? (
                        <span style={styles.listNote}> · {item.note}</span>
                      ) : null}
                    </div>
                    <div style={styles.listMeta}>
                      +{item.pointsEarned} pts ·{" "}
                      {new Date(item.ts).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  screen: {
    minHeight: "100vh",
    background: "radial-gradient(circle at top, #0f172a, #020617 60%)",
    color: "#e5e7eb",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, system-ui, -system-ui, sans-serif",
    padding: 16,
    boxSizing: "border-box",
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  backButton: {
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid rgba(148,163,184,0.9)",
    background: "rgba(15,23,42,0.9)",
    color: "#e5e7eb",
    fontSize: 12,
    cursor: "pointer",
  },
  body: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1fr)",
    gap: 16,
  },
  card: {
    background: "rgba(15,23,42,0.95)",
    borderRadius: 18,
    border: "1px solid rgba(148,163,184,0.35)",
    padding: 16,
    boxShadow: "0 18px 45px rgba(15,23,42,0.85)",
    boxSizing: "border-box",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 600,
  },
  statusPill: {
    fontSize: 11,
    padding: "4px 8px",
    borderRadius: 999,
    borderWidth: 1,
    borderStyle: "solid",
  },
  qrRow: {
    display: "flex",
    gap: 14,
    alignItems: "center",
  },
  qrBox: {
    padding: 10,
    borderRadius: 14,
    background: "radial-gradient(circle at top, #0ea5e9, #020617)",
    boxShadow: "0 12px 30px rgba(56,189,248,0.45)",
  },
  qrInfo: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  label: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.08,
    color: "#9ca3af",
  },
  code: {
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: 2,
    fontFamily: "monospace",
  },
  helperText: {
    fontSize: 12,
    color: "#9ca3af",
  },
  buttonRow: {
    marginTop: 8,
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },
  primaryButton: {
    padding: "6px 12px",
    borderRadius: 999,
    border: "none",
    background:
      "linear-gradient(135deg, rgba(34,197,94,0.95), rgba(52,211,153,0.95))",
    color: "#022c22",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
  },
  secondaryButton: {
    padding: "6px 12px",
    borderRadius: 999,
    border: "1px solid rgba(148,163,184,0.8)",
    background: "transparent",
    color: "#e5e7eb",
    fontSize: 12,
    cursor: "pointer",
  },
  subtleLabel: {
    fontSize: 11,
    color: "#9ca3af",
  },
  emptyState: {
    marginTop: 4,
    padding: 10,
    borderRadius: 12,
    background: "rgba(15,23,42,0.9)",
    border: "1px dashed rgba(55,65,81,0.9)",
  },
  list: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    marginTop: 4,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  listItem: {
    padding: 8,
    borderRadius: 12,
    background: "rgba(15,23,42,0.9)",
    border: "1px solid rgba(31,41,55,0.9)",
  },
  listTitle: {
    fontSize: 13,
    fontWeight: 500,
  },
  listNote: {
    fontSize: 12,
    color: "#9ca3af",
  },
  listMeta: {
    fontSize: 11,
    color: "#9ca3af",
    marginTop: 2,
  },
};
