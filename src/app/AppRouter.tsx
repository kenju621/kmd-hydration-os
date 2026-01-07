// src/app/AppRouter.tsx
import type React from "react";
import { DispenserScreen } from "./routes/dispenser/DispenserScreen";
import { MobileCompanion } from "./routes/mobile/MobileCompanion";
import { CareShell } from "./routes/care/CareShell";
import { ToastHost } from "../ui/toast/ToastHost";

export function AppRouter() {
  // Simple manual routing based on pathname
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "/dispenser";

  let screen: React.ReactNode;

  if (pathname.startsWith("/mobile")) {
    screen = <MobileCompanion />;
  } else if (pathname.startsWith("/care")) {
    screen = <CareShell />;
  } else {
    // default to dispenser screen (also for "/dispenser")
    screen = <DispenserScreen />;
  }

  return (
    <div style={styles.appShell}>
      {screen}
      <ToastHost />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  appShell: {
    minHeight: "100vh",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
    backgroundColor: "#050712",
    color: "#ffffff",
  },
};
