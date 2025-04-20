import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Form } from "..";
import { SelectProps } from "../../Select";

jest.mock("../../Select", () => ({
  Select: ({ onChange, value }: SelectProps) => (
    <select
      data-testid="mock-select"
      value={value}
      onChange={(e) =>
        onChange({ label: e.target.value, value: e.target.value })
      }
    >
      <option value="">Select a stock</option>
      <option value="AAPL">AAPL</option>
      <option value="GOOGL">GOOGL</option>
    </select>
  ),
}));

const mockAddStock = jest.fn();
jest.mock("../../../context/StockContext", () => ({
  useStockContext: () => ({
    addStock: mockAddStock,
  }),
}));

describe("Form", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the form correctly", () => {
    render(<Form />);

    screen.getByText("Stock:");
    screen.getByText("Price:");

    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  });

  it("should enable the Save button when inputs are completed", async () => {
    render(<Form />);

    fireEvent.change(screen.getByTestId("mock-select"), {
      target: { value: "AAPL" },
    });

    fireEvent.change(screen.getByLabelText("Price:"), {
      target: { value: "150" },
    });

    expect(screen.getByRole("button", { name: "Save" })).toBeEnabled();
  });

  it("should add stock with the input data", () => {
    render(<Form />);

    fireEvent.change(screen.getByTestId("mock-select"), {
      target: { value: "AAPL" },
    });

    fireEvent.change(screen.getByLabelText("Price:"), {
      target: { value: "150" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(mockAddStock).toHaveBeenCalledWith({
      symbol: "AAPL",
      priceAlert: 150,
    });
  });
});
