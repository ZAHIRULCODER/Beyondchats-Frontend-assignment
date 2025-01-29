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

const statusColors = {
  completed: "text-green-600",
  scraping: "text-indigo-600",
  pending: "text-gray-400",
  error: "text-red-600",
};

export default function Organization() {
  const navigate = useNavigate();
  const [showPages, setShowPages] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);
  const [pages, setPages] = useState(initialDummyPages);
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    description: "",
  });
  const [isFetchingMeta, setIsFetchingMeta] = useState(false);

  // Simulate real-time scraping updates
  useEffect(() => {
    if (!showPages) return;

    const interval = setInterval(() => {
      setPages((prev) =>
        prev.map((page) => {
          if (page.status === "scraping") {
            const progress = Math.min(page.progress + Math.random() * 10, 100);
            return {
              ...page,
              progress,
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
    }, 3000);

    return () => clearInterval(interval);
  }, [showPages]);

  // Auto-fetch meta description
  const fetchMetaDescription = async (url) => {
    try {
      setIsFetchingMeta(true);
      const res = await fetch(
        `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`
      );
      const data = await res.json();
      const parser = new DOMParser();
      const doc = parser.parseFromString(data.contents, "text/html");
      const meta = doc.querySelector('meta[name="description"]');

      setFormData((prev) => ({
        ...prev,
        description: meta ? meta.content : "No meta description found",
      }));
    } catch (error) {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValidUrl(formData.website)) {
      toast.error("Please enter a valid website URL");
      return;
    }
    setShowPages(true);
    toast.success("Website analysis started!");
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

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
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Setup Organization
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
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
                onBlur={handleWebsiteBlur}
              />
              {isFetchingMeta && (
                <div
                  className="absolute right-3 top-3.5"
                  title="Fetching description from website...">
                  <Loader2 className="h-5 w-5 text-indigo-600 animate-spin" />
                </div>
              )}
            </div>
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

          {!showPages && (
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer flex items-center justify-center gap-2">
              Analyze Website
              <Globe className="w-4 h-4" />
            </button>
          )}
        </form>

        {showPages && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 space-y-6">
            <div className="border rounded-lg divide-y">
              {pages.map((page) => (
                <motion.div
                  key={page.url}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-2 md:p-4 flex items-center justify-between hover:bg-gray-50 hover:rounded-lg cursor-pointer group"
                  onClick={() =>
                    setSelectedPage(selectedPage === page.url ? null : page.url)
                  }>
                  <div className="flex items-center space-x-2 md:space-x-4">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="font-medium">{page.url}</p>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        {page.status === "scraping" && (
                          <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-600 transition-all duration-300"
                              style={{ width: `${page.progress}%` }}
                            />
                          </div>
                        )}
                        <span>
                          {page.status === "error"
                            ? `Error: ${page.error}`
                            : `${page.chunks} data chunks extracted`}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 md:gap-2 ${
                      statusColors[page.status]
                    }`}>
                    {getStatusIcon(page.status)}
                    <span className="capitalize">{page.status}</span>
                    {page.status === "error" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRetry(page.url);
                        }}
                        className="ml-2 p-1 hover:bg-gray-100 rounded-full">
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

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
