import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// FIXED: Import from ./pages, not ../public
import Home from "../public/Home"; 
import CreateRequest from "./pages/CreateRequest";
import NearbyRequests from "./pages/NearbyRequests"; // Ensure file is named NearbyRequests.jsx
import FindDonors from "./pages/FindDonors";

import Register from "./pages/Register";
import Login from "./pages/Login";
import MyRequests from "./pages/MyRequests";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import Developers from "./components/developers";


export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen font-sans text-slate-900">
        <Navbar />

        {/* Main Content: Flex-grow pushes Footer to bottom if content is short */}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />

            {/* Blood Request Form Page */}
            <Route path="/create-request" element={<CreateRequest />} />

            {/* Active Requests for Donors Page */}
            <Route path="/requests" element={<NearbyRequests />} />

            {/* Auth */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/find-donors" element={<FindDonors />} />
            <Route path="/team" element={<Developers />} />
            
            {/* User Protected Pages */}
            <Route path="/my-requests" element={<MyRequests />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </div>

        {/* Footer is now outside the padding, spanning full width */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}