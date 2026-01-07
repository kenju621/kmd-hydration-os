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
  source?: string; // "dispenser" | "mobile" | etc. (demo only)
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
  goalGlasses: number;
  goalMl: number;       // ✅ compat: some screens use goalMl directly
  glassesToday: number;
  pointsToday: number;
  pointsTotal: number;

  // last session (for post-pour / mobile overview)
  sessionMl: number;    // ✅ compat: used by PostPour / mobile views

  // quests
  dailyQuests: Quest[];

  // household
  householdMembers: HouseholdMember[];
  household: HouseholdMember[]; // ✅ compat alias for older code
  streakDays: number;           // ✅ root-level streak for overview

  // history
  pourHistory: PourHistoryItem[];

  // mobile pairing
  pairingCode: string;
  paired: boolean;
};

// ---------- Helpers / constants ----------

type Listener = () => void;

const STORAGE_KEY = "kmd_hydration_v1";

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

function todayISO(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

// "Perfect pour" window used by pour UI + game
export const PERFECT_WINDOW_ML = {
  min: 230,
  max: 270,
};

// "Target" fill that the UI/game aims for.
export const POUR_TARGET_ML = 250;

// ---------- Default state ----------

function defaultState(): HydrationState {
  const baseGoalGlasses = 8;
  const baseGoalMl = baseGoalGlasses * 240;

  const baseHousehold: HouseholdMember[] = [
    { id: "you", name: "You", glassesToday: 0, pointsToday: 0, streakDays: 3 },
    { id: "a", name: "Alice", glassesToday: 2, pointsToday: 6, streakDays: 5 },
    { id: "m", name: "Miles", glassesToday: 1, pointsToday: 3, streakDays: 2 },
    { id: "g", name: "Guest", glassesToday: 0, pointsToday: 0, streakDays: 0 },
  ];

  const you = baseHousehold.find((m) => m.id === "you");

  return {
    mode: "IDLE",

    filterPercent: 92,
    wifiConnected: true,
    iceEnabled: true,
    tempPreset: "COLD",

    todayMl: 0,
    currentPourMl: 0,

    goalGlasses: baseGoalGlasses,
    goalMl: baseGoalMl,

    glassesToday: 0,
    pointsToday: 0,
    pointsTotal: 0,

    sessionMl: 0,

    dailyQuests: defaultDailyQuests(),

    householdMembers: baseHousehold,
    household: baseHousehold,
    streakDays: you?.streakDays ?? 3,

    pourHistory: [],

    pairingCode: makePairingCode(),
    paired: false,
  };
}

// Persisted payload wrapper so we can version + track day
type PersistedPayload = {
  version: 1;
  lastDate: string;
  state: HydrationState;
};

function safeLoadFromStorage(): HydrationState | null {
  if (typeof window === "undefined") return null;
  if (typeof window.localStorage === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as PersistedPayload;
    const base = defaultState();
    const today = todayISO();

    // Merge with base so new fields get defaults
    let st: HydrationState = { ...base, ...(parsed.state as Partial<HydrationState>) };

    // Always boot the UI in a safe, idle state
    st = {
      ...st,
      mode: "IDLE",
      currentPourMl: 0,
    };

    // New day → reset daily portions, keep device context
    if (parsed.lastDate !== today) {
      st = {
        ...st,
        todayMl: 0,
        glassesToday: 0,
        pointsToday: 0,
        dailyQuests: defaultDailyQuests(),
        pourHistory: [],
        sessionMl: 0,
      };
    }

    // Ensure compat aliases are in sync
    st = syncDerivedFields(st);

    return st;
  } catch {
    // If anything is corrupted, just start fresh
    return null;
  }
}

function safePersistToStorage(state: HydrationState) {
  if (typeof window === "undefined") return;
  if (typeof window.localStorage === "undefined") return;

  try {
    const payload: PersistedPayload = {
      version: 1,
      lastDate: todayISO(),
      state,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // swallow in demo
  }
}

function syncDerivedFields(st: HydrationState): HydrationState {
  const goalMl = st.goalGlasses * 240;

  const householdMembers = st.householdMembers ?? st.household ?? [];
  const household = householdMembers;
  const you = householdMembers.find((m) => m.id === "you");

  return {
    ...st,
    goalMl,
    householdMembers,
    household,
    streakDays: you?.streakDays ?? st.streakDays ?? 0,
  };
}

// ---------- Minimal store (no zustand dependency) ----------

export const store = (() => {
  let state: HydrationState =
    typeof window !== "undefined" ? safeLoadFromStorage() ?? defaultState() : defaultState();

  state = syncDerivedFields(state);

  const listeners = new Set<Listener>();

  function setState(
    patch: Partial<HydrationState> | ((prev: HydrationState) => Partial<HydrationState>)
  ) {
    const nextPatch = typeof patch === "function" ? patch(state) : patch;
    state = syncDerivedFields({ ...state, ...nextPatch });
    safePersistToStorage(state);
    listeners.forEach((l) => l());
  }

  return {
    getState() {
      return state;
    },
    setState,
    subscribe(listener: Listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
})();

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
    sessionMl: 0,
  });
}

export function stopPour() {
  const s = store.getState();

  const ml = Math.max(0, s.currentPourMl);
  const pointsEarned = ml >= 240 ? 2 : 1; // simple demo scoring

  const item: PourHistoryItem = {
    id: makeId("pour"),
    ts: Date.now(),
    ml,
    pointsEarned,
    note: s.tempPreset === "COLD" ? "Cold pour" : "Pour",
    source: "dispenser",
  };

  store.setState((prev) => ({
    mode: "POST_POUR",
    todayMl: prev.todayMl + ml,
    currentPourMl: 0,
    sessionMl: ml,
    pointsToday: prev.pointsToday + pointsEarned,
    pointsTotal: prev.pointsTotal + pointsEarned,
    pourHistory: [item, ...prev.pourHistory].slice(0, 30),
  }));

  if (ml >= 200) {
    awardGlassAndUpdateQuests({ isCold: s.tempPreset === "COLD" });
  }

  bumpHouseholdGlasses();
}

export function addPourMl(delta: number) {
  store.setState((prev) => ({
    currentPourMl: Math.max(0, prev.currentPourMl + delta),
    sessionMl: Math.max(0, prev.currentPourMl + delta),
  }));
}

export function bumpHouseholdGlasses() {
  store.setState((prev) => {
    const updatedMembers = prev.householdMembers.map((m) =>
      m.id === "you"
        ? {
            ...m,
            glassesToday: m.glassesToday + 1,
            pointsToday: m.pointsToday + 1,
          }
        : m
    );
    return {
      householdMembers: updatedMembers,
      household: updatedMembers,
    };
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

  // AM_SPRINT (demo: any glasses count)
  quests = quests.map((q) =>
    q.id === "AM_SPRINT"
      ? { ...q, progress: clamp(q.progress + 1, 0, q.target) }
      : q
  );

  // COLD_LOVE
  if (opts?.isCold) {
    quests = quests.map((q) =>
      q.id === "COLD_LOVE"
        ? { ...q, progress: clamp(q.progress + 1, 0, q.target) }
        : q
    );
  }

  // FAMILY_COMBO (demo uses your glasses; later we can use household sum)
  quests = quests.map((q) =>
    q.id === "FAMILY_COMBO"
      ? { ...q, progress: clamp(nextGlasses, 0, q.target) }
      : q
  );

  const beforeDone = (s.dailyQuests ?? []).filter((q) => q.done).length;

  quests = quests.map((q) => {
    const done = q.done || q.progress >= q.target;
    return { ...q, done };
  });

  const doneNow = quests.filter((q) => q.done).length;

  quests = quests.map((q) =>
    q.id === "STREAK_STEP"
      ? {
          ...q,
          progress: clamp(doneNow, 0, q.target),
          done: doneNow >= q.target,
        }
      : q
  );

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
    toastPush({
      kind: "success",
      title: "Quest complete",
      detail: "Nice work.",
    });
  }
}
