import React from "react";
import { useAuth } from "../context/AuthContext";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white/80 dark:bg-black/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="px-6 py-3 flex justify-end items-center">
        <div className="flex items-center space-x-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-medium text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
              {user?.name}
            </span>
          </motion.div>

          <button
            onClick={logout}
            className="p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
            title="Logout"
          >
            <FiLogOut className="text-lg text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
