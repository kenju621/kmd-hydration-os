// src/app/routes/dispenser/DispenserScreen.tsx
import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useHydration } from "../../../core/state/useHydration";
import {
  addPourMl,
  bumpHouseholdGlasses,
  setMode,
  startPour,
  stopPour,
} from "../../../core/state/hydrationStore";

import { Idle } from "./screens/Idle";
import { Pour } from "./screens/Pour";
import { PostPour } from "./screens/PostPour";
import { GamePerfectPour } from "./screens/GamePerfectPour";
import { Household } from "./screens/Household";
import { ToastHost } from "../../../ui/toast/ToastHost";

export function DispenserScreen() {
  const s = useHydration();

  // Demo: auto-fill while pouring (replace with real sensor events later)
  useEffect(() => {
    if (s.mode !== "POURING") return;
    const t = setInterval(() => addPourMl(18), 120);
    return () => clearInterval(t);
  }, [s.mode]);

  return (
    <div style={styles.shell}>
      {/* Top status bar */}
      <div style={styles.topBar}>
        <div style={{ fontWeight: 800, letterSpacing: -0.3 }}>
          KMD Hydration OS
        </div>
        <div style={{ opacity: 0.8, display: "flex", gap: 10, fontSize: 12 }}>
          <span>Filter {s.filterPercent}%</span>
          <span>{s.wifiConnected ? "Wi-Fi ✓" : "Wi-Fi ✕"}</span>
          <span>{s.iceEnabled ? "Ice ✓" : "Ice ✕"}</span>
          <span style={{ opacity: 0.7 }}>
            {s.glassesToday}/{s.goalGlasses} glasses
          </span>
        </div>
      </div>

      {/* Main stage */}
      <div style={styles.stage}>
        <AnimatePresence mode="wait">
          {s.mode === "IDLE" && (
            <motion.div key="idle" {...anim}>
              <Idle onTap={() => startPour()} />
            </motion.div>
          )}

          {s.mode === "POURING" && (
            <motion.div key="pour" {...anim}>
              <Pour
                onStop={() => {
                  stopPour();
                  bumpHouseholdGlasses();
                }}
              />
            </motion.div>
          )}

          {s.mode === "POST_POUR" && (
            <motion.div key="post" {...anim}>
              <PostPour
                onGame={() => setMode("GAME")}
                onSkip={() => setMode("IDLE")}
                onHousehold={() => setMode("HOUSEHOLD")}
              />
            </motion.div>
          )}

          {s.mode === "GAME" && (
            <motion.div key="game" {...anim}>
              <GamePerfectPour onDone={() => setMode("IDLE")} />
            </motion.div>
          )}

          {s.mode === "HOUSEHOLD" && (
            <motion.div key="house" {...anim}>
              <Household onBack={() => setMode("IDLE")} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer controls */}
      <div style={styles.footer}>
        <button onClick={() => setMode("IDLE")}>Idle</button>
        <button onClick={() => startPour()}>Start Pour</button>
        <button onClick={() => setMode("HOUSEHOLD")}>Household</button>
        <button onClick={() => setMode("GAME")}>Game</button>
        <a href="/dispenser?view=mobile" style={{ textDecoration: "none" }}>
          <button>Mobile</button>
        </a>
      </div>

      <ToastHost />
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
    background: "linear-gradient(180deg, #020617 0%, #020617 45%, #020617 100%)",
    color: "white",
    display: "flex",
    flexDirection: "column",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, system-ui, -system-ui, sans-serif",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "14px 18px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    fontSize: 13,
  },
  stage: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    paddingBottom: 28,
    position: "relative",
    zIndex: 1,
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
