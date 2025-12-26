// src/core/state/useHydration.ts
import { useSyncExternalStore } from "react";
import { store, type HydrationState } from "./hydrationStore";

function subscribe(cb: () => void) {
  return store.subscribe(cb);
}

function getSnapshot(): HydrationState {
  return store.getState();
}

export function useHydration(): HydrationState {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
