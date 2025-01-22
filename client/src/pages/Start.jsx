import { Link } from "react-router-dom";
import logo from "/logo.png";
const Start = () => {
  return (
    <div className="overflow-hidden">
      <div className="bg-cover relative bg-center bg-[url(https://images.unsplash.com/photo-1619059558110-c45be64b73ae?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] h-screen pt-8 flex justify-between flex-col w-full">
        <img className="w-28 ml-0 absolute top-0 left-0" src={logo} alt="" />
        <div className="bg-white pb-16 py-4 px-4 absolute bottom-0 left-0 right-0">
          <h2 className="text-[28px] text-center font-semibold">
            Get Started with QuickCab
          </h2>
          <div className="space-y-3 mt-5">
            <Link
              to="/login"
              className="flex items-center justify-center w-full bg-black text-white py-3 rounded-lg"
            >
              Continue as user
            </Link>
            <Link
              to="/captain-login"
              className="flex items-center justify-center w-full bg-black text-white py-3 rounded-lg"
            >
              Continue as captain
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Start;
