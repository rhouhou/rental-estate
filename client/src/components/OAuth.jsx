import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase.js";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice.js";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleClick = async () => {
    try {
      setLoading(true);
      setError("");

      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: "select_account",
      });

      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        setError(data.message || "Could not sign in with Google.");
        return;
      }

      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      console.error("Google sign-in error:", error);

      if (error.code === "auth/popup-closed-by-user") {
        setError("Google sign-in was cancelled.");
      } else {
        setError("Could not sign in with Google. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleGoogleClick}
        type="button"
        disabled={loading}
        className="border border-slate-300 text-slate-700 bg-white p-3 rounded-lg uppercase font-semibold hover:bg-slate-50 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? "Connecting..." : "Continue with Google"}
      </button>

      {error && <p className="text-red-700 text-sm">{error}</p>}
    </div>
  );
};

export default OAuth;