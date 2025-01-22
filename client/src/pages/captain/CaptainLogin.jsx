import axios from "axios";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CaptainDataContext } from "../../context/CaptainContext";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import captainLogo from "/logo.png";

const CaptainLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { setCaptain } = useContext(CaptainDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { status, data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/captains/login`,
        { email, password },
        { withCredentials: true }
      );

      if (status === 200) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("captainData", JSON.stringify(data.captain));
        setCaptain(data.captain);
        toast.success("Successfully logged in!");
        navigate("/captain-home");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 p-7 flex flex-col justify-center items-center relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-8 left-12 w-36 h-36 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob"></div>
        <div className="absolute top-20 right-10 w-32 h-32 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-10 left-20 w-40 h-40 bg-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md bg-white/95 rounded-xl shadow-lg p-8 relative ">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            className="w-24 h-24 object-contain drop-shadow-md hover:scale-105 transition-transform duration-300 invert"
            src={captainLogo}
            alt="Captain Logo"
          />
        </div>

        <h2 className="text-3xl font-bold text-center mb-6 text-orange-700">
          Captain Login
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          Ready to drive with QuickCab? Log in to your captain account below.
        </p>

        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400 hover:border-orange-400"
              type="email"
              placeholder="captain@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400 hover:border-orange-400"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff size={20} className="opacity-75" />
                ) : (
                  <Eye size={20} className="opacity-75" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-center font-semibold text-sm">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3.5 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
          >
            {loading ? (
              <>
                <ClipLoader size={20} color="#ffffff" />
                <span>Logging in...</span>
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Not a captain yet?{" "}
            <Link
              to="/captain-signup"
              className="text-orange-600 font-medium hover:text-orange-700 transition-colors duration-200"
            >
              Register here
            </Link>
          </p>
        </div>

        <div className="mt-6">
          <Link
            to="/login"
            className="block text-center text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            Log in as a User
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CaptainLogin;
