import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome,
  FiCompass,
  FiMessageSquare,
  FiUser,
  FiSun,
  FiMoon,
  FiChevronLeft,
  FiChevronRight,
  FiMenu,
  FiX,
} from "react-icons/fi";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [isDark, setIsDark] = useState(
    localStorage.getItem("darkMode") === "true",
  );
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const menuItems = [
    { path: "/dashboard", icon: FiHome, label: "Dashboard" },
    { path: "/create-trip", icon: FiCompass, label: "Create Trip" },
    { path: "/chat", icon: FiMessageSquare, label: "AI Assistant" },
    { path: "/profile", icon: FiUser, label: "Profile" },
  ];

  if (isMobile) {
    return (
      <>
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-black shadow-sm border border-gray-200 dark:border-gray-800 hover:border-green-500 dark:hover:border-green-500 transition-all md:hidden"
        >
          <FiMenu className="text-xl text-gray-700 dark:text-gray-300" />
        </button>

        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeMobileMenu}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              />
              <motion.aside
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                transition={{ type: "tween", duration: 0.3 }}
                className="fixed left-0 top-0 bottom-0 w-72 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 shadow-xl z-50 md:hidden"
              >
                <div className="h-full flex flex-col">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                    <div className="text-xl font-semibold gradient-text">
                      TravelAI
                    </div>
                    <button
                      onClick={closeMobileMenu}
                      className="p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                    >
                      <FiX className="text-xl" />
                    </button>
                  </div>

                  <nav className="flex-1 px-4 py-6 space-y-1">
                    {menuItems.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={closeMobileMenu}
                        className={({ isActive }) =>
                          `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                            isActive
                              ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-l-2 border-green-600"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900"
                          }`
                        }
                      >
                        <item.icon className="text-xl" />
                        <span className="font-medium">{item.label}</span>
                      </NavLink>
                    ))}
                  </nav>

                  <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                    <button
                      onClick={toggleDarkMode}
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
                    >
                      {isDark ? (
                        <FiSun className="text-xl" />
                      ) : (
                        <FiMoon className="text-xl" />
                      )}
                      <span className="font-medium">
                        {isDark ? "Light Mode" : "Dark Mode"}
                      </span>
                    </button>
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 260 : 72 }}
      className="relative bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 shadow-sm z-10 hidden md:block"
    >
      <div className="h-full flex flex-col">
        <div className="p-5 flex justify-between items-center">
          <motion.div
            animate={{ opacity: isOpen ? 1 : 0 }}
            className="text-xl font-semibold gradient-text whitespace-nowrap"
          >
            TravelAI
          </motion.div>

          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-all absolute -right-3 top-6 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-sm"
          >
            {isOpen ? (
              <FiChevronLeft className="text-sm text-gray-600 dark:text-gray-400" />
            ) : (
              <FiChevronRight className="text-sm text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900"
                }`
              }
            >
              <item.icon className="text-xl flex-shrink-0" />
              <motion.span
                animate={{
                  opacity: isOpen ? 1 : 0,
                  display: isOpen ? "inline" : "none",
                }}
                className="text-sm font-medium whitespace-nowrap"
              >
                {item.label}
              </motion.span>
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
          >
            {isDark ? (
              <FiSun className="text-xl flex-shrink-0" />
            ) : (
              <FiMoon className="text-xl flex-shrink-0" />
            )}
            <motion.span
              animate={{
                opacity: isOpen ? 1 : 0,
                display: isOpen ? "inline" : "none",
              }}
              className="text-sm font-medium whitespace-nowrap"
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
