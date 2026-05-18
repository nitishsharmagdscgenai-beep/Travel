// src/components/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiHome,
  FiCompass,
  FiMessageSquare,
  FiUser,
  FiMap,
  FiCalendar,
  FiTrendingUp,
  FiSun,
  FiMoon,
} from "react-icons/fi";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [isDark, setIsDark] = React.useState(
    localStorage.getItem("darkMode") === "true",
  );

  const toggleDarkMode = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem("darkMode", newDark);
    if (newDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const menuItems = [
    { path: "/dashboard", icon: FiHome, label: "Dashboard" },
    { path: "/create-trip", icon: FiCompass, label: "Create Trip" },
    { path: "/chat", icon: FiMessageSquare, label: "AI Assistant" },
    { path: "/profile", icon: FiUser, label: "Profile" },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 280 : 80 }}
      className="relative bg-white dark:bg-gray-800 shadow-xl z-10"
    >
      <div className="h-full flex flex-col">
        <div className="p-6">
          <motion.div
            animate={{ opacity: isOpen ? 1 : 0 }}
            className="text-2xl font-bold gradient-text"
          >
            TravelAI
          </motion.div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`
              }
            >
              <item.icon className="text-xl" />
              <motion.span
                animate={{ opacity: isOpen ? 1 : 0 }}
                className="font-medium"
              >
                {item.label}
              </motion.span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t dark:border-gray-700">
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
          >
            {isDark ? (
              <FiSun className="text-xl" />
            ) : (
              <FiMoon className="text-xl" />
            )}
            <motion.span
              animate={{ opacity: isOpen ? 1 : 0 }}
              className="font-medium"
            >
              {isDark ? "Light Mode" : "Dark Mode"}
            </motion.span>
          </button>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
