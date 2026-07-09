import { FaSearch } from "react-icons/fa";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedSearchTerm = searchTerm.trim();

    if (!trimmedSearchTerm) {
      navigate("/search");
      return;
    }

    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", trimmedSearchTerm);

    navigate(`/search?${urlParams.toString()}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");

    setSearchTerm(searchTermFromUrl || "");
  }, [location.search]);

  const navLinkClass = ({ isActive }) =>
    `hidden sm:inline text-sm font-medium transition ${
      isActive
        ? "text-slate-900"
        : "text-slate-600 hover:text-slate-900"
    }`;

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
            N
          </div>

          <div className="leading-tight">
            <h1 className="font-bold text-lg sm:text-xl text-slate-800">
              Nestora
            </h1>
            <p className="hidden sm:block text-xs text-slate-500">
              Real Estate Platform
            </p>
          </div>
        </Link>

        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 border border-slate-200 px-3 py-2 rounded-full flex items-center flex-1 max-w-md"
        >
          <input
            type="text"
            placeholder="Search homes..."
            className="bg-transparent focus:outline-none w-full text-sm text-slate-700 placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button
            type="submit"
            className="text-slate-500 hover:text-slate-800 transition"
            aria-label="Search"
          >
            <FaSearch />
          </button>
        </form>

        <nav className="flex items-center gap-4">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>

          {currentUser && (
            <Link
              to="/create-listing"
              className="hidden md:inline bg-slate-900 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition"
            >
              Add Listing
            </Link>
          )}

          <Link to="/profile" className="flex items-center">
            {currentUser ? (
              <img
                src={currentUser.avatar}
                alt="Profile"
                className="rounded-full h-9 w-9 object-cover border-2 border-slate-200"
              />
            ) : (
              <span className="text-sm font-medium text-slate-700 hover:text-slate-900">
                Sign In
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;