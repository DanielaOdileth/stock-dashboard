"use client";

import React, { useState } from "react";
import { Card } from "../Card";
import { Trade } from "@/app/types/stock";
import { useStockContext } from "../../context/StockContext";
import { useStockSocket } from "@/app/hooks/useStockSocket";

export function Header() {
  const [stockData, setStockData] = useState<
    Record<string, { price: number; percentage: number; time: number }>
  >({});

  const { stocks } = useStockContext();

  function handleTradeUpdate(trades: Trade[]) {
    if (stocks.length === 0) {
      return;
    }

    setStockData((prevData) => {
      const updatedData = { ...prevData };

      trades.forEach(({ s: symbol, p: price, t: time }) => {
        const prev = prevData[symbol]?.price ?? price;
        const percentage = ((price - prev) / prev) * 100;

        updatedData[symbol] = {
          price: price,
          percentage,
          time,
        };
      });

      return updatedData;
    });
  }

  useStockSocket({
    symbols: stocks.map(({ symbol }) => symbol),
    addTradeData: (trades) => {
      handleTradeUpdate(trades);
    },
  });

  return (
    <header
      className="divide-gray-500 py-3 overflow-x-auto whitespace-nowrap"
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
