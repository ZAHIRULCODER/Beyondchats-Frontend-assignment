import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Code2, MessageSquare, ExternalLink, XIcon } from "lucide-react";
import toast from "react-hot-toast";
import IntegrationCard from "../components/IntegrationCard";
import IntegrationOptions from "../components/IntegrationOptions";

export default function Integration() {
  const navigate = useNavigate();
  const [showTestChat, setShowTestChat] = useState(false);

  const handleTestIntegration = () => {
    toast.success("Integration successful!");
    navigate("/success");
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
                  <div className="p-4 h-60 md:h-80 overflow-y-auto">
                    <div className="space-y-4">
                      <div className="flex justify-end">
                        <div className="bg-indigo-100 rounded-lg p-3 max-w-[90%] md:max-w-[80%] text-sm md:text-base">
                          Hello! How can I help you today?
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-lg p-3 max-w-[90%] md:max-w-[80%] text-sm md:text-base">
                          What services do you offer?
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <div className="bg-indigo-100 rounded-lg p-3 max-w-[90%] md:max-w-[80%] text-sm md:text-base">
                          We offer a wide range of services including...
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Type your message..."
                        className="w-full p-2 pr-10 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base"
                      />
                      <button className="absolute right-2 top-2.5 text-indigo-600 cursor-pointer">
                        <ExternalLink className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    </div>
                  </div>
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
