import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// Added Sector for custom pie chart shape
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Sector } from 'recharts';

// --- CUSTOM CHART COMPONENTS ---

// 1. Custom Hover Shape for Pie Chart
const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill="#334155" className="text-lg font-bold">
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        className="drop-shadow-lg" // Add shadow to popping slice
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#334155" fontSize={14} fontWeight={600}>{`Count: ${value}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#94a3b8" fontSize={12}>
        {`(Rate: ${(percent * 100).toFixed(0)}%)`}
      </text>
    </g>
  );
};

// 2. Custom Tooltip for Bar Chart
const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white p-4 rounded-xl shadow-xl border border-slate-100">
        <p className="text-sm font-bold text-slate-700 mb-1">{label}</p>
        <p className="text-lg font-extrabold" style={{ color: data.fill }}>
          {data.value} Requests
        </p>
      </div>
    );
  }
  return null;
};


export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalRequests: 0, activeRequests: 0, suspendedUsers: 0 });
  // State for Pie Chart Hover interaction
  const [pieActiveIndex, setPieActiveIndex] = useState(0);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, requestsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/admin/users", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("http://localhost:5000/api/admin/requests", { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const userList = usersRes.data.users;
      const reqList = requestsRes.data.requests;

      setUsers(userList);
      setRequests(reqList);

      setStats({
        totalUsers: userList.length,
        totalRequests: reqList.length,
        activeRequests: reqList.filter(r => r.status === "Pending" || r.status === "Accepted").length,
        suspendedUsers: userList.filter(u => u.isSuspended).length
      });

    } catch (err) {
      console.error("Admin Fetch Error:", err);
      alert("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  // --- CHART DATA HELPERS ---
  const getBloodGroupStats = useCallback(() => {
    const counts = {};
    users.forEach(u => {
      if (u.role === 'user' && !u.isSuspended) { 
        counts[u.bloodGroup] = (counts[u.bloodGroup] || 0) + 1;
      }
    });
    return Object.keys(counts).map(bg => ({ name: bg, value: counts[bg] }));
  }, [users]);

  const getRequestStatusStats = useCallback(() => {
    const counts = { Pending: 0, Accepted: 0, Completed: 0, Expired: 0 };
    requests.forEach(r => {
      const status = r.status === "Fulfilled" ? "Completed" : r.status;
      if (counts[status] !== undefined) counts[status]++;
    });
    return Object.keys(counts).map(st => ({ name: st, value: counts[st] }));
  }, [requests]);

  // Updated Color Palettes for a more premium look
  const PIE_COLORS = ['#EF4444', '#F97316', '#FBBF24', '#10B981', '#0EA5E9', '#6366F1', '#8B5CF6', '#EC4899'];
  const BAR_COLORS = { 
    Pending: '#3B82F6',   // Blue
    Accepted: '#F59E0B',  // Amber
    Completed: '#10B981', // Emerald
    Expired: '#94A3B8'    // Slate
  };

  const onPieEnter = (_, index) => {
    setPieActiveIndex(index);
  };

  // --- ACTIONS ---
  const handleToggleSuspend = async (userId) => {
    if(!confirm("Are you sure you want to change this user's suspension status?")) return;
    try {
      await axios.put(`http://localhost:5000/api/admin/users/${userId}/toggle-suspend`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.map(u => u._id === userId ? { ...u, isSuspended: !u.isSuspended } : u));
    } catch (err) {
      alert("Action failed");
    }
  };

  const handleDeleteRequest = async (reqId) => {
    if(!confirm("Permanently delete this request? This cannot be undone.")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/requests/${reqId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(requests.filter(r => r._id !== reqId));
    } catch (err) {
      alert("Delete failed");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <i className="fas fa-circle-notch animate-spin text-3xl text-red-600"></i>
        <p className="text-slate-500 font-bold">Loading Admin Panel...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      
      {/* Top Bar */}
      <div className="bg-slate-900 text-white pt-10 pb-24 px-6 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-96 h-96 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center relative z-10">
           <div>
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold mb-2 border border-white/20">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                Admin Portal
             </div>
             <h1 className="text-3xl font-extrabold">System Overview</h1>
           </div>
           
           <div className="flex gap-2 mt-4 md:mt-0 bg-white/10 p-1 rounded-xl border border-white/10">
             {['overview', 'users', 'requests'].map((tab) => (
               <button
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={`px-6 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                   activeTab === tab 
                     ? 'bg-white text-slate-900 shadow-lg' 
                     : 'text-slate-400 hover:text-white hover:bg-white/5'
                 }`}
               >
                 {tab}
               </button>
             ))}
           </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
        
        {/* --- VIEW: OVERVIEW --- */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fade-in-up">
            
            {/* 1. Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Total Users", val: stats.totalUsers, icon: "fa-users", color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Total Requests", val: stats.totalRequests, icon: "fa-bullhorn", color: "text-purple-600", bg: "bg-purple-50" },
                { label: "Active Requests", val: stats.activeRequests, icon: "fa-heartbeat", color: "text-red-600", bg: "bg-red-50" },
                { label: "Suspended Users", val: stats.suspendedUsers, icon: "fa-ban", color: "text-amber-600", bg: "bg-amber-50" },
              ].map((s, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 flex items-center justify-between">
                   <div>
                     <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{s.label}</p>
                     <h2 className="text-3xl font-extrabold text-slate-800">{s.val}</h2>
                   </div>
                   <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${s.bg} ${s.color}`}>
                     <i className={`fas ${s.icon}`}></i>
                   </div>
                </div>
              ))}
            </div>

            {/* 2. Charts Section (UPGRADED) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Pie Chart: Donor Distribution - Modern Donut Style with Pop-out hover */}
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 flex flex-col">
                <div className="mb-6">
                   <h3 className="font-bold text-slate-800 text-lg">Active Donor Pool</h3>
                   <p className="text-xs text-slate-400">Distribution by Blood Group (Excludes suspended)</p>
                </div>
                <div className="flex-grow min-h-[350px] -ml-4"> {/* Negative margin to offset padding for centered look */}
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        activeIndex={pieActiveIndex}
                        activeShape={renderActiveShape} // Use the custom shape
                        data={getBloodGroupStats()}
                        cx="50%"
                        cy="50%"
                        innerRadius={80} // Thinner donut look
                        outerRadius={110}
                        paddingAngle={4} // Space between slices
                        dataKey="value"
                        onMouseEnter={onPieEnter}
                      >
                        {getBloodGroupStats().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="none" />
                        ))}
                      </Pie>
                      {/* Removed default Tooltip, using activeShape info instead for cleaner look */}
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bar Chart: Request Status - Round bars, clean grid, custom tooltip */}
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 flex flex-col">
                 <div className="mb-6">
                   <h3 className="font-bold text-slate-800 text-lg">Request Outcomes</h3>
                   <p className="text-xs text-slate-400">Current status of all blood requests</p>
                </div>
                <div className="flex-grow min-h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getRequestStatusStats()} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                      <Tooltip content={<CustomBarTooltip />} cursor={{ fill: '#f1f5f9', radius: [12, 12, 0, 0] }} />
                      <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={40}> {/* Rounder, thicker bars */}
                        {getRequestStatusStats().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={BAR_COLORS[entry.name] || '#94A3B8'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* --- VIEW: USERS TABLE (Unchanged from previous version) --- */}
        {activeTab === "users" && (
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-fade-in-up">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-lg">User Management</h3>
              <span className="text-xs font-bold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200">{users.length} Users</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs font-bold text-slate-400 uppercase bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map(u => (
                    <tr key={u._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-xs ${u.isSuspended ? 'bg-slate-300' : 'bg-red-500'}`}>
                            {u.bloodGroup}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{u.name}</p>
                            <p className="text-xs text-slate-500">{u.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div className="flex flex-col">
                          <span>{u.email}</span>
                          <span className="text-xs text-slate-400">{u.phone}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {u.city}, {u.district}
                      </td>
                      <td className="px-6 py-4">
                        {u.isSuspended ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-red-50 text-red-600">
                            <i className="fas fa-ban"></i> Suspended
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-600">
                            <i className="fas fa-check"></i> Active
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {u.role !== 'admin' && (
                          <button 
                            onClick={() => handleToggleSuspend(u._id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                              u.isSuspended 
                                ? 'border-emerald-200 text-emerald-600 hover:bg-emerald-50' 
                                : 'border-slate-200 text-slate-500 hover:border-red-200 hover:text-red-600'
                            }`}
                          >
                            {u.isSuspended ? "Unsuspend" : "Suspend"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- VIEW: REQUESTS TABLE (Unchanged from previous version) --- */}
        {activeTab === "requests" && (
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-fade-in-up">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-lg">Request Management</h3>
              <span className="text-xs font-bold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200">{requests.length} Requests</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs font-bold text-slate-400 uppercase bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4">Patient / Hospital</th>
                    <th className="px-6 py-4">Blood Need</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Requester</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {requests.map(r => (
                    <tr key={r._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{r.patientName}</p>
                          <p className="text-xs text-slate-500"><i className="fas fa-hospital mr-1"></i>{r.hospital}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-2">
                           <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded text-xs border border-red-100">{r.bloodGroup}</span>
                           <span className="text-xs text-slate-500">{r.unitsNeeded} Units</span>
                         </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          r.status === 'Completed' || r.status === 'Fulfilled' ? 'bg-emerald-50 text-emerald-600' :
                          r.status === 'Pending' ? 'bg-blue-50 text-blue-600' :
                          r.status === 'Expired' ? 'bg-slate-100 text-slate-500' :
                          'bg-amber-50 text-amber-600'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                         {r.requester?.name || "Unknown"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDeleteRequest(r._id)}
                          className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all flex items-center justify-center"
                          title="Delete Request"
                        >
                          <i className="fas fa-trash-alt text-xs"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
      
      {/* Animation Style */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}