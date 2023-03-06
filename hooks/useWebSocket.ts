import { useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";

interface useWebSocket {
  url: string;
  onOpen(this: WebSocket): void;
  onMessage(this: WebSocket, event: MessageEvent): void;
}

export function useWebSocket({ url, onOpen, onMessage }: useWebSocket) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  if (socket) {
    console.log("returning the existing one");
    return socket;
  } else if (IS_BROWSER) {
    const newSocket = new WebSocket(url);
    newSocket.addEventListener("open", onOpen);
    newSocket.addEventListener("message", onMessage);
    setSocket(newSocket);
    return newSocket;
  }
}
