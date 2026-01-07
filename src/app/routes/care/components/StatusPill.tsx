// src/app/routes/care/components/StatusPill.tsx

type StatusPillProps = {
  tone: "ok" | "warn" | "info" | "offline";
  label: string;
};

export function StatusPill({ tone, label }: StatusPillProps) {
  const base: React.CSSProperties = {
    borderRadius: 999,
    fontSize: 11,
    padding: "4px 8px",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    border: "1px solid transparent",
  };

  const toneStyles: Record<string, React.CSSProperties> = {
    ok: {
      background: "rgba(46, 213, 115, 0.18)",
      borderColor: "rgba(46, 213, 115, 0.55)",
      color: "rgba(210,255,220,0.96)",
    },
    warn: {
      background: "rgba(255, 179, 71, 0.12)",
      borderColor: "rgba(255, 179, 71, 0.7)",
      color: "rgba(255,240,210,0.96)",
    },
    info: {
      background: "rgba(33, 177, 255, 0.14)",
      borderColor: "rgba(33, 177, 255, 0.7)",
      color: "rgba(215,237,255,0.96)",
    },
    offline: {
      background: "rgba(128,128,128,0.14)",
      borderColor: "rgba(180,180,180,0.6)",
      color: "rgba(230,230,230,0.95)",
    },
  };

  return (
    <span style={{ ...base, ...toneStyles[tone] }}>
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: 999,
          background:
            tone === "ok"
              ? "#2ed573"
              : tone === "warn"
              ? "#ffb347"
              : tone === "offline"
              ? "#aaaaaa"
              : "#21b1ff",
        }}
      />
      {label}
    </span>
  );
}
