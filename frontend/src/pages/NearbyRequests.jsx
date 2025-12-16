import { useState, useEffect } from "react";
import axios from "axios";
import locationData from "../data/locationData";
import bloodGroups from "../data/bloodGroups";

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- NEW: State for the Custom Modal ---
  const [modal, setModal] = useState({
    show: false,
    type: null, // 'accept' or 'complete'
    reqId: null,
  });

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

      const enhanced = res.data.requests.map((r) => {
        const myAssignment = r.donorsAssigned?.find((entry) => {
          const entryDonorId = entry.donor?._id || entry.donor;
          return String(entryDonorId) === String(uId);
        });

        const hasAccepted = !!myAssignment;
        const hasCompleted = myAssignment?.status === "Completed";
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

  // --- BUTTON CLICKS (Just open the modal) ---
  const clickAccept = (reqId) => {
    if (!token) return alert("Please login first.");
    setModal({ show: true, type: "accept", reqId });
  };

  const clickComplete = (reqId) => {
    setModal({ show: true, type: "complete", reqId });
  };

  // --- ACTUAL API LOGIC (Triggered by Modal "Yes") ---
  const confirmAction = async () => {
    if (!modal.reqId) return;

    try {
      if (modal.type === "accept") {
        await axios.post(
          `http://localhost:5000/api/requests/${modal.reqId}/accept`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Optional: Toast notification here
      } else if (modal.type === "complete") {
        await axios.put(
          `http://localhost:5000/api/requests/${modal.reqId}/complete`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      
      // Refresh UI and Close Modal
      fetchRequests();
      setModal({ show: false, type: null, reqId: null });

    } catch (err) {
      alert(err.response?.data?.msg || "Action failed.");
      setModal({ show: false, type: null, reqId: null });
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

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans relative overflow-hidden">
      {/* Background Decor */}
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
                    ? "border-emerald-200 bg-emerald-50/20"
                    : "border-slate-100"
                }`}
              >
                {/* Badge */}
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1 text-xs font-bold rounded-full ${
                      req.hasCompleted
                        ? "bg-emerald-100 text-emerald-700"
                        : req.hasAccepted
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {req.hasCompleted
                      ? "Donated"
                      : req.hasAccepted
                      ? "Accepted"
                      : req.status}
                  </span>
                </div>

                {/* Card Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold ${
                      req.hasCompleted || req.hasAccepted
                        ? "bg-emerald-500"
                        : "bg-red-600"
                    }`}
                  >
                    {req.bloodGroup}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">
                      {req.patientName}
                    </h3>
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

                {/* ACTION BUTTONS */}
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
                    onClick={() => clickComplete(req._id)}
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
                      onClick={() => clickAccept(req._id)}
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

      {/* --- CUSTOM MODAL --- */}
      {modal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setModal({ show: false, type: null, reqId: null })}
          ></div>

          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl relative z-10 transform transition-all">
            {/* Icon based on type */}
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-lg ${
                modal.type === "accept"
                  ? "bg-red-100 text-red-600 shadow-red-100"
                  : "bg-emerald-100 text-emerald-600 shadow-emerald-100"
              }`}
            >
              <i
                className={`fas ${
                  modal.type === "accept" ? "fa-hand-holding-heart" : "fa-check"
                }`}
              ></i>
            </div>

            <h3 className="text-xl font-bold text-slate-900 text-center mb-2">
              {modal.type === "accept"
                ? "Confirm Donation?"
                : "Mark as Completed?"}
            </h3>

            <p className="text-slate-500 text-center text-sm mb-8">
              {modal.type === "accept"
                ? "This will notify the requester that you are coming to help. Are you sure?"
                : "Have you successfully donated blood? This will update your history and notify the requester."}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() =>
                  setModal({ show: false, type: null, reqId: null })
                }
                className="flex-1 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className={`flex-1 py-3 rounded-xl font-bold text-white shadow-lg transition ${
                  modal.type === "accept"
                    ? "bg-red-600 hover:bg-red-700 shadow-red-200"
                    : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
                }`}
              >
                Yes, {modal.type === "accept" ? "I'll Donate" : "Completed"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}