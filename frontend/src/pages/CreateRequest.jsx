import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import locationData from "../data/locationData";
import bloodGroups from "../data/bloodGroups";

export default function CreateRequest() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    patientName: "",
    bloodGroup: "",
    hospital: "",
    unitsNeeded: "",
  });

  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");

  const selectedDistrict = locationData.find((d) => d.district === district);
  const selectedCity = selectedDistrict?.cities.find((c) => c.city === city);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login first.");
        navigate("/login");
        return;
      }

      // UPDATED ENDPOINT: Added "/create" to match your route file
      await axios.post(
        "http://localhost:5000/api/requests/create", 
        {
          ...form,
          district,
          city,
          area,
          unitsNeeded: Number(form.unitsNeeded)
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert("Request created successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Failed to create request");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 relative overflow-hidden font-sans">
      
      {/* --- BACKGROUND BLOBS --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-red-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-rose-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-3xl w-full bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-12 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-600 mb-4 shadow-sm">
             <i className="fas fa-bullhorn text-2xl"></i>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Post a Blood Request</h1>
          <p className="text-slate-500 mt-2">We will broadcast this to all eligible donors instantly.</p>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit}>
          
          {/* Section: Patient Details */}
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Patient Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-500 uppercase ml-1">Patient Name</label>
                 <input
                   type="text"
                   placeholder="e.g. Rahim Uddin"
                   className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all font-medium text-slate-800"
                   value={form.patientName}
                   onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                   required
                 />
              </div>

              <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-500 uppercase ml-1">Blood Group Needed</label>
                 <div className="relative">
                    <select
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all font-bold text-slate-800 appearance-none cursor-pointer"
                      value={form.bloodGroup}
                      onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                      required
                    >
                      <option value="">Select Group</option>
                      {bloodGroups.map((bg) => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <i className="fas fa-chevron-down text-xs"></i>
                    </div>
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-500 uppercase ml-1">Hospital Name</label>
                 <input
                   type="text"
                   placeholder="e.g. Dhaka Medical College"
                   className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all font-medium text-slate-800"
                   value={form.hospital}
                   onChange={(e) => setForm({ ...form, hospital: e.target.value })}
                   required
                 />
              </div>

              <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-500 uppercase ml-1">Units (Bags)</label>
                 <input
                   type="number"
                   min="1"
                   placeholder="e.g. 2"
                   className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all font-medium text-slate-800"
                   value={form.unitsNeeded}
                   onChange={(e) => setForm({ ...form, unitsNeeded: e.target.value })}
                   required
                 />
              </div>

            </div>
          </div>

          {/* Section: Location */}
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Location Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* District */}
                <div className="relative">
                    <select
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-slate-800 appearance-none cursor-pointer"
                      value={district}
                      onChange={(e) => {
                        setDistrict(e.target.value);
                        setCity("");
                        setArea("");
                      }}
                      required
                    >
                      <option value="">District</option>
                      {locationData.map((d) => (
                        <option key={d.district} value={d.district}>{d.district}</option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs">
                       <i className="fas fa-chevron-down"></i>
                    </div>
                </div>

                {/* City */}
                <div className="relative">
                    <select
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-slate-800 appearance-none cursor-pointer disabled:opacity-50"
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        setArea("");
                      }}
                      required
                      disabled={!district}
                    >
                      <option value="">City</option>
                      {selectedDistrict?.cities.map((c) => (
                        <option key={c.city} value={c.city}>{c.city}</option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs">
                       <i className="fas fa-chevron-down"></i>
                    </div>
                </div>

                {/* Area */}
                <div className="relative">
                    <select
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-slate-800 appearance-none cursor-pointer disabled:opacity-50"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      required
                      disabled={!city}
                    >
                      <option value="">Area</option>
                      {selectedCity?.areas.map((a) => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs">
                       <i className="fas fa-chevron-down"></i>
                    </div>
                </div>

            </div>
          </div>

          <div className="pt-4">
             <button 
               disabled={isLoading}
               className="w-full bg-red-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition-all shadow-lg shadow-red-200 transform active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
             >
               {isLoading ? (
                 <>
                   <i className="fas fa-circle-notch animate-spin"></i> Posting Request...
                 </>
               ) : (
                 <>
                   <i className="fas fa-paper-plane"></i> Submit Request
                 </>
               )}
             </button>
             <p className="text-center text-xs text-slate-400 mt-4">
               By clicking submit, your request will be visible to all verified donors in the selected area.
             </p>
          </div>
        </form>
      </div>
    </div>
  );
}