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
import CaptainPayment from "./pages/captain/CaptainPayment";
const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/riding" element={<Riding />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/captain-login" element={<CaptainLogin />} />
        <Route path="/captain-signup" element={<CaptainSignup />} />
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
        <Route
          path="/captain-payment"
          element={
            <CaptainProtectedWrapper>
              <CaptainPayment />
            </CaptainProtectedWrapper>
          }
        />
      </Routes>
    </>
  );
};

export default App;
