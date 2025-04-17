import React, { Suspense, lazy } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import AuthPage from "./components/auth/AuthPage";
import routes from "tempo-routes";

// Lazy load the admin components for better performance
const AdminDashboard = lazy(() => import("./components/AdminDashboard"));
const FlightManagement = lazy(
  () => import("./components/admin/FlightManagement"),
);
const MyBookings = lazy(() => import("./components/MyBookings"));

// Simple auth check function
const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  return token !== null && user !== null;
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
  // Check if user is authenticated by verifying both token and user data exist
  const authenticated = isAuthenticated();
  console.log("Authentication status:", authenticated);

  if (!authenticated) {
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/auth" replace />;
  }

  if (adminOnly && !isAdmin()) {
    console.log("User not admin, redirecting to home");
    return <Navigate to="/" replace />;
  }

  console.log("User authenticated, rendering protected content");
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
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute element={<MyBookings />} adminOnly={false} />
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
