import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Stats & Data
  const [stats, setStats] = useState({ activeRequests: 0, donationsMade: 0 });
  const [myRequests, setMyRequests] = useState([]);
  const [nearbyRequests, setNearbyRequests] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (!stored) {
      navigate("/login");
      return;
    }
    setUser(stored);
    fetchDashboardData(stored._id);
  }, []);

  const fetchDashboardData = async (userId) => {
    try {
      setLoading(true);
      
      const [statsRes, myRequestsRes, activeRes] = await Promise.all([
        axios.get("http://localhost:5000/api/requests/stats", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("http://localhost:5000/api/requests/my", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("http://localhost:5000/api/requests/active") 
      ]);

      setStats({
        activeRequests: statsRes.data.activeRequests || 0,
        donationsMade: statsRes.data.donationsMade || 0
      });

      setMyRequests(myRequestsRes.data.requests || []);

      // Filter active requests: exclude my own, take top 5
      const others = activeRes.data.requests.filter(r => r.requester._id !== userId).slice(0, 5);
      setNearbyRequests(others);

    } catch (err) {
      console.error("Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
        case "Fulfilled":
        case "Completed": return "bg-emerald-50 text-emerald-600 border-emerald-100";
        case "Expired": return "bg-slate-100 text-slate-500 border-slate-200";
        default: return "bg-blue-50 text-blue-600 border-blue-100";
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20 relative overflow-hidden">
      
      {/* --- BACKGROUND ANIMATION --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-red-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-rose-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-12">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
            <p className="text-slate-500 mt-2 text-lg">Welcome back, <span className="font-bold text-slate-800">{user.name}</span>.</p>
          </div>

          <Link
            to="/create-request"
            className="group px-8 py-4 bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold rounded-2xl shadow-lg shadow-red-200 hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-3"
          >
            <i className="fas fa-plus-circle text-lg group-hover:rotate-90 transition-transform"></i> 
            Create Request
          </Link>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">

          {/* Active Requests Card */}
          <div className="bg-white p-8 rounded-3xl shadow-lg shadow-slate-200/50 border border-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full -mr-10 -mt-10 group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-red-100 rounded-2xl text-red-600 text-xl">
                        <i className="fas fa-procedures"></i>
                    </div>
                    <span className="text-4xl font-extrabold text-slate-900">{stats.activeRequests}</span>
                </div>
                <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">Active Requests</p>
            </div>
          </div>

          {/* Donations Made Card */}
          <div className="bg-white p-8 rounded-3xl shadow-lg shadow-slate-200/50 border border-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-10 -mt-10 group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600 text-xl">
                        <i className="fas fa-hand-holding-heart"></i>
                    </div>
                    <span className="text-4xl font-extrabold text-slate-900">{stats.donationsMade}</span>
                </div>
                <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">Lives Impacted</p>
            </div>
          </div>

          {/* Status Display Card (No Button) */}
          <div className={`p-8 rounded-3xl shadow-lg border relative overflow-hidden transition-all ${
              user.availability 
              ? "bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-slate-900/20" 
              : "bg-white border-white shadow-slate-200/50"
          }`}>
            <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-center">
                    <div>
                        <p className={`text-sm font-bold uppercase tracking-wider ${user.availability ? "text-slate-400" : "text-slate-500"}`}>Current Status</p>
                        <h3 className={`text-2xl font-bold mt-1 ${user.availability ? "text-white" : "text-slate-800"}`}>
                            {user.availability ? "Available" : "Unavailable"}
                        </h3>
                    </div>
                    <div className={`w-4 h-4 rounded-full ${user.availability ? "bg-emerald-400 animate-pulse shadow-[0_0_15px_rgba(52,211,153,0.6)]" : "bg-slate-300"}`}></div>
                </div>
                
                {/* Link to Profile instead of Toggle Button */}
                <Link 
                    to="/profile"
                    className={`text-sm font-bold mt-6 flex items-center gap-2 hover:underline ${
                        user.availability ? "text-slate-300" : "text-slate-500"
                    }`}
                >
                    Manage in Profile &rarr;
                </Link>
            </div>
          </div>
        </div>

        {/* ---- MAIN CONTENT GRID ---- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT SIDE: MY RECENT REQUESTS */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center px-2">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <i className="fas fa-history text-slate-400"></i> My Requests
              </h2>
              <Link to="/my-requests" className="text-sm font-bold text-red-600 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors">
                History &rarr;
              </Link>
            </div>

            {loading ? (
                <div className="text-center py-20 text-slate-400">Loading your data...</div>
            ) : myRequests.length === 0 ? (
              <div className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-white text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full mx-auto mb-6 flex items-center justify-center text-slate-300">
                  <i className="fas fa-clipboard-list text-3xl"></i>
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-800">No Requests Yet</h3>
                <p className="text-slate-500 mb-8 max-w-xs mx-auto">You haven't posted any blood requests. When you do, they will appear here.</p>
                <Link to="/create-request" className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold hover:border-red-200 hover:text-red-600 transition-all">
                  Create First Request
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {myRequests.slice(0, 3).map(req => (
                  <div key={req._id} className="bg-white p-6 rounded-[2rem] border border-white shadow-sm hover:shadow-md hover:border-red-100 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-4">
                            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 font-black text-xl shadow-sm group-hover:bg-red-600 group-hover:text-white transition-colors">
                                {req.bloodGroup}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-lg">{req.patientName}</h4>
                                <div className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                                    <i className="fas fa-hospital"></i> {req.hospital}
                                </div>
                            </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(req.status)}`}>
                            {req.status === "Fulfilled" ? "Completed" : req.status}
                        </span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                        <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                            <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md"><i className="fas fa-map-marker-alt text-red-400"></i> {req.area}</span>
                            <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md"><i className="fas fa-calendar text-slate-400"></i> {new Date(req.createdAt).toLocaleDateString()}</span>
                        </div>
                        <span className="text-xs font-bold text-slate-700">
                            {req.unitsNeeded} Units
                        </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT SIDE: URGENT NEEDS FEED */}
          <div className="space-y-6">
            
            <div className="flex justify-between items-center px-1">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 text-sm">
                   <i className="fas fa-hand-holding-heart"></i>
                </span>
                Urgent Needs
              </h2>
              <Link to="/requests" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline">
                View All
              </Link>
            </div>

            {nearbyRequests.length === 0 ? (
               <div className="bg-white p-8 rounded-[2rem] border border-white shadow-lg text-center">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full mx-auto mb-4 flex items-center justify-center text-emerald-400">
                     <i className="fas fa-check-circle text-2xl"></i>
                  </div>
                  <p className="text-slate-500 font-medium">No urgent needs nearby right now.</p>
                  <Link to="/requests" className="block mt-4 text-xs font-bold text-slate-400 hover:text-emerald-600">Check other areas &rarr;</Link>
               </div>
            ) : (
               <div className="space-y-4">
                 {nearbyRequests.map(req => (
                   <Link 
                     to="/requests" 
                     key={req._id} 
                     className="block bg-white p-5 rounded-[1.5rem] border border-white shadow-sm hover:shadow-lg hover:border-emerald-100 hover:-translate-y-1 transition-all group"
                   >
                      <div className="flex items-center justify-between mb-3">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-extrabold text-sm group-hover:bg-red-600 group-hover:text-white transition-colors">
                               {req.bloodGroup}
                            </div>
                            <div>
                               <h4 className="font-bold text-slate-900 text-sm">{req.patientName}</h4>
                               <p className="text-xs text-slate-400 truncate w-32">{req.hospital}</p>
                            </div>
                         </div>
                         <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                            <i className="fas fa-arrow-right text-xs"></i>
                         </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 bg-slate-50 px-3 py-2 rounded-lg">
                         <span className="flex items-center gap-1"><i className="fas fa-map-marker-alt text-red-400"></i> {req.city}</span>
                         <span className="text-red-500">{req.unitsNeeded} Units</span>
                      </div>
                   </Link>
                 ))}
               </div>
            )}

            {/* Helper Quote */}
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-[2rem] text-white shadow-lg shadow-indigo-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-8 -mt-8"></div>
                <p className="text-sm font-medium leading-relaxed italic opacity-90 mb-2">
                    "Every drop counts. You are someone's hero."
                </p>
                <div className="flex items-center gap-2 opacity-75">
                    <i className="fas fa-star text-xs"></i>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Community</span>
                </div>
            </div>

          </div>
        </div>

      </div>
      
      {/* Animation Styles */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 10s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}