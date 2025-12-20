import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Vulnerable from "../pages/Vulnerable";
import ProtectedRoute from "../components/ProtectedRoute";

const routes = [
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/vulnerable",
    element: <Vulnerable />,
  },
];
export default routes;
