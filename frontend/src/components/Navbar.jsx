import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Reload user on route change
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    setUser(stored);
  }, [location]);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/");
  };

  // Protected navigation
  const goProtected = (path) => {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate(path);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50 font-sans">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* LOGO */}
        <Link
          to="/"
          className="text-2xl font-extrabold flex items-center gap-2 text-slate-800 hover:opacity-80 transition-opacity"
        >
          <span className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-sm shadow-md shadow-red-200">
            <i className="fas fa-heartbeat"></i>
          </span>
          BloodLink
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-8">

          {/* HOME */}
          <Link
            to="/"
            className={`font-semibold transition-colors ${
              location.pathname === "/" ? "text-red-600" : "text-slate-600 hover:text-red-600"
            }`}
          >
            Home
          </Link>

          {/* POST REQUEST (Protected) */}
          <button
            onClick={() => goProtected("/create-request")}
            className={`font-semibold transition-colors ${
              location.pathname === "/create-request"
                ? "text-red-600"
                : "text-slate-600 hover:text-red-600"
            }`}
          >
            Post Request
          </button>

          {/* NEARBY REQUESTS */}
          <Link
            to="/requests"
            className={`font-semibold transition-colors ${
              location.pathname === "/requests"
                ? "text-red-600"
                : "text-slate-600 hover:text-red-600"
            }`}
          >
            Nearby Requests
          </Link>

          {/* ADMIN PANEL */}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className={`font-semibold transition-colors ${
                location.pathname === "/admin"
                  ? "text-red-600"
                  : "text-slate-600 hover:text-red-600"
              }`}
            >
              Admin Panel
            </Link>
          )}

          {/* AUTH HANDLING */}
          {!user ? (
            <div className="flex items-center gap-4 ml-4">
              <Link to="/login" className="text-slate-600 hover:text-red-600 font-bold">
                Login
              </Link>

              <Link
                to="/register"
                className="px-6 py-2.5 bg-red-600 text-white rounded-full font-bold shadow-md shadow-red-200 hover:bg-red-700 hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                Join Now
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-6 ml-4 relative">

              {/* DASHBOARD */}
              <button
                onClick={() => goProtected("/dashboard")}
                className={`font-semibold transition-colors ${
                  location.pathname === "/dashboard"
                    ? "text-red-600"
                    : "text-slate-600 hover:text-red-600"
                }`}
              >
                Dashboard
              </button>

              {/* PROFILE DROPDOWN */}
              <div
                className="flex items-center gap-3 pl-6 border-l border-slate-200 cursor-pointer"
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                <div className="hidden lg:block text-right">
                  <p className="text-sm font-bold">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.role || "User"}</p>
                </div>

                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
                  <img
                    src={
                      user.profileImage
                        ? `http://localhost:5000${user.profileImage}`
                        : `https://ui-avatars.com/api/?name=${user.name}&background=fee2e2&color=ef4444`
                    }
                    className="w-full h-full object-cover"
                  />
                </div>

                <i className="fas fa-chevron-down text-xs"></i>
              </div>

              {dropdownOpen && (
                <div className="absolute top-16 right-0 bg-white shadow-lg border border-slate-200 rounded-xl w-48 py-2 z-50">

                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-slate-700 hover:bg-slate-100 font-medium"
                  >
                    My Profile
                  </Link>

                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-slate-700 hover:bg-slate-100 font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/my-requests"
                    className="block px-4 py-2 text-slate-700 hover:bg-slate-100 font-medium"
                  >
                    My Requests
                  </Link>

                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-slate-700 hover:bg-slate-100 font-medium"
                    >
                      Admin Panel
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 font-semibold"
                  >
                    Logout
                  </button>

                </div>
              )}
            </div>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden text-slate-600 text-2xl"
          onClick={() => setMobileOpen(true)}
        >
          <i className="fas fa-bars"></i>
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden z-50"
          onClick={() => setMobileOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 top-0 w-72 h-full bg-white shadow-xl p-6 flex flex-col gap-6 animate-slide-left"
          >
            <button
              className="self-end text-slate-600 text-2xl"
              onClick={() => setMobileOpen(false)}
            >
              <i className="fas fa-times"></i>
            </button>

            <Link to="/" className="text-lg font-semibold text-slate-800">
              Home
            </Link>

            <button
              onClick={() => goProtected("/create-request")}
              className="text-left text-lg font-semibold text-slate-800"
            >
              Post Request
            </button>

            <Link to="/requests" className="text-lg font-semibold text-slate-800">
              Nearby Requests
            </Link>

            {user?.role === "admin" && (
              <Link to="/admin" className="text-lg font-semibold text-red-600">
                Admin Panel
              </Link>
            )}

            {!user ? (
              <>
                <Link to="/login" className="text-lg text-slate-600">
                  Login
                </Link>

                <Link
                  to="/register"
                  className="px-6 py-3 bg-red-600 text-white rounded-full font-bold shadow-md text-center"
                >
                  Join Now
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={() => goProtected("/dashboard")}
                  className="text-left text-lg text-slate-800"
                >
                  Dashboard
                </button>

                <Link to="/profile" className="text-lg text-slate-800">
                  My Profile
                </Link>

                <button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className="text-left text-lg font-bold text-red-600"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ANIMATION */}
      <style>{`
        @keyframes slide-left {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-left {
          animation: slide-left 0.3s ease-out;
        }
      `}</style>
    </nav>
  );
}
