import React from "react";
import { Link } from "react-router-dom";

const Start = () => {
  return (
    <div>
      <div className="bg-cover relative bg-center bg-[url(https://images.unsplash.com/photo-1619059558110-c45be64b73ae?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] h-screen pt-8 flex justify-between flex-col w-full">
        <img
          className="w-28 ml-0 absolute top-0 left-0"
          src="https://i.ibb.co/F3MFc2s/1fee5e07d071421a89925691127908dd-free-upscaled-removebg-preview.png"
          alt=""
        />
        <div className="bg-white pb-8 py-4 px-4 absolute bottom-0 left-0 right-0">
          <h2 className="text-[28px] text-center font-semibold">
            Get Started with QuickCab
          </h2>
          <Link
            to="/login"
            className="flex items-center justify-center w-full bg-black text-white py-3 rounded-lg mt-5"
          >
            Continue
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Start;
