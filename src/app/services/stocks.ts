import { StockSymbolAPI } from "../types/stock";

const FINN_HUB_API_URL = process.env.NEXT_PUBLIC_FINN_HUB_API_URL;
const FINN_HUB_AI_KEY = process.env.NEXT_PUBLIC_FINN_HUB_API_KEY;

export const getStocks = async (): Promise<StockSymbolAPI[]> => {
  const response = await fetch(
    `${FINN_HUB_API_URL}/symbol?exchange=US&token=${FINN_HUB_AI_KEY}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch stock");
  }

  const data = await response.json();
  return data;
};
