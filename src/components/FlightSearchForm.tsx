import React, { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

interface FlightSearchFormProps {
  onSearch?: (searchParams: {
    origin: string;
    destination: string;
    departureDate: Date;
    returnDate?: Date;
    passengers: number;
  }) => void;
}

const FlightSearchForm: React.FC<FlightSearchFormProps> = ({
  onSearch = () => {},
}) => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState<Date | undefined>(
    new Date(),
  );
  const [returnDate, setReturnDate] = useState<Date | undefined>();
  const [passengers, setPassengers] = useState(1);

  const handleSearch = () => {
    if (!origin || !destination || !departureDate) {
      alert("Please fill in all required fields");
      return;
    }

    onSearch({
      origin,
      destination,
      departureDate,
      returnDate,
      passengers,
    });
  };

  return (
    <Card className="w-full p-6 bg-white">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Origin Airport */}
          <div className="space-y-2">
            <label className="text-sm font-medium">From</label>
            <Input
              placeholder="Enter origin city or airport"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              required
            />
          </div>

          {/* Destination Airport */}
          <div className="space-y-2">
            <label className="text-sm font-medium">To</label>
            <Input
              placeholder="Enter destination city or airport"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
          </div>

          {/* Departure Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Departure Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {departureDate ? format(departureDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={departureDate}
                  onSelect={setDepartureDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Return Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Return Date (Optional)
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {returnDate ? format(returnDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={returnDate}
                  onSelect={setReturnDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Passengers */}
        <div className="flex items-end gap-4">
          <div className="w-32 space-y-2">
            <label className="text-sm font-medium">Passengers</label>
            <Input
              type="number"
              min="1"
              value={passengers}
              onChange={(e) => setPassengers(parseInt(e.target.value) || 1)}
            />
          </div>

          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white px-8"
            onClick={handleSearch}
          >
            Search Flights
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FlightSearchForm;
