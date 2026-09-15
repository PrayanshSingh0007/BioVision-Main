import { Routes, Route, Navigate } from "react-router-dom";
import AppShell from "./components/layout/AppShell";
import Landing from "./pages/Landing/Landing";
import Boot from "./pages/Boot/Boot";
import Mission from "./pages/Mission/Mission";
import Habitat from "./pages/Habitat/Habitat";
import Species from "./pages/Species/Species";
import Lab from "./pages/Lab/Lab";
import Report from "./pages/Report/Report";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Landing />} />
        <Route path="/boot" element={<Boot />} />
        <Route path="/mission" element={<Mission />} />
        <Route path="/habitat" element={<Habitat />} />
        <Route path="/species" element={<Species />} />
        <Route path="/lab" element={<Lab />} />
        <Route path="/report" element={<Report />} />
        <Route path="/index.html" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
