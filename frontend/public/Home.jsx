import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Check login status on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  // Protection Logic
  const goProtected = (path) => {
    if (!user) {
      // Optional: alert("Please login to access this feature.");
      navigate("/login");
      return;
    }
    navigate(path);
  };

  return (
    <div className="relative w-full overflow-x-hidden bg-slate-50 font-sans text-slate-800">
      
      {/* --- BACKGROUND BLOBS --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-red-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-rose-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute top-[40%] left-[20%] w-[400px] h-[400px] bg-pink-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-6 pb-20">
        
        {/* --- NAVBAR SPACER --- */}
        <div className="h-16"></div>

        {/* --- HERO SECTION --- */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-24">
          
          {/* Left Content */}
          <div className="w-full md:w-1/2 text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-bold tracking-wider text-red-600 uppercase bg-red-50 rounded-full border border-red-100">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
              Saving Lives 24/7
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-6 tracking-tight">
              Donate Blood, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-500">
                Save a Life
              </span>
            </h1>

            <p className="text-lg text-slate-500 mb-8 max-w-lg leading-relaxed">
              Join our community of heroes. Whether you need blood urgently or want to donate, we connect you with verified people instantly.
            </p>

            <div className="flex flex-wrap gap-4">
              {/* PROTECTED BUTTON: Find Blood */}
              <button
                onClick={() => goProtected("/create-request")}
                className="px-8 py-4 bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold rounded-full shadow-lg shadow-red-200 hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Find Blood Now
              </button>

              {/* CONDITIONAL BUTTON: Join vs Dashboard */}
              {!user ? (
                <Link
                  to="/register"
                  className="px-8 py-4 bg-white text-slate-700 border border-slate-200 font-bold rounded-full shadow-sm hover:border-red-200 hover:text-red-600 hover:bg-red-50 transition-all duration-300"
                >
                  Become a Donor
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className="px-8 py-4 bg-white text-slate-700 border border-slate-200 font-bold rounded-full shadow-sm hover:border-red-200 hover:text-red-600 hover:bg-red-50 transition-all duration-300"
                >
                  Go to Dashboard
                </Link>
              )}
            </div>

            {/* Social Proof */}
            <div className="mt-10 flex items-center gap-4 text-sm text-slate-500 font-medium">
               <div className="flex -space-x-3">
                 <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://randomuser.me/api/portraits/women/66.jpg" alt="User"/>
                 <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://randomuser.me/api/portraits/men/32.jpg" alt="User"/>
                 <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://randomuser.me/api/portraits/women/12.jpg" alt="User"/>
                 <div className="w-10 h-10 rounded-full border-2 border-white bg-red-50 flex items-center justify-center text-red-600 text-xs font-bold">
                   +2k
                 </div>
               </div>
               <p>Join <span className="text-slate-900 font-bold">2,000+</span> active donors</p>
            </div>
          </div>

          {/* Right Image Composition */}
          <div className="w-full md:w-1/2 relative">
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl shadow-red-900/10 border-8 border-white">
               <img 
                 src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                 alt="Blood Donation" 
                 className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>

            {/* Floating Card: Blood Type */}
            <div className="absolute top-12 -left-6 md:-left-12 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 animate-float z-20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                  <i className="fas fa-tint text-xl"></i>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase">Urgent Need</p>
                  <p className="text-lg font-bold text-slate-800">All Blood Groups</p>
                </div>
              </div>
            </div>
            
          </div>
        </div>

        {/* --- STATS STRIP --- */}
        <div className="bg-white rounded-3xl p-10 shadow-xl shadow-slate-200/60 mb-24 border border-slate-100 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500 group-hover:w-2 transition-all"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-100">
            <div className="text-center px-4">
              <h3 className="text-4xl font-extrabold text-slate-900 mb-1">5k+</h3>
              <p className="text-sm text-red-500 font-bold uppercase tracking-wide">Donors Registered</p>
            </div>
            <div className="text-center px-4">
              <h3 className="text-4xl font-extrabold text-slate-900 mb-1">1.2k</h3>
              <p className="text-sm text-red-500 font-bold uppercase tracking-wide">Lives Saved</p>
            </div>
            <div className="text-center px-4">
              <h3 className="text-4xl font-extrabold text-slate-900 mb-1">15min</h3>
              <p className="text-sm text-red-500 font-bold uppercase tracking-wide">Avg. Response</p>
            </div>
            <div className="text-center px-4">
              <h3 className="text-4xl font-extrabold text-slate-900 mb-1">100%</h3>
              <p className="text-sm text-red-500 font-bold uppercase tracking-wide">Free Service</p>
            </div>
          </div>
        </div>

        {/* --- SERVICES SECTION --- */}
        <div className="mb-24">
          <div className="text-center max-w-3xl mx-auto mb-16">
             <div className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-rose-500 uppercase bg-rose-50 rounded-full">How We Help</div>
             <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Your Health, Our Priority</h2>
             <p className="text-slate-500 text-lg">We simplify the process of finding and donating blood with smart technology.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="group bg-white rounded-[2rem] p-8 shadow-lg shadow-slate-100 border border-slate-100 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
               <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                 <i className="fas fa-search-location text-3xl"></i>
               </div>
               <h3 className="text-2xl font-bold text-slate-900 mb-3">Find Donors</h3>
               <p className="text-slate-500 mb-6 leading-relaxed">
                 Locate nearest eligible donors by blood group and city instantly with our smart geolocation engine.
               </p>
               {/* PROTECTED LINK */}
               <button onClick={() => goProtected("/requests")} className="text-red-600 font-bold hover:underline flex items-center gap-2">
                 Search Now <i className="fas fa-arrow-right text-xs"></i>
               </button>
            </div>

            {/* Service 2 */}
            <div className="group bg-white rounded-[2rem] p-8 shadow-lg shadow-slate-100 border border-slate-100 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
               <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mb-6 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-all duration-300">
                 <i className="fas fa-bullhorn text-3xl"></i>
               </div>
               <h3 className="text-2xl font-bold text-slate-900 mb-3">Post Request</h3>
               <p className="text-slate-500 mb-6 leading-relaxed">
                 In an emergency? Post a blood request and we will send instant alerts to all nearby matching donors.
               </p>
               {/* PROTECTED LINK */}
               <button onClick={() => goProtected("/create-request")} className="text-rose-600 font-bold hover:underline flex items-center gap-2">
                 Create Request <i className="fas fa-arrow-right text-xs"></i>
               </button>
            </div>

            {/* Service 3 */}
            <div className="group bg-white rounded-[2rem] p-8 shadow-lg shadow-slate-100 border border-slate-100 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
               <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 text-slate-600 group-hover:bg-slate-800 group-hover:text-white transition-all duration-300">
                 <i className="fas fa-user-check text-3xl"></i>
               </div>
               <h3 className="text-2xl font-bold text-slate-900 mb-3">Always Free</h3>
               <p className="text-slate-500 mb-6 leading-relaxed">
                 Our platform is non-profit. We do not charge for matching or donor information. It's built for humanity.
               </p>
               <span className="text-slate-400 font-bold flex items-center gap-2 cursor-default">
                 Forever Free <i className="fas fa-check-circle text-xs"></i>
               </span>
            </div>
          </div>
        </div>

        {/* --- TESTIMONIALS SECTION --- */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Voices of Life</h2>
            <p className="text-slate-500 text-lg">Real stories from people whose lives were changed forever.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Review 1 */}
            <div className="bg-white p-8 rounded-[2rem] shadow-lg shadow-slate-200/50 border border-slate-100 relative">
               <i className="fas fa-quote-right absolute top-8 right-8 text-4xl text-red-50"></i>
               <p className="text-slate-600 mb-6 italic text-lg leading-relaxed">"I needed A- blood urgently for my father. Within 15 minutes of posting, I found a donor just 2km away. This platform is a miracle."</p>
               <div className="flex items-center gap-4">
                  <img src="https://randomuser.me/api/portraits/women/45.jpg" className="w-12 h-12 rounded-full object-cover" alt="Sarah" />
                  <div>
                     <h4 className="font-bold text-slate-900">Sarah Ahmed</h4>
                     <p className="text-sm text-slate-500">Receiver, Dhaka</p>
                  </div>
               </div>
            </div>

            {/* Review 2 */}
            <div className="bg-white p-8 rounded-[2rem] shadow-lg shadow-slate-200/50 border border-slate-100 relative">
               <i className="fas fa-quote-right absolute top-8 right-8 text-4xl text-red-50"></i>
               <p className="text-slate-600 mb-6 italic text-lg leading-relaxed">"Being a donor here is so fulfilling. The real-time alerts help me know exactly when I can save a life near me. Highly recommended!"</p>
               <div className="flex items-center gap-4">
                  <img src="https://randomuser.me/api/portraits/men/32.jpg" className="w-12 h-12 rounded-full object-cover" alt="Rahim" />
                  <div>
                     <h4 className="font-bold text-slate-900">Rahim Uddin</h4>
                     <p className="text-sm text-slate-500">Regular Donor</p>
                  </div>
               </div>
            </div>

            {/* Review 3 */}
            <div className="bg-white p-8 rounded-[2rem] shadow-lg shadow-slate-200/50 border border-slate-100 relative">
               <i className="fas fa-quote-right absolute top-8 right-8 text-4xl text-red-50"></i>
               <p className="text-slate-600 mb-6 italic text-lg leading-relaxed">"The simplicity of this app is its best feature. No complicated steps, just direct connection to those in need. Truly lifesaving."</p>
               <div className="flex items-center gap-4">
                  <img src="https://randomuser.me/api/portraits/women/68.jpg" className="w-12 h-12 rounded-full object-cover" alt="Fatima" />
                  <div>
                     <h4 className="font-bold text-slate-900">Fatima Begum</h4>
                     <p className="text-sm text-slate-500">Receiver, Chittagong</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* --- CTA BANNER --- */}
        <div className="relative rounded-[3rem] overflow-hidden bg-slate-900 px-6 py-16 md:px-20 text-center">
           {/* Abstract shapes */}
           <div className="absolute top-0 left-0 w-full h-full opacity-20">
             <div className="absolute top-[-50%] left-[-10%] w-[600px] h-[600px] bg-red-600 rounded-full filter blur-[120px]"></div>
             <div className="absolute bottom-[-50%] right-[-10%] w-[600px] h-[600px] bg-indigo-600 rounded-full filter blur-[120px]"></div>
           </div>
           
           <div className="relative z-10 max-w-4xl mx-auto">
             <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
               Be the reason someone smiles today.
             </h2>
             <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
               It takes only 15 minutes to donate blood, but it gives someone a lifetime. Join our mission.
             </p>
             <div className="flex flex-col sm:flex-row justify-center gap-4">
                {!user ? (
                  <Link to="/register" className="px-10 py-4 bg-red-600 text-white font-bold rounded-full hover:bg-red-500 hover:shadow-lg hover:shadow-red-900/50 transition-all transform hover:-translate-y-1">
                    Start Donating
                  </Link>
                ) : (
                  <button onClick={() => goProtected("/create-request")} className="px-10 py-4 bg-red-600 text-white font-bold rounded-full hover:bg-red-500 hover:shadow-lg hover:shadow-red-900/50 transition-all transform hover:-translate-y-1">
                    Post a Request
                  </button>
                )}
                
                <button onClick={() => goProtected("/requests")} className="px-10 py-4 bg-transparent border border-slate-600 text-white font-bold rounded-full hover:bg-slate-800 transition-all">
                  See Who Needs Help
                </button>
             </div>
           </div>
        </div>

      </div>

      {/* --- INLINE STYLES FOR ANIMATIONS --- */}
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
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}