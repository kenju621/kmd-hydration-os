import { useEffect, useState } from "react";
import { toastSubscribe, type ToastItem } from "./toastStore";

export function ToastHost() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    return toastSubscribe((s) => setToasts(s.toasts));
  }, []);

  return (
    <div style={styles.wrap} aria-live="polite" aria-relevant="additions">
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            ...styles.toast,
            ...(t.kind === "success" ? styles.success : styles.info),
          }}
        >
          <div style={{ fontWeight: 900 }}>{t.title}</div>
          {t.detail ? <div style={styles.detail}>{t.detail}</div> : null}
        </div>
      ))}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    position: "absolute",
    right: 14,
    top: 14,
    zIndex: 50,
    display: "grid",
    gap: 10,
    pointerEvents: "none",
  },
  toast: {
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(0,0,0,0.35)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    padding: "10px 12px",
    minWidth: 220,
    color: "white",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
  },
  success: { outline: "1px solid rgba(33,177,255,0.22)" },
  info: { outline: "1px solid rgba(255,255,255,0.10)" },
  detail: { opacity: 0.8, fontSize: 12, marginTop: 2 },
};
