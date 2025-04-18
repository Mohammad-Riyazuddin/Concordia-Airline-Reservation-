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
import { ArrowLeft, Calendar, MapPin, Ticket, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";

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
  departureDate?: string; // Added departure date
  baggage: Baggage[];
}

const MyBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCancellationDialog, setShowCancellationDialog] =
    useState<boolean>(false);
  const [cancellationDetails, setCancellationDetails] = useState<any>(null);
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
        `http://localhost:3000/customer/${customerId}/bookings`,
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch bookings: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Bookings API response:", data);

      // Process the API response to extract bookings array
      if (data && data.bookings) {
        // Filter out string entries and keep only booking objects
        const processedBookings = data.bookings.filter(
          (booking) =>
            typeof booking === "object" &&
            booking !== null &&
            booking.bookingId,
        );
        console.log("Processed bookings:", processedBookings);
        setBookings(processedBookings);
      } else {
        setBookings([]);
      }
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
          departureDate: "2025-06-20T10:00:00.000Z", // Future date
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
          departureDate: "2025-05-25T14:30:00.000Z", // Future date
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
          departureDate: "2025-07-10T08:15:00.000Z", // Future date
          baggage: [],
        },
        {
          bookingId: "BK-1744602816089-7274",
          flightNumber: "C1014",
          seat: {
            seatNumber: "D2",
            class: "Economy",
            isOccupied: false,
          },
          meal: {
            mealType: "regular",
          },
          specialRequest: null,
          ticket: {
            ticketId: "TK-1744602816089-1872",
            boardingPassUrl: "",
            bookingRef: "BK-1744602816089-7274",
          },
          status: "confirmed",
          bookingDate: "2025-04-17T03:53:36.089Z",
          departureDate: "2025-04-01T11:45:00.000Z", // Past date
          baggage: [],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
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

      // Call the cancel booking API
      const response = await fetch(
        `http://localhost:3000/customer/${customerId}/booking/${bookingId}/cancel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to cancel booking: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Cancellation response:", data);

      // Show cancellation details
      setCancellationDetails(data);
      setShowCancellationDialog(true);

      // Refresh bookings list
      fetchBookings();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      setError(
        error instanceof Error ? error.message : "Failed to cancel booking",
      );
    }
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
                    className={`px-2 py-1 text-xs rounded-full font-medium
                    ${
                      booking.status === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : booking.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
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
                  {booking.departureDate && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                      <span className="text-sm font-medium">Departure:</span>
                      <span className="text-sm ml-2">
                        {new Date(booking.departureDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
              <Separator />
              <CardFooter className="pt-4">
                {booking.status === "confirmed" &&
                  booking.departureDate &&
                  new Date(booking.departureDate) > new Date() && (
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() =>
                        handleCancelBooking(booking.ticket.bookingRef)
                      }
                    >
                      Cancel
                    </Button>
                  )}
                {booking.status === "confirmed" &&
                  booking.departureDate &&
                  new Date(booking.departureDate) <= new Date() && (
                    <p className="text-sm text-gray-500 w-full text-center">
                      This flight has already departed
                    </p>
                  )}
                {booking.status === "pending" && (
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
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

      {/* Cancellation Confirmation Dialog */}
      {cancellationDetails && (
        <Dialog
          open={showCancellationDialog}
          onOpenChange={setShowCancellationDialog}
        >
          <DialogContent className="sm:max-w-md bg-white">
            <DialogHeader>
              <DialogTitle className="flex items-center text-green-600">
                <CheckCircle className="mr-2 h-6 w-6" /> Booking Cancelled
              </DialogTitle>
              <DialogDescription>
                Your booking has been successfully cancelled.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 border-b pb-2">
                  Cancellation Details:
                </p>
                <div className="grid grid-cols-2 gap-y-2">
                  <p className="text-sm">
                    <span className="font-semibold">Booking ID:</span>
                  </p>
                  <p className="text-sm">
                    {cancellationDetails.cancellation?.bookingId}
                  </p>

                  <p className="text-sm">
                    <span className="font-semibold">Flight Number:</span>
                  </p>
                  <p className="text-sm">
                    {cancellationDetails.cancellation?.flightNumber}
                  </p>

                  <p className="text-sm">
                    <span className="font-semibold">Cancellation Date:</span>
                  </p>
                  <p className="text-sm">
                    {cancellationDetails.cancellation?.cancellationDate &&
                      new Date(
                        cancellationDetails.cancellation.cancellationDate,
                      ).toLocaleString()}
                  </p>
                </div>

                {cancellationDetails.refund && (
                  <>
                    <p className="text-sm font-medium text-gray-700 border-b pb-2 mt-4">
                      Refund Details:
                    </p>
                    <div className="grid grid-cols-2 gap-y-2">
                      <p className="text-sm">
                        <span className="font-semibold">Refund ID:</span>
                      </p>
                      <p className="text-sm">
                        {cancellationDetails.refund.refundId}
                      </p>

                      <p className="text-sm">
                        <span className="font-semibold">Amount:</span>
                      </p>
                      <p className="text-sm">
                        ${cancellationDetails.refund.amount.toFixed(2)}
                      </p>

                      <p className="text-sm">
                        <span className="font-semibold">Status:</span>
                      </p>
                      <p className="text-sm">
                        <span className="px-2 py-1 text-xs rounded-full font-medium bg-yellow-100 text-yellow-800">
                          {cancellationDetails.refund.status}
                        </span>
                      </p>

                      <p className="text-sm">
                        <span className="font-semibold">Request Date:</span>
                      </p>
                      <p className="text-sm">
                        {cancellationDetails.refund.requestDate &&
                          new Date(
                            cancellationDetails.refund.requestDate,
                          ).toLocaleString()}
                      </p>

                      <p className="text-sm">
                        <span className="font-semibold">Reason:</span>
                      </p>
                      <p className="text-sm">
                        {cancellationDetails.refund.reason}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setShowCancellationDialog(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MyBookings;
