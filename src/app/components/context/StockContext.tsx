"use client";

import { Symbol } from "@/app/types/stock";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type StockContextType = {
  stocks: Symbol[];
  addStock: (symbol: Symbol) => void;
};

const StockContext = createContext<StockContextType | undefined>(undefined);

export const StockProvider = ({ children }: { children: React.ReactNode }) => {
  const [stocks, setStocks] = useState<Symbol[]>([]);

  const addStock = useCallback((stock: Symbol) => {
    setStocks((prev) => (prev.includes(stock) ? prev : [...prev, stock]));
  }, []);

  const value = useMemo(() => ({ stocks, addStock }), [stocks, addStock]);

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
