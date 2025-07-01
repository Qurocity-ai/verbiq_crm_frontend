import React, { useState }  from "react";
import { Outlet } from "react-router-dom";
import RecruiterNavbar from "./RecruiterNavbar/RecruiterNavbar";
import RecruiterSidebar from "./RecruiterSidebar/RecruiterSidebar";

const RecruiterDashboard = () => {
   const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  return (
    <div className="flex h-screen">
      <RecruiterSidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />
      <div className="flex-1 flex flex-col">
        <RecruiterNavbar  toggleSidebar={toggleSidebar}/>
        <main className="p-4 overflow-y-auto bg-white h-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
