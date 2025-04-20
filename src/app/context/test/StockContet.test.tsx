import { renderHook, act } from "@testing-library/react";
import { ReactNode } from "react";
import { StockProvider, useStockContext } from "../StockContext";

const wrapper = ({ children }: { children: ReactNode }) => (
  <StockProvider>{children}</StockProvider>
);

describe("StockProvider", () => {
  it("should add a stock to the list using addStock", () => {
    const { result } = renderHook(() => useStockContext(), { wrapper });

    act(() => {
      result.current.addStock({ symbol: "AAPL", priceAlert: 20 });
    });

    expect(result.current.stocks).toEqual([
      expect.objectContaining({ symbol: "AAPL", priceAlert: 20 }),
    ]);
  });

  it("it should add graph data using addGraphData", () => {
    const { result } = renderHook(() => useStockContext(), { wrapper });

    act(() => {
      result.current.addGraphData({ time: 1000, AAPL: 29 });
    });

    expect(result.current.graphData).toEqual([
      expect.objectContaining({ time: 1000, AAPL: 29 }),
    ]);
  });
});
