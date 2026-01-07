// src/app/routes/care/components/CareCard.tsx
import type React from "react";

type CareCardProps = {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  emphasis?: "normal" | "soft";
};

export function CareCard({ title, subtitle, children, emphasis = "normal" }: CareCardProps) {
  const style: React.CSSProperties =
    emphasis === "soft" ? styles.softCard : styles.card;

  return (
    <section style={style}>
      <header style={styles.header}>
        <div style={styles.title}>{title}</div>
        {subtitle && <div style={styles.subtitle}>{subtitle}</div>}
      </header>
      {children && <div style={styles.body}>{children}</div>}
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.10)",
    background:
      "radial-gradient(circle at 0% 0%, rgba(33,177,255,0.22), transparent 55%), rgba(0,0,0,0.45)",
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    minHeight: 0,
  },
  softCard: {
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.07)",
    background: "rgba(0,0,0,0.32)",
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    minHeight: 0,
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: 900,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12,
    opacity: 0.78,
  },
  body: {
    marginTop: 6,
    fontSize: 13,
    opacity: 0.96,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
};
