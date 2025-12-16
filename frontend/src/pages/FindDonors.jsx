import { useState } from "react";
import axios from "axios";
import locationData from "../data/locationData";
import bloodGroups from "../data/bloodGroups";

export default function FindDonors() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Filters
  const [bloodGroup, setBloodGroup] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");

  const selectedDistrict = locationData.find((d) => d.district === district);
  const selectedCity = selectedDistrict?.cities.find((c) => c.city === city);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setHasSearched(true);

    try {
      const token = localStorage.getItem("token");
      const query = new URLSearchParams({
        bloodGroup,
        district,
        city,
        area,
      }).toString();

      const res = await axios.get(`http://localhost:5000/api/donor/search?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDonors(res.data.donors);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch donors");
    } finally {
      setLoading(false);
    }
  };

  // Helper: Calculate Next Available Date
  const getNextAvailableDate = (lastDonation) => {
    if (!lastDonation) return "Unknown";
    const date = new Date(lastDonation);
    date.setMonth(date.getMonth() + 3);
    return date.toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans pb-20">
      
      {/* --- BACKGROUND ANIMATION --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-100/60 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-rose-100/60 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-12">
        
        {/* HEADER */}
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm mb-6 text-red-600">
             <i className="fas fa-search-location text-3xl"></i>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Find <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-500">Local Heroes</span>
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed">
            Directly connect with verified donors in your area. No waiting lists, just immediate help.
          </p>
        </div>

        {/* SEARCH PANEL */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-white mb-16 relative overflow-hidden">
          {/* Decorative bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-rose-500 to-orange-500"></div>

          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Blood Group</label>
              <select 
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-red-100 focus:ring-4 focus:ring-red-50 transition-all font-bold text-slate-700 outline-none cursor-pointer"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
              >
                <option value="">Any Group</option>
                {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">District</label>
              <select 
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-red-100 focus:ring-4 focus:ring-red-50 transition-all font-semibold text-slate-700 outline-none cursor-pointer"
                value={district}
                onChange={(e) => { setDistrict(e.target.value); setCity(""); setArea(""); }}
              >
                <option value="">All Districts</option>
                {locationData.map(d => <option key={d.district} value={d.district}>{d.district}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">City</label>
              <select 
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-red-100 focus:ring-4 focus:ring-red-50 transition-all font-semibold text-slate-700 outline-none cursor-pointer disabled:opacity-50"
                value={city}
                onChange={(e) => { setCity(e.target.value); setArea(""); }}
                disabled={!district}
              >
                <option value="">All Cities</option>
                {selectedDistrict?.cities.map(c => <option key={c.city} value={c.city}>{c.city}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Area</label>
              <select 
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-red-100 focus:ring-4 focus:ring-red-50 transition-all font-semibold text-slate-700 outline-none cursor-pointer disabled:opacity-50"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                disabled={!city}
              >
                <option value="">All Areas</option>
                {selectedCity?.areas.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full h-[58px] bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold rounded-2xl shadow-lg shadow-red-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <><i className="fas fa-circle-notch animate-spin"></i> Finding...</>
              ) : (
                <><i className="fas fa-search"></i> Find Donors</>
              )}
            </button>
          </form>
        </div>

        {/* RESULTS AREA */}
        {loading ? (
           <div className="flex flex-col items-center justify-center py-20 opacity-50">
             <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mb-4"></div>
             <p className="text-slate-500 font-medium">Scanning donor database...</p>
           </div>
        ) : donors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {donors.map((donor) => (
              <div 
                key={donor._id} 
                className={`group relative bg-white rounded-3xl p-6 border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-200/50 ${
                  !donor.availability ? 'border-slate-100 opacity-90' : 'border-white ring-1 ring-slate-100'
                }`}
              >
                {/* Available Glow Effect */}
                {donor.availability && (
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-emerald-50/50 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
                )}

                {/* Top Row: Avatar & Status */}
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-[1.2rem] overflow-hidden shadow-md border-2 border-white group-hover:scale-105 transition-transform">
                      <img 
                        src={donor.profileImage ? `http://localhost:5000${donor.profileImage}` : `https://ui-avatars.com/api/?name=${donor.name}&background=fee2e2&color=ef4444`} 
                        className={`w-full h-full object-cover ${!donor.availability && 'grayscale contrast-75'}`}
                        alt={donor.name} 
                      />
                    </div>
                    {/* Status Dot on Avatar */}
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 border-4 border-white rounded-full ${donor.availability ? 'bg-emerald-500' : 'bg-amber-400'}`}></div>
                  </div>

                  <div className="flex flex-col items-end">
                    <div className={`w-12 h-12 flex items-center justify-center rounded-2xl font-black text-xl shadow-sm mb-2 ${
                      donor.availability ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {donor.bloodGroup}
                    </div>
                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg ${
                      donor.availability 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {donor.availability ? 'Active' : 'Resting'}
                    </span>
                  </div>
                </div>

                {/* Info Block */}
                <div className="mb-6 relative z-10">
                  <h3 className="text-xl font-bold text-slate-900 leading-tight mb-1 truncate">{donor.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                    <i className="fas fa-map-marker-alt text-red-500"></i>
                    <span className="truncate">{donor.area}, {donor.city}</span>
                  </div>
                  
                  {/* Phone Chip */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                    <i className="fas fa-phone text-slate-400 text-xs"></i>
                    <span className="font-mono text-sm font-bold text-slate-700 tracking-tight">{donor.phone}</span>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="relative z-10">
                  {!donor.availability && (
                    <div className="flex items-center justify-center gap-2 text-xs font-bold text-amber-600 bg-amber-50 rounded-lg py-2 mb-3">
                       <i className="fas fa-hourglass-half"></i>
                       Available: {getNextAvailableDate(donor.lastDonation)}
                    </div>
                  )}

                  <a 
                    href={`tel:${donor.phone}`}
                    className={`flex items-center justify-center w-full py-3.5 rounded-xl font-bold text-sm transition-all active:scale-[0.98] ${
                      donor.availability 
                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-200 hover:bg-red-600 hover:shadow-red-200' 
                        : 'bg-white border-2 border-slate-100 text-slate-400 hover:border-red-200 hover:text-red-500'
                    }`}
                  >
                    <i className={`fas fa-phone-alt mr-2 ${donor.availability && 'animate-pulse'}`}></i> 
                    {donor.availability ? "Call Donor Now" : "Emergency Call"}
                  </a>
                </div>

              </div>
            ))}
          </div>
        ) : hasSearched ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
             <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <i className="fas fa-search text-4xl text-slate-300"></i>
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-2">No Donors Found</h3>
             <p className="text-slate-500 max-w-md mx-auto">
               We couldn't find any donors matching your criteria in this area. Try expanding your search or selecting a different location.
             </p>
          </div>
        ) : (
          // Initial Empty State
          <div className="flex flex-col items-center justify-center py-16 opacity-40">
             <i className="fas fa-users text-8xl text-slate-300 mb-6"></i>
             <p className="text-xl font-bold text-slate-400">Select filters above to find heroes</p>
          </div>
        )}
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