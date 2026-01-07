// src/app/routes/care/screens/History.tsx
import type React from "react";
import { useHydration } from "../../../../core/state/useHydration";
import { CareCard } from "../components/CareCard";

export function History() {
  const s = useHydration();
  const history = s.pourHistory ?? [];

  return (
    <div style={styles.wrap}>
      <CareCard
        title="Care & usage history"
        subtitle="Recent hydration events from this device."
      >
        {history.length === 0 ? (
          <div style={styles.empty}>History will appear here after a few pours.</div>
        ) : (
          <div style={styles.list}>
            {history.slice(0, 12).map((item) => (
              <div key={item.id} style={styles.row}>
                <div style={styles.rowLeft}>
                  <div style={styles.rowTitle}>
                    {item.note ?? "Pour recorded"}
                  </div>
                  <div style={styles.rowMeta}>
                    {formatTime(item.ts)} • {Math.round(item.ml)} ml •{" "}
                    {item.pointsEarned} pts
                    {item.source ? ` • via ${item.source}` : ""}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CareCard>
    </div>
  );
}

function formatTime(ts: number) {
  try {
    const d = new Date(ts);
    return d.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "Recently";
  }
}

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    width: "100%",
    maxWidth: 900,
  },
  empty: {
    fontSize: 13,
    opacity: 0.85,
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    marginTop: 4,
    maxHeight: 360,
    overflowY: "auto",
  },
  row: {
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(0,0,0,0.35)",
    padding: 8,
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
    fontSize: 12,
  },
  rowLeft: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  rowTitle: {
    fontWeight: 600,
  },
  rowMeta: {
    opacity: 0.8,
  },
};
