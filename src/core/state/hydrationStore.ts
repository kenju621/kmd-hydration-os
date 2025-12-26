// src/core/state/hydrationStore.ts
import { defaultDailyQuests, type Quest } from "./quests";
import { toastPush } from "../../ui/toast/toastStore";

export type Mode = "IDLE" | "POURING" | "POST_POUR" | "GAME" | "HOUSEHOLD";

export type PourHistoryItem = {
  id: string;
  ts: number;
  ml: number;
  pointsEarned: number;
  note?: string;
  // optional, used by some mobile views for labeling (e.g., "dispenser", "mobile")
  source?: string;
};

export type HouseholdMember = {
  id: string;
  name: string;
  glassesToday: number;
  pointsToday: number;
  streakDays: number;
};

export type HydrationState = {
  // core UI state
  mode: Mode;

  // dispenser status
  filterPercent: number;
  wifiConnected: boolean;
  iceEnabled: boolean;
  tempPreset: "COLD" | "COOL" | "ROOM" | "HOT";

  // pouring / totals
  todayMl: number;
  currentPourMl: number;

  // gamification
  goalGlasses: number; // e.g. 8
  glassesToday: number;

  pointsToday: number;
  pointsTotal: number;

  // quests
  dailyQuests: Quest[];

  // household
  householdMembers: HouseholdMember[];

  // history
  pourHistory: PourHistoryItem[];

  // mobile pairing
  pairingCode: string;
  paired: boolean;
};

type Listener = () => void;

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function makeId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function makePairingCode() {
  const a = Math.random().toString(16).slice(2, 6).toUpperCase();
  const b = Math.random().toString(16).slice(2, 6).toUpperCase();
  return `${a}-${b}`;
}

function isPerfectPour(ml: number, target: number, window: number) {
  return Math.abs(ml - target) <= window;
}

// Shared constants (used by Pour UI + scoring)
export const POUR_TARGET_ML = 340;
export const PERFECT_WINDOW_ML = 18;

// ---- Minimal Store (no zustand dependency) ----
export const store = (() => {
  let state: HydrationState = {
    mode: "IDLE",

    filterPercent: 92,
    wifiConnected: true,
    iceEnabled: true,
    tempPreset: "COLD",

    todayMl: 0,
    currentPourMl: 0,

    goalGlasses: 8,
    glassesToday: 0,

    pointsToday: 0,
    pointsTotal: 0,

    dailyQuests: defaultDailyQuests(),

    householdMembers: [
      { id: "you", name: "You", glassesToday: 0, pointsToday: 0, streakDays: 3 },
      { id: "a", name: "Alice", glassesToday: 2, pointsToday: 6, streakDays: 5 },
      { id: "m", name: "Miles", glassesToday: 1, pointsToday: 3, streakDays: 2 },
      { id: "g", name: "Guest", glassesToday: 0, pointsToday: 0, streakDays: 0 },
    ],

    pourHistory: [],

    pairingCode: makePairingCode(),
    paired: false,
  };

  const listeners = new Set<Listener>();

  return {
    getState() {
      return state;
    },
    setState(
      patch: Partial<HydrationState> | ((prev: HydrationState) => Partial<HydrationState>)
    ) {
      const nextPatch = typeof patch === "function" ? patch(state) : patch;
      state = { ...state, ...nextPatch };
      listeners.forEach((l) => l());
    },
    subscribe(listener: Listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
})();

// ---------- Read helpers ----------
export function getLivePourSnapshot() {
  const s = store.getState();
  return {
    ml: s.currentPourMl,
    pct: s.currentPourMl > 0 ? Math.round((s.currentPourMl / POUR_TARGET_ML) * 100) : 0,
  };
}

// ---------- Actions ----------
export function setMode(mode: Mode) {
  store.setState({ mode });
}

export function setIceEnabled(v: boolean) {
  store.setState({ iceEnabled: v });
}

export function setWifiConnected(v: boolean) {
  store.setState({ wifiConnected: v });
}

export function setFilterPercent(v: number) {
  store.setState({ filterPercent: clamp(v, 0, 100) });
}

export function setTempPreset(p: HydrationState["tempPreset"]) {
  store.setState({ tempPreset: p });
}

export function regeneratePairingCode() {
  store.setState({ pairingCode: makePairingCode(), paired: false });
}

export function setPaired(v: boolean) {
  store.setState({ paired: v });
  toastPush({
    kind: "info",
    title: v ? "Mobile paired ✓" : "Mobile unpaired",
    detail: v ? "Companion connected." : "Scan QR to reconnect.",
  });
}

export function startPour() {
  store.setState({
    mode: "POURING",
    currentPourMl: 0,
  });
}

export function stopPour() {
  const s = store.getState();

  const ml = Math.max(0, s.currentPourMl);

  // base points (demo)
  let pointsEarned = ml >= 240 ? 2 : 1;
  let note = s.tempPreset === "COLD" ? "Cold pour" : "Pour";

  // ✅ Perfect Pour bonus
  if (isPerfectPour(ml, POUR_TARGET_ML, PERFECT_WINDOW_ML)) {
    pointsEarned += 6;
    note = "Perfect pour!";
    toastPush({
      kind: "success",
      title: "Perfect Pour! +6",
      detail: "Locked in.",
    });
  }

  const item: PourHistoryItem = {
    id: makeId("pour"),
    ts: Date.now(),
    ml,
    pointsEarned,
    note,
    source: "dispenser",
  };

  store.setState((prev) => ({
    mode: "POST_POUR",
    todayMl: prev.todayMl + ml,
    currentPourMl: 0,
    pointsToday: prev.pointsToday + pointsEarned,
    pointsTotal: prev.pointsTotal + pointsEarned,
    pourHistory: [item, ...prev.pourHistory].slice(0, 30),
  }));

  // count a “glass” for demo purposes if pour >= 200ml
  if (ml >= 200) {
    awardGlassAndUpdateQuests({ isCold: s.tempPreset === "COLD" });
  }
}

export function addPourMl(delta: number) {
  store.setState((prev) => ({
    currentPourMl: Math.max(0, prev.currentPourMl + delta),
  }));
}

export function bumpHouseholdGlasses() {
  // demo: add 1 glass to "You" after a pour ends
  store.setState((prev) => {
    const members = prev.householdMembers.map((m) =>
      m.id === "you"
        ? { ...m, glassesToday: m.glassesToday + 1, pointsToday: m.pointsToday + 1 }
        : m
    );
    return { householdMembers: members };
  });
}

export function ensureDailyQuests() {
  const s = store.getState();
  if (!s.dailyQuests || s.dailyQuests.length === 0) {
    store.setState({ dailyQuests: defaultDailyQuests() });
  }
}

// call this whenever a “glass” is earned
export function awardGlassAndUpdateQuests(opts?: { isCold?: boolean }) {
  const s = store.getState();
  const nextGlasses = s.glassesToday + 1;

  let quests = (s.dailyQuests ?? defaultDailyQuests()).map((q) => ({ ...q }));

  // AM_SPRINT (demo counts any glasses; time gating comes later)
  quests = quests.map((q) =>
    q.id === "AM_SPRINT" ? { ...q, progress: clamp(q.progress + 1, 0, q.target) } : q
  );

  // COLD_LOVE
  if (opts?.isCold) {
    quests = quests.map((q) =>
      q.id === "COLD_LOVE" ? { ...q, progress: clamp(q.progress + 1, 0, q.target) } : q
    );
  }

  // FAMILY_COMBO (demo uses your glasses; we’ll wire real household sum later)
  quests = quests.map((q) =>
    q.id === "FAMILY_COMBO" ? { ...q, progress: clamp(nextGlasses, 0, q.target) } : q
  );

  const beforeDone = (s.dailyQuests ?? []).filter((q) => q.done).length;

  quests = quests.map((q) => {
    const done = q.done || q.progress >= q.target;
    return { ...q, done };
  });

  const doneNow = quests.filter((q) => q.done).length;

  quests = quests.map((q) =>
    q.id === "STREAK_STEP"
      ? { ...q, progress: clamp(doneNow, 0, q.target), done: doneNow >= q.target }
      : q
  );

  // award newly completed quests
  const earned = quests
    .filter((q, i) => q.done && !(s.dailyQuests?.[i]?.done ?? false))
    .reduce((acc, q) => acc + q.reward, 0);

  store.setState({
    glassesToday: nextGlasses,
    dailyQuests: quests,
    pointsToday: s.pointsToday + earned,
    pointsTotal: s.pointsTotal + earned,
  });

  if (earned > 0) {
    toastPush({
      kind: "success",
      title: `Quest complete +${earned}`,
      detail: "Keep the streak alive.",
    });
  } else if (quests.filter((q) => q.done).length > beforeDone) {
    toastPush({ kind: "success", title: "Quest complete", detail: "Nice work." });
  }
}
