import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../componants/Dashboard/Dashboard"; // layout with Sidebar + Navbar
import RecruiterID from "../pages/RecruiterID";
import Client from "../pages/Client";
import CandidateData from "../pages/CandidateData";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />}>
        <Route index element={<RecruiterID />} />
        <Route path="client" element={<Client />} />
        <Route path="candidate-data" element={<CandidateData />} />
      </Route>
    </Routes>
  );
};

export default AllRoutes;
