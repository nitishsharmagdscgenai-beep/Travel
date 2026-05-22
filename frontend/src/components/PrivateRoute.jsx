import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiLoader } from "react-icons/fi";
import "../styles/components/PrivateRoute.css";

const PrivateRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-card">
          <div className="loading-spinner-wrapper">
            <div className="loading-spinner"></div>
            <FiLoader className="loading-icon" />
          </div>
          <h3 className="loading-title">Loading your dashboard</h3>
          <p className="loading-subtitle">
            Please wait while we set things up...
          </p>
        </div>
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
