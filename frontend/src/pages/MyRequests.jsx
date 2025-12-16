import { useState, useEffect } from "react";
import axios from "axios";

export default function MyRequests() {
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    // 1. Fetch immediately when page loads
    fetchMyRequests(); 

    // 2. Set up a timer to fetch every 5 seconds (Polling)
    const interval = setInterval(() => {
      fetchMyRequests(true); // Pass 'true' to indicate background update
    }, 5000);

    // 3. Cleanup: Stop the timer if the user leaves the page
    return () => clearInterval(interval);
  }, []);

  // Updated function accepts 'isBackground' to avoid flashing the loading spinner
  const fetchMyRequests = async (isBackground = false) => {
    try {
      // Only show big loading spinner on the VERY first load
      if (!isBackground) setLoading(true);
      
      const res = await axios.get("http://localhost:5000/api/requests/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyRequests(res.data.requests || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    if (status === "Fulfilled") return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (status === "Expired") return "bg-red-100 text-red-700 border-red-200";
    return "bg-amber-100 text-amber-700 border-amber-200";
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-8">My Requests</h1>

        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading your history...</div>
        ) : myRequests.length === 0 ? (
          <div className="bg-white p-10 rounded-[2rem] text-center shadow-sm">
            <h3 className="text-lg font-bold text-slate-700">No requests found</h3>
          </div>
        ) : (
          <div className="space-y-6">
            {myRequests.map((req) => (
              <div
                key={req._id}
                className={`bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border transition-all hover:shadow-md 
                  ${req.status === "Fulfilled" ? "border-emerald-500" : "border-slate-100"}`}
              >
                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6 border-b border-slate-50 pb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-xs">
                        {req.bloodGroup}
                      </span>
                      <h3 className="text-xl font-bold text-slate-900">{req.patientName}</h3>
                    </div>
                    <p className="text-sm text-slate-500">
                      <i className="fas fa-hospital text-slate-300"></i> {req.hospital}
                    </p>
                  </div>

                  <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusStyle(req.status)}`}>
                    {req.status}
                  </div>
                </div>

                {/* DONORS LIST */}
                {req.donorsAssigned && req.donorsAssigned.length > 0 ? (
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Donor Status</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {req.donorsAssigned.map((dObj) => {
                        const donor = dObj.donor;
                        const donorStatus = dObj.status || "Accepted"; 
                        const isCompleted = donorStatus === "Completed";

                        return (
                          <div
                            key={donor?._id}
                            className={`flex items-center gap-4 p-4 rounded-xl border transition-colors
                                ${isCompleted 
                                    ? "bg-emerald-50/50 border-emerald-100" 
                                    : "bg-indigo-50/50 border-indigo-100"}`}
                          >
                            <div className="w-12 h-12 rounded-full bg-white overflow-hidden border-2 border-white shadow-sm">
                              <img
                                src={donor?.profileImage ? `http://localhost:5000${donor.profileImage}` : "https://via.placeholder.com/150"}
                                className="w-full h-full object-cover"
                                alt="donor"
                              />
                            </div>

                            <div className="flex-1">
                              <div className="font-bold text-slate-800">{donor?.name}</div>
                              <div className="text-xs text-slate-500">{donor?.phone}</div>
                            </div>

                            <div className="text-right">
                              {isCompleted ? (
                                <div className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full uppercase">
                                  <i className="fas fa-check-circle"></i> Donated
                                </div>
                              ) : (
                                <div className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full uppercase">
                                  <i className="fas fa-spinner fa-spin"></i> On Way
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-slate-400 italic">Waiting for donors...</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}