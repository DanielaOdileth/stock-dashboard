import React from "react";

export function Card({
  symbol,
  price,
  percentage,
}: {
  symbol: string;
  price: number;
  percentage: number;
}) {
  return (
    <div className="flex flex-col w-64 text-white">
      <div className="mx-2 w-full">
        <div className="m-1">
          <div className="flex justify-between text-sm">
            <p className="mr-2">{symbol}</p>
            <p>{price.toFixed(2)}</p>
          </div>
          <div className="flex mt-1 text-xl">
            <p>{`${percentage.toFixed(2)}%`}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
