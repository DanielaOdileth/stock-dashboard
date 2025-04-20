export type Trade = {
  p: number;
  s: string;
  t: number;
  v: number;
};

export type StockSymbolAPI = { symbol: string };

export type Symbol = {
  symbol: string;
  priceAlert: number;
};

export type Report = { time: number; [symbol: string]: number };
