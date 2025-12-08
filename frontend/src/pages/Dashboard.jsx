import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [activeRequests, setActiveRequests] = useState(0);
  const [donationsMade, setDonationsMade] = useState(0);
  const [myRequests, setMyRequests] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (stored) {
      setUser(stored);
      fetchStats();
      fetchMyRequests();
    }
  }, []);

  // ---- FETCH STATS ----
  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/requests/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setActiveRequests(res.data.activeRequests || 0);
      setDonationsMade(res.data.donationsMade || 0);

    } catch (err) {
      console.error("Stats error:", err);
    }
  };

  // ---- FETCH MY REQUESTS ----
  const fetchMyRequests = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/requests/my", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMyRequests(res.data.requests || []);

    } catch (err) {
      console.error("My requests error:", err);
    }
  };

  // Helper for Status Colors
  const getStatusBadge = (status) => {
    if (status === "Fulfilled" || status === "Completed") {
      return "bg-emerald-50 text-emerald-600 border-emerald-100";
    }
    if (status === "Expired") {
      return "bg-red-50 text-red-600 border-red-100";
    }
    return "bg-amber-50 text-amber-600 border-amber-100";
  };

  if (!user)
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
          <p className="text-xl text-slate-600 mb-4">Access Restricted</p>
          <Link to="/login" className="px-6 py-2 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition">
            Login to Dashboard
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
      <div className="max-w-6xl mx-auto px-6 mt-10">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-500 mt-1">Welcome back, hero.</p>
          </div>

          <Link
            to="/create-request"
            className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-200 hover:bg-red-700 hover:-translate-y-1 transition-all flex items-center gap-2"
          >
            <i className="fas fa-plus-circle"></i> Create Request
          </Link>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

          {/* Active Requests */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <p className="text-slate-500 text-sm mb-1 font-semibold uppercase tracking-wide">Active Requests</p>
            <div className="flex justify-between items-end">
                <h3 className="text-4xl font-extrabold text-slate-900">{activeRequests}</h3>
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                    <i className="fas fa-procedures"></i>
                </div>
            </div>
          </div>

          {/* Donations Count */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <p className="text-slate-500 text-sm mb-1 font-semibold uppercase tracking-wide">Donations Made</p>
            <div className="flex justify-between items-end">
                <h3 className="text-4xl font-extrabold text-slate-900">{donationsMade}</h3>
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                    <i className="fas fa-hand-holding-heart"></i>
                </div>
            </div>
          </div>

          {/* Status Card */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-8 -mt-8"></div>
            <div className="relative z-10">
                <p className="text-slate-400 text-sm mb-1 font-bold uppercase tracking-wide">My Status</p>
                <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-2xl font-bold">{user.availability ? "Available" : "Unavailable"}</h3>
                    <span className={`w-2.5 h-2.5 rounded-full ${user.availability ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                </div>
                <Link
                to="/profile"
                className="block w-full py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-sm font-semibold text-center transition-all"
                >
                Change Status
                </Link>
            </div>
          </div>
        </div>

        {/* ---- CONTENT GRID ---- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT SIDE: MY REQUESTS LIST */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600 text-sm">
                    <i className="fas fa-clipboard-list"></i>
                </span>
                Recent Requests
              </h2>
              <Link to="/my-requests" className="text-sm font-bold text-red-600 hover:text-red-700 hover:underline">
                View All History
              </Link>
            </div>

            {/* CONDITIONAL UI */}
            {myRequests.length === 0 ? (
              <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-100 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full mx-auto mb-4 flex items-center justify-center text-slate-300">
                  <i className="fas fa-folder-open text-2xl"></i>
                </div>
                <h3 className="text-lg font-bold mb-2 text-slate-700">No Active Requests</h3>
                <p className="text-slate-500 text-sm mb-6">Your created requests will appear here.</p>
                <Link to="/create-request" className="inline-block px-6 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 hover:border-slate-300 transition-all">
                  Start New Request
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {myRequests.slice(0, 3).map(req => (
                  <div key={req._id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-red-100 transition-all group">
                    <div className="flex justify-between items-start">
                        {/* Left: Info */}
                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600 font-bold text-lg group-hover:bg-red-600 group-hover:text-white transition-colors shadow-sm">
                                {req.bloodGroup}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-lg leading-tight">{req.patientName}</h4>
                                <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                    <i className="fas fa-hospital"></i> {req.hospital}
                                </div>
                            </div>
                        </div>

                        {/* Right: Status */}
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(req.status)}`}>
                            {req.status === "Fulfilled" ? "Completed" : req.status}
                        </span>
                    </div>

                    {/* Bottom: Details */}
                    <div className="mt-4 pt-3 border-t border-slate-50 flex justify-between items-center">
                        <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                            <span className="flex items-center gap-1"><i className="fas fa-map-marker-alt"></i> {req.area}</span>
                            <span className="flex items-center gap-1"><i className="fas fa-calendar"></i> {new Date(req.createdAt).toLocaleDateString()}</span>
                        </div>
                        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">
                            {req.unitsNeeded} Units
                        </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT SIDE: NEARBY ACTION */}
          <div>
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600 text-sm">
                 <i className="fas fa-map-marker-alt"></i> 
              </span>
              Nearby Needs
            </h2>

            <Link to="/requests" className="block bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:border-red-200 hover:shadow-md transition-all group">
              <div className="text-center">
                <div className="relative w-16 h-16 mx-auto mb-6">
                  <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-70"></div>
                  <div className="relative w-full h-full flex items-center justify-center bg-red-50 rounded-full text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                    <i className="fas fa-search-location text-2xl"></i>
                  </div>
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-1">Find Donors Nearby</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                    View urgent requests in your area and help save a life today.
                </p>
                <div className="mt-6 inline-block text-sm font-bold text-red-600 group-hover:underline">
                    View Feed &rarr;
                </div>
              </div>
            </Link>

            {/* Quote Card */}
            <div className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-3xl border border-blue-100">
                <p className="text-slate-600 italic text-sm mb-3">
                    "The blood you donate gives someone another chance at life."
                </p>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-200 rounded-full"></div>
                    <span className="text-xs font-bold text-blue-800">Community Hero</span>
                </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}