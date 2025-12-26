import { tokens } from "../tokens";

export function KmdCard({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        borderRadius: tokens.radius.md,
        border: tokens.border,
        background: tokens.glass,
        padding: tokens.space.md,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
