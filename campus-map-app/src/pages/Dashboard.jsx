import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import HomeMap from "../components/HomeMap";
import { SCHOOL } from "../data/campuses";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <AppShell
      crumbs={[{ label: SCHOOL, to: "/" }]}
      subtitle="Select a campus to explore its buildings and floor plans."
    >
      <HomeMap onSelect={(id) => navigate(`/campus/${id}`)} />
    </AppShell>
  );
}
