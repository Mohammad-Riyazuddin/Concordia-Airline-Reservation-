import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { PlusCircle, LogOut, Home, Plane, Award } from "lucide-react";
import FlightManagement from "./admin/FlightManagement";
import LoyaltyManagement from "./admin/LoyaltyManagement";

const AdminDashboard = () => {
  const [user, setUser] = useState<{
    name: string;
    email: string;
    role: string;
  } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    } else {
      // If no user data, redirect to login
      navigate("/auth");
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear user data and token from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/auth");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span>Welcome, {user.name}</span>
            <Button
              variant="outline"
              size="sm"
              className="bg-white text-blue-600 hover:bg-blue-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto p-4 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Navigation</CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  <Link to="/">
                    <Button variant="ghost" className="w-full justify-start">
                      <Home className="mr-2 h-4 w-4" />
                      Back to Home
                    </Button>
                  </Link>
                  <Link to="/admin/dashboard/flights">
                    <Button variant="ghost" className="w-full justify-start">
                      <Plane className="mr-2 h-4 w-4" />
                      Flight Management
                    </Button>
                  </Link>
                  <Link to="/admin/dashboard/loyalty">
                    <Button variant="ghost" className="w-full justify-start">
                      <Award className="mr-2 h-4 w-4" />
                      Loyalty Programs
                    </Button>
                  </Link>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-3">
            <Routes>
              <Route
                path="/"
                element={
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Flight Management</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-4">
                          Manage flight schedules, prices, and availability.
                        </p>
                        <Link to="/admin/dashboard/flights">
                          <Button>
                            <Plane className="mr-2 h-4 w-4" />
                            Manage Flights
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Loyalty Programs</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-4">
                          Create and manage loyalty programs for customers.
                        </p>
                        <Link to="/admin/dashboard/loyalty">
                          <Button>
                            <Award className="mr-2 h-4 w-4" />
                            Manage Programs
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </div>
                }
              />
              <Route path="/flights/*" element={<FlightManagement />} />
              <Route path="/loyalty/*" element={<LoyaltyManagement />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
