import React, { useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

const PrivateRoutes = ({ allowedRoles = [] }) => {
  const isAuthenticated = useIsAuthenticated();
  const authUser = useAuthUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/unauth", { state: { from: location } });
      return;
    }

    // Ensure authUser exists before checking role
    if (!authUser || !authUser.role || !allowedRoles.includes(authUser.role)) {
      navigate("/unauth", { state: { from: location } });
      return;
    }
  }, [isAuthenticated, authUser, allowedRoles, location, navigate]);

  return isAuthenticated ? <Outlet /> : null;
};

export default PrivateRoutes;
