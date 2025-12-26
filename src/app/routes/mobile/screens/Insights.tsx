import { Card } from "../../../../components/Card";

export function Insights() {
  return (
    <div style={{ display: "grid", gap: 14, maxWidth: 520 }}>
      <Card>
        <div style={{ fontSize: 22, fontWeight: 900 }}>Insights</div>
        <div style={{ marginTop: 10, opacity: 0.8 }}>
          You hydrate most consistently between <b>9–11am</b>.
        </div>
        <div style={{ marginTop: 10, opacity: 0.75 }}>
          Try one glass mid-PM to avoid the afternoon dip.
        </div>
      </Card>
    </div>
  );
}
