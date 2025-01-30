import { useState, useRef, useEffect } from "react";
import { Mail } from "lucide-react";
import toast from "react-hot-toast";

/**
 * Component for providing integration options: Copy code or email instructions
 * @param {Object} props - Component properties
 * @param {string} props.codeSnippet - Code snippet to be copied or shared
 */
export default function IntegrationOptions({ codeSnippet }) {
  // State for managing email input and copy status
  const [email, setEmail] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  // Ref for managing the timeout to reset the "Copied" state
  const timeoutRef = useRef(null);

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  /**
   * Handles copying the code snippet to the clipboard
   */
  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet);
    toast.success("Code copied to clipboard!");
    setIsCopied(true);

    // Clear existing timeout and set a new one to reset "Copied" state
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsCopied(false), 1000);
  };

  /**
   * Handles form submission for sending email instructions
   * @param {Event} e - Form submission event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Instructions sent to developer!");
    setEmail(""); // Reset email input after submission
  };

  return (
    <div className="space-y-4">
      {/* Copy-Paste Integration Section */}
      <div className="border rounded-lg p-3 md:p-6">
        <h4 className="font-medium mb-4">Copy-Paste Integration Code</h4>
        <div className="bg-black/90 text-white p-4 rounded-lg">
          {/* Display the code snippet with scrollable overflow */}
          <pre className="text-sm overflow-x-auto">{codeSnippet}</pre>
        </div>
        {/* Copy button with "Copied" feedback */}
        <button
          onClick={handleCopy}
          className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer border rounded-md p-2 hover:bg-gray-100 min-w-[120px]">
          <div className="relative inline-block">
            {/* Toggle between "Copy Code" and "Copied!" text */}
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

      {/* Email Instructions Section */}
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
