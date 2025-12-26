import { useEffect, useMemo, useRef, useState } from "react";

export function GamePerfectPour({ onDone }: { onDone: () => void }) {
  const TARGET = 450;
  const RANGE = 120;
  const MAX = TARGET + RANGE;

  const [status, setStatus] = useState<"READY" | "RUNNING" | "RESULT">("READY");
  const [ml, setMl] = useState(0);
  const [result, setResult] = useState<{ score: number; msg: string } | null>(null);

  const rafRef = useRef<number | null>(null);
  const runningRef = useRef(false);

  const pct = useMemo(() => {
    const clamped = Math.max(0, Math.min(MAX, ml));
    return (clamped / MAX) * 100;
  }, [ml, MAX]);

  const accuracy = useMemo(() => {
    const diff = Math.abs(ml - TARGET);
    const raw = 1 - Math.min(1, diff / RANGE);
    return Math.round(raw * 100);
  }, [ml, TARGET, RANGE]);

  function stopLoop() {
    runningRef.current = false;
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }

  useEffect(() => {
    // ✅ prevent runaway RAF when switching screens/hot reload
    return () => stopLoop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startDemo() {
    stopLoop();
    setResult(null);
    setMl(0);
    setStatus("RUNNING");
    runningRef.current = true;

    let v = 0;
    let dir: 1 | -1 = 1;
    const speed = 6;

    const tick = () => {
      if (!runningRef.current) return;

      v += speed * dir;

      if (v > MAX) {
        v = MAX;
        dir = -1;
      }
      if (v < 0) {
        v = 0;
        dir = 1;
      }

      setMl(Math.round(v));
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }

  function lockIn() {
    if (status !== "RUNNING") return;

    stopLoop();
    setStatus("RESULT");

    const diff = Math.abs(ml - TARGET);
    const score = accuracy;

    let msg = "Nice pour.";
    if (diff <= 10) msg = "Perfect pour! 🔥";
    else if (diff <= 25) msg = "Great control.";
    else if (diff <= 45) msg = "Close—try again.";
    else msg = "Too far—dial it in.";

    setResult({ score, msg });
  }

  function reset() {
    stopLoop();
    setStatus("READY");
    setMl(0);
    setResult(null);
  }

  return (
    <div style={styles.shell}>
      <div style={styles.bg} />

      <div style={styles.header}>
        <div>
          <div style={styles.title}>Perfect Pour</div>
          <div style={styles.sub}>Start demo, then tap “Lock In” near the target line.</div>
        </div>

        <div style={styles.headerActions}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDone();
            }}
          >
            Back
          </button>
        </div>
      </div>

      <div style={styles.body}>
        <div style={styles.summaryRow}>
          <div style={styles.summaryCard}>
            <div style={styles.kpiLabel}>Target</div>
            <div style={styles.kpiValue}>
              {TARGET} <span style={styles.kpiUnit}>ml</span>
            </div>
            <div style={styles.kpiHint}>± {RANGE} ml</div>
          </div>

          <div style={styles.summaryCard}>
            <div style={styles.kpiLabel}>Current</div>
            <div style={styles.kpiValue}>
              {ml} <span style={styles.kpiUnit}>ml</span>
            </div>
            <div style={styles.kpiHint}>Accuracy {accuracy}%</div>
          </div>
        </div>

        <div style={styles.playArea}>
          {/* LEFT: cup */}
          <div style={styles.cup}>
            <div style={{ ...styles.fill, height: `${pct}%` }} />
            <div style={{ ...styles.targetBand, bottom: `${(TARGET / MAX) * 100}%` }} />
            <div style={{ ...styles.targetLine, bottom: `${(TARGET / MAX) * 100}%` }} />
          </div>

          {/* RIGHT: info + controls (moved under tip) */}
          <div style={styles.legend}>
            <div style={styles.legendRow}>
              <span style={styles.dotA} /> Target
            </div>
            <div style={styles.legendRow}>
              <span style={styles.dotB} /> Fill
            </div>

            <div style={styles.tip}>Tip: lock in when the fill kisses the bright line.</div>

            {/* ✅ buttons now live under the tip */}
            <div style={styles.controlsColumn}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startDemo();
                }}
                disabled={status === "RUNNING"}
                style={styles.ctrlBtn}
              >
                Start Demo
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  lockIn();
                }}
                disabled={status !== "RUNNING"}
                style={styles.ctrlBtn}
              >
                Lock In
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  reset();
                }}
                style={styles.ctrlBtn}
              >
                Reset
              </button>
            </div>

            {/* ✅ result stays with controls so it’s always visible */}
            <div style={styles.resultCard}>
              {result ? (
                <>
                  <div style={styles.resultMsg}>{result.msg}</div>
                  <div style={styles.resultMeta}>Score: {result.score}/100</div>
                </>
              ) : (
                <div style={{ opacity: 0.82 }}>
                  Tap <b>Start Demo</b>, then <b>Lock In</b> at the target line.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  shell: {
    position: "relative",
    width: "min(820px, 100%)",
    height: "100%",
    margin: "0 auto",
    borderRadius: 20,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.02)",
    color: "white",
    display: "flex",
    flexDirection: "column",
    minHeight: 0,
  },

  bg: {
    position: "absolute",
    inset: 0,
    zIndex: 0,
    background:
      "radial-gradient(circle at 25% 25%, rgba(33,177,255,0.18), transparent 55%), radial-gradient(circle at 70% 75%, rgba(33,177,255,0.10), transparent 55%), linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.00))",
  },

  header: {
    position: "relative",
    zIndex: 2,
    padding: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(0,0,0,0.06)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
  },

  headerActions: { display: "flex", gap: 10 },

  title: { fontSize: 22, fontWeight: 900, letterSpacing: -0.6 },
  sub: { fontSize: 12, opacity: 0.75, marginTop: 2 },

  body: {
    position: "relative",
    zIndex: 2,
    flex: 1,
    minHeight: 0,
    overflowY: "auto",
    padding: 12,
    paddingBottom: 12,
    display: "grid",
    gap: 10,
  },

  summaryRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
  },

  summaryCard: {
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.14)",
    padding: 8,
    display: "grid",
    gap: 2,
  },

  kpiLabel: { fontSize: 11, opacity: 0.75, fontWeight: 900 },
  kpiValue: { fontSize: 16, fontWeight: 900, letterSpacing: -0.3 },
  kpiUnit: { fontSize: 11, opacity: 0.75, fontWeight: 900, marginLeft: 6 },
  kpiHint: { fontSize: 11, opacity: 0.72 },

  playArea: {
    display: "grid",
    gridTemplateColumns: "150px 1fr",
    gap: 12,
    alignItems: "start",
    minHeight: 150,
  },

  cup: {
    position: "relative",
    height: 190,
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(0,0,0,0.12)",
    overflow: "hidden",
  },

  fill: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(180deg, rgba(33,177,255,0.22), rgba(33,177,255,0.65))",
  },

  targetBand: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 22,
    transform: "translateY(-50%)",
    background: "rgba(255,255,255,0.06)",
    borderTop: "1px solid rgba(255,255,255,0.10)",
    borderBottom: "1px solid rgba(255,255,255,0.10)",
  },

  targetLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 2,
    transform: "translateY(-50%)",
    background: "rgba(255,255,255,0.85)",
    boxShadow: "0 0 14px rgba(255,255,255,0.25)",
  },

  legend: {
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.04)",
    padding: 10,
    display: "grid",
    gap: 8,
  },

  legendRow: { display: "flex", alignItems: "center", gap: 10, fontWeight: 800, opacity: 0.9 },
  dotA: { width: 10, height: 10, borderRadius: 999, background: "rgba(255,255,255,0.85)" },
  dotB: { width: 10, height: 10, borderRadius: 999, background: "rgba(33,177,255,0.65)" },

  tip: { marginTop: 2, opacity: 0.75, fontSize: 11, lineHeight: 1.35 },

  controlsColumn: {
    display: "grid",
    gap: 8,
    marginTop: 4,
  },

  ctrlBtn: {
    width: "100%",
  },

  resultCard: {
    marginTop: 2,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.12)",
    padding: 10,
    display: "grid",
    gap: 4,
  },
  resultMsg: { fontWeight: 900, fontSize: 14 },
  resultMeta: { opacity: 0.75, fontWeight: 800, fontSize: 11 },
};
