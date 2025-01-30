import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Globe,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { initialDummyPages } from "../lib/constants";

// Status color mapping for different scraping states
const statusColors = {
  completed: "text-green-600",
  scraping: "text-indigo-600",
  pending: "text-gray-400",
  error: "text-red-600",
};

/**
 * Organization Setup Component
 * Handles company profile creation and website scraping simulation
 * Includes form validation, meta description fetching, and real-time scraping status updates
 */
export default function Organization() {
  const navigate = useNavigate();
  const [showPages, setShowPages] = useState(false); // Toggles between form and results view
  const [selectedPage, setSelectedPage] = useState(null); // Track expanded page details
  const [pages, setPages] = useState(initialDummyPages); // Scraped pages data
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    description: "",
  });
  const [isFetchingMeta, setIsFetchingMeta] = useState(false); // Loading state for meta fetch

  // Simulate real-time scraping progress updates
  useEffect(() => {
    if (!showPages) return; // Only run when results are shown

    // Simulate real-time progress updates
    const interval = setInterval(() => {
      setPages((prev) =>
        prev.map((page) => {
          if (page.status === "scraping") {
            // Calculate random progress increment
            const progress = Math.min(page.progress + Math.random() * 10, 100);
            return {
              ...page,
              progress,
              // Generate random chunk count when complete
              chunks:
                progress === 100
                  ? Math.floor(Math.random() * 20) + 5
                  : page.chunks,
              status: progress === 100 ? "completed" : "scraping",
              lastUpdated: Date.now(),
            };
          }
          return page;
        })
      );
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [showPages]);

  /**
   * Fetches meta description from website using CORS proxy
   * @param {string} url - Website URL to fetch metadata from
   */
  const fetchMetaDescription = async (url) => {
    try {
      setIsFetchingMeta(true);
      // Use CORS proxy to bypass restrictions
      const res = await fetch(
        `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`
      );
      const data = await res.json();
      // Parse HTML response for meta description
      const parser = new DOMParser();
      const doc = parser.parseFromString(data.contents, "text/html");
      const meta = doc.querySelector('meta[name="description"]');

      setFormData((prev) => ({
        ...prev,
        description: meta ? meta.content : "No meta description found",
      }));
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch meta description");
    } finally {
      setIsFetchingMeta(false);
    }
  };

  const handleWebsiteBlur = async () => {
    if (formData.website && !formData.description) {
      await fetchMetaDescription(formData.website);
    }
  };

  // Form validation and submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValidUrl(formData.website)) {
      toast.error("Please enter a valid website URL");
      return;
    }
    setShowPages(true);
    toast.success("Website analysis started!");
  };

  // URL validation helper
  const isValidUrl = (url) => {
    try {
      new URL(url); // Native URL validation
      return true;
    } catch {
      return false;
    }
  };

  // Status icon renderer based on scraping state
  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5" />;
      case "error":
        return <AlertCircle className="w-5 h-5" />;
      case "scraping":
        return <Loader2 className="w-5 h-5 animate-spin" />;
      default:
        return null;
    }
  };

  // Retry failed scraping attempts
  const handleRetry = (url) => {
    setPages((prev) =>
      prev.map((page) =>
        page.url === url ? { ...page, status: "scraping", progress: 0 } : page
      )
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-xl p-4 md:p-8">
        {/* Main Form Section */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Setup Organization
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Company Name Input */}
            <div className="relative">
              <Building2 className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Company Name"
                className="pl-10 w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>

            {/* Website URL Input with Meta Fetch */}
            <div className="relative">
              <Globe className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="url"
                placeholder="Company Website URL"
                className={`pl-10 w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  isFetchingMeta ? "bg-gray-50 cursor-not-allowed" : ""
                }`}
                required
                value={formData.website}
                disabled={isFetchingMeta}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, website: e.target.value }))
                }
                onBlur={handleWebsiteBlur} // Trigger meta fetch on blur
              />
              {/* Meta fetch loading indicator */}
              {isFetchingMeta && (
                <div
                  className="absolute right-3 top-3.5"
                  title="Fetching description from website...">
                  <Loader2 className="h-5 w-5 text-indigo-600 animate-spin" />
                </div>
              )}
            </div>

            {/* Company Description Textarea */}
            <div className="relative">
              <FileText className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <textarea
                placeholder="Company Description"
                className="pl-10 w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          {/* Form Submission Button */}
          {!showPages && (
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer flex items-center justify-center gap-2">
              Analyze Website
              <Globe className="w-4 h-4" />
            </button>
          )}
        </form>

        {/* Scraping Results Section */}
        {showPages && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 space-y-6">
            {/* Pages List */}
            <div className="border rounded-lg divide-y">
              {pages.map((page) => (
                <motion.div
                  key={page.url}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-2 md:p-4 flex flex-col md:flex-row items-start md:items-center justify-between hover:bg-gray-50 hover:rounded-lg cursor-pointer group"
                  onClick={() =>
                    setSelectedPage(selectedPage === page.url ? null : page.url)
                  }>
                  {/* Page URL and Progress - Mobile Stacked Layout */}
                  <div className="flex items-start space-x-2 md:space-x-4 w-full">
                    <Globe className="w-5 h-5 text-gray-400 mt-1 md:mt-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium break-words text-sm md:text-base">
                        {page.url}
                      </p>
                      <div className="text-sm text-gray-500 flex flex-col md:flex-row md:items-center gap-2 mt-1 md:mt-0">
                        {page.status === "scraping" && (
                          <div className="w-20 md:w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-600 transition-all duration-300"
                              style={{ width: `${page.progress}%` }}
                            />
                          </div>
                        )}
                        <span className="text-xs md:text-sm">
                          {page.status === "error"
                            ? `Error: ${page.error}`
                            : `${page.chunks} data chunks extracted`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Indicator - Right-aligned for mobile */}
                  <div
                    className={`flex items-center gap-1.5 md:gap-2 mt-2 md:mt-0 ml-7 md:ml-0 ${
                      statusColors[page.status]
                    }`}>
                    {getStatusIcon(page.status)}
                    <span className="capitalize text-sm md:text-base">
                      {page.status}
                    </span>
                    {page.status === "error" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRetry(page.url);
                        }}
                        className="ml-2 p-1.5 hover:bg-gray-100 rounded-full">
                        <RefreshCw className="w-4.5 h-4.5" />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Expanded Page Details */}
            <AnimatePresence>
              {selectedPage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border rounded-lg overflow-hidden">
                  <div className="p-2 md:p-4">
                    <h3 className="font-medium mb-4 flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      Data Chunks from {selectedPage}
                    </h3>
                    <div className="grid gap-2">
                      {/* Dummy Content Chunks */}
                      {/* 1. Create an array of N length where N = number of
                      chunks for the selected page: - Find the selected page in
                      the pages array using URL - Use optional chaining (?.) to
                      safely access chunks property - Fallback to 0 if no chunks
                      found to prevent errors  
                      
                      2. Map over the created array to generate content chunks:
                      - Using index (_) parameter since array elements are empty
                      - index (i) will be 0, 1, 2,...N-1 

                      3. Create an animated div for each content chunk:
                      - Using Framer Motion's motion.div for animations
                      - Each chunk gets a unique key based on index
                      - Fade-in animation using opacity
                      - Styling classes for appearance

                      4. Generate dummy content for each chunk:
                      - Pass the selected page URL and current index
                      - Function returns different text variations based on inputs                    
                      */}
                      {[
                        ...Array(
                          pages.find((p) => p.url === selectedPage)?.chunks || 0
                        ),
                      ].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="p-3 bg-gray-50 rounded-lg text-sm font-mono text-gray-600 break-words">
                          {generateDummyContent(selectedPage, i)}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Controls */}
            <div className="md:flex-row flex flex-col-reverse justify-between items-center gap-6">
              <button
                onClick={() => setShowPages(false)}
                className="text-gray-600 hover:text-gray-800 flex items-center gap-2 cursor-pointer">
                <ChevronLeft size={18} />
                Back to Setup
              </button>
              <button
                onClick={() => navigate("/integration")}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 cursor-pointer">
                Continue to Integration
                <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

/**
 * Generates dummy content for scraped page preview
 * @param {string} pageUrl - URL of the scraped page
 * @param {number} index - Chunk index
 * @returns {string} Generated content string
 */
function generateDummyContent(pageUrl, index) {
  const lorem = "Lorem ipsum dolor sit amet consectetur adipisicing elit. ";
  const variations = [
    `Learn more about our ${pageUrl.slice(1)} services: ${lorem.repeat(2)}`,
    `Important update regarding ${pageUrl.slice(1)}: ${lorem.repeat(3)}`,
    `Service description for ${pageUrl.slice(1)} page: ${lorem.repeat(4)}`,
    `Content section ${index + 1}: ${lorem.repeat(1)}`,
    `Key points about ${pageUrl.slice(1)}: ${lorem.repeat(2)}`,
  ];
  return variations[index % variations.length];
}
