// User registration endpoint: /register - now using fetch API
export const register = async (
  name: string,
  email: string,
  password: string,
) => {
  try {
    const response = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, role: "customer" }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

// User login endpoint: /login - now using fetch API
export const login = async (email: string, password: string) => {
  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Admin registration endpoint: /admin/register - now using fetch API
export const adminRegister = async (
  name: string,
  email: string,
  password: string,
) => {
  try {
    const response = await fetch("http://localhost:3000/admin/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, role: "admin" }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Admin registration failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Admin registration error:", error);
    throw error;
  }
};

// Admin login endpoint: /admin/login - now using fetch API
export const adminLogin = async (email: string, password: string) => {
  try {
    const response = await fetch("http://localhost:3000/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Admin login failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Admin login error:", error);
    throw error;
  }
};
