import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import FlightSearchForm from "./FlightSearchForm";
import FlightResults from "./FlightResults";
import BookingWizard from "./BookingWizard";
import { Button } from "./ui/button";
import { LogOut, Download } from "lucide-react";
import { searchFlights, FlightSearchParams, FlightData } from "../api/flights";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { CheckCircle } from "lucide-react";
import { jsPDF } from "jspdf";

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
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
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
      // Directly use the API response without any transformation
      const searchUrl = `http://localhost:3000/flights?origin=${encodeURIComponent(params.origin)}&destination=${encodeURIComponent(params.destination)}`;
      console.log("Fetching from URL:", searchUrl);

      // For testing, use a direct fetch to ensure we get the exact response
      const response = await fetch(searchUrl);
      if (!response.ok) {
        throw new Error(`Failed to search flights: ${response.statusText}`);
      }

      const results = await response.json();
      console.log("API search results:", results);

      // Make sure results is an array
      const flightArray = Array.isArray(results) ? results : [results];
      console.log("Processed flight array:", flightArray);

      // Fix the availableSeats issue if needed
      const fixedFlights = flightArray.map((flight) => {
        // Make sure availableSeats is properly formatted
        if (flight.availableSeats) {
          const fixedSeats = flight.availableSeats.map((seat) => {
            // Fix swapped seatNumber and class if needed
            if (seat.seatNumber === "Economy" && seat.class.startsWith("A")) {
              return {
                seatNumber: seat.class,
                class: "Economy",
                isOccupied: seat.isOccupied,
              };
            }
            return seat;
          });
          return { ...flight, availableSeats: fixedSeats };
        }
        return flight;
      });

      console.log("Fixed flights:", fixedFlights);
      // Set flights and show results
      setFlights(fixedFlights);
      setShowResults(true);
    } catch (error) {
      console.error("Error searching flights:", error);
      // Show error message to user
      alert("Error searching for flights. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectFlight = (flight: any) => {
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

    // Instead of alert, set state to show confirmation dialog
    setBookingDetails({
      ...bookingData,
      flightDetails: selectedFlight,
    });
    setShowConfirmation(true);
  };

  const closeConfirmation = () => {
    setShowConfirmation(false);
  };

  // Function to generate and download PDF with booking details
  const generateBookingPDF = (bookingData: any, flightData: any) => {
    if (!bookingData || !flightData) return;

    // Create a new PDF document
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.setTextColor(0, 150, 0);
    doc.text("Booking Confirmation", 105, 20, { align: "center" });

    // Add logo or header
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 150);
    doc.text("SkyWay Airlines", 105, 30, { align: "center" });

    // Add horizontal line
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 35, 190, 35);

    // Flight details section
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Flight Details", 20, 45);

    doc.setFontSize(12);
    doc.text(`Flight Number: ${flightData.flightNumber}`, 25, 55);
    doc.text(`From: ${flightData.origin}`, 25, 65);
    doc.text(`To: ${flightData.destination}`, 25, 75);
    doc.text(
      `Departure: ${flightData.departureDate || ""} ${flightData.departureTime || ""}`,
      25,
      85,
    );
    doc.text(
      `Arrival: ${flightData.arrivalDate || ""} ${flightData.arrivalTime || ""}`,
      25,
      95,
    );

    // Booking details section
    if (bookingData.booking) {
      doc.setFontSize(14);
      doc.text("Booking Details", 20, 115);

      doc.setFontSize(12);
      doc.text(
        `Booking Reference: ${bookingData.booking.ticket.bookingRef}`,
        25,
        125,
      );
      doc.text(
        `Seat: ${bookingData.booking.seat.seatNumber} (${bookingData.booking.seat.class})`,
        25,
        135,
      );
      doc.text(
        `Meal Preference: ${bookingData.booking.meal.mealType}`,
        25,
        145,
      );
    }

    // Payment details section
    if (bookingData.payment) {
      doc.setFontSize(14);
      doc.text("Payment Details", 20, 165);

      doc.setFontSize(12);
      doc.text(`Transaction ID: ${bookingData.payment.transactionID}`, 25, 175);
      doc.text(
        `Amount Paid: ${bookingData.payment.paymentDetails.paymentAmount.toFixed(2)}`,
        25,
        185,
      );
      doc.text(
        `Payment Date: ${new Date(bookingData.payment.paymentDetails.date).toLocaleString()}`,
        25,
        195,
      );
    }

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Thank you for choosing SkyWay Airlines", 105, 280, {
      align: "center",
    });

    // Save the PDF
    doc.save(`booking-${flightData.flightNumber}.pdf`);
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

        {/* Booking Confirmation Dialog */}
        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent className="sm:max-w-md bg-white">
            <DialogHeader>
              <DialogTitle className="flex items-center text-green-600">
                <CheckCircle className="mr-2 h-6 w-6" /> Booking Confirmed
              </DialogTitle>
              <DialogDescription>
                Your flight has been successfully booked.
              </DialogDescription>
            </DialogHeader>
            {bookingDetails && selectedFlight && (
              <div className="py-4">
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 border-b pb-2">
                    Flight Details:
                  </p>
                  <div className="grid grid-cols-2 gap-y-2">
                    <p className="text-sm">
                      <span className="font-semibold">Flight Number:</span>
                    </p>
                    <p className="text-sm">{selectedFlight.flightNumber}</p>

                    <p className="text-sm">
                      <span className="font-semibold">From:</span>
                    </p>
                    <p className="text-sm">{selectedFlight.origin}</p>

                    <p className="text-sm">
                      <span className="font-semibold">To:</span>
                    </p>
                    <p className="text-sm">{selectedFlight.destination}</p>

                    <p className="text-sm">
                      <span className="font-semibold">Date:</span>
                    </p>
                    <p className="text-sm">{selectedFlight.departureDate}</p>

                    <p className="text-sm">
                      <span className="font-semibold">Time:</span>
                    </p>
                    <p className="text-sm">{selectedFlight.departureTime}</p>

                    {bookingDetails.booking && (
                      <>
                        <p className="text-sm">
                          <span className="font-semibold">Seat:</span>
                        </p>
                        <p className="text-sm">
                          {bookingDetails.booking.seat.seatNumber} (
                          {bookingDetails.booking.seat.class})
                        </p>

                        <p className="text-sm">
                          <span className="font-semibold">
                            Booking Reference:
                          </span>
                        </p>
                        <p className="text-sm">
                          {bookingDetails.booking.ticket.bookingRef}
                        </p>
                      </>
                    )}

                    {bookingDetails.payment && (
                      <>
                        <p className="text-sm">
                          <span className="font-semibold">Amount Paid:</span>
                        </p>
                        <p className="text-sm">
                          $
                          {bookingDetails.payment.paymentDetails.paymentAmount.toFixed(
                            2,
                          )}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
            <DialogFooter className="flex justify-between mt-4">
              <Button
                variant="outline"
                className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200"
                onClick={() =>
                  generateBookingPDF(bookingDetails, selectedFlight)
                }
              >
                Download Details
              </Button>
              <Button onClick={closeConfirmation}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Home;
