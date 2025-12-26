import { useMemo } from "react";
import { QRCodeCanvas } from "qrcode.react";
import type { PourHistoryItem } from "../../../core/state/hydrationStore";
import { useHydration } from "../../../core/state/useHydration";
import { regeneratePairingCode, setPaired } from "../../../core/state/hydrationStore";

export function MobileCompanion() {
  const s = useHydration();

  // ✅ Pure, stable payload (no Date.now, no setState, no effects)
  const payload = useMemo(() => {
    return JSON.stringify({
      code: s.pairingCode,
      product: "KMD Hydration OS",
    });
  }, [s.pairingCode]);

  return (
    <div style={styles.shell}>
      <div style={styles.card}>
        <div style={styles.h1}>Pair Mobile</div>
        <div style={styles.sub}>Scan to connect your phone to this dispenser.</div>

        <div style={styles.qrWrap}>
          <QRCodeCanvas value={payload} size={220} />
        </div>

        <div style={styles.row}>
          <div style={{ fontWeight: 900 }}>Pairing Code</div>
          <div style={styles.code}>{s.pairingCode}</div>
        </div>

        <div style={styles.row}>
          <div>Paired</div>
          <div style={{ fontWeight: 900 }}>{s.paired ? "Yes ✓" : "Not yet"}</div>
        </div>

        <div style={styles.actions}>
          <button onClick={() => setPaired(true)}>Simulate Pair</button>
          <button onClick={() => regeneratePairingCode()}>New Code</button>
        </div>

        <div style={styles.sectionTitle}>Profile</div>

        <div style={styles.row}>
          <div>Points today</div>
          <div style={{ fontWeight: 900 }}>{s.pointsToday}</div>
        </div>

        <div style={styles.row}>
          <div>Total points</div>
          <div style={{ fontWeight: 900 }}>{s.pointsTotal}</div>
        </div>

        <div style={styles.sectionTitle}>Recent activity</div>

        <div style={{ display: "grid", gap: 8 }}>
          {s.pourHistory.slice(0, 10).map((p: PourHistoryItem) => (
            <div key={p.ts} style={styles.historyRow}>
              <div style={{ fontWeight: 800 }}>{p.source}</div>
              <div style={{ opacity: 0.8 }}>{p.ml} ml</div>
              <div style={{ opacity: 0.6, fontSize: 12 }}>{formatTime(p.ts)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ✅ Pure helper (no Date.now)
function formatTime(ts: number): string {
  try {
    return new Date(ts).toLocaleTimeString();
  } catch {
    return "";
  }
}

const styles: Record<string, React.CSSProperties> = {
  shell: {
    minHeight: "100vh",
    padding: 18,
    background: "linear-gradient(180deg, #0B0F1A 0%, #141A2E 100%)",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  card: {
    width: "min(520px, 100%)",
    borderRadius: 22,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.04)",
    padding: 16,
    display: "grid",
    gap: 12,
  },
  h1: { fontSize: 26, fontWeight: 900 },
  sub: { opacity: 0.8 },
  qrWrap: {
    display: "flex",
    justifyContent: "center",
    padding: 12,
    borderRadius: 18,
    background: "rgba(255,255,255,0.06)",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 12px",
    borderRadius: 16,
    background: "rgba(0,0,0,0.12)",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  code: { letterSpacing: 2, fontWeight: 900 },
  actions: { display: "flex", gap: 10, flexWrap: "wrap" },
  sectionTitle: { marginTop: 8, fontWeight: 900, opacity: 0.9 },
  historyRow: {
    display: "grid",
    gridTemplateColumns: "1fr auto auto",
    gap: 10,
    alignItems: "center",
    padding: "10px 12px",
    borderRadius: 16,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
  },
};
