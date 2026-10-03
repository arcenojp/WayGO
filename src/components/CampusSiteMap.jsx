import { useState } from "react";
import { CAMPUSES } from "../data/campuses";
import RtsCampusMap from "./RtsCampusMap";
import { C } from "../theme";

export default function CampusSiteMap({ campusId, onSelectBuilding }) {
  const campus = CAMPUSES[campusId];
  const [hover, setHover] = useState(null);

  // RTS Campus has its own illustrated map.
  if (campusId === "rts") {
    return <RtsCampusMap onSelectBuilding={onSelectBuilding} />;
  }

  const buildings = Object.entries(campus.buildings);

  const nums = (d) => d.match(/-?\d+\.?\d*/g).map(Number);
  const xs = buildings.flatMap(([, b]) => nums(b.shape).filter((_, i) => i % 2 === 0));
  const ys = buildings.flatMap(([, b]) => nums(b.shape).filter((_, i) => i % 2 === 1));
  const pad = 60;
  const minX = Math.min(...xs) - pad;
  const maxX = Math.max(...xs) + pad;
  const minY = Math.min(...ys) - pad;
  const maxY = Math.max(...ys) + pad;

  return (
    <svg
      viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`}
      className="w-full h-auto select-none"
      style={{ maxHeight: "60vh" }}
    >
      {campus.track && (
        <>
          <ellipse cx={campus.track.cx} cy={campus.track.cy} rx={campus.track.rx} ry={campus.track.ry} fill={C.green} stroke={C.greenLine} strokeWidth="2" />
          <ellipse cx={campus.track.cx} cy={campus.track.cy} rx={campus.track.rx - 20} ry={campus.track.ry - 20} fill={C.paper} stroke={C.greenLine} strokeWidth="1.2" />
        </>
      )}
      {buildings.map(([id, b]) => (
        <g
          key={id}
          onClick={() => onSelectBuilding(id)}
          onMouseEnter={() => setHover(id)}
          onMouseLeave={() => setHover(null)}
          style={{ cursor: "pointer" }}
        >
          <path
            d={b.shape}
            fill={hover === id ? C.accentSoft : C.stone}
            stroke={hover === id ? C.accent : C.ink}
            strokeWidth={hover === id ? 2 : 1.2}
          />
          <text
            x={b.label.x}
            y={b.label.y}
            textAnchor="middle"
            style={{
              font: `${hover === id ? 600 : 500} 12px 'Space Grotesk', sans-serif`,
              fill: hover === id ? C.accent : C.ink,
              pointerEvents: "none",
            }}
          >
            {b.name}
          </text>
        </g>
      ))}
    </svg>
  );
}
