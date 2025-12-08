import { useState, useEffect } from "react";
import axios from "axios";
import locationData from "../data/locationData";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageUploading, setImageUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form State for Profile Details
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    district: "",
    city: "",
    area: "",
  });

  // Separate State for Donation Date
  const [lastDonationDate, setLastDonationDate] = useState("");

  // Fetch Profile Data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setUser(res.data);
        
        // Initialize form data
        setFormData({
          name: res.data.name,
          phone: res.data.phone,
          district: res.data.district || "",
          city: res.data.city || "",
          area: res.data.area || "",
        });

        // Format date for input field (YYYY-MM-DD)
        if (res.data.lastDonation) {
          setLastDonationDate(new Date(res.data.lastDonation).toISOString().split('T')[0]);
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Handle Image Upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    setImageUploading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/profile/upload-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      const updatedUser = { ...user, profileImage: res.data.image };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser)); // Sync Navbar
      alert("Profile picture updated!");
    } catch (err) {
      alert("Failed to upload image.");
    } finally {
      setImageUploading(false);
    }
  };

  // Handle Manual Availability Toggle
  const toggleAvailability = async () => {
    try {
      const token = localStorage.getItem("token");
      const newStatus = !user.availability; 
      
      const res = await axios.put(
        "http://localhost:5000/api/profile/availability",
        { availability: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser({ ...user, availability: res.data.availability });
    } catch (err) {
      alert("Failed to update status");
    }
  };

  // Handle General Profile Update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://localhost:5000/api/profile",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Failed to update profile.");
    }
  };

  // Handle Last Donation Update
  const handleDonationDateUpdate = async () => {
    if (!lastDonationDate) return alert("Please select a date.");
    
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://localhost:5000/api/profile/last-donation",
        { lastDonation: lastDonationDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(res.data.user); 
      alert(res.data.freezeStatus); 
    } catch (err) {
      alert("Failed to update donation date.");
    }
  };

  // Derived Locations
  const selectedDistrict = locationData.find((d) => d.district === formData.district);
  const selectedCity = selectedDistrict?.cities.find((c) => c.city === formData.city);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 relative overflow-hidden font-sans">
      
      {/* --- BACKGROUND BLOBS --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-red-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-rose-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT COLUMN: IDENTITY & STATUS --- */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Identity Card */}
          <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 text-center relative z-10">
            
            {/* Image Upload */}
            <div className="relative w-32 h-32 mx-auto mb-6 group">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img
                  src={user.profileImage ? `http://localhost:5000${user.profileImage}` : `https://ui-avatars.com/api/?name=${user.name}&background=fee2e2&color=ef4444`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                {imageUploading ? <i className="fas fa-spinner animate-spin text-2xl"></i> : <i className="fas fa-camera text-2xl"></i>}
              </label>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900">{user.name}</h2>
            <p className="text-slate-500 text-sm mb-4">{user.email}</p>
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-50 text-red-600 rounded-full font-bold text-sm">
              <i className="fas fa-tint"></i> {user.bloodGroup} Donor
            </div>
          </div>

          {/* Donation Eligibility Card (FIXED BUTTON) */}
          <div className="bg-white rounded-[2rem] shadow-lg border border-slate-100 p-6 relative overflow-hidden">
             <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
               {/* SVG Icon instead of FontAwesome */}
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
               </svg>
               Donation History
             </h3>
             
             <div className="space-y-4">
                <div>
                   <label className="text-xs font-bold text-slate-400 uppercase">Last Donation Date</label>
                   <div className="flex gap-2 mt-1">
                      <input 
                        type="date" 
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                        value={lastDonationDate}
                        onChange={(e) => setLastDonationDate(e.target.value)}
                      />
                      {/* FIXED BUTTON: Replaced icon with clear Text and SVG */}
                      <button 
                        onClick={handleDonationDateUpdate}
                        className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-bold hover:bg-slate-700 flex items-center gap-2 shadow-md transition-all active:scale-95"
                        title="Save Date"
                      >
                        Save
                      </button>
                   </div>
                </div>

                {/* Dynamic Status Badge */}
                <div className={`p-4 rounded-xl border ${user.availability ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'}`}>
                   <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user.availability ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                         {/* SVG Status Icon */}
                         {user.availability ? (
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                             <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                           </svg>
                         ) : (
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                             <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd" />
                           </svg>
                         )}
                      </div>
                      <div>
                         <p className={`font-bold text-sm ${user.availability ? 'text-emerald-800' : 'text-amber-800'}`}>
                           {user.availability ? "Eligible to Donate" : "In Recovery Period"}
                         </p>
                         <p className="text-xs opacity-70">
                           {user.availability 
                             ? "You can accept new requests." 
                             : "Please wait 3 months between donations."}
                         </p>
                      </div>
                   </div>
                </div>
             </div>
          </div>

        </div>

        {/* --- RIGHT COLUMN: EDIT DETAILS --- */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-10 relative z-10 h-full">
            
            {/* Header with Edit Button on Right */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Personal Information</h2>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${isEditing ? 'bg-slate-100 text-slate-600' : 'bg-red-600 text-white shadow-lg shadow-red-200 hover:bg-red-700'}`}
              >
                {/* SVG Edit Icon */}
                {isEditing ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                  </svg>
                )}
                {isEditing ? "Cancel Editing" : "Edit Profile"}
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-8">
              
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name</label>
                   <input
                     type="text"
                     disabled={!isEditing}
                     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-slate-50 disabled:text-slate-500 transition-all font-medium text-slate-800"
                     value={formData.name}
                     onChange={(e) => setFormData({...formData, name: e.target.value})}
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase ml-1">Phone Number</label>
                   <input
                     type="text"
                     disabled={!isEditing}
                     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-slate-50 disabled:text-slate-500 transition-all font-medium text-slate-800"
                     value={formData.phone}
                     onChange={(e) => setFormData({...formData, phone: e.target.value})}
                   />
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-slate-100"></div>
                </div>
                <div className="relative flex justify-start">
                  <span className="bg-white pr-2 text-sm text-slate-400 font-bold uppercase tracking-wider">Address Details</span>
                </div>
              </div>

              {/* Location Selectors */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">District</label>
                    <div className="relative">
                      <select
                        disabled={!isEditing}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-slate-50 disabled:text-slate-500 appearance-none transition-all cursor-pointer"
                        value={formData.district}
                        onChange={(e) => setFormData({ ...formData, district: e.target.value, city: "", area: "" })}
                      >
                        <option value="">Select District</option>
                        {locationData.map((d) => (
                          <option key={d.district} value={d.district}>{d.district}</option>
                        ))}
                      </select>
                      {isEditing && <i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none"></i>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">City</label>
                    <div className="relative">
                      <select
                        disabled={!isEditing || !formData.district}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-slate-50 disabled:text-slate-500 appearance-none transition-all cursor-pointer"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value, area: "" })}
                      >
                        <option value="">Select City</option>
                        {selectedDistrict?.cities.map((c) => (
                          <option key={c.city} value={c.city}>{c.city}</option>
                        ))}
                      </select>
                      {isEditing && <i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none"></i>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Area</label>
                    <div className="relative">
                      <select
                        disabled={!isEditing || !formData.city}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-slate-50 disabled:text-slate-500 appearance-none transition-all cursor-pointer"
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      >
                        <option value="">Select Area</option>
                        {selectedCity?.areas.map((a) => (
                          <option key={a} value={a}>{a}</option>
                        ))}
                      </select>
                      {isEditing && <i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none"></i>}
                    </div>
                  </div>
              </div>

              {isEditing && (
                <div className="pt-6 flex justify-end animate-fade-in-up">
                   <button className="px-8 py-3 bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-200 hover:bg-red-700 hover:-translate-y-1 transition-all flex items-center gap-2">
                     <i className="fas fa-save"></i> Save Changes
                   </button>
                </div>
              )}
            </form>

          </div>
        </div>

      </div>
    </div>
  );
}