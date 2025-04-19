import { Trade } from "../types/stock";

const finnHubUrl = process.env.NEXT_PUBLIC_FINN_HUB_WEEBSOCKET_URL;
const finnHubApiKey = process.env.NEXT_PUBLIC_FINN_HUB_API_KEY;

const filterTrades = (trades: Trade[]) => {
  return Object.values(
    trades.reduce((acc: Record<string, Trade>, trade: Trade) => {
      if (!acc[trade.s]) {
        acc[trade.s] = trade;
      }
      return acc;
    }, {})
  );
};

const finnHubWebSocket = (
  symbols: string[],
  callback: (data: Trade[]) => void
) => {
  const socket = new WebSocket(`${finnHubUrl}?token=${finnHubApiKey}`);

  const send = (data: unknown) => {
    const message = JSON.stringify(data);
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(message);
    } else {
      const interval = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(message);
          clearInterval(interval);
        }
      }, 100);
    }
  };

  const subscribe = () => {
    symbols.forEach((symbol) => {
      send({ type: "subscribe", symbol });
    });
  };

  const unsubscribe = () => {
    symbols.forEach((symbol) => {
      send({ type: "unsubscribe", symbol });
    });
  };

  socket.addEventListener("open", () => {
    console.log("WebSocket connected");
    subscribe();
  });

  socket.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "trade") {
      callback(filterTrades(data.data));
    }
  });

  socket.addEventListener("error", (event) => {
    console.error("WebSocket error:", event);
  });

  const cleanup = () => {
    unsubscribe();
    if (
      socket.readyState === WebSocket.OPEN ||
      socket.readyState === WebSocket.CONNECTING
    ) {
      socket.close();
    }
  };

  return cleanup;
};

export default finnHubWebSocket;
