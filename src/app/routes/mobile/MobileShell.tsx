import { Routes, Route, Navigate, Link } from "react-router-dom";
import { Overview } from "./screens/Overview";
import { Insights } from "./screens/Insights";
import { HouseholdMobile } from "./screens/HouseholdMobile";

export function MobileShell() {
  return (
    <div style={styles.shell}>
      <div style={styles.header}>
        <Link to="/dispenser" style={styles.link}>← Dispenser</Link>
        <div style={{ fontWeight: 900 }}>Mobile Companion</div>
      </div>

      <div style={styles.nav}>
        <Link to="overview" style={styles.link}>Overview</Link>
        <Link to="insights" style={styles.link}>Insights</Link>
        <Link to="household" style={styles.link}>Household</Link>
      </div>

      <div style={styles.body}>
        <Routes>
          <Route path="/" element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<Overview />} />
          <Route path="insights" element={<Insights />} />
          <Route path="household" element={<HouseholdMobile />} />
        </Routes>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  shell: { height: "100%", background: "#0B0F1A", color: "white" },
  header: { display: "flex", justifyContent: "space-between", padding: 16, borderBottom: "1px solid rgba(255,255,255,0.08)" },
  nav: { display: "flex", gap: 12, padding: 12, borderBottom: "1px solid rgba(255,255,255,0.08)" },
  body: { padding: 16 },
  link: { color: "white", textDecoration: "none", opacity: 0.9 },
};
