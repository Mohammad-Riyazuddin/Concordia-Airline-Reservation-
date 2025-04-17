import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Separator } from "./ui/separator";
import { ArrowLeft, Calendar, MapPin, Ticket } from "lucide-react";

interface Baggage {
  type: string;
  weight: number;
}

interface Seat {
  seatNumber: string;
  class: string;
  isOccupied: boolean;
}

interface Meal {
  mealType: string;
}

interface SpecialRequest {
  requestType: string;
  note: string;
  status: string;
}

interface Ticket {
  ticketId: string;
  boardingPassUrl: string;
  bookingRef: string;
}

interface Booking {
  bookingId: string;
  flightNumber: string;
  seat: Seat;
  meal: Meal;
  specialRequest: SpecialRequest | null;
  ticket: Ticket;
  status: "confirmed" | "pending" | "cancelled";
  bookingDate: string;
  baggage: Baggage[];
}

const MyBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get user data from localStorage
      const userData = localStorage.getItem("user");
      if (!userData) {
        throw new Error("User not logged in");
      }

      const user = JSON.parse(userData);
      const customerId = user.userId;

      if (!customerId) {
        throw new Error("Customer ID not found");
      }

      // Fetch bookings from API
      const response = await fetch(
        `http://localhost:3000/${customerId}/bookings`,
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch bookings: ${response.statusText}`);
      }

      const data = await response.json();
      setBookings(data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch bookings");

      // For development: mock data
      setBookings([
        {
          bookingId: "BK-1744602816089-7271",
          flightNumber: "C1011",
          seat: {
            seatNumber: "A3",
            class: "Economy",
            isOccupied: false,
          },
          meal: {
            mealType: "regular",
          },
          specialRequest: null,
          ticket: {
            ticketId: "TK-1744602816089-1869",
            boardingPassUrl: "",
            bookingRef: "BK-1744602816089-7271",
          },
          status: "confirmed",
          bookingDate: "2025-04-14T03:53:36.089Z",
          baggage: [],
        },
        {
          bookingId: "BK-1744602816089-7272",
          flightNumber: "C1012",
          seat: {
            seatNumber: "B5",
            class: "Business",
            isOccupied: false,
          },
          meal: {
            mealType: "vegetarian",
          },
          specialRequest: null,
          ticket: {
            ticketId: "TK-1744602816089-1870",
            boardingPassUrl: "",
            bookingRef: "BK-1744602816089-7272",
          },
          status: "pending",
          bookingDate: "2025-04-15T03:53:36.089Z",
          baggage: [],
        },
        {
          bookingId: "BK-1744602816089-7273",
          flightNumber: "C1013",
          seat: {
            seatNumber: "C7",
            class: "Economy",
            isOccupied: false,
          },
          meal: {
            mealType: "vegan",
          },
          specialRequest: null,
          ticket: {
            ticketId: "TK-1744602816089-1871",
            boardingPassUrl: "",
            bookingRef: "BK-1744602816089-7273",
          },
          status: "cancelled",
          bookingDate: "2025-04-16T03:53:36.089Z",
          baggage: [],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    // Implementation for cancel booking will be added later
    console.log("Cancel booking:", bookingId);
  };

  const handleMakePayment = async (bookingId: string) => {
    // Implementation for make payment will be added later
    console.log("Make payment for booking:", bookingId);
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="container mx-auto p-4 bg-white min-h-screen">
      <header className="mb-8">
        <div className="flex items-center">
          <Button variant="ghost" className="mr-2" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-blue-600">My Bookings</h1>
        </div>
      </header>

      <main>
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!isLoading && bookings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              You don't have any bookings yet.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <Card key={booking.bookingId} className="overflow-hidden">
              <CardHeader className="bg-blue-50 pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-semibold">
                    Flight {booking.flightNumber}
                  </CardTitle>
                  <div
                    className="px-2 py-1 text-xs rounded-full font-medium
                    ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'}"
                  >
                    {booking.status.charAt(0).toUpperCase() +
                      booking.status.slice(1)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Ticket className="h-4 w-4 mr-2 text-blue-500" />
                    <span className="text-sm font-medium">Booking Ref:</span>
                    <span className="text-sm ml-2">
                      {booking.ticket.bookingRef}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                    <span className="text-sm font-medium">Seat:</span>
                    <span className="text-sm ml-2">
                      {booking.seat.seatNumber} ({booking.seat.class})
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                    <span className="text-sm font-medium">Booked on:</span>
                    <span className="text-sm ml-2">
                      {new Date(booking.bookingDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
              <Separator />
              <CardFooter className="pt-4">
                {booking.status === "confirmed" && (
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => handleCancelBooking(booking.bookingId)}
                  >
                    Cancel Booking
                  </Button>
                )}
                {booking.status === "pending" && (
                  <Button
                    className="w-full"
                    onClick={() => handleMakePayment(booking.bookingId)}
                  >
                    Make Payment
                  </Button>
                )}
                {booking.status === "cancelled" && (
                  <p className="text-sm text-gray-500 w-full text-center">
                    This booking has been cancelled
                  </p>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MyBookings;
