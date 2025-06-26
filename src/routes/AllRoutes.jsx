import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../componants/Dashboard/Dashboard"; // layout with Sidebar + Navbar
import RecruiterID from "../pages/RecruiterID";
import CartToSelect from "../componants/Login/CartToSelect";
import RecruiterLogin from "../componants/Login/RecruiterLogin";
import Client from "../pages/Client";
import CandidateData from "../pages/CandidateData";
import Login from "../componants/Login/Login";
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("crm_token");
  return token ? children : <Navigate to="/login" />;
};
const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/login/" element={<CartToSelect />}>
        <Route index element={<Login />} />
        <Route path="superadmin" element={<Login />} />
        <Route path="recuriter" element={<RecruiterLogin />} />
      </Route>
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      >
        <Route index element={<RecruiterID />} />
        <Route path="client" element={<Client />} />
        <Route path="candidate-data" element={<CandidateData />} />
      </Route>
    </Routes>
  );
};

export default AllRoutes;
