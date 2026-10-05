import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CampusPage from "./pages/CampusPage";
import BuildingPage from "./pages/BuildingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import AdminPage from "./pages/AdminPage";
import RequireAuth from "./auth/RequireAuth";

// Map pages need a signed-in user once a backend is connected (see
// src/api/client.js); until then they're open to everyone, and the account
// pages redirect to the map.
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/admin" element={<RequireAuth role="admin"><AdminPage /></RequireAuth>} />
      <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
      <Route path="/campus/:campusId" element={<RequireAuth><CampusPage /></RequireAuth>} />
      <Route path="/campus/:campusId/building/:buildingId" element={<RequireAuth><BuildingPage /></RequireAuth>} />
    </Routes>
  );
}
