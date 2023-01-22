import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";

// Redirect authenticated users to main portal when they try to visit login/riegister page
function RedirectRoute(props: { children: JSX.Element }) {
  const adminReducer = useAppSelector((store) => store.admin);

  return adminReducer.isAuthenticated && adminReducer.isAdmin ? <Navigate to="/admin" replace /> : props.children;
}

export default RedirectRoute;
