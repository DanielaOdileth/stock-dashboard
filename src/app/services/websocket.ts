const finnHubUrl = process.env.NEXT_PUBLIC_FINN_HUB_WEEBSOCKET_URL;
const finnHubApiKey = process.env.NEXT_PUBLIC_FINN_HUB_API_KEY;

let socket: WebSocket | null = null;

export const getFinnHubWebSocket = () => {
  if (!socket || socket.readyState === WebSocket.CLOSED) {
    socket = new WebSocket(`${finnHubUrl}?token=${finnHubApiKey}`);
  }
  return socket;
};
