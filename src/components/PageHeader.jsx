import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Breadcrumb from "./Breadcrumb";
import SearchBar from "./SearchBar";
import { C } from "../theme";

export default function PageHeader({ crumbs, backTo, backLabel }) {
  return (
    <header
      className="relative md:sticky top-0 z-[1050] px-4 py-3 md:px-6 md:py-4 flex flex-wrap items-center gap-x-3 gap-y-2"
      style={{ background: C.paper, borderTop: `3px solid ${C.brand}`, borderBottom: `1px solid ${C.line}` }}
    >
      {/* Mobile: logo and back button on the first row, search below. */}
      <div className="flex-1 min-w-0 order-1 flex items-center gap-2.5">
        <Link to="/" aria-label="WayGo home" className="shrink-0 rounded-sm">
          <img src="/WayGo-logo.svg" alt="" className="w-9 h-9 md:w-10 md:h-10" />
        </Link>
        <div className="min-w-0">
          <Link
            to="/"
            className="text-lg font-bold leading-tight tracking-tight rounded-sm"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: C.brandDark }}
          >
            WayGo
          </Link>
          <Breadcrumb items={crumbs} />
        </div>
      </div>

      <div className="w-full order-3 md:w-auto md:flex-1 md:order-2 flex justify-center">
        <SearchBar />
      </div>

      <div className="order-2 md:order-3 md:flex-1 flex justify-end">
        {backTo && (
          <Link
            to={backTo}
            className="waygo-hover-tint flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-md border transition-colors whitespace-nowrap"
            style={{ borderColor: C.brandLine, color: C.brandDark }}
          >
            <ArrowLeft size={15} />
            {backLabel}
          </Link>
        )}
      </div>
    </header>
  );
}
