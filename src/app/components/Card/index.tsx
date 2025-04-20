import React from "react";

export type CardProps = {
  symbol: string;
  price: number;
  percentage: number;
  priceAlert: number;
};

export function Card({ symbol, price, percentage, priceAlert }: CardProps) {
  let backgroundColor = "none";

  if (price && priceAlert) {
    backgroundColor = price > priceAlert ? "bg-red-900" : "bg-green-900";
  }

  return (
    <div className={`flex flex-col min-w-48 xl:min-w-64 text-white`}>
      <div className={`mx-2 w-full ${backgroundColor}`}>
        <div className="m-1">
          <div className="flex justify-between text-sm">
            <p className="mr-2">{symbol}</p>
            <p>{price.toFixed(2)}</p>
          </div>
          <div className="flex mt-1 text-xl">
            <p>{`${percentage.toFixed(2)}%`}</p>
          </div>
          <div className="flex text-xs justify-end">
            <label className="mr-1">Price alert:</label>
            <p>{priceAlert}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
