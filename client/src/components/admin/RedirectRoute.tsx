import { Navigate,Outlet } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";

// Redirect authenticated users to main portal when they try to visit login/riegister page
function RedirectRoute() {
  const adminReducer = useAppSelector((store) => store.admin);

  return adminReducer.isAuthenticated && adminReducer.isAdmin ? <Navigate to="/admin" replace /> : <Outlet/>;
}

export default RedirectRoute;
