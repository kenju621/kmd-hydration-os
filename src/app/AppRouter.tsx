// src/app/AppRouter.tsx
import { DispenserScreen } from "./routes/dispenser/DispenserScreen";
import CareShell from "./routes/care/CareShell";
import { MobileCompanion } from "./routes/mobile/MobileCompanion";

export function AppRouter() {
  // Safety for SSR / build
  if (typeof window === "undefined") {
    return <DispenserScreen />;
  }

  const params = new URLSearchParams(window.location.search);
  const view = params.get("view");

  if (view === "care") {
    return <CareShell />;
  }

  if (view === "mobile") {
    return <MobileCompanion />;
  }

  // Default → Hydration OS
  return <DispenserScreen />;
}

export default AppRouter;
