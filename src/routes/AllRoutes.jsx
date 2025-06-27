import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../componants/Dashboard/Dashboard"; // layout with Sidebar + Navbar
import RecruiterID from "../pages/RecruiterID";
import CartToSelect from "../componants/Login/CartToSelect";
import RecruiterLogin from "../componants/Login/RecruiterLogin";
import Client from "../pages/Client";
import CandidateData from "../pages/CandidateData";
import Login from "../componants/Login/Login";
import RecruiterDashboard from "../componants/RecruiterDashboard/RecruiterDashboard"
import DataAssign from "../recruiterpages/DataAssign";
import Candidatedata from "../recruiterpages/Candidatedata";

const SuperAdminRoute = ({ children }) => {
  const token = localStorage.getItem("crm_token");
  const role = localStorage.getItem("user_role");
  return token && role === "superadmin" ? children : <Navigate to="/login" />;
};

// Recruiter private route
const RecruiterRoute = ({ children }) => {
  const token = localStorage.getItem("crm_token");
  const role = localStorage.getItem("user_role");
  return token && role === "recruiter" ? children : <Navigate to="/login" />;
};
const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/login/" element={<CartToSelect />}>
        <Route index element={<Login />} />
        <Route path="superadmin"  element={<Login />} />
        <Route path="recuriter" element={<RecruiterLogin />} />
      </Route>
      <Route
        path="/"
        element={
          <SuperAdminRoute>
            <Dashboard />
          </SuperAdminRoute>
        }
      >
        <Route index element={<RecruiterID />} />
        <Route path="client" element={<Client />} />
        <Route path="candidate-data" element={<CandidateData />} />
      </Route>
      <Route
        path="/recruiterDashboard/*"
        element={
          <RecruiterRoute>
            <RecruiterDashboard />
          </RecruiterRoute>
        }
       
      >
      <Route index element={<Candidatedata />} /> 
        <Route path="candidateData" index element={<Candidatedata />} />
         <Route path="Data-Assign" element={<DataAssign />} />
    </Route>
    </Routes>
  );
};

export default AllRoutes;
