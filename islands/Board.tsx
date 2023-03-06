import { useState } from "preact/hooks";
import { useWebSocket } from "../hooks/useWebSocket.ts";

type TicTacCell = "X" | "O" | "";
type TitTacRow = [TicTacCell, TicTacCell, TicTacCell];
type TicTacToe = [TitTacRow, TitTacRow, TitTacRow];

let next: "X" | "O" = "X";

export default function Board() {
  const [msg, setMsg] = useState<string[]>([]);
  const [board, setBoard] = useState<TicTacToe>([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);
  const onOpen: (this: WebSocket) => void = function () {
    this.send("Hello Server!");
  };
  function onMessage(event: MessageEvent) {
    setMsg((msg) => [...msg, `${Date.now()}:${String(event.data)}`]);
  }

  const socket = useWebSocket({
    url: "ws://localhost:8000/ws",
    onOpen,
    onMessage,
  });

  function click(x: number, y: number) {
    return function () {
      const nextBoard: TicTacToe = [[...board[0]], [...board[1]], [
        ...board[2],
      ]];
      nextBoard[y][x] = next;
      next = next === "X" ? "O" : "X";
      setBoard(nextBoard);
    };
  }

  return (
    <div>
      <div class="grid grid-cols-3 grid-rows-3 gap-2 w-40">
        {board.map((row, y) =>
          row.map((cell, x) => (
            <div
              onClick={click(x, y)}
              class="flex items-center justify-center w-12 h-12 rounded-md bg-green-300 hover:bg-red-300 cursor-pointer"
            >
              {cell || "-"}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
