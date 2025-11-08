import { useEffect, useState, useRef } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState(["hi there", "hello"]);

  const wsRef = useRef<WebSocket>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ws = new WebSocket("http://localhost:8080");
    ws.onmessage = (event) => {
      setMessages((m) => [...m, event.data]);
    };
    wsRef.current = ws;
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId: "red",
          },
        })
      );
    };
    return () => {
      ws.close;
    };
  }, []);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <div className="h-screen bg-neutral-950 flex flex-col justify-between">
      <div className="mt-8 overflow-y-auto">
        {messages.map((message) => (
          <div className="m-10 ">
            <span className="bg-cyan-100 p-4 m-8 rounded">{message} </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="bg-cyan-100 w-full flex fixed bottom-0">
        {" "}
        <input
          ref={inputRef}
          className="flex-1 p-4 outline-none border-none bg-transparent"
          placeholder="Type a message..."
        />
        <button
          className="bg-green-600 text-neutral-50 p-4 cursor-pointer outline-none border-none"
          onClick={() => {
            const message = inputRef.current?.value;
            wsRef?.current?.send(
              JSON.stringify({
                type: "chat",
                payload: {
                  message: message,
                },
              })
            );
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
export default App;
