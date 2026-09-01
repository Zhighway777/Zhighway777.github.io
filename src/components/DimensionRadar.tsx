import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import { dimensions } from "../lib/personas";
import type { DimensionId } from "../lib/types";

interface DimensionRadarProps {
  scores: Record<DimensionId, number>;
}

export default function DimensionRadar({ scores }: DimensionRadarProps) {
  const data = dimensions.map((dimension) => ({
    dimension: dimension.shortName,
    score: scores[dimension.id],
  }));

  return (
    <div className="chart-frame">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid stroke="#d5dcd8" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fontSize: 11, fill: "#52606b" }}
          />
          <Radar
            dataKey="score"
            stroke="#0f766e"
            fill="#14b8a6"
            fillOpacity={0.24}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
