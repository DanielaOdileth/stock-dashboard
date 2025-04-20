"use client";

import React, { useState } from "react";
import { Select } from "../Select";

export function Form() {
  const [symbolSelected, setSymbolSelected] = useState<string>("");
  const [priceAlert, setPriceAlert] = useState<string | number>("");

  const onSubmit = () => {
    setPriceAlert("");
    setSymbolSelected("");
  };

  return (
    <div className="flex flex-col border-2 rounded-md rad w-1/2 p-3 m-3  shadow-sm">
      <div className="flex items-center">
        <label htmlFor="stocks" className="mr-10">
          Stock:
        </label>
        <Select
          onChange={({ value }) => {
            setSymbolSelected(value);
          }}
          value={symbolSelected}
        />
      </div>
      <div className="flex mt-5">
        <label htmlFor="price" className="mr-10">
          Price:
        </label>
        <input
          type="number"
          className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
          step="0.01"
          min="0"
          onChange={(e) => setPriceAlert(Number(e.target.value))}
          value={priceAlert}
        />
      </div>
      <div className="flex justify-end">
        <button
          className="border-blue-400 disabled:bg-gray-900 disabled:cursor-not-allowed disabled:text-black disabled:opacity-70 w-36 border-2 rounded-sm p-2 mt-10 font-semibold hover:bg-blue-100"
          onClick={onSubmit}
          disabled={!symbolSelected || !priceAlert}
        >
          Save
        </button>
      </div>
    </div>
  );
}
