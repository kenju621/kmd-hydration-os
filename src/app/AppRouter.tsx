// src/app/AppRouter.tsx
import React from "react";
import { DispenserScreen } from "./routes/dispenser/DispenserScreen";
import CareShell from "./routes/care/CareShell";
import { MobileCompanion } from "./routes/mobile/MobileCompanion";

export function AppRouter() {
  // SSR / build safety
  if (typeof window === "undefined") {
    return <DispenserScreen />;
  }

  const params = new URLSearchParams(window.location.search);
  const view = params.get("view");

  if (view === "care") return <CareShell />;
  if (view === "mobile") return <MobileCompanion />;

  // default = Hydration OS
  return <DispenserScreen />;
}

export default AppRouter;
