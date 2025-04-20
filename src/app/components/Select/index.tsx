import { getStocks } from "@/app/services/stocks";
import { StockSymbolAPI } from "@/app/types/stock";
import React, { useState, useMemo, useEffect } from "react";
import { FixedSizeList as List } from "react-window";
import { useStockContext } from "../../context/StockContext";

export interface Option {
  label: string;
  value: string;
}

export type SelectProps = {
  value?: string;
  onChange: (value: Option) => void;
};

const defaultStocks = [
  { symbol: "OANDA:EUR_USD" },
  { symbol: "BINANCE:ETHUSDT" },
  { symbol: "BINANCE:BTCUSDT" },
];

export function Select({ value, onChange }: SelectProps) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Option | null>(null);
  const [stocksAPI, setStocksAPI] = useState<StockSymbolAPI[]>([]);
  const [availableStocks, setAvailableStocks] = useState<StockSymbolAPI[]>([]);

  const { stocks } = useStockContext();

  useEffect(() => {
    const selectedSymbols = new Set(stocks.map(({ symbol }) => symbol));
    const availableAPIStocks = stocksAPI.filter(
      ({ symbol }) => !selectedSymbols.has(symbol)
    );
    setAvailableStocks(availableAPIStocks);
  }, [stocks, stocksAPI]);

  const filteredOptions = useMemo(() => {
    const stocks = query
      ? availableStocks.filter(({ symbol }) =>
          symbol.toLowerCase().includes(query.toLowerCase())
        )
      : availableStocks.slice(0, 10);

    return stocks.map((stock) => ({
      label: stock.symbol,
      value: stock.symbol,
    }));
  }, [query, availableStocks]);

  useEffect(() => {
    const getStocksApi = async () => {
      setIsLoading(true);
      try {
        const data = await getStocks();
        setStocksAPI([...data, ...defaultStocks]);
      } catch (error) {
        console.log(
          `There was an error to get stocks from api. Error: ${error}`
        );
        setStocksAPI(defaultStocks);
      } finally {
        setIsLoading(false);
      }
    };
    getStocksApi();
  }, []);

  const Option = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const option = filteredOptions[index];
    return (
      <div
        style={style}
        className={`px-4 py-2 cursor-pointer hover:bg-blue-100
          ${selected?.value === option.value && "bg-blue-200"}
        `}
        onClick={() => {
          setSelected(option);
          onChange(option);
          setIsOpen(false);
          setQuery("");
        }}
      >
        {option.label}
      </div>
    );
  };

  return (
    <div className="relative w-64 text-black">
      <input
        type="text"
        className="w-full border px-4 py-2 rounded focus:outline-none focus:ring"
        value={value || query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
      />
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg max-h-60 overflow-hidden">
          {filteredOptions.length > 0 ? (
            <List
              height={240}
              itemCount={filteredOptions.length}
              itemSize={35}
              width="100%"
            >
              {Option}
            </List>
          ) : (
            <div className="px-4 py-2 text-gray-500">
              {isLoading ? "Loading.." : "No results found"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
