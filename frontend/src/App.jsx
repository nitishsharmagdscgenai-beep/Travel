// src/App.jsx
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateTrip from "./pages/CreateTrip";
import TripDetails from "./pages/TripDetails";
import ChatAssistant from "./pages/ChatAssistant";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

function App() {
  useEffect(() => {
    // Check for dark mode preference
    const isDark = localStorage.getItem("darkMode") === "true";
    if (isDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-trip" element={<CreateTrip />} />
              <Route path="/trip/:id" element={<TripDetails />} />
              <Route path="/chat" element={<ChatAssistant />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
