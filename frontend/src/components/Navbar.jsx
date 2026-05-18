// src/components/Navbar.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { FiMenu, FiLogOut, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-sm">
      <div className="px-6 py-4 flex justify-between items-center">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <FiMenu className="text-2xl" />
        </button>

        <div className="flex items-center space-x-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="hidden md:block font-medium">{user?.name}</span>
          </motion.div>

          <button
            onClick={logout}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <FiLogOut className="text-xl" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
