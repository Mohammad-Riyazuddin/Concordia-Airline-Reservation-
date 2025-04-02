import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthForm from "./AuthForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Card, CardContent } from "../ui/card";
import { toast } from "../ui/use-toast";

const AuthPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("login");
  const [loginType, setLoginType] = useState("customer");

  // Parse query parameters to determine which tab to show
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const mode = searchParams.get("mode");
    if (mode === "signup") {
      setActiveTab("signup");
    } else if (mode === "login") {
      setActiveTab("login");
    }
  }, [location]);

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      setIsLoading(true);
      // Determine if it's an admin login based on the loginType
      const endpoint =
        loginType === "admin"
          ? "http://localhost:3000/admin/login"
          : "http://localhost:3000/login";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const userData = await response.json();

      // Store user data and token in localStorage
      localStorage.setItem("token", userData.token);
      localStorage.setItem("user", JSON.stringify(userData.user));

      toast({
        title:
          loginType === "admin" ? "Admin Login Successful" : "Login Successful",
        description: "You have been logged in successfully.",
      });

      // Redirect to home page or admin dashboard based on role
      if (loginType === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (data: {
    name?: string;
    email: string;
    password: string;
    role?: string;
  }) => {
    try {
      setIsLoading(true);
      // Determine endpoint based on role
      const endpoint =
        data.role === "admin"
          ? "http://localhost:3000/admin/register"
          : "http://localhost:3000/register";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Signup failed");
      }

      const userData = await response.json();

      toast({
        title:
          data.role === "admin"
            ? "Admin Registration Successful"
            : "Registration Successful",
        description: `Your ${data.role === "admin" ? "admin" : ""} account has been created successfully. Please log in.`,
      });

      // Switch to login tab after successful signup
      setActiveTab("login");
      // Set login type based on the role they just registered with
      setLoginType(data.role === "admin" ? "admin" : "customer");
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Registration Failed",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred during registration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card className="mb-4">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <Label>Login As</Label>
                  <RadioGroup
                    value={loginType}
                    onValueChange={setLoginType}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="customer" id="login-customer" />
                      <Label htmlFor="login-customer">Customer</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="admin" id="login-admin" />
                      <Label htmlFor="login-admin">Admin</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
            <AuthForm mode="login" onSubmit={handleLogin} />
          </TabsContent>
          <TabsContent value="signup">
            <AuthForm mode="signup" onSubmit={handleSignup} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AuthPage;
