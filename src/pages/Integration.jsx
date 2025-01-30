import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Code2, MessageSquare, XIcon } from "lucide-react";
import toast from "react-hot-toast";
import IntegrationCard from "../components/IntegrationCard";
import IntegrationOptions from "../components/IntegrationOptions";
import { SendChatLogo } from "../lib/svg";

export default function Integration() {
  const navigate = useNavigate();
  const [showTestChat, setShowTestChat] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you today?", isBot: true },
    { id: 2, text: "What services do you offer?", isBot: false },
    {
      id: 3,
      text: "We offer a wide range of services including...",
      isBot: true,
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatContainerRef = useRef(null);

  const handleTestIntegration = () => {
    toast.success("Integration successful!");
    navigate("/success");
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isBotTyping]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: inputMessage,
      isBot: false,
    };
    setMessages([...messages, newMessage]);
    setInputMessage("");

    setIsBotTyping(true);

    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: "This is a simulated response. In real integration, I'll use your API.",
        isBot: true,
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsBotTyping(false);
    }, 1000);
  };

  const dummyCode = `<script>
  window.beyondChatsConfig = {
    apiKey: 'YOUR_API_KEY',
    organizationId: 'YOUR_ORG_ID'
  };
</script>
<script src="https://cdn.beyondchats.com/widget.js" async></script>`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-xl p-4 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Chatbot Integration & Testing
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <IntegrationCard
            icon={MessageSquare}
            title="Test Chatbot"
            description="Preview how your chatbot will look and function on your website"
            onClick={() => setShowTestChat(true)}
          />

          <IntegrationCard
            icon={Code2}
            title="Integrate on Website"
            description="Get the code snippet to add the chatbot to your website"
            onClick={handleTestIntegration}
          />
        </div>

        {showTestChat && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 border rounded-xl p-3 md:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Preview Mode</h3>
              <button
                onClick={() => setShowTestChat(false)}
                className="text-gray-500 hover:text-gray-700 cursor-pointer p-1">
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-gray-100 rounded-lg relative min-h-[300px] md:min-h-[480px]">
              <div className="md:absolute bottom-0 md:bottom-4 left-0 right-0 md:left-auto md:right-4 w-full md:w-80">
                <div className="bg-white rounded-lg shadow-lg md:mx-0">
                  <div className="p-4 border-b bg-indigo-600 text-white rounded-t-lg">
                    <h4 className="font-medium text-sm md:text-base">
                      BeyondChats Assistant
                    </h4>
                  </div>
                  <div
                    ref={chatContainerRef}
                    className="p-4 h-60 md:h-80 overflow-y-auto">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.isBot ? "justify-start" : "justify-end"
                          }`}>
                          <div
                            className={`rounded-lg p-3 max-w-[90%] md:max-w-[80%] text-sm md:text-base ${
                              message.isBot
                                ? "bg-indigo-100"
                                : "bg-indigo-600 text-white"
                            }`}>
                            {message.text}
                          </div>
                        </div>
                      ))}
                      {isBotTyping && (
                        <div className="flex justify-start">
                          <div className="rounded-lg p-3 max-w-[90%] md:max-w-[80%] bg-indigo-100">
                            <div className="flex space-x-2">
                              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-[bounce_1s_infinite_200ms]" />
                              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-[bounce_1s_infinite_400ms]" />
                              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-[bounce_1s_infinite_600ms]" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <form onSubmit={handleSendMessage} className="border-t">
                    <div className="p-4">
                      <div className="relative">
                        <input
                          type="text"
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          placeholder="Type your message..."
                          className="w-full p-2 pr-10 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base"
                        />
                        <button
                          type="submit"
                          className="absolute right-2 top-2.5 text-indigo-600 cursor-pointer hover:text-indigo-800">
                          <SendChatLogo />
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 rounded-lg flex items-center space-x-2">
              <p className="text-yellow-800 text-sm md:text-base">
                Chatbot not working as intended?{" "}
                <button className="underline font-medium">
                  Share feedback
                </button>
              </p>
            </div>
          </motion.div>
        )}

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Integration Options</h3>
          <IntegrationOptions codeSnippet={dummyCode} />
        </div>
      </div>
    </motion.div>
  );
}
