import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CampusPage from "./pages/CampusPage";
import BuildingPage from "./pages/BuildingPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/campus/:campusId" element={<CampusPage />} />
      <Route path="/campus/:campusId/building/:buildingId" element={<BuildingPage />} />
    </Routes>
  );
}
