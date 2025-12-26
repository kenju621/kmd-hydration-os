import { tokens } from "../tokens";

type Variant = "primary" | "ghost";

export function KmdButton({
  children,
  onClick,
  disabled,
  variant = "primary",
  style,
}: {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  variant?: Variant;
  style?: React.CSSProperties;
}) {
  const base: React.CSSProperties = {
    borderRadius: tokens.radius.pill,
    padding: "10px 12px",
    fontWeight: 900,
    letterSpacing: -0.2,
    border: tokens.border,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.55 : 1,
    transform: "translateY(0px)",
    transition: "transform 120ms ease, filter 120ms ease, background 120ms ease",
  };

  const skin: Record<Variant, React.CSSProperties> = {
    primary: {
      background: "linear-gradient(180deg, rgba(33,177,255,0.28), rgba(33,177,255,0.12))",
      filter: "drop-shadow(0 0 10px rgba(33,177,255,0.10))",
    },
    ghost: {
      background: "rgba(0,0,0,0.18)",
    },
  };

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{ ...base, ...skin[variant], ...style }}
      onMouseDown={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(1px)";
      }}
      onMouseUp={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0px)";
      }}
    >
      {children}
    </button>
  );
}
