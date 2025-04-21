"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useStockContext } from "../../context/StockContext";

const colors = ["#8884d8", "#82ca9d", "#ff7300", "#d84a4a", "#00c49f"];

function extractSymbols(data: Array<Record<string, number>>): string[] {
  const symbolSet = new Set<string>();

  data.forEach((entry) => {
    Object.keys(entry).forEach((key) => {
      if (key !== "time") {
        symbolSet.add(key);
      }
    });
  });

  return Array.from(symbolSet);
}

export function Graph() {
  const { graphData } = useStockContext();

  const symbols = useMemo(() => {
    return extractSymbols(graphData);
  }, [graphData]);

  return (
    graphData.length && (
      <div className="w-11/12 xl:w-full h-96 p-4 rounded-xl m-2 border ">
        <h2 className="text-lg font-semibold mb-4">Stock Prices ($)</h2>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={graphData}>
            <XAxis
              dataKey="time"
              tickFormatter={(timestamp) =>
                new Date(timestamp).toLocaleTimeString()
              }
            />
            <YAxis domain={["auto", "auto"]} tickFormatter={(v) => `$${v}`} />
            <Tooltip formatter={(v) => `$${v}`} />
            <Legend />
            {symbols.map((symbol, idx) => (
              <Line
                key={symbol}
                type="monotone"
                dataKey={symbol}
                stroke={colors[idx % colors.length]}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    )
  );
}
