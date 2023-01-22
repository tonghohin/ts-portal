import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";

// Redirect unauthenticated users to login page when they try to visit the main portal
function UserProtectedRoute(props: { children: JSX.Element }) {
  const userReducer = useAppSelector((store) => store.user);

  return userReducer.isAuthenticated ? props.children : <Navigate to="/login" replace />;
}

export default UserProtectedRoute;
