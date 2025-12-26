import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DispenserScreen } from "./routes/dispenser/DispenserScreen";
import { MobileShell } from "./routes/mobile/MobileShell";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dispenser" replace />} />
        <Route path="/dispenser" element={<DispenserScreen />} />
        <Route path="/mobile/*" element={<MobileShell />} />
      </Routes>
    </BrowserRouter>
  );
}
