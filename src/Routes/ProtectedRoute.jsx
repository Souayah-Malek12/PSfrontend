import React from "react";
import { useUserRole } from "../Context/UserContext";
import { Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types";  // ✅ Import PropTypes

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { userRole } = useUserRole();  // Get userRole from context
  
  console.log("protected route", userRole);
  console.log("✅ Allowed Roles:", allowedRoles);

  if (userRole === null || userRole === undefined) {
    return   <Navigate to="/login" />;


  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/login" />;
  }

  return  children ? children : <Outlet />;
  ;  
};

ProtectedRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ProtectedRoute;
