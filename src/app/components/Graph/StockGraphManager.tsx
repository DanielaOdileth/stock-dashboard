"use client";

import { useStockContext } from "@/app/context/StockContext";
import { useStockSocket } from "@/app/hooks/useStockSocket";
import { Report, Trade } from "@/app/types/stock";

export function StockSocketManager() {
  const { stocks, addGraphData } = useStockContext();

  useStockSocket({
    symbols: stocks.map(({ symbol }) => symbol),
    addTradeData: (trades: Trade[]) => {
      const time = trades[0]?.t;
      if (!time) {
        return;
      }

      const newGraphEntry: Report = { time };

      trades.forEach(({ s: symbol, p: price }) => {
        newGraphEntry[symbol] = price;
      });

      if (Object.keys(newGraphEntry).length > 1) {
        addGraphData(newGraphEntry);
      }
    },
  });

  return null;
}
