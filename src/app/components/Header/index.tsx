"use client";

import React, { useEffect, useState } from "react";
import { Card } from "../Card";
import finnHubWebSocket from "@/app/services/websocket";
import { Report, Trade } from "@/app/types/stock";
import { useStockContext } from "../context/StockContext";

export function Header() {
  const [stockData, setStockData] = useState<
    Record<string, { price: number; percentage: number; time: number }>
  >({});

  const { stocks, addGraphData } = useStockContext();

  useEffect(() => {
    if (stocks.length === 0) {
      return;
    }

    function handleTradeUpdate(trades: Trade[]) {
      setStockData((prevData) => {
        const updatedData = { ...prevData };
        const newGraphEntry: Report = { time: trades[0].t };

        trades.forEach(({ s: symbol, p: price, t: time }) => {
          const prev = prevData[symbol]?.price ?? price;
          const percentage = ((price - prev) / prev) * 100;

          updatedData[symbol] = {
            price: price,
            percentage,
            time,
          };

          newGraphEntry[symbol] = price;
        });

        if (Object.keys(newGraphEntry).length > 1) {
          addGraphData(newGraphEntry);
        }

        return updatedData;
      });
    }

    const cleanup = finnHubWebSocket(stocks, handleTradeUpdate);

    return () => cleanup();
  }, [stocks]);

  return (
    <header
      className="divide-gray-500 bg-zinc-800 py-3 overflow-x-auto whitespace-nowrap"
      style={{ scrollbarWidth: "none" }}
    >
      <div className="flex divide-x-2 space-x-4 px-4">
        {stocks.map(({ symbol, priceAlert }) => {
          const stock = stockData[symbol];
          return (
            <Card
              symbol={symbol}
              price={stock?.price || 0}
              percentage={stock?.percentage || 0}
              key={`card-${symbol}`}
              priceAlert={priceAlert}
            />
          );
        })}
      </div>
    </header>
  );
}
