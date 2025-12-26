export function ProgressRing({
  value,
  label,
}: {
  value: number; // 0..1
  label: string;
}) {
  const size = 220;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, value));
  const dash = c * (1 - pct);

  return (
    <div style={{ display: "grid", placeItems: "center" }}>
      <svg width={size} height={size} style={{ overflow: "visible" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="rgba(33,177,255,0.9)"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={dash}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div style={{ marginTop: -140, textAlign: "center" }}>
        <div style={{ fontSize: 26, fontWeight: 800 }}>{Math.round(pct * 100)}%</div>
        <div style={{ opacity: 0.75 }}>{label}</div>
      </div>
    </div>
  );
}
