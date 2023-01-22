import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";

// Redirect authenticated users to main portal when they try to visit login/register page
function UserRedirectRoute(props: { children: JSX.Element }) {
  const userReducer = useAppSelector((store) => store.user);

  return userReducer.isAuthenticated ? <Navigate to="/" replace /> : props.children;
}

export default UserRedirectRoute;
