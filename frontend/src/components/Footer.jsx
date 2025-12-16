import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800 font-sans relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-600 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-rose-600 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-extrabold flex items-center gap-2 text-white">
              <span className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-sm shadow-lg shadow-red-900">
                {/* Heartbeat SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                </svg>
              </span>
              BloodLink
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Connecting blood donors with patients in need. Our mission is to ensure no life is lost due to a lack of blood.
            </p>
            <div className="flex gap-4 pt-2">
              {/* Social Icons (Keeping your existing ones) */}
              <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all">
                <i className="fab fa-facebook-f text-sm"></i>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all">
                <i className="fab fa-twitter text-sm"></i>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all">
                <i className="fab fa-instagram text-sm"></i>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links - ADDED DEVELOPERS HERE */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              {[
                { name: "Home", path: "/" },
                { name: "Find Blood", path: "/requests" },
                { name: "Post Request", path: "/create-request" },
                { name: "Join as Donor", path: "/register" },
                { name: "Meet the Developers", path: "/team" } // <--- Added Here
              ].map((link, idx) => (
                <li key={idx}>
                  <Link to={link.path} className="hover:text-red-500 transition-colors flex items-center gap-2 group">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-slate-600 group-hover:text-red-500 transition-colors">
                      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                    </svg>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Support</h3>
            <ul className="space-y-3 text-sm">
              {["Privacy Policy", "Terms of Service", "Cookie Policy", "Contact Us"].map((item, idx) => (
                <li key={idx}>
                  <a href="#" className="hover:text-red-500 transition-colors flex items-center gap-2 group">
                     {/* Added arrow for consistency */}
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-slate-600 group-hover:text-red-500 transition-colors">
                      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 group cursor-pointer">
                <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="flex-1 pt-1 group-hover:text-white transition-colors">123 Medical Road, Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3 group cursor-pointer">
                <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="pt-1 group-hover:text-white transition-colors">+880 1234 567 890</span>
              </li>
              <li className="flex items-center gap-3 group cursor-pointer">
                <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                    <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                  </svg>
                </div>
                <span className="pt-1 group-hover:text-white transition-colors">support@bloodlink.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} BloodLink. All rights reserved.
          </p>
          <div className="text-xs text-slate-500 flex items-center gap-1">
            Made with 
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-red-600 animate-pulse">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
            for Humanity
          </div>
        </div>
      </div>
    </footer>
  );
}