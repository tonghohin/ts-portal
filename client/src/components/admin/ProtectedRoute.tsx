import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";

// Redirect unauthenticated users to login page when they try to visit the main portal
function ProtectedRoute() {
  const adminReducer = useAppSelector((store) => store.admin);

  return adminReducer.isAuthenticated && adminReducer.isAdmin ? <Outlet /> : <Navigate to="/admin/login" replace />;
}

export default ProtectedRoute;
