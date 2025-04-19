import React from "react";

export function Card({ price, symbol }: { symbol: string; price: number }) {
  return (
    <div className="flex flex-col w-64 text-white">
      <div className="m-1">
        <div className="flex justify-between text-sm">
          <p className="mr-2">{symbol}</p>
          <p>{price.toFixed(2)}</p>
        </div>
        <div className="flex mt-1 text-xl">
          <p>1%</p>
        </div>
      </div>
    </div>
  );
}
