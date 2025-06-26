import React from "react";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
const RecruiterNavbar = ({ toggleSidebar }) => {
   const navigate = useNavigate();
  const handleLogout = () => {
    // Add your logout logic
    localStorage.removeItem("crm_token"); // Clear token
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="flex justify-between items-center p-3.5 border-[#F7F7F7] bg-[#F7F7F7]">
      {/* Left: Hamburger menu (only on mobile) */}
      <div>
        <button
          className="md:hidden text-black"
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <Menu size={26} />
        </button>
      </div>

      {/* Right: Logout button always visible */}
      <div>
        <button
          onClick={handleLogout}
          className="bg-green-300 text-black px-4 py-2 rounded hover:bg-green-400"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default RecruiterNavbar;
