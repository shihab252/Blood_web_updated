import { useState, useEffect } from "react";
import axios from "axios";

export default function MyRequests() {
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    try {
      setLoading(true);
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
    switch (status) {
      case "Fulfilled":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Expired":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-amber-100 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-8">My Requests</h1>

        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading your history...</div>
        ) : myRequests.length === 0 ? (
          <div className="bg-white p-10 rounded-[2rem] text-center shadow-sm border border-slate-100">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
               <i className="fas fa-folder-open text-2xl"></i>
            </div>
            <h3 className="text-lg font-bold text-slate-700">No requests found</h3>
            <p className="text-slate-500 mt-2">You haven't posted any blood requests yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {myRequests.map((req) => (
              <div
                key={req._id}
                className={`bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border transition-all hover:shadow-md 
                  ${req.status === "Fulfilled" ? "border-emerald-500 shadow-emerald-50" 
                  : req.status === "Expired" ? "border-red-200 opacity-80" 
                  : "border-slate-100"}`}
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
                    <p className="text-sm text-slate-500 flex items-center gap-2">
                      <i className="fas fa-hospital text-slate-300"></i>
                      {req.hospital} — {req.area}, {req.city}
                    </p>
                  </div>

                  <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusStyle(req.status)}`}>
                    {req.status === "Fulfilled" ? "Completed" : req.status}
                  </div>
                </div>

                {/* COUNTERS */}
                <div className="flex gap-6 mb-6 text-sm">
                  <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-bold uppercase text-[10px] block">Needed</span>
                    <span className="font-extrabold text-slate-800 text-lg">
                      {req.unitsNeeded} <span className="text-xs font-normal">Units</span>
                    </span>
                  </div>

                  <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-bold uppercase text-[10px] block">Donors Found</span>
                    <span className="font-extrabold text-slate-800 text-lg">
                      {req.donorsAssigned?.length || 0}
                    </span>
                  </div>
                </div>

                {/* DONORS LIST */}
                {req.donorsAssigned && req.donorsAssigned.length > 0 ? (
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Accepted Donors</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                      {req.donorsAssigned.map((dObj) => {
                        const donor = dObj.donor; // ← FIX: donor inside object

                        return (
                          <div
                            key={donor?._id}
                            className="flex items-center gap-4 p-4 rounded-xl border border-indigo-100 bg-indigo-50/50 hover:bg-indigo-50 transition-colors"
                          >
                            <div className="w-12 h-12 rounded-full bg-white overflow-hidden border-2 border-white shadow-sm">
                              <img
                                src={
                                  donor?.profileImage
                                    ? `http://localhost:5000${donor.profileImage}`
                                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(donor?.name || "User")}&background=6366f1&color=fff`
                                }
                                className="w-full h-full object-cover"
                              />
                            </div>

                            <div className="flex-1">
                              <div className="font-bold text-slate-800">{donor?.name || "Unknown Donor"}</div>
                              <div className="text-xs font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-100 inline-block mt-1">
                                {donor?.phone || "No Phone"}
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full uppercase">
                                <i className="fas fa-handshake"></i> Accepted
                              </div>
                            </div>
                          </div>
                        );
                      })}

                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-slate-400 italic">
                    Waiting for donors to accept...
                  </div>
                )}

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
