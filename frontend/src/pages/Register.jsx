import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

import locationData from "../data/locationData";
import bloodGroups from "../data/bloodGroups";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    bloodGroup: "",
  });

  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const selectedDistrict = locationData.find((d) => d.district === district);
  const selectedCity = selectedDistrict?.cities.find((c) => c.city === city);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        ...form,
        district,
        city,
        area,
      });

      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.msg || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 relative overflow-hidden font-sans">
      
      {/* --- BACKGROUND BLOBS --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-red-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-rose-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-2xl w-full bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-12 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-50 text-red-600 mb-4 shadow-sm">
             <i className="fas fa-user-plus text-2xl"></i>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Join the Family</h1>
          <p className="text-slate-500 mt-2">Become a donor and start saving lives today.</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          
          {/* Section: Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Full Name</label>
               <input
                 type="text"
                 placeholder="John Doe"
                 className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all font-medium text-slate-800"
                 value={form.name}
                 onChange={(e) => setForm({ ...form, name: e.target.value })}
                 required
               />
            </div>

            <div className="space-y-2">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Phone Number</label>
               <input
                 type="text"
                 placeholder="017XXXXXXXX"
                 className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all font-medium text-slate-800"
                 value={form.phone}
                 onChange={(e) => setForm({ ...form, phone: e.target.value })}
                 required
               />
            </div>

            <div className="space-y-2">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Email Address</label>
               <input
                 type="email"
                 placeholder="you@example.com"
                 className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all font-medium text-slate-800"
                 value={form.email}
                 onChange={(e) => setForm({ ...form, email: e.target.value })}
                 required
               />
            </div>

            <div className="space-y-2">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Password</label>
               <input
                 type="password"
                 placeholder="••••••••"
                 className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all font-medium text-slate-800"
                 value={form.password}
                 onChange={(e) => setForm({ ...form, password: e.target.value })}
                 required
               />
            </div>
          </div>

          <hr className="border-slate-100 my-6" />

          {/* Section: Blood & Location */}
          <div className="space-y-6">
            
            {/* Blood Group */}
            <div className="space-y-2">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Blood Group</label>
               <div className="relative">
                  <select
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all font-bold text-slate-800 appearance-none cursor-pointer"
                    value={form.bloodGroup}
                    onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                    required
                  >
                    <option value="">Select Blood Group</option>
                    {bloodGroups.map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <i className="fas fa-chevron-down"></i>
                  </div>
               </div>
            </div>

            {/* Location Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* District */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">District</label>
                <div className="relative">
                    <select
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-slate-800 appearance-none cursor-pointer"
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
              </div>

              {/* City */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">City</label>
                <div className="relative">
                    <select
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-slate-800 appearance-none cursor-pointer disabled:opacity-50"
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
              </div>

              {/* Area */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Area</label>
                <div className="relative">
                    <select
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-slate-800 appearance-none cursor-pointer disabled:opacity-50"
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
          </div>

          <div className="pt-4">
             <button 
               disabled={isLoading}
               className="w-full bg-red-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition-all shadow-lg shadow-red-200 transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
             >
               {isLoading ? (
                 <span className="flex items-center justify-center gap-2">
                   <i className="fas fa-circle-notch animate-spin"></i> Creating Account...
                 </span>
               ) : (
                 "Register Now"
               )}
             </button>
          </div>
        </form>

        <p className="mt-8 text-center text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="text-red-600 font-bold hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}