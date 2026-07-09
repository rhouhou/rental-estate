import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const PrivateRoute = () => {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();

  if (currentUser) {
    return <Outlet />;
  }

  return <Navigate to="/sign-in" state={{ from: location }} replace />;
};

export default PrivateRoute;