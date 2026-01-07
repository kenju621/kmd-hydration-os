// src/app/routes/dispenser/screens/Pour.tsx
import type React from "react";
import { useHydration } from "../../../../core/state/useHydration";
import {
  PERFECT_WINDOW_ML,
  POUR_TARGET_ML,
} from "../../../../core/state/hydrationStore";

type PourProps = {
  onStop: () => void;
};

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export function Pour({ onStop }: PourProps) {
  const s = useHydration();

  const ml = s.currentPourMl;
  const pctOfTarget = clamp((ml / POUR_TARGET_ML) * 100, 0, 140); // allow a bit of overshoot
  const inPerfectWindow =
    ml >= PERFECT_WINDOW_ML.min && ml <= PERFECT_WINDOW_ML.max;

  const perfectMinPct = clamp(
    (PERFECT_WINDOW_ML.min / POUR_TARGET_ML) * 100,
    0,
    120
  );
  const perfectMaxPct = clamp(
    (PERFECT_WINDOW_ML.max / POUR_TARGET_ML) * 100,
    0,
    140
  );

  const fillHeight = `${pctOfTarget}%`;
  const targetLineTop = `${100 - (POUR_TARGET_ML / (POUR_TARGET_ML * 1.4)) * 100}%`;

  return (
    <div style={styles.wrap}>
      <div style={styles.leftColumn}>
        <div style={styles.headingRow}>
          <div style={styles.title}>Pouring</div>
          <div style={styles.subTitle}>Hold to fill, tap stop to lock in</div>
        </div>

        <div style={styles.metricsRow}>
          <div style={styles.metric}>
            <div style={styles.metricLabel}>Current fill</div>
            <div style={styles.metricValue}>{Math.round(ml)} ml</div>
          </div>
          <div style={styles.metric}>
            <div style={styles.metricLabel}>Target</div>
            <div style={styles.metricValue}>{POUR_TARGET_ML} ml</div>
            <div style={styles.metricHint}>
              Perfect window: {PERFECT_WINDOW_ML.min}–{PERFECT_WINDOW_ML.max} ml
            </div>
          </div>
          <div style={styles.metric}>
            <div style={styles.metricLabel}>Status</div>
            <div
              style={{
                ...styles.statusPill,
                ...(inPerfectWindow
                  ? styles.statusPillGood
                  : styles.statusPillSoft),
              }}
            >
              {inPerfectWindow ? "In the sweet spot" : "Adjust your pour"}
            </div>
          </div>
        </div>

        <div style={styles.tipBox}>
          <div style={styles.tipTitle}>Tip</div>
          <div style={styles.tipBody}>
            Lock in when the water line kisses the bright target bar. The closer
            you are to {POUR_TARGET_ML} ml, the more points you earn in Perfect
            Pour.
          </div>
        </div>

        <div style={styles.actionsRow}>
          <button style={styles.stopButton} onClick={onStop}>
            Stop pour
          </button>
        </div>
      </div>

      <div style={styles.glassColumn}>
        <div style={styles.glassShell}>
          {/* glass outline */}
          <div style={styles.glassBorder} />

          {/* target bar */}
          <div style={{ ...styles.targetLine, top: targetLineTop }} />

          {/* perfect window band (transparent highlight) */}
          <div
            style={{
              ...styles.perfectBand,
              top: `${100 - perfectMaxPct}%`,
              height: `${perfectMaxPct - perfectMinPct}%`,
            }}
          />

          {/* fill */}
          <div
            style={{
              ...styles.fill,
              height: fillHeight,
            }}
          >
            <div style={styles.fillSparkle} />
          </div>
        </div>

        <div style={styles.glassLabelRow}>
          <span style={styles.glassLabel}>Live fill</span>
          <span style={styles.glassLabelValue}>
            {Math.round(pctOfTarget)}% of target
          </span>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)",
    gap: 28,
    width: "min(1120px, 100%)",
    padding: 18,
    borderRadius: 22,
    background:
      "radial-gradient(circle at 10% 0%, rgba(40,160,255,0.24), transparent 55%), radial-gradient(circle at 90% 100%, rgba(32,122,255,0.16), transparent 55%), rgba(8,12,26,0.94)",
    border: "1px solid rgba(255,255,255,0.10)",
    boxShadow: "0 18px 45px rgba(0,0,0,0.45)",
  },

  leftColumn: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },

  headingRow: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: 800,
    letterSpacing: -0.4,
  },
  subTitle: {
    fontSize: 13,
    opacity: 0.78,
  },

  metricsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 14,
  },
  metric: {
    padding: 12,
    borderRadius: 16,
    background: "rgba(0,0,0,0.35)",
    border: "1px solid rgba(255,255,255,0.06)",
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  metricLabel: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.14,
    opacity: 0.72,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 700,
  },
  metricHint: {
    fontSize: 11,
    opacity: 0.7,
    marginTop: 2,
  },

  statusPill: {
    marginTop: 4,
    alignSelf: "flex-start",
    padding: "4px 9px",
    borderRadius: 999,
    fontSize: 11,
    border: "1px solid rgba(255,255,255,0.2)",
  },
  statusPillGood: {
    background:
      "linear-gradient(90deg, rgba(41,205,143,0.2), rgba(15,158,96,0.4))",
    borderColor: "rgba(80,255,190,0.9)",
  },
  statusPillSoft: {
    background: "rgba(255,255,255,0.04)",
    borderColor: "rgba(255,255,255,0.14)",
  },

  tipBox: {
    marginTop: 4,
    padding: 12,
    borderRadius: 14,
    background: "rgba(11, 26, 46, 0.8)",
    border: "1px dashed rgba(88,180,255,0.55)",
    fontSize: 12,
    lineHeight: 1.4,
  },
  tipTitle: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.15,
    opacity: 0.8,
    marginBottom: 2,
  },
  tipBody: {
    opacity: 0.96,
  },

  actionsRow: {
    marginTop: 8,
    display: "flex",
    gap: 10,
  },
  stopButton: {
    padding: "10px 18px",
    borderRadius: 999,
    border: "none",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    background: "linear-gradient(135deg, #FF4B6E, #FF9068)",
    color: "#ffffff",
    boxShadow: "0 8px 22px rgba(0,0,0,0.4)",
  },

  glassColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  glassShell: {
    position: "relative",
    width: 120,
    height: 260,
    borderRadius: 60,
    overflow: "hidden",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.02))",
    boxShadow: "0 16px 40px rgba(0,0,0,0.75)",
  },
  glassBorder: {
    position: "absolute",
    inset: 0,
    borderRadius: 60,
    border: "2px solid rgba(255,255,255,0.26)",
    boxShadow:
      "0 0 0 1px rgba(0,0,0,0.7) inset, 0 0 35px rgba(64,180,255,0.6)",
    pointerEvents: "none",
  },
  targetLine: {
    position: "absolute",
    left: 10,
    right: 10,
    height: 2,
    borderRadius: 999,
    background:
      "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.95), rgba(255,255,255,0))",
    boxShadow: "0 0 10px rgba(255,255,255,0.9)",
    pointerEvents: "none",
  },
  perfectBand: {
    position: "absolute",
    left: 8,
    right: 8,
    borderRadius: 999,
    background:
      "linear-gradient(180deg, rgba(64,180,255,0.32), rgba(29,112,190,0.0))",
    opacity: 0.55,
    pointerEvents: "none",
  },
  fill: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "linear-gradient(180deg, #38bdf8, #0ea5e9, #0369a1)",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    overflow: "hidden",
  },
  fillSparkle: {
    marginTop: 4,
    width: "70%",
    height: 12,
    borderRadius: 999,
    background:
      "linear-gradient(90deg, rgba(255,255,255,0.6), rgba(255,255,255,0.05))",
    filter: "blur(1px)",
    opacity: 0.9,
  },

  glassLabelRow: {
    display: "flex",
    justifyContent: "space-between",
    width: 140,
    fontSize: 11,
    opacity: 0.85,
  },
  glassLabel: {
    opacity: 0.8,
  },
  glassLabelValue: {
    fontWeight: 600,
  },
};
