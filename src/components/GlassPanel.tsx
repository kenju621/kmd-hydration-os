import type { PropsWithChildren } from "react";

export function GlassPanel({
  children,
  height = 480,
}: PropsWithChildren<{ height?: number }>) {
  return (
    <div style={{ ...styles.wrap, height }}>
      {children}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    position: "relative",
    width: "min(1100px, 100%)",
    maxHeight: "calc(100vh - 210px)",
    borderRadius: 22,
    overflow: "hidden",
    isolation: "isolate",
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
  },
};
