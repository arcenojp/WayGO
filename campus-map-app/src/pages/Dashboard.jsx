import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import HomeMap from "../components/HomeMap";
import { SCHOOL } from "../data/campuses";
import { C } from "../theme";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full" style={{ background: C.paper, color: C.ink, fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <PageHeader crumbs={[{ label: SCHOOL, to: "/" }]} />
      <main className="py-5 md:py-8">
        <p className="text-sm mb-4 md:mb-6 px-4 text-center mx-auto" style={{ color: C.inkSoft, maxWidth: "48ch" }}>
          Select a campus to explore its buildings and floor plans.
        </p>
        <div className="px-4 md:px-6">
          <HomeMap onSelect={(id) => navigate(`/campus/${id}`)} />
        </div>
      </main>
    </div>
  );
}
