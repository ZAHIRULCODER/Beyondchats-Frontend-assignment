export const initialDummyPages = [
  { url: "/about", status: "completed", chunks: 15, lastUpdated: Date.now() },
  {
    url: "/products",
    status: "completed",
    chunks: 23,
    lastUpdated: Date.now() - 3600000,
  },
  { url: "/services", status: "pending", chunks: 0, lastUpdated: null },
  {
    url: "/contact",
    status: "error",
    chunks: 8,
    lastUpdated: Date.now() - 7200000,
    error: "Timeout error",
  },
  {
    url: "/blog",
    status: "scraping",
    chunks: 5,
    lastUpdated: Date.now(),
    progress: 65,
  },
];
