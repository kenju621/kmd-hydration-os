import { useHydration } from "../../../../core/state/useHydration";
import { Card } from "../../../../components/Card";
import { ProgressRing } from "../../../../components/ProgressRing";

export function Overview() {
  const s = useHydration();
  const pct = s.goalMl ? Math.min(1, s.todayMl / s.goalMl) : 0;

  return (
    <div style={{ display: "grid", gap: 14, maxWidth: 520 }}>
      <Card>
        <div style={{ fontSize: 22, fontWeight: 900 }}>Today</div>
        <div style={{ marginTop: 10 }}>
          <ProgressRing value={pct} label="hydrated" />
        </div>
        <div style={{ marginTop: 10, opacity: 0.8 }}>
          Streak: {s.streakDays} days 🔥
        </div>
      </Card>
    </div>
  );
}
