import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import FlightSearchForm from "./FlightSearchForm";
import FlightResults from "./FlightResults";
import BookingWizard from "./BookingWizard";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { searchFlights, FlightSearchParams, FlightData } from "../api/flights";

const Home = () => {
  const [searchParams, setSearchParams] = useState<FlightSearchParams | null>(
    null,
  );
  const [showResults, setShowResults] = useState(false);
  const [showBookingWizard, setShowBookingWizard] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<FlightData | null>(null);
  const [flights, setFlights] = useState<FlightData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        // Set default role to customer if not specified but has userId starting with 'cust'
        if (
          !parsedUser.role &&
          parsedUser.userId &&
          parsedUser.userId.startsWith("cust")
        ) {
          parsedUser.role = "customer";
        }
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/auth?mode=login");
  };

  const handleSearch = async (params: FlightSearchParams) => {
    setSearchParams(params);
    setIsLoading(true);
    setShowBookingWizard(false);

    try {
      // For demo purposes, we'll use mock data instead of calling the API
      // In a real app, you would use: const results = await searchFlights(params);
      const mockResults: FlightData[] = [
        {
          flightNumber: "E6009",
          departureTime: "2025-06-01T10:00:00",
          arrivalTime: "2025-06-01T10:21:00",
          origin: "Vancouver",
          destination: "Montreal",
          price: 500,
          airline: "Air Canada",
          availableSeats: [
            {
              seatNumber: "A1",
              class: "Economy",
              isOccupied: true,
            },
            {
              seatNumber: "A2",
              class: "Economy",
              isOccupied: false,
            },
            {
              seatNumber: "A3",
              class: "First",
              isOccupied: false,
            },
            {
              seatNumber: "A4",
              class: "Economy",
              isOccupied: false,
            },
          ],
        },
        {
          flightNumber: "WJ238",
          departureTime: "2025-06-01T14:30:00",
          arrivalTime: "2025-06-01T16:45:00",
          origin: "Vancouver",
          destination: "Montreal",
          price: 450,
          airline: "WestJet",
          availableSeats: [
            {
              seatNumber: "B1",
              class: "Business",
              isOccupied: false,
            },
            {
              seatNumber: "B2",
              class: "Business",
              isOccupied: true,
            },
            {
              seatNumber: "C1",
              class: "Economy",
              isOccupied: false,
            },
            {
              seatNumber: "C2",
              class: "Economy",
              isOccupied: false,
            },
          ],
        },
      ];

      setFlights(mockResults);
      setShowResults(true);
    } catch (error) {
      console.error("Error searching flights:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectFlight = (flight: FlightData) => {
    setSelectedFlight(flight);
    setShowBookingWizard(true);
  };

  const handleBackToResults = () => {
    setShowBookingWizard(false);
  };

  const handleBookingComplete = (bookingData: any) => {
    console.log("Booking completed:", {
      ...bookingData,
      flightDetails: selectedFlight,
    });
    setShowBookingWizard(false);

    // Show booking confirmation
    alert(
      `Booking confirmed! Your flight ${selectedFlight?.flightNumber} from ${selectedFlight?.origin} to ${selectedFlight?.destination} has been booked.`,
    );
  };

  return (
    <div className="container mx-auto p-4 bg-white min-h-screen">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-600">SkyWay Airlines</h1>
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-blue-600 font-medium">
                  Welcome, {user.name}
                </span>
                {user.role === "admin" && (
                  <Link
                    to="/admin/dashboard"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-600 text-blue-600"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <div>
                <Link
                  to="/auth?mode=login"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors mr-4 text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/auth?mode=signup"
                  className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors text-sm font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main>
        <section className="mb-8">
          <FlightSearchForm onSearch={handleSearch} />
        </section>

        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        )}

        {showResults && !isLoading && (
          <section className="mb-8">
            <FlightResults
              flights={flights}
              onFlightSelect={handleSelectFlight}
            />
          </section>
        )}

        {showBookingWizard && selectedFlight && (
          <section>
            <BookingWizard
              isOpen={true}
              onClose={handleBackToResults}
              onComplete={handleBookingComplete}
              selectedFlight={selectedFlight}
            />
          </section>
        )}
      </main>
    </div>
  );
};

export default Home;
