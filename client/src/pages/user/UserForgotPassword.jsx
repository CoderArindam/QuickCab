import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import logo from "/logo.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/users/forgot-password`,
        { email },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setSubmitted(true);
        toast.success("Password reset instructions sent to your email!");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Failed to send reset email. Please try again.";
      toast.error(errorMessage);
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

      <div className="w-full max-w-md bg-white/95 rounded-2xl shadow-lg p-8 relative">
        <Link
          to="/login"
          className="inline-flex items-center text-slate-600 hover:text-slate-800 mb-6 group"
        >
          <ArrowLeft
            size={20}
            className="mr-2 group-hover:-translate-x-1 transition-transform"
          />
          Back to Login
        </Link>

        <div className="flex justify-center mb-8">
          <img
            className="w-24 h-24 object-contain drop-shadow-md hover:scale-105 invert transition-transform duration-300"
            src={logo}
            alt="logo"
          />
        </div>

        {!submitted ? (
          <>
            <h2 className="text-3xl font-bold text-center mb-3 text-gray-800">
              Forgot Password?
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Don't worry! Enter your email and we'll send you instructions to
              reset your password.
            </p>

            <form onSubmit={submitHandler} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400 hover:border-slate-400"
                    type="email"
                    placeholder="Enter your email address"
                  />
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
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
                    <span>Sending...</span>
                  </>
                ) : (
                  "Send Reset Instructions"
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-6">
              <CheckCircle size={64} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Check Your Email
            </h2>
            <p className="text-gray-600">
              We've sent password reset instructions to:
              <br />
              <span className="font-medium text-gray-800">{email}</span>
            </p>
            <div className="pt-4">
              <p className="text-sm text-gray-500">
                Didn't receive the email? Check your spam folder or
                <button
                  onClick={submitHandler}
                  className="text-slate-700 font-medium hover:text-slate-900 ml-1"
                >
                  try sending again
                </button>
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-slate-700 font-medium hover:text-slate-900 transition-colors duration-200"
            >
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
