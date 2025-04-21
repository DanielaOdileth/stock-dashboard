import { useEffect, useRef } from "react";
import { Trade } from "../types/stock";
import { getFinnHubWebSocket } from "../services/websocket";

type Props = {
  symbols: string[];
  addTradeData: (trades: Trade[]) => void;
};

const filterTrades = (trades: Trade[]) => {
  return Object.values(
    trades.reduce((acc: Record<string, Trade>, trade: Trade) => {
      if (!acc[trade.s]) {
        acc[trade.s] = trade;
      }
      return acc;
    }, {})
  );
};

export const useStockSocket = ({ symbols, addTradeData }: Props) => {
  const prevSymbolsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const finnHubSocket = getFinnHubWebSocket();

    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.type === "trade") {
        addTradeData(filterTrades(data.data));
      }
    };

    finnHubSocket.addEventListener("message", handleMessage);

    const currentSymbols = new Set(symbols);

    symbols.forEach((symbol) => {
      if (!prevSymbolsRef.current.has(symbol)) {
        finnHubSocket.send(JSON.stringify({ type: "subscribe", symbol }));
      }
    });

    prevSymbolsRef.current.forEach((symbol) => {
      if (!currentSymbols.has(symbol)) {
        finnHubSocket.send(JSON.stringify({ type: "unsubscribe", symbol }));
      }
    });

    prevSymbolsRef.current = currentSymbols;

    return () => {
      finnHubSocket.removeEventListener("message", handleMessage);
    };
  }, [symbols, addTradeData]);
};
