"use client";

import React from "react";
import { Card } from "../Card";

export function Header() {
  return (
    <header
      className="divide-gray-500 bg-zinc-800 py-3 overflow-x-auto whitespace-nowrap"
      style={{ scrollbarWidth: "none" }}
    >
      <div className="flex divide-x-2 space-x-4 px-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index} />
        ))}
      </div>
    </header>
  );
}
