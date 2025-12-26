import { useHydration } from "../../../../core/state/useHydration";
import { Card } from "../../../../components/Card";

export function HouseholdMobile() {
  const s = useHydration();

  return (
    <div style={{ display: "grid", gap: 14, maxWidth: 520 }}>
      <Card>
        <div style={{ fontSize: 22, fontWeight: 900 }}>Household</div>
        <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
          {s.household.map((m) => (
            <div key={m.name} style={{ display: "flex", justifyContent: "space-between", padding: 10, borderRadius: 14, background: "rgba(255,255,255,0.04)" }}>
              <div style={{ fontWeight: 800 }}>{m.name}</div>
              <div style={{ opacity: 0.85 }}>{m.glasses}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
