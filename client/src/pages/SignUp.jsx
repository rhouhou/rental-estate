import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import OAuth from "../components/OAuth";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setError("");

    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        setError(data.message || "Could not create account.");
        return;
      }

      navigate("/sign-in");
    } catch (error) {
      setError(error.message || "Could not create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-slate-50 min-h-screen">
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 items-center">
          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">
              Join Nestora
            </p>

            <h1 className="text-5xl font-bold text-slate-800 mt-3 leading-tight">
              Create your account and start listing properties.
            </h1>

            <p className="text-slate-500 mt-5 max-w-xl text-lg">
              Sign up to create property listings, manage your profile, upload
              listing images, and keep your real estate dashboard organized.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <p className="text-2xl font-bold text-slate-800">List</p>
                <p className="text-sm text-slate-500 mt-1">
                  Publish rental and sale properties.
                </p>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <p className="text-2xl font-bold text-slate-800">Upload</p>
                <p className="text-sm text-slate-500 mt-1">
                  Add images through Cloudinary.
                </p>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <p className="text-2xl font-bold text-slate-800">Manage</p>
                <p className="text-sm text-slate-500 mt-1">
                  Edit or delete your own listings.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
            <div className="mb-7">
              <h2 className="text-3xl font-bold text-slate-800">Sign Up</h2>
              <p className="text-slate-500 mt-2">
                Create an account to start using Nestora.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Username"
                className="border border-slate-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300"
                id="username"
                required
                value={formData.username}
                onChange={handleChange}
              />

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
                minLength="6"
                value={formData.password}
                onChange={handleChange}
              />

              <button
                disabled={loading}
                className="bg-slate-900 text-white p-3 rounded-lg uppercase font-semibold hover:opacity-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Creating account..." : "Sign Up"}
              </button>

              <OAuth />
            </form>

            <div className="flex gap-2 mt-6 text-sm">
              <p className="text-slate-600">Already have an account?</p>

              <Link to="/sign-in">
                <span className="text-blue-700 font-semibold hover:underline">
                  Sign In
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

export default SignUp;