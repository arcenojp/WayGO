import { Fragment } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { C } from "../theme";

/**
 * items: [{ label, to }]  — the last item renders as plain (current) text.
 */
export default function Breadcrumb({ items }) {
  return (
    <div className="flex items-center flex-wrap gap-1 text-sm">
      {items.map((it, i) => {
        const isLast = i === items.length - 1;
        return (
          <Fragment key={i}>
            {i > 0 && <ChevronRight size={14} style={{ color: C.inkSoft }} />}
            {isLast ? (
              <span className="px-1.5 py-0.5" style={{ color: C.ink, fontWeight: 600 }}>
                {it.label}
              </span>
            ) : (
              <Link
                to={it.to}
                className="px-1.5 py-0.5 rounded-sm transition-colors"
                style={{ color: C.inkSoft, fontWeight: 500 }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.accent)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.inkSoft)}
              >
                {it.label}
              </Link>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
