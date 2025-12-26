export type ToastKind = "success" | "info";

export type ToastItem = {
  id: string;
  kind: ToastKind;
  title: string;
  detail?: string;
  ts: number;
};

export type ToastState = {
  toasts: ToastItem[];
};

type Listener = (s: ToastState) => void;

const state: ToastState = { toasts: [] };
const listeners = new Set<Listener>();

function emit(): void {
  for (const l of listeners) l(state);
}

export function toastPush(item: Omit<ToastItem, "id" | "ts">): void {
  const id = `${Date.now()}_${Math.random().toString(16).slice(2)}`;

  state.toasts = [{ id, ts: Date.now(), ...item }, ...state.toasts].slice(0, 4);
  emit();

  window.setTimeout(() => {
    state.toasts = state.toasts.filter((t) => t.id !== id);
    emit();
  }, 2200);
}

export function toastSubscribe(fn: Listener): () => void {
  listeners.add(fn);
  fn(state);
  return () => {
    listeners.delete(fn);
  };
}
