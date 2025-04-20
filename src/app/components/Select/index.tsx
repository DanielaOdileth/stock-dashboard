import { getStocks } from "@/app/services/stocks";
import { StockSymbolAPI } from "@/app/types/stock";
import React, { useState, useMemo, useEffect } from "react";
import { FixedSizeList as List } from "react-window";

export interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  value?: string;
  onChange: (value: Option) => void;
}

const defaultStocks = [
  { symbol: "OANDA:EUR_USD" },
  { symbol: "BINANCE:ETHUSDT" },
  { symbol: "BINANCE:BTCUSDT" },
];

export const Select: React.FC<SelectProps> = ({ value, onChange }) => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Option | null>(null);
  const [stocks, setStocks] = useState<StockSymbolAPI[]>([]);

  useEffect(() => {
    const getStocksApi = async () => {
      setIsLoading(true);
      try {
        const data = await getStocks();
        setStocks([...data, ...defaultStocks]);
      } catch (error) {
        console.log(
          `There was an error to get stocks from api. Error: ${error}`
        );
        setStocks(defaultStocks);
      } finally {
        setIsLoading(false);
      }
    };
    getStocksApi();
  }, []);

  const filteredOptions = useMemo(() => {
    if (!query) {
      return stocks
        .slice(0, 10)
        .map((stock) => ({ label: stock.symbol, value: stock.symbol }));
    }
    return stocks
      .filter((o: StockSymbolAPI) =>
        o.symbol.toLowerCase().includes(query.toLowerCase())
      )
      .map((stock) => ({ label: stock.symbol, value: stock.symbol }));
  }, [query, stocks]);

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
    <div className="relative w-64">
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
};
