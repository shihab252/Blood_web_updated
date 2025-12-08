import { useState, useEffect } from "react";
import axios from "axios";
import locationData from "../data/locationData";
import bloodGroups from "../data/bloodGroups";

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // Filters
  const [filterBlood, setFilterBlood] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("");

  useEffect(() => {
    fetchRequests();
  }, [filterBlood, filterDistrict]);

  const fetchRequests = async () => {
    try {
      setLoading(true);

      let url = "http://localhost:5000/api/requests/active?";
      if (filterBlood) url += `bloodGroup=${encodeURIComponent(filterBlood)}&`;
      if (filterDistrict) url += `district=${encodeURIComponent(filterDistrict)}`;

      const res = await axios.get(url);

      const uId = user?._id;

      // --- LOGIC FIX HERE ---
      const enhanced = res.data.requests.map((r) => {
        // Find if the current user is in the assigned list
        const myAssignment = r.donorsAssigned?.find(entry => {
            const entryDonorId = entry.donor?._id || entry.donor; // Handle populated vs unpopulated
            return String(entryDonorId) === String(uId);
        });

        const hasAccepted = !!myAssignment; // True if found
        const hasCompleted = myAssignment?.status === 'Completed'; // True if status is Completed
        
        const hasRejected = r.rejectedDonors?.includes(uId);
        const isRequester = String(r.requester?._id) === String(uId);

        return { ...r, hasAccepted, hasCompleted, hasRejected, isRequester };
      });

      setRequests(enhanced);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    if (!token) return alert("Please login first.");
    if (!confirm("Are you sure you want to accept and donate?")) return;

    try {
      await axios.post(
        `http://localhost:5000/api/requests/${requestId}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Accepted! Requester has been notified.");
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to accept request.");
    }
  };

  const handleReject = async (requestId) => {
    if (!token) return;

    try {
      await axios.post(
        `http://localhost:5000/api/requests/${requestId}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  const handleComplete = async (requestId) => {
    if (!token) return alert("You must be logged in.");

    if (!confirm("Confirm that you have donated and want to mark this as completed?"))
      return;

    try {
      await axios.put( // Changed to PUT to match backend
        `http://localhost:5000/api/requests/${requestId}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Hero! Donation completed. Your last donation date has been updated.");
      fetchRequests(); // Refresh to update UI
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to complete donation.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-rose-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Active Requests</h1>
            <p className="text-slate-500 mt-1">Heroes needed nearby. Can you help?</p>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <select
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white cursor-pointer"
              value={filterBlood}
              onChange={(e) => setFilterBlood(e.target.value)}
            >
              <option value="">All Blood Groups</option>
              {bloodGroups.map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>

            <select
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white cursor-pointer"
              value={filterDistrict}
              onChange={(e) => setFilterDistrict(e.target.value)}
            >
              <option value="">All Districts</option>
              {locationData.map((d) => (
                <option key={d.district} value={d.district}>
                  {d.district}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Requests Grid */}
        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading...</div>
        ) : requests.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2rem] shadow-sm">
            <p className="text-slate-500 text-lg">No active requests found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((req) => (
              <div
                key={req._id}
                className={`bg-white rounded-3xl p-6 shadow-lg border relative transition-all ${
                  req.hasCompleted 
                    ? "border-emerald-400 bg-emerald-50/20" 
                    : req.hasAccepted 
                    ? "border-emerald-200 bg-emerald-50/20" // Changed background to green tint for accepted
                    : "border-slate-100"
                }`}
              >
                {/* Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                    req.hasCompleted ? "bg-emerald-100 text-emerald-700" :
                    req.hasAccepted ? "bg-emerald-100 text-emerald-700" : // Changed badge to green for accepted
                    "bg-red-50 text-red-600"
                  }`}>
                    {req.hasCompleted ? "Donated" : req.hasAccepted ? "Accepted" : req.status}
                  </span>
                </div>

                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold ${
                    req.hasCompleted || req.hasAccepted ? "bg-emerald-500" : "bg-red-600" // Changed icon bg to green for accepted/completed
                  }`}>
                    {req.bloodGroup}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{req.patientName}</h3>
                    <p className="text-slate-500 text-xs">
                      <i className="fas fa-hospital"></i> {req.hospital}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3 mb-6">
                  <div className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl">
                    <i className="fas fa-map-marker-alt text-red-400"></i>{" "}
                    {req.area}, {req.city}
                  </div>
                  <div className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl">
                    <i className="fas fa-tint text-red-400"></i>{" "}
                    {req.unitsNeeded} Units Required
                  </div>
                </div>

                {/* BUTTON LOGIC */}
                {req.isRequester ? (
                  <button className="w-full py-3 bg-slate-200 text-slate-500 rounded-xl font-bold cursor-default">
                    Your Request
                  </button>
                ) : req.hasCompleted ? (
                  <button className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold cursor-default shadow-md flex items-center justify-center gap-2">
                    <i className="fas fa-check-circle"></i> Donation Verified
                  </button>
                ) : req.hasAccepted ? (
                  <button
                    onClick={() => handleComplete(req._id)}
                    className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 shadow-md shadow-emerald-200 transition-all"
                  >
                    Mark as Completed
                  </button>
                ) : req.hasRejected ? (
                  <button className="w-full py-3 border border-slate-300 text-slate-400 rounded-xl cursor-not-allowed">
                    Ignored
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleReject(req._id)}
                      className="flex-1 py-3 border border-slate-200 rounded-xl text-slate-400 font-bold hover:bg-slate-100"
                    >
                      Ignore
                    </button>
                    <button
                      onClick={() => handleAccept(req._id)}
                      className="flex-[2] py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-red-200"
                    >
                      Donate
                    </button>
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