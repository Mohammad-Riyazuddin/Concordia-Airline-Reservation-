import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import SeatMap from "./SeatMap";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  FlightData,
  bookFlight,
  BookFlightPayload,
  BookingResponse,
  processPayment,
  PaymentPayload,
  PaymentResponse,
} from "../api/flights";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Loader2 } from "lucide-react";

interface BookingWizardProps {
  isOpen?: boolean;
  onClose?: () => void;
  onComplete?: (bookingData: any) => void;
  selectedFlight?: FlightData;
}

const BookingWizard: React.FC<BookingWizardProps> = ({
  isOpen = true,
  onClose = () => {},
  onComplete = () => {},
  selectedFlight,
}) => {
  const [selectedSeat, setSelectedSeat] = React.useState("");
  const [mealPreference, setMealPreference] = React.useState("regular");
  const [baggage, setBaggage] = React.useState<string[]>([]);
  const [specialRequests, setSpecialRequests] = React.useState("");
  const [totalPrice, setTotalPrice] = React.useState<number>(0);

  // New states for booking flow
  const [isBookingInProgress, setIsBookingInProgress] = useState(false);
  const [bookingResponse, setBookingResponse] =
    useState<BookingResponse | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState<boolean>(false);
  const [paymentFormData, setPaymentFormData] = useState({
    cardNumber: "",
    cvv: "",
    expiryDate: "",
  });
  const [paymentError, setPaymentError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentTransactionId, setPaymentTransactionId] = useState("");
  const [paymentDetails, setPaymentDetails] =
    useState<PaymentResponse["paymentDetails"]>();
  const [isPaymentInProgress, setIsPaymentInProgress] = useState(false);
  const [customerId, setCustomerId] = useState<string>("");
  const [showBookingDetails, setShowBookingDetails] = useState(false);

  // Format date for display
  const formatDateTime = (dateTimeStr?: string) => {
    if (!dateTimeStr) return "";
    if (dateTimeStr.includes("T")) {
      const date = new Date(dateTimeStr);
      return date.toLocaleString([], {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return dateTimeStr; // Return as is if not ISO format
  };

  // Calculate baggage price
  const calculateBaggagePrice = (selectedBaggage: string[]) => {
    let price = 0;
    if (selectedBaggage.includes("extra-bag-7kg")) {
      price += 50;
    }
    if (selectedBaggage.includes("extra-bag-23kg")) {
      price += 100;
    }
    return price;
  };

  // Update total price when baggage selection changes
  React.useEffect(() => {
    const basePrice = selectedFlight?.price || 0;
    const baggagePrice = calculateBaggagePrice(baggage);
    setTotalPrice(basePrice + baggagePrice);
  }, [baggage, selectedFlight]);

  // Handle booking submission
  const handleBookingSubmit = async () => {
    if (!selectedFlight || !selectedSeat) return;

    setIsBookingInProgress(true);
    setShowBookingDetails(true);

    // Find the selected seat details
    const seatDetails = selectedFlight.availableSeats.find(
      (seat) => seat.seatNumber === selectedSeat,
    );

    if (!seatDetails) {
      console.error("Selected seat not found");
      setIsBookingInProgress(false);
      return;
    }

    // Map baggage options to API payload format
    const baggagePayload = [];

    if (baggage.includes("extra-bag-7kg")) {
      baggagePayload.push({
        type: "Carry-on",
        weight: 7,
      });
    }

    if (baggage.includes("extra-bag-23kg")) {
      baggagePayload.push({
        type: "Suitcase",
        weight: 23,
      });
    }

    // Prepare booking payload
    const bookingPayload: BookFlightPayload = {
      flightNumber: selectedFlight.flightNumber,
      seatNumber: selectedSeat,
      seatClass: seatDetails.class,
      mealType: mealPreference,
      specialRequestType: specialRequests ? "Other" : undefined,
      specialRequestNote: specialRequests || undefined,
      baggage: baggagePayload,
    };

    try {
      // Get the customer ID from localStorage
      let customerIdFromStorage = localStorage.getItem("userId");

      // If userId is not directly stored, try to get it from the user object
      if (!customerIdFromStorage) {
        const userData = localStorage.getItem("user");
        if (userData) {
          try {
            const parsedUser = JSON.parse(userData);
            customerIdFromStorage = parsedUser.userId || parsedUser.id;
          } catch (error) {
            console.error("Error parsing user data:", error);
          }
        }
      }

      // Fallback to a default ID if none is found (for development purposes)
      if (!customerIdFromStorage) {
        console.warn("No customer ID found in storage, using default");
        customerIdFromStorage = "customer123";
      }

      setCustomerId(customerIdFromStorage);
      console.log("Using customer ID for booking:", customerIdFromStorage);
      const response = await bookFlight(customerIdFromStorage, bookingPayload);

      console.log("Booking response received:", response);
      setBookingResponse(response);
    } catch (error) {
      console.error("Error booking flight:", error);
    } finally {
      setIsBookingInProgress(false);
    }
  };

  // Handle payment submission
  const handlePaymentSubmit = async () => {
    if (!bookingResponse || !customerId) return;

    setIsPaymentInProgress(true);
    setPaymentError("");

    try {
      const paymentPayload: PaymentPayload = {
        flightNumber: bookingResponse.booking.flightNumber,
        paymentAmount: totalPrice,
        creditCardNumber: paymentFormData.cardNumber,
        cvv: paymentFormData.cvv,
        bookingId: bookingResponse.booking.bookingId,
      };

      const response = await processPayment(customerId, paymentPayload);

      setPaymentTransactionId(response.transactionID);
      setPaymentDetails(response.paymentDetails);
      setPaymentSuccess(true);

      // Call onComplete with the booking and payment data
      if (onComplete) {
        onComplete({
          booking: bookingResponse.booking,
          payment: response,
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentError("Failed to process payment. Please try again.");
    } finally {
      setIsPaymentInProgress(false);
    }
  };

  // Handle payment form input changes
  const handlePaymentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] max-w-3xl bg-white p-0 max-h-[90vh] overflow-auto">
        <Tabs defaultValue="seat" className="w-full">
          <div className="border-b px-4 py-3">
            <h2 className="text-xl font-bold mb-3">Complete Your Booking</h2>
            {selectedFlight && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800">
                  {selectedFlight.airline} - {selectedFlight.flightNumber}
                </h3>
                <div className="flex justify-between mt-2 text-sm">
                  <div>
                    <p className="font-medium">
                      {selectedFlight.origin} → {selectedFlight.destination}
                    </p>
                    <p>
                      Departure: {formatDateTime(selectedFlight.departureTime)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p>Arrival: {formatDateTime(selectedFlight.arrivalTime)}</p>
                    <p className="font-medium text-green-700">
                      ${totalPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <TabsList className="grid w-full grid-cols-4 gap-2 text-sm">
              <TabsTrigger value="seat">Seat</TabsTrigger>
              <TabsTrigger value="meal">Meal</TabsTrigger>
              <TabsTrigger value="baggage">Baggage</TabsTrigger>
              <TabsTrigger value="special">Requests</TabsTrigger>
            </TabsList>
          </div>

          <div className="p-3">
            <TabsContent value="seat">
              <SeatMap
                selectedSeatId={selectedSeat}
                onSeatSelect={setSelectedSeat}
                seats={selectedFlight?.availableSeats?.map((seat) => ({
                  id: seat.seatNumber,
                  number: seat.seatNumber,
                  type: seat.class.toLowerCase() as
                    | "economy"
                    | "business"
                    | "first",
                  isOccupied: seat.isOccupied,
                }))}
              />
            </TabsContent>

            <TabsContent value="meal">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Meal Preferences</h3>
                <RadioGroup
                  value={mealPreference}
                  onValueChange={setMealPreference}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-4">
                    <RadioGroupItem value="regular" id="regular" />
                    <Label htmlFor="regular">Regular Meal</Label>
                  </div>
                  <div className="flex items-center space-x-4">
                    <RadioGroupItem value="vegetarian" id="vegetarian" />
                    <Label htmlFor="vegetarian">Vegetarian</Label>
                  </div>
                  <div className="flex items-center space-x-4">
                    <RadioGroupItem value="vegan" id="vegan" />
                    <Label htmlFor="vegan">Vegan</Label>
                  </div>
                  <div className="flex items-center space-x-4">
                    <RadioGroupItem value="kosher" id="kosher" />
                    <Label htmlFor="kosher">Kosher</Label>
                  </div>
                  <div className="flex items-center space-x-4">
                    <RadioGroupItem value="halal" id="halal" />
                    <Label htmlFor="halal">Halal</Label>
                  </div>
                </RadioGroup>
              </div>
            </TabsContent>

            <TabsContent value="baggage">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Baggage Options</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Checkbox
                      id="extra-bag-7kg"
                      checked={baggage.includes("extra-bag-7kg")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setBaggage([...baggage, "extra-bag-7kg"]);
                        } else {
                          setBaggage(
                            baggage.filter((b) => b !== "extra-bag-7kg"),
                          );
                        }
                      }}
                    />
                    <Label htmlFor="extra-bag-7kg">
                      Extra Bag (7kg)
                      <p className="text-sm text-gray-500">
                        Additional piece up to 7kg (15lbs)
                        <span className="ml-2 font-medium text-blue-600">
                          +$50.00
                        </span>
                      </p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Checkbox
                      id="extra-bag-23kg"
                      checked={baggage.includes("extra-bag-23kg")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setBaggage([...baggage, "extra-bag-23kg"]);
                        } else {
                          setBaggage(
                            baggage.filter((b) => b !== "extra-bag-23kg"),
                          );
                        }
                      }}
                    />
                    <Label htmlFor="extra-bag-23kg">
                      Extra Bag (23kg)
                      <p className="text-sm text-gray-500">
                        Additional piece up to 23kg (50lbs)
                        <span className="ml-2 font-medium text-blue-600">
                          +$100.00
                        </span>
                      </p>
                    </Label>
                  </div>

                  <div className="mt-6 p-3 bg-blue-50 rounded-lg">
                    <div className="flex justify-between">
                      <p className="font-medium">Base ticket price:</p>
                      <p>${selectedFlight?.price.toFixed(2) || "0.00"}</p>
                    </div>
                    {baggage.includes("extra-bag-7kg") && (
                      <div className="flex justify-between">
                        <p>Extra bag (7kg):</p>
                        <p>+$50.00</p>
                      </div>
                    )}
                    {baggage.includes("extra-bag-23kg") && (
                      <div className="flex justify-between">
                        <p>Extra bag (23kg):</p>
                        <p>+$100.00</p>
                      </div>
                    )}
                    <div className="flex justify-between mt-2 pt-2 border-t border-blue-200">
                      <p className="font-bold">Total price:</p>
                      <p className="font-bold">${totalPrice.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="special">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Special Requests</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="special-requests">
                      Additional Requirements or Assistance
                    </Label>
                    <Textarea
                      id="special-requests"
                      placeholder="Enter any special requests or requirements..."
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>

          <div className="border-t px-4 py-3 flex justify-between">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleBookingSubmit}
              disabled={!selectedSeat || isBookingInProgress}
            >
              {isBookingInProgress ? "Processing..." : "Complete Booking"}
            </Button>
          </div>
        </Tabs>
      </DialogContent>

      {/* Booking Details Dialog */}
      {showBookingDetails && (
        <AlertDialog
          open={showBookingDetails}
          onOpenChange={setShowBookingDetails}
        >
          <AlertDialogContent className="max-w-md bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle>
                {isBookingInProgress
                  ? "Processing Your Booking"
                  : "Booking Confirmed"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {isBookingInProgress ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
                    <p className="text-center">
                      Please wait while we process your booking...
                    </p>
                  </div>
                ) : bookingResponse ? (
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Booking Details</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Flight:</span>
                            <span className="font-medium">
                              {bookingResponse.booking.flightNumber}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Seat:</span>
                            <span className="font-medium">
                              {bookingResponse.booking.seat.seatNumber} (
                              {bookingResponse.booking.seat.class})
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Booking Reference:</span>
                            <span className="font-medium">
                              {bookingResponse.booking.ticket.bookingRef}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Amount:</span>
                            <span className="font-medium">
                              ${totalPrice.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Payment Details</h3>
                      {paymentError && (
                        <div className="bg-red-50 text-red-800 p-3 rounded-md border border-red-200 mb-3">
                          {paymentError}
                        </div>
                      )}
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input
                            id="cardNumber"
                            name="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={paymentFormData.cardNumber}
                            onChange={handlePaymentInputChange}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label htmlFor="expiryDate">Expiry Date</Label>
                            <Input
                              id="expiryDate"
                              name="expiryDate"
                              placeholder="MM/YY"
                              value={paymentFormData.expiryDate}
                              onChange={handlePaymentInputChange}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              name="cvv"
                              placeholder="123"
                              value={paymentFormData.cvv}
                              onChange={handlePaymentInputChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p>No booking information available.</p>
                  </div>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              {!isBookingInProgress && bookingResponse ? (
                <>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handlePaymentSubmit}
                    disabled={
                      isPaymentInProgress ||
                      !paymentFormData.cardNumber ||
                      !paymentFormData.cvv ||
                      !paymentFormData.expiryDate
                    }
                  >
                    {isPaymentInProgress ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Make Payment"
                    )}
                  </AlertDialogAction>
                </>
              ) : (
                <AlertDialogCancel>Close</AlertDialogCancel>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Payment Success Dialog */}
      {paymentSuccess && bookingResponse && (
        <AlertDialog
          open={paymentSuccess}
          onOpenChange={(open) => {
            if (!open) {
              setPaymentSuccess(false);
              onClose();
            }
          }}
        >
          <AlertDialogContent className="max-w-md bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Payment Successful</AlertDialogTitle>
              <AlertDialogDescription>
                <div className="space-y-4">
                  <p>Your payment has been processed successfully!</p>

                  <div className="bg-green-50 p-4 rounded-md border border-green-200">
                    <h3 className="font-medium text-green-800 mb-2">
                      Payment Details
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p className="font-medium">Transaction ID:</p>
                      <p>{paymentTransactionId}</p>

                      {paymentDetails && (
                        <>
                          <p className="font-medium">Amount Paid:</p>
                          <p>${paymentDetails.paymentAmount.toFixed(2)}</p>

                          <p className="font-medium">Payment Date:</p>
                          <p>
                            {new Date(paymentDetails.date).toLocaleString()}
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-md border border-green-200">
                    <h3 className="font-medium text-green-800 mb-2">
                      Booking Details
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p className="font-medium">Booking Reference:</p>
                      <p>{bookingResponse.booking.ticket.bookingRef}</p>

                      <p className="font-medium">Flight:</p>
                      <p>{bookingResponse.booking.flightNumber}</p>

                      <p className="font-medium">Seat:</p>
                      <p>
                        {bookingResponse.booking.seat.seatNumber} (
                        {bookingResponse.booking.seat.class})
                      </p>

                      <p className="font-medium">Meal:</p>
                      <p>{bookingResponse.booking.meal.mealType}</p>
                    </div>
                  </div>

                  <Button
                    className="w-full mt-4"
                    variant="outline"
                    onClick={() => {}}
                  >
                    Download Booking Details
                  </Button>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction
                onClick={() => {
                  setPaymentSuccess(false);
                  onClose();
                }}
              >
                Close
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </Dialog>
  );
};

export default BookingWizard;
