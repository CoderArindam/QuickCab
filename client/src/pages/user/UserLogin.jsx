import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../../context/UserContext";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import logo from "/logo.png";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useContext(UserDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/users/login`,
        { email, password },
        { withCredentials: true }
      );
      if (response.status === 200) {
        const data = response.data;
        setUser(data.user);
        localStorage.setItem("token", data.token);
        toast.success("Successfully logged in!");
        navigate("/home");
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 p-7 flex flex-col justify-center items-center relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 left-10 w-32 h-32 bg-slate-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob"></div>
        <div className="absolute top-0 right-10 w-32 h-32 bg-gray-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-32 h-32 bg-slate-100 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md bg-white/95  rounded-2xl shadow-lg p-8 relative">
        <div className="flex justify-center mb-8">
          <img
            className="w-24 h-24 object-contain drop-shadow-md hover:scale-105 invert transition-transform duration-300"
            src={logo}
            alt="logo"
          />
        </div>

        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Welcome to QuickCab
        </h2>

        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400 hover:border-slate-400"
              type="email"
              placeholder="email@example.com"
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
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400 hover:border-slate-400"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-3.5 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
          >
            {loading ? (
              <>
                <ClipLoader size={20} color="#ffffff" />
                <span>Signing in...</span>
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-8">
          <p className="text-center text-gray-600">
            New to QuickCab?{" "}
            <Link
              to="/signup"
              className="text-slate-700 font-medium hover:text-slate-900 transition-colors duration-200"
            >
              Create new Account
            </Link>
          </p>
        </div>

        <div className="mt-4">
          <Link
            to="/forgot-password"
            className="block text-center text-gray-500 hover:text-gray-700 text-sm transition-colors duration-200"
          >
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
