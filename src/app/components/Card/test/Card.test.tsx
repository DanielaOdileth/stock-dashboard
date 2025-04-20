import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Card, CardProps } from "..";

const subject = (props: CardProps) => render(<Card {...props} />);

describe("Card", () => {
  it("should render the component correctly", () => {
    subject({ symbol: "AAPL", price: 150, priceAlert: 140, percentage: 2.5 });

    screen.getByText("AAPL");
    screen.getByText("150.00");
    screen.getByText("2.50%");
    screen.getByText("Price alert:");
    screen.getByText("140");
  });

  it("should show green background if price is low than alertPrice", async () => {
    subject({ symbol: "TSLA", price: 130, priceAlert: 140, percentage: 2.5 });
    const card = (await screen.findByText("TSLA")).parentNode?.parentNode
      ?.parentNode;
    expect(card).toHaveClass("bg-green-900");
  });

  it("should show green red if price is high than alertPrice", async () => {
    subject({ symbol: "BARN", price: 160, priceAlert: 140, percentage: 2.5 });

    const card = (await screen.findByText("BARN")).parentNode?.parentNode
      ?.parentNode;
    expect(card).toHaveClass("bg-red-900");
  });
});
