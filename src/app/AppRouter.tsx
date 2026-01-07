// src/app/AppRouter.tsx
import React from "react";
import { DispenserScreen } from "./routes/dispenser/DispenserScreen";
import CareShell from "./routes/care/CareShell";
import { MobileCompanion } from "./routes/mobile/MobileCompanion";

export function AppRouter() {
  // SSR / build-time safety
  if (typeof window === "undefined") {
    return <DispenserScreen />;
  }

  const { pathname, search } = window.location;
  const params = new URLSearchParams(search);
  const view = params.get("view");

  // ✅ Canonical entry: /dispenser (and we also tolerate "/")
  if (pathname.startsWith("/dispenser") || pathname === "/") {
    if (view === "care") return <CareShell />;
    if (view === "mobile") return <MobileCompanion />;
    return <DispenserScreen />;
  }

  // ✅ Nice-to-have: local dev direct paths still work
  if (pathname.startsWith("/care")) {
    return <CareShell />;
  }
  if (pathname.startsWith("/mobile")) {
    return <MobileCompanion />;
  }

  // Fallback: always show main dispenser
  return <DispenserScreen />;
}

export default AppRouter;
