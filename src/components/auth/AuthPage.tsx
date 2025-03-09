import React, { useState } from "react";
import AuthForm from "./AuthForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const AuthPage = () => {
  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Login failed");
      // Handle successful login
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleSignup = async (data: {
    email: string;
    password: string;
    role: "customer" | "admin";
  }) => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Signup failed");
      // Handle successful signup
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
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
