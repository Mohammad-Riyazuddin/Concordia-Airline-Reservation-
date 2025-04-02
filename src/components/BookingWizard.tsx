import React from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import SeatMap from "./SeatMap";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { FlightData } from "../api/flights";

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
                      ${selectedFlight.price.toFixed(2)}
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
                      id="carry-on"
                      checked={baggage.includes("carry-on")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setBaggage([...baggage, "carry-on"]);
                        } else {
                          setBaggage(baggage.filter((b) => b !== "carry-on"));
                        }
                      }}
                    />
                    <Label htmlFor="carry-on">
                      Carry-on Baggage
                      <p className="text-sm text-gray-500">
                        1 piece up to 7kg (15lbs)
                      </p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Checkbox
                      id="checked-bag"
                      checked={baggage.includes("checked-bag")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setBaggage([...baggage, "checked-bag"]);
                        } else {
                          setBaggage(
                            baggage.filter((b) => b !== "checked-bag"),
                          );
                        }
                      }}
                    />
                    <Label htmlFor="checked-bag">
                      Checked Baggage
                      <p className="text-sm text-gray-500">
                        1 piece up to 23kg (50lbs)
                      </p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Checkbox
                      id="extra-bag"
                      checked={baggage.includes("extra-bag")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setBaggage([...baggage, "extra-bag"]);
                        } else {
                          setBaggage(baggage.filter((b) => b !== "extra-bag"));
                        }
                      }}
                    />
                    <Label htmlFor="extra-bag">
                      Extra Baggage
                      <p className="text-sm text-gray-500">
                        Additional piece up to 23kg (50lbs)
                      </p>
                    </Label>
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
              onClick={() =>
                onComplete({
                  selectedSeat,
                  flightNumber: selectedFlight?.flightNumber,
                  mealPreference,
                  baggage,
                  specialRequests,
                })
              }
              disabled={!selectedSeat}
            >
              Complete Booking
            </Button>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default BookingWizard;
