import React from "react";
import { render, screen, act } from "@testing-library/react";
import { useStockContext } from "@/app/context/StockContext";
import { Header } from "..";
import { Trade } from "@/app/types/stock";
import { useStockSocket } from "@/app/hooks/useStockSocket";

jest.mock("../../../context/StockContext", () => ({
  useStockContext: jest.fn(),
}));

jest.mock("../../../hooks/useStockSocket", () => ({
  useStockSocket: jest.fn(),
}));

describe("Header", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.only("should render a card for each stock in context", () => {
    const mockStocks = [
      { symbol: "AAPL", priceAlert: 150 },
      { symbol: "GOOGL", priceAlert: 200 },
    ];

    (useStockContext as jest.Mock).mockReturnValue({
      stocks: mockStocks,
    });

    let socketCallback: (trades: Trade[]) => void = () => {};
    (useStockSocket as jest.Mock).mockImplementation(({ addTradeData }) => {
      socketCallback = addTradeData;
    });

    render(<Header />);

    act(() => {
      socketCallback([
        { s: "AAPL", p: 160, t: Date.now(), v: 1234 },
        { s: "GOOGL", p: 2800, t: Date.now(), v: 1234 },
      ]);
    });

    screen.getByText("AAPL");
    screen.getByText("160.00"); // price
    screen.getByText("150");

    screen.getByText("GOOGL");
    screen.getByText("2800.00"); // price
    screen.getByText("200");

    /** two cards */
    expect(screen.getAllByText("Price alert:")).toHaveLength(2);
  });
});
