import React, { useState }  from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
   const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  return (
    <div className="flex h-screen">
      <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />
      <div className="flex-1 flex flex-col">
        <Navbar  toggleSidebar={toggleSidebar}/>
        <main className="p-4 overflow-y-auto bg-white h-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;


