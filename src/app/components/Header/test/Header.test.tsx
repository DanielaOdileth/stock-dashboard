import React from "react";
import { render, screen, act } from "@testing-library/react";
import { useStockContext } from "@/app/context/StockContext";
import { Header } from "..";
import { Symbol, Trade } from "@/app/types/stock";

const mockWebSocket = jest.fn();
jest.mock("../../../services/websocket", () => ({
  __esModule: true,
  default: (...args: Symbol[]) => mockWebSocket(...args),
}));

const mockAddGraphData = jest.fn();
jest.mock("../../../context/StockContext", () => ({
  useStockContext: jest.fn(),
}));

describe("Header", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render a card for each stock in context", () => {
    const tradeHandlerRef: { current: (trades: Trade[]) => void } = {
      current: () => {},
    };

    mockWebSocket.mockImplementation(
      (_: unknown, handler: (trades: Trade[]) => void) => {
        tradeHandlerRef.current = handler;
        return jest.fn();
      }
    );

    (useStockContext as jest.Mock).mockReturnValue({
      stocks: [
        { symbol: "AAPL", priceAlert: 150 },
        { symbol: "GOOGL", priceAlert: 2800 },
      ],
    });

    render(<Header />);

    screen.getByText("AAPL");
    screen.getByText("150");
    screen.getByText("GOOGL");
    screen.getByText("2800");
  });

  it("subscribes to WebSocket and updates stockData", () => {
    const tradeHandlerRef: { current: (trades: Trade[]) => void } = {
      current: () => {},
    };

    mockWebSocket.mockImplementation(
      (_, handler: (trades: Trade[]) => void) => {
        tradeHandlerRef.current = handler;
        return jest.fn();
      }
    );

    (useStockContext as jest.Mock).mockReturnValue({
      stocks: [{ symbol: "AAPL", priceAlert: 150 }],
      addGraphData: mockAddGraphData,
    });

    render(<Header />);

    // message
    act(() => {
      tradeHandlerRef.current([{ s: "AAPL", p: 155, t: Date.now(), v: 124 }]);
    });

    screen.getByText("AAPL");
    screen.getByText("155.00");
    screen.getByText("Price alert:");
    screen.getByText("150");
  });
});
