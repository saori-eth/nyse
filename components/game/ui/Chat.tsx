import { useState, useEffect, useRef } from "react";
import { myPlayer, useMultiplayerState } from "playroomkit";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const Chat = () => {
  return <ChatBox />;
};

const ChatBox = () => {
  const playerId = myPlayer()?.id;
  const [name] = useLocalStorage("name", "");
  const [messages, setMessages] = useMultiplayerState("messages", []);
  useEffect(() => {
    console.log("playerId", playerId);
  }, [messages]);
  const [inputText, setInputText] = useState("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null); // Added input ref

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = () => {
    if (inputText.trim() !== "") {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          text: inputText,
          playerId: playerId,
          name: name,
        },
      ]);
      setInputText("");
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []); // Added useEffect for key events

  return (
    <div className="absolute bottom-4 left-4 w-80 h-60 bg-gray-900/40 backdrop-blur rounded-xl shadow-lg flex flex-col z-50 overflow-hidden border border-gray-700">
      <div
        ref={messagesContainerRef}
        className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 flex flex-col-reverse"
      >
        {messages
          .slice()
          .reverse()
          .map((message: any, index: number, array: any[]) => {
            const prevMessage = array[index - 1];
            const showName =
              index === 0 || message.playerId !== prevMessage?.playerId;

            return (
              <div
                key={message.id}
                className={`mb-3 flex flex-col ${
                  message.playerId === playerId ? "items-end" : "items-start"
                }`}
              >
                <span
                  className={`inline-block p-2 rounded-lg ${
                    message.playerId === playerId
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-200"
                  } break-words max-w-[80%] overflow-wrap-anywhere hyphens-auto`}
                >
                  {message.text}
                </span>
                {showName && (
                  <span
                    className={`text-xs text-gray-400 ${
                      message.playerId === playerId ? "mr-2" : "ml-2"
                    }`}
                  >
                    {message.name}
                  </span>
                )}
              </div>
            );
          })}
      </div>
      <div className="p-3 bg-gray-800/40 backdrop-blur">
        <div className="flex items-center">
          <input
            ref={inputRef} // Attached ref here
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
            className="flex-1 p-2 bg-white/20 text-black rounded-l-md focus:outline-none placeholder-gray-900"
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 p-2 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg
              className="w-6 h-6"
              fill="#7c56566a"
              stroke="#322b2b6a"
              viewBox="0 0 24 24"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 4l8 8-8 8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
