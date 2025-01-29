import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Registration from "./pages/Registration";
import Organization from "./pages/Organization";
import Integration from "./pages/Integration";
import Success from "./pages/Success";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Registration />} />
          <Route path="organization" element={<Organization />} />
          <Route path="integration" element={<Integration />} />
          <Route path="success" element={<Success />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
