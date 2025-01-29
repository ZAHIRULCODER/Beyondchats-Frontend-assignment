import { useState, useRef, useEffect } from "react";
import { Mail } from "lucide-react";
import toast from "react-hot-toast";

export default function IntegrationOptions({ codeSnippet }) {
  const [email, setEmail] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet);
    toast.success("Code copied to clipboard!");
    setIsCopied(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsCopied(false), 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Instructions sent to developer!");
    setEmail("");
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-3 md:p-6">
        <h4 className="font-medium mb-4">Copy-Paste Integration Code</h4>
        <div className="bg-black/90 text-white p-4 rounded-lg">
          <pre className="text-sm overflow-x-auto">{codeSnippet}</pre>
        </div>
        <button
          onClick={handleCopy}
          className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer border rounded-md p-2 hover:bg-gray-100 min-w-[120px]">
          <div className="relative inline-block">
            <span
              className={`inline-block transition-opacity duration-200 ${
                isCopied ? "opacity-0" : "opacity-100"
              }`}>
              Copy Code
            </span>
            <span
              className={`absolute left-0 transition-opacity duration-100 ${
                isCopied ? "opacity-100" : "opacity-0"
              }`}>
              Copied!
            </span>
          </div>
        </button>
      </div>

      <div className="border rounded-lg p-3 md:p-6">
        <h4 className="font-medium mb-4">Email Instructions to Developer</h4>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex items-center flex-wrap gap-4">
            <input
              type="email"
              placeholder="Developer's email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 p-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-indigo-600 max-md:w-full text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2 cursor-pointer max-md:justify-center disabled:opacity-50 disabled:cursor-not-allowed">
              <Mail className="w-4 h-4" />
              <span>Send</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
