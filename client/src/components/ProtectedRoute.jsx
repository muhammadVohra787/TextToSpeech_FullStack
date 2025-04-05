import React, { useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

const PrivateRoutes = ({ allowedRoles = [] }) => {
  const isAuthenticated = useIsAuthenticated();
  const authUser = useAuthUser();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if the user is authenticated
  console.log(authUser); // Check authUser structure
  console.log(allowedRoles); // Check allowedRoles

  useEffect(() => {
    // If not authenticated, redirect to /unauth
    if (!isAuthenticated) {
      navigate("/unauth", { state: { from: location } });
      return;
    }

    // Determine the role of the user based on `authUser.admin`
    const userRole = authUser?.admin ? "admin" : "user";

    // If user's role is not in allowedRoles, redirect to /unauth
    if (!allowedRoles.includes(userRole)) {
      navigate("/unauth", { state: { from: location } });
      return;
    }
  }, [isAuthenticated, authUser, allowedRoles, location, navigate]);

  // Render the children (protected route) if authenticated and role is allowed
  return isAuthenticated ? <Outlet /> : null;
};

export default PrivateRoutes;
