import React from "react";
import { Routes, Router, Route } from "react-router-dom";
import Home from "./pages/user/Home";

import Start from "./pages/Start";
import CaptainProtectedWrapper from "./hoc/CaptainProtectedWrapper";
import UserProtectedWrapper from "./hoc/UserProtectedWrapper";

import Riding from "./pages/user/Riding";
import UserLogin from "./pages/user/UserLogin";
import UserSignup from "./pages/user/UserSignup";
import CaptainLogin from "./pages/captain/CaptainLogin";
import CaptainSignup from "./pages/captain/CaptainSignup";
import UserLogout from "./pages/user/UserLogout";
import CaptainHome from "./pages/captain/CaptainHome";
import CaptainLogout from "./pages/captain/CaptainLogout";
import CaptainRiding from "./pages/captain/CaptainRiding";
import CaptainRideFinished from "./pages/captain/CaptainRideFinished";
import CaptainPaymentPage from "./components/captain/CaptainPayment";
import ForgotPassword from "./pages/user/UserForgotPassword";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/riding" element={<Riding />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/captain-login" element={<CaptainLogin />} />
        <Route path="/captain-signup" element={<CaptainSignup />} />
        <Route path="/captain-payment" element={<CaptainPaymentPage />} />

        <Route
          path="/captain-ride-finished"
          element={<CaptainRideFinished />}
        />
        <Route
          path="/home"
          element={
            <UserProtectedWrapper>
              <Home />
            </UserProtectedWrapper>
          }
        />
        <Route
          path="/user/logout"
          element={
            <UserProtectedWrapper>
              <UserLogout />
            </UserProtectedWrapper>
          }
        />
        <Route
          path="/captain-home"
          element={
            <CaptainProtectedWrapper>
              <CaptainHome />
            </CaptainProtectedWrapper>
          }
        />
        <Route
          path="/captain-logout"
          element={
            <CaptainProtectedWrapper>
              <CaptainLogout />
            </CaptainProtectedWrapper>
          }
        />
        <Route
          path="/captain-riding"
          element={
            <CaptainProtectedWrapper>
              <CaptainRiding />
            </CaptainProtectedWrapper>
          }
        />
      </Routes>
    </>
  );
};

export default App;
