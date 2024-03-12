import React from "react";
import { Route, Routes } from "react-router-dom";
import Userpage from "../components/pages/Userpage";
import Formlogin from "../components/form/Formlogin";
import Dashboardpage from "../components/pages/Dashboardpage";
import Salesdata from "../components/user/Salesdata";
import Product from "../components/user/Product";
import Cookies from "js-cookie";
import Profile from "../components/user/Profile";
import FormRegister from "../components/form/FormRegister";

const Router = () => {
  const token = Cookies.get("token");
  return (
    <>
      <Routes>
        {token ? (
          <>
            <Route path="/dashboard" element={<Dashboardpage />} />
            <Route path="/datasales" element={<Salesdata />} />
            <Route path="/product" element={<Product />} />
            <Route path="/profile" element={<Profile />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Userpage />} />
            <Route path="/login" element={<Formlogin />} />
            <Route path="/register" element={<FormRegister />} />
          </>
        )}
      </Routes>
    </>
  );
};

export default Router;
