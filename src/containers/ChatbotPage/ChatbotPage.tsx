import { Maximize2, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

interface Message {
  text: string;
  sender: "user" | "bot";
}

const ChatbotPage: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const navigate = useNavigate();

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const toggleFullScreen = () => {
    navigate("/chatbot-fullscreen");
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    const userMessage: Message = { text: inputValue, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue("");
    setIsTyping(true);

    const botMessage: Message = { text: await getBotResponse(inputValue), sender: "bot" };
    setMessages((prevMessages) => [...prevMessages, botMessage]);
    setIsTyping(false);
  };

  const getBotResponse = async (userMessage: string): Promise<string> => {
    try {
      const response = await fetch("https://lamprey-witty-panda.ngrok-free.app/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: userMessage }),
      });

      const data = await response.json();
      return data.assistant || "Xin lỗi, tôi không hiểu. Bạn có thể hỏi lại không?";
    } catch (error) {
      return "Xin lỗi, đã có lỗi xảy ra. Bạn có thể thử lại sau.";
    }
  };

  return (
    <div className={`fixed ${isFullScreen ? "inset-0" : "bottom-8 right-8"} z-50`}>
      {!isOpen && (
        <button
          onClick={toggleChatbot}
          className="bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-blue-600 transition-all duration-300"
        >
          <span role="img" aria-label="chat" className="text-2xl">
            💬
          </span>
        </button>
      )}

      {isOpen && (
        <div className={`absolute ${isFullScreen ? "inset-0" : "bottom-20 right-0 w-80"} bg-white rounded-lg shadow-lg animate-slide-up`}>
          <div className="bg-blue-500 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="text-lg font-semibold">Chatbot</h3>
            <div className="flex gap-2">
              <Maximize2 onClick={toggleFullScreen} className="text-white hover:text-gray-200 text-2xl cursor-pointer" />
              <button onClick={toggleChatbot} className="text-white hover:text-gray-200 text-2xl">
                <X />
              </button>
            </div>
          </div>

          <div className={`p-4 ${isFullScreen ? "h-[calc(100%-8rem)]" : "h-60"} overflow-y-auto flex flex-col gap-2`}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg max-w-[70%] ${
                  message.sender === "user" ? "bg-blue-500 text-white self-end" : "bg-gray-200 text-gray-800 self-start"
                } animate-fade-in`}
              >
                {message.text}
              </div>
            ))}
            {isTyping && (
              <div className="p-2 rounded-lg max-w-[70%] bg-gray-200 text-gray-800 self-start animate-fade-in">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-gray-800 rounded-full animate-bounce mr-1"></span>
                  <span className="w-2 h-2 bg-gray-800 rounded-full animate-bounce mr-1"></span>
                  <span className="w-2 h-2 bg-gray-800 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-200 flex gap-2">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300"
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotPage;
