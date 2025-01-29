import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { Sparkles, MessageSquare, Share2 } from "lucide-react";
import { FacebookLogo, LinkedinLogo, TwitterLogo } from "../lib/svg";

export default function Success() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  return (
    <>
      <Confetti
        width={dimensions.width}
        height={dimensions.height}
        recycle={false}
        numberOfPieces={250}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-xl shadow-xl p-4 md:p-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Integration Successful!
          </h2>
          <p className="text-gray-600 mb-8">
            Your chatbot is now ready to assist your website visitors
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="p-4 border rounded-xl hover:border-indigo-500 flex items-center justify-center space-x-2 cursor-pointer">
              <MessageSquare className="w-5 h-5 text-indigo-600" />
              <span>Explore Admin Panel</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              className="p-4 border rounded-xl hover:border-indigo-500 flex items-center justify-center space-x-2 cursor-pointer">
              <Share2 className="w-5 h-5 text-indigo-600" />
              <span>Share Success</span>
            </motion.button>
          </div>

          <div className="flex justify-center space-x-4">
            <motion.a
              whileHover={{ scale: 1.1 }}
              href="#"
              className="text-blue-600 hover:text-blue-700">
              <FacebookLogo />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.1 }}
              href="#"
              className="text-blue-400 hover:text-blue-500">
              <TwitterLogo />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.1 }}
              href="#"
              className="text-blue-500 hover:text-blue-600">
              <LinkedinLogo />
            </motion.a>
          </div>
        </div>
      </motion.div>
    </>
  );
}
