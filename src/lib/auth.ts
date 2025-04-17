// This file is kept as a placeholder but JWT and bcrypt functions are removed
// as the application is now frontend-only with API calls to a backend

// Helper function to check if a user is authenticated based on localStorage user data
export const isAuthenticated = () => {
  return localStorage.getItem("user") !== null;
};

// Helper function to check if a user is an admin
export const isAdmin = () => {
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

// Helper function to get the current user from localStorage
export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  if (!user) return null;

  try {
    return JSON.parse(user);
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

// Helper function to logout a user
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
