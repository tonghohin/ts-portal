import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";

// Redirect authenticated users to main portal when they try to visit login/register page
function UserRedirectRoute() {
  const userReducer = useAppSelector((store) => store.user);

  return userReducer.isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
}

export default UserRedirectRoute;
