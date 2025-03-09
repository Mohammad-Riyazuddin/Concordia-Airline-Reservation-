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

interface BookingWizardProps {
  isOpen?: boolean;
  onClose?: () => void;
  onComplete?: (bookingData: any) => void;
}

const BookingWizard: React.FC<BookingWizardProps> = ({
  isOpen = true,
  onClose = () => {},
  onComplete = () => {},
}) => {
  const [selectedSeat, setSelectedSeat] = React.useState("");
  const [travelClass, setTravelClass] = React.useState("economy");
  const [mealPreference, setMealPreference] = React.useState("regular");
  const [baggage, setBaggage] = React.useState<string[]>([]);
  const [specialRequests, setSpecialRequests] = React.useState("");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-white p-0">
        <Tabs defaultValue="seat" className="w-full">
          <div className="border-b px-6 py-4">
            <h2 className="text-2xl font-bold mb-4">Complete Your Booking</h2>
            <TabsList className="grid w-full grid-cols-5 gap-4">
              <TabsTrigger value="seat">Seat</TabsTrigger>
              <TabsTrigger value="class">Class</TabsTrigger>
              <TabsTrigger value="meal">Meal</TabsTrigger>
              <TabsTrigger value="baggage">Baggage</TabsTrigger>
              <TabsTrigger value="special">Requests</TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6">
            <TabsContent value="seat">
              <SeatMap
                selectedSeatId={selectedSeat}
                onSeatSelect={setSelectedSeat}
              />
            </TabsContent>

            <TabsContent value="class">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Select Travel Class</h3>
                <RadioGroup
                  value={travelClass}
                  onValueChange={setTravelClass}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-4">
                    <RadioGroupItem value="economy" id="economy" />
                    <Label htmlFor="economy">
                      Economy Class
                      <p className="text-sm text-gray-500">
                        Standard seating with basic amenities
                      </p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-4">
                    <RadioGroupItem value="business" id="business" />
                    <Label htmlFor="business">
                      Business Class
                      <p className="text-sm text-gray-500">
                        Premium seating with enhanced services
                      </p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-4">
                    <RadioGroupItem value="first" id="first" />
                    <Label htmlFor="first">
                      First Class
                      <p className="text-sm text-gray-500">
                        Luxury experience with exclusive amenities
                      </p>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
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

          <div className="border-t px-6 py-4 flex justify-between">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                onComplete({
                  selectedSeat,
                  travelClass,
                  mealPreference,
                  baggage,
                  specialRequests,
                })
              }
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
