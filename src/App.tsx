import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import AuthPage from "./components/auth/AuthPage";
import routes from "tempo-routes";

// Lazy load the admin components for better performance
const AdminDashboard = lazy(() => import("./components/AdminDashboard"));
const FlightManagement = lazy(
  () => import("./components/admin/FlightManagement"),
);

// Simple auth check function
const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

// Check if user is an admin
const isAdmin = () => {
  const user = localStorage.getItem("user");
  if (!user) return false;

  try {
    const userData = JSON.parse(user);
    return userData.role === "admin";
  } catch (error) {
    console.error("Error parsing user data:", error);
    return false;
  }
};

// Protected route component
const ProtectedRoute = ({
  element,
  adminOnly = false,
}: {
  element: JSX.Element;
  adminOnly?: boolean;
}) => {
  if (!isAuthenticated()) {
    return <Navigate to="/auth" replace />;
  }

  if (adminOnly && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return element;
};

function App() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          Loading...
        </div>
      }
    >
      <>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={<Home />} />
          <Route
            path="/admin/dashboard/*"
            element={
              <ProtectedRoute element={<AdminDashboard />} adminOnly={true} />
            }
          />
          <Route
            path="/admin/flights"
            element={
              <ProtectedRoute element={<FlightManagement />} adminOnly={true} />
            }
          />
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
