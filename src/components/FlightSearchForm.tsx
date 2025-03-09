import React from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "./ui/command";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ChevronsUpDown, Plane } from "lucide-react";

interface Airport {
  code: string;
  name: string;
  city: string;
}

interface FlightSearchFormProps {
  onSearch?: (searchParams: {
    origin: string;
    destination: string;
    departureDate: Date;
    returnDate?: Date;
    passengers: number;
  }) => void;
}

const defaultAirports: Airport[] = [
  { code: "JFK", name: "John F. Kennedy International", city: "New York" },
  { code: "LAX", name: "Los Angeles International", city: "Los Angeles" },
  { code: "ORD", name: "O'Hare International", city: "Chicago" },
  { code: "LHR", name: "Heathrow", city: "London" },
  { code: "CDG", name: "Charles de Gaulle", city: "Paris" },
];

const FlightSearchForm: React.FC<FlightSearchFormProps> = ({
  onSearch = () => {},
}) => {
  const [origin, setOrigin] = React.useState<Airport | null>(null);
  const [destination, setDestination] = React.useState<Airport | null>(null);
  const [departureDate, setDepartureDate] = React.useState<Date | undefined>(
    new Date(),
  );
  const [returnDate, setReturnDate] = React.useState<Date | undefined>();
  const [passengers, setPassengers] = React.useState(1);
  const [isOriginOpen, setIsOriginOpen] = React.useState(false);
  const [isDestinationOpen, setIsDestinationOpen] = React.useState(false);

  return (
    <Card className="w-full p-6 bg-white">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Origin Airport */}
          <div className="space-y-2">
            <label className="text-sm font-medium">From</label>
            <Popover open={isOriginOpen} onOpenChange={setIsOriginOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={isOriginOpen}
                  className="w-full justify-between"
                >
                  {origin ? `${origin.city} (${origin.code})` : "Select origin"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                <Command>
                  <CommandInput placeholder="Search airports..." />
                  <CommandEmpty>No airports found.</CommandEmpty>
                  <CommandGroup>
                    {defaultAirports.map((airport) => (
                      <CommandItem
                        key={airport.code}
                        onSelect={() => {
                          setOrigin(airport);
                          setIsOriginOpen(false);
                        }}
                      >
                        <Plane className="mr-2 h-4 w-4" />
                        {airport.city} ({airport.code})
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Destination Airport */}
          <div className="space-y-2">
            <label className="text-sm font-medium">To</label>
            <Popover
              open={isDestinationOpen}
              onOpenChange={setIsDestinationOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={isDestinationOpen}
                  className="w-full justify-between"
                >
                  {destination
                    ? `${destination.city} (${destination.code})`
                    : "Select destination"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                <Command>
                  <CommandInput placeholder="Search airports..." />
                  <CommandEmpty>No airports found.</CommandEmpty>
                  <CommandGroup>
                    {defaultAirports.map((airport) => (
                      <CommandItem
                        key={airport.code}
                        onSelect={() => {
                          setDestination(airport);
                          setIsDestinationOpen(false);
                        }}
                      >
                        <Plane className="mr-2 h-4 w-4" />
                        {airport.city} ({airport.code})
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
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
            onClick={() =>
              onSearch({
                origin: origin?.code || "",
                destination: destination?.code || "",
                departureDate: departureDate || new Date(),
                returnDate,
                passengers,
              })
            }
          >
            Search Flights
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FlightSearchForm;
