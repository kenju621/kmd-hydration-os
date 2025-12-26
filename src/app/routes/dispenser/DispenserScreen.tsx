import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useHydration } from "../../../core/state/useHydration";
import { addPourMl, bumpHouseholdGlasses, setMode, startPour, stopPour } from "../../../core/state/hydrationStore";

import { ToastHost } from "../../../ui/toast/ToastHost";

import { Idle } from "./screens/Idle";
import { Pour } from "./screens/Pour";
import { PostPour } from "./screens/PostPour";
import { GamePerfectPour } from "./screens/GamePerfectPour";
import { Household } from "./screens/Household";

export function DispenserScreen() {
  const s = useHydration();

  // Demo: auto-fill while pouring (replace with real sensor events later)
  useEffect(() => {
    if (s.mode !== "POURING") return;

    // ✅ Slower + smoother so it feels like real water
    const t = window.setInterval(() => addPourMl(10), 140);

    return () => window.clearInterval(t);
  }, [s.mode]);

  return (
    <div style={styles.shell}>
      <div style={styles.topBar}>
        <div style={{ fontWeight: 800, letterSpacing: -0.3 }}>KMD Hydration OS</div>
        <div style={{ opacity: 0.85, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <span>Filter {s.filterPercent}%</span>
          <span>{s.wifiConnected ? "Wi-Fi ✓" : "Wi-Fi ✕"}</span>
          <span>{s.iceEnabled ? "Ice ✓" : "Ice ✕"}</span>
        </div>
      </div>

      <div style={styles.stage}>
        <ToastHost />

        <AnimatePresence mode="wait">
          {s.mode === "IDLE" && (
            <motion.div key="idle" {...anim} style={styles.stageInner}>
              <Idle onTap={() => startPour()} />
            </motion.div>
          )}

          {s.mode === "POURING" && (
            <motion.div key="pour" {...anim} style={styles.stageInner}>
              <Pour
                onStop={() => {
                  stopPour();
                  bumpHouseholdGlasses();
                }}
              />
            </motion.div>
          )}

          {s.mode === "POST_POUR" && (
            <motion.div key="post" {...anim} style={styles.stageInner}>
              <PostPour
                onGame={() => setMode("GAME")}
                onSkip={() => setMode("IDLE")}
                onHousehold={() => setMode("HOUSEHOLD")}
              />
            </motion.div>
          )}

          {s.mode === "GAME" && (
            <motion.div key="game" {...anim} style={styles.stageInner}>
              <GamePerfectPour onDone={() => setMode("IDLE")} />
            </motion.div>
          )}

          {s.mode === "HOUSEHOLD" && (
            <motion.div key="house" {...anim} style={styles.stageInner}>
              <Household onBack={() => setMode("IDLE")} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={styles.footer}>
        <button onClick={() => setMode("IDLE")}>Idle</button>
        <button onClick={() => startPour()}>Start Pour</button>
        <button onClick={() => setMode("HOUSEHOLD")}>Household</button>
        <button onClick={() => setMode("GAME")}>Game</button>
        <a href="/mobile" style={{ textDecoration: "none" }}>
          <button>Mobile</button>
        </a>
      </div>
    </div>
  );
}

const anim = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.18 },
};

const styles: Record<string, React.CSSProperties> = {
  shell: {
    height: "100%",
    minHeight: 0,
    background: "linear-gradient(180deg, #0B0F1A 0%, #141A2E 100%)",
    color: "white",
    display: "flex",
    flexDirection: "column",
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "14px 18px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },

  stage: {
    flex: 1,
    minHeight: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    position: "relative",
    zIndex: 1,
  },

  stageInner: {
    width: "100%",
    height: "100%",
    minHeight: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  footer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    padding: 14,
    minHeight: 64,
    borderTop: "1px solid rgba(255,255,255,0.08)",
    position: "relative",
    zIndex: 2,
    background: "rgba(0,0,0,0.25)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
  },
};
