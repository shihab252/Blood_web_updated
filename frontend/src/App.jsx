import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "../public/Home";
import CreateRequest from "./pages/CreateRequest";
import NearbyRequests from "./pages/NearbyRequests";

import Register from "./pages/Register";
import Login from "./pages/Login";
import MyRequests from "./pages/MyRequests";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <div className="p-6">
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Blood Request Form Page */}
          <Route path="/create-request" element={<CreateRequest />} />

          {/* Active Requests for Donors Page */}
          <Route path="/requests" element={<NearbyRequests />} />

          {/* Auth */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/my-requests" element={<MyRequests />} />
          {/* User Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
         <Footer />
      </div>
    </BrowserRouter>
  );
}
