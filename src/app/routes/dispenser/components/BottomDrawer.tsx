import { useMemo, useState } from "react";

type BottomDrawerProps = {
  summaryLeft: string;
  summaryRight?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  maxHeight?: number; // px
};

export function BottomDrawer({
  summaryLeft,
  summaryRight,
  children,
  defaultOpen = false,
  maxHeight = 320,
}: BottomDrawerProps) {
  const [open, setOpen] = useState(defaultOpen);

  const panelStyle = useMemo<React.CSSProperties>(() => {
    return {
      ...styles.panel,
      maxHeight,
      transform: open ? "translateY(0)" : "translateY(calc(100% - 64px))",
    };
  }, [open, maxHeight]);

  return (
    <div style={styles.wrap}>
      <div style={panelStyle} aria-expanded={open}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          style={styles.handleBtn}
          aria-label={open ? "Collapse details" : "Expand details"}
        >
          <div style={styles.handleRow}>
            <div style={styles.handlePill} />
          </div>

          <div style={styles.summaryRow}>
            <div style={styles.summaryLeft}>{summaryLeft}</div>
            <div style={styles.summaryRight}>
              {summaryRight ?? (open ? "Hide ▾" : "Details ▴")}
            </div>
          </div>
        </button>

        <div style={styles.body}>{children}</div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 20,
    pointerEvents: "none", // important: only panel receives events
  },

  panel: {
    pointerEvents: "auto",
    margin: 14,
    borderRadius: 22,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(10, 14, 26, 0.55)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    boxShadow: "0 18px 40px rgba(0,0,0,0.35)",
    overflow: "hidden",

    transition: "transform 240ms ease",
    willChange: "transform",
  },

  handleBtn: {
    width: "100%",
    border: "none",
    background: "transparent",
    color: "white",
    padding: 0,
    cursor: "pointer",
    textAlign: "left",
  },

  handleRow: {
    display: "flex",
    justifyContent: "center",
    paddingTop: 10,
    paddingBottom: 6,
  },

  handlePill: {
    width: 52,
    height: 5,
    borderRadius: 999,
    background: "rgba(255,255,255,0.22)",
  },

  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    padding: "10px 14px 12px 14px",
    borderTop: "1px solid rgba(255,255,255,0.06)",
  },

  summaryLeft: {
    fontWeight: 900,
    letterSpacing: -0.2,
    opacity: 0.95,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  summaryRight: {
    fontWeight: 900,
    opacity: 0.8,
    whiteSpace: "nowrap",
  },

  body: {
    padding: "0 14px 14px 14px",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    maxHeight: 260,
    overflowY: "auto",
  },
};
