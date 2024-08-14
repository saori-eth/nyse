import { useState, useEffect, useRef } from "react";
import { myPlayer, useMultiplayerState } from "playroomkit";

export const Chat = () => {
  const playerId = myPlayer()?.id;

  const [messages, setMessages] = useMultiplayerState("messages", []);
  useEffect(() => {
    console.log("playerId", playerId);
  }, [messages]);
  const [inputText, setInputText] = useState("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = () => {
    console.log("my player", myPlayer());
    if (inputText.trim() !== "") {
      setMessages([
        ...messages,
        { id: messages.length + 1, text: inputText, playerId: playerId },
      ]);
      setInputText("");
    }
  };

  return (
    <div className="absolute bottom-4 left-4 w-80 h-96 bg-gray-900 rounded-lg shadow-lg flex flex-col z-50 overflow-hidden border border-gray-700">
      <div
        ref={messagesContainerRef}
        className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 flex flex-col-reverse"
      >
        {messages
          .slice()
          .reverse()
          .map((message: any) => (
            <div
              key={message.id}
              className={`mb-3 ${
                message.playerId === playerId ? "text-right" : "text-left"
              }`}
            >
              <span
                className={`text-xs text-gray-400 ${
                  message.playerId === playerId ? "mr-2" : "ml-2"
                }`}
              >
                {message.playerId.slice(0, 4)}
              </span>
              <span
                className={`inline-block p-2 rounded-lg ${
                  message.playerId === playerId
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-200"
                } break-words max-w-[80%] overflow-wrap-anywhere hyphens-auto`}
              >
                {message.text}
              </span>
            </div>
          ))}
      </div>
      <div className="p-3 bg-gray-800">
        <div className="flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => {
              e.stopPropagation();
              setInputText(e.target.value);
            }}
            onKeyDown={(e) => {
              e.stopPropagation();
              e.key === "Enter" && handleSend();
            }}
            className="flex-1 p-2 bg-gray-700 text-gray-100 rounded-l-md focus:outline-none placeholder-gray-400"
            placeholder="Type a message..."
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white p-2 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
