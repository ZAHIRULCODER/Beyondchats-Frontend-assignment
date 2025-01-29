import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navbar />
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-10 mt-24 h-[calc(100vh-5.5rem)] overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
