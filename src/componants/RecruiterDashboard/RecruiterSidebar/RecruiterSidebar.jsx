
import React from "react";
import { NavLink } from "react-router-dom";

const RecruiterSidebar = ({ isOpen, closeSidebar }) => {
  const navLinkClass = ({ isActive }) =>
    `px-6 py-3 block font-bold border-b border-gray-200 rounded-lg transition duration-200 ${
      isActive
        ? "bg-black text-[#FBFBFB]"
        : "text-black bg-[#FBFBFB] hover:bg-black hover:text-[#FBFBFB]"
    }`;

  return (
     <div
      className={`fixed md:static top-0 left-0 h-full bg-white w-56 z-40 transform transition-transform duration-300 border-r border-gray-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
    >
    <div className="w-56 bg-white min-h-screen border-r border-gray-200">
      <div className="py-6 px-4">
         <img src="/assets/virbiqlogo.png" alt="Logo" className="w-28 mb-5 pl-6" />
          <div className="border-b border-gray-100 mb-6"></div>
        <nav className="flex flex-col space-y-3">
          <NavLink onClick={closeSidebar} to="/recruiterDashboard/candidateData" className={navLinkClass}>Candidate Data</NavLink>
          <NavLink onClick={closeSidebar} to="/recruiterDashboard/Data-Assign" className={navLinkClass}>Data Assign</NavLink>
          
        </nav>
      </div>
    </div>
    </div>
  );
};

export default RecruiterSidebar;