import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CaptainDataContext } from "../../context/CaptainContext";
import axios from "axios";
import { toast } from "react-toastify"; // For toasts
import { Eye, EyeOff } from "lucide-react";
import logo from "/logo.png";

const CaptainSignup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [vehicleColor, setVehicleColor] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { captain, setCaptain } = useContext(CaptainDataContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Loading state

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const captainData = {
      fullName: {
        firstName,
        lastName,
      },
      email,
      password,
      vehicle: {
        color: vehicleColor,
        plateNumber: vehiclePlate,
        capacity: vehicleCapacity,
        vehicleType: vehicleType,
        model: vehicleModel, // Include model
      },
    };

    setLoading(true); // Start loading

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/captains/register`,
        captainData,
        {
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        const data = response.data;
        setCaptain(data.captain);
        localStorage.setItem("token", data.token);

        toast.success("Account created successfully!");
        navigate("/captain-home");
      } else {
        toast.error("Failed to create account.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }

    // Reset form
    setEmail("");
    setFirstName("");
    setLastName("");
    setPassword("");
    setConfirmPassword("");
    setVehicleCapacity("");
    setVehicleColor("");
    setVehiclePlate("");
    setVehicleType("");
    setVehicleModel("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 py-10 px-4 flex flex-col justify-center items-center relative overflow-hidden">
      {/* Enhanced decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-8 left-12 w-48 h-48 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob"></div>
        <div className="absolute top-20 right-10 w-44 h-44 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-10 left-20 w-52 h-52 bg-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-2xl bg-white/95 rounded-2xl shadow-xl p-10 relative">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            className="w-32 h-32 object-contain drop-shadow-lg hover:scale-105 transition-transform duration-300 invert"
            src={logo}
            alt="Captain Logo"
          />
        </div>

        <h2 className="text-4xl font-bold text-center mb-8 text-orange-700">
          Captain Signup
        </h2>

        <form onSubmit={submitHandler} className="space-y-8">
          {/* Personal Information Section */}
          <div className="bg-orange-50/50 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4 text-orange-800">
              Personal Information
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  First Name
                </label>
                <input
                  required
                  className="w-full bg-white rounded-lg px-4 py-3 border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all text-lg"
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Last Name
                </label>
                <input
                  required
                  className="w-full bg-white rounded-lg px-4 py-3 border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all text-lg"
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Email Address
              </label>
              <input
                required
                className="w-full bg-white rounded-lg px-4 py-3 border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all text-lg"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Section */}
          <div className="bg-orange-50/50 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4 text-orange-800">
              Security
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    className="w-full bg-white rounded-lg px-4 py-3 border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all text-lg pr-12"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    className="w-full bg-white rounded-lg px-4 py-3 border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all text-lg pr-12"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Information Section */}
          <div className="bg-orange-50/50 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4 text-orange-800">
              Vehicle Information
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Vehicle Color
                </label>
                <input
                  required
                  className="w-full bg-white rounded-lg px-4 py-3 border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all text-lg"
                  type="text"
                  placeholder="Vehicle Color"
                  value={vehicleColor}
                  onChange={(e) => setVehicleColor(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  License Plate
                </label>
                <input
                  required
                  className="w-full bg-white rounded-lg px-4 py-3 border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all text-lg"
                  type="text"
                  placeholder="Vehicle Plate"
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Vehicle Capacity
                </label>
                <input
                  required
                  className="w-full bg-white rounded-lg px-4 py-3 border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all text-lg"
                  type="number"
                  placeholder="Vehicle Capacity"
                  value={vehicleCapacity}
                  onChange={(e) => setVehicleCapacity(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Vehicle Model
                </label>
                <input
                  required
                  className="w-full bg-white rounded-lg px-4 py-3 border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all text-lg"
                  type="text"
                  placeholder="Vehicle Model"
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Vehicle Type
                </label>
                <select
                  required
                  className="w-full bg-white rounded-lg px-4 py-3 border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all text-lg"
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                >
                  <option value="" disabled>
                    Select Vehicle Type
                  </option>
                  <option value="car">Car</option>
                  <option value="auto">Auto</option>
                  <option value="motorcycle">Motorcycle</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 text-white font-semibold rounded-xl px-6 py-4 text-lg transition-all duration-200 hover:bg-orange-700 focus:ring-4 focus:ring-orange-200 disabled:opacity-70"
            disabled={loading}
          >
            {loading ? (
              <div className="flex justify-center items-center space-x-2">
                <div className="w-6 h-6 border-4 border-t-4 border-white rounded-full animate-spin"></div>
                <span>Creating Account...</span>
              </div>
            ) : (
              "Create Captain Account"
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-lg">
          Already have an account?{" "}
          <Link
            to="/captain-login"
            className="text-orange-600 hover:text-orange-700 font-semibold"
          >
            Login here
          </Link>
        </p>

        <div className="mt-6 text-sm text-center text-gray-600">
          This site is protected by reCAPTCHA and the{" "}
          <a href="#" className="underline hover:text-orange-600">
            Google Privacy Policy
          </a>{" "}
          and{" "}
          <a href="#" className="underline hover:text-orange-600">
            Terms of Service
          </a>{" "}
          apply.
        </div>
      </div>
    </div>
  );
};

export default CaptainSignup;
