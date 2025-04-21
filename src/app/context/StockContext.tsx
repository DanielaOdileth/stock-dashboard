"use client";

import { Report, Symbol } from "@/app/types/stock";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const StockContext = createContext<StockContextType | undefined>(undefined);

export type StockContextType = {
  graphData: Report[];
  stocks: Symbol[];
  addStock: (symbol: Symbol) => void;
  addGraphData: (entry: Report) => void;
  removeStock: (symbol: string) => void;
};

export const StockProvider = ({ children }: { children: React.ReactNode }) => {
  const [stocks, setStocks] = useState<Symbol[]>([]);
  const [graphData, setGraphData] = useState<Report[]>([]);

  const addStock = useCallback((stock: Symbol) => {
    setStocks((prev) => (prev.includes(stock) ? prev : [...prev, stock]));
  }, []);

  const removeStock = useCallback((symbol: string) => {
    setStocks((prevStocks) =>
      prevStocks.filter((stock) => stock.symbol !== symbol)
    );
  }, []);

  const addGraphData = useCallback((entry: Report) => {
    setGraphData((prev) => {
      const updatedChart = [...prev, entry];

      if (updatedChart.length > 50) {
        updatedChart.shift();
      }

      return updatedChart;
    });
  }, []);

  const value = useMemo(
    () => ({ stocks, graphData, addStock, addGraphData, removeStock }),
    [stocks, graphData, addStock, addGraphData, removeStock]
  );

  return (
    <StockContext.Provider value={value}>{children}</StockContext.Provider>
  );
};

export const useStockContext = () => {
  const context = useContext(StockContext);
  if (!context) {
    throw new Error("useStockContext must be used within a StockProvider");
  }
  return context;
};
