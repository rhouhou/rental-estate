import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
  clearUserError,
} from "../redux/user/userSlice.js";
import OAuth from "../components/OAuth.jsx";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const dispatch = useDispatch();

  const handleChange = (e) => {
    dispatch(clearUserError());

    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      dispatch(signInFailure("Please enter your email and password."));
      return;
    }

    try {
      dispatch(signInStart());

      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        dispatch(signInFailure(data.message || "Could not sign in."));
        return;
      }

      dispatch(signInSuccess(data));
      navigate(from, { replace: true });
    } catch (error) {
      dispatch(signInFailure(error.message || "Could not sign in."));
    }
  };

  return (
    <main className="bg-slate-50 min-h-screen">
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 items-center">
          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">
              Welcome back
            </p>

            <h1 className="text-5xl font-bold text-slate-800 mt-3 leading-tight">
              Sign in to manage your listings on Nestora.
            </h1>

            <p className="text-slate-500 mt-5 max-w-xl text-lg">
              Access your profile, create new property listings, update your
              homes, and manage your real estate dashboard.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <p className="text-2xl font-bold text-slate-800">Create</p>
                <p className="text-sm text-slate-500 mt-1">
                  Add new property listings.
                </p>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <p className="text-2xl font-bold text-slate-800">Edit</p>
                <p className="text-sm text-slate-500 mt-1">
                  Update listing details anytime.
                </p>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <p className="text-2xl font-bold text-slate-800">Manage</p>
                <p className="text-sm text-slate-500 mt-1">
                  Control your property dashboard.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
            <div className="mb-7">
              <h2 className="text-3xl font-bold text-slate-800">Sign In</h2>
              <p className="text-slate-500 mt-2">
                Enter your account details to continue.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Email"
                className="border border-slate-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300"
                id="email"
                required
                value={formData.email}
                onChange={handleChange}
              />

              <input
                type="password"
                placeholder="Password"
                className="border border-slate-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300"
                id="password"
                required
                value={formData.password}
                onChange={handleChange}
              />

              <button
                disabled={loading}
                className="bg-slate-900 text-white p-3 rounded-lg uppercase font-semibold hover:opacity-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>

              <OAuth />
            </form>

            <div className="flex gap-2 mt-6 text-sm">
              <p className="text-slate-600">Don&apos;t have an account?</p>

              <Link to="/sign-up">
                <span className="text-blue-700 font-semibold hover:underline">
                  Sign Up
                </span>
              </Link>
            </div>

            {error && <p className="text-red-700 text-sm mt-5">{error}</p>}
          </div>
        </div>
      </section>
    </main>
  );
};

export default SignIn;