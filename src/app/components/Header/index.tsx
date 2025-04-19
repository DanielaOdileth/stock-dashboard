"use client";

import React, { useEffect, useState } from "react";
import { Card } from "../Card";
import finnHubWebSocket from "@/app/services/websocket";
import { Trade } from "@/app/types/stock";

const symbols = [
  "OANDA:EUR_USD",
  "BINANCE:ETHUSDT",
  "BINANCE:BTCUSDT",
  "AMZN",
  "MSFT",
];

export function Header() {
  const [stockData, setStockData] = useState<
    Record<string, { price: number; percentage: number; time: number }>
  >({});

  useEffect(() => {
    function handleTradeUpdate(trades: Trade[]) {
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

    const cleanup = finnHubWebSocket(symbols, handleTradeUpdate);

    return () => cleanup();
  }, []);

  return (
    <header
      className="divide-gray-500 bg-zinc-800 py-3 overflow-x-auto whitespace-nowrap"
      style={{ scrollbarWidth: "none" }}
    >
      <div className="flex divide-x-2 space-x-4 px-4">
        {Object.keys(stockData).map((symbol, index) => {
          const currentSymbol = stockData[symbol];
          return (
            <Card symbol={symbol} price={currentSymbol.price} key={index} />
          );
        })}
      </div>
    </header>
  );
}
