// src/app/routes/care/components/ProgressRing.tsx

type ProgressRingProps = {
  size?: number;
  stroke?: number;
  value: number; // 0–100
  label?: string;
};

export function ProgressRing({ size = 120, stroke = 8, value, label }: ProgressRingProps) {
  const pct = Math.max(0, Math.min(100, value));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          stroke="rgba(255,255,255,0.16)"
          fill="transparent"
          strokeWidth={stroke}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke="url(#careGradient)"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
        <defs>
          <linearGradient id="careGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#21b1ff" />
            <stop offset="100%" stopColor="#7cf4ff" />
          </linearGradient>
        </defs>
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 2,
          fontSize: 14,
        }}
      >
        <div style={{ fontWeight: 900 }}>{pct}%</div>
        {label && (
          <div style={{ fontSize: 11, opacity: 0.8, textAlign: "center", maxWidth: 90 }}>
            {label}
          </div>
        )}
      </div>
    </div>
  );
}
