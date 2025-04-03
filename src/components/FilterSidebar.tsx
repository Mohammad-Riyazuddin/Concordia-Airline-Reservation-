import React from "react";
import { Card } from "./ui/card";
import { Slider } from "./ui/slider";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { ScrollArea } from "./ui/scroll-area";

interface Airline {
  id: string;
  name: string;
}

interface FilterSidebarProps {
  priceRange?: [number, number];
  onPriceRangeChange?: (value: [number, number]) => void;
  airlines?: Airline[];
  selectedAirlines?: string[];
  onAirlineChange?: (airlineId: string) => void;
  departureTimeRange?: [number, number];
  onDepartureTimeChange?: (value: [number, number]) => void;
}

const defaultAirlines: Airline[] = [
  { id: "1", name: "American Airlines" },
  { id: "2", name: "United Airlines" },
  { id: "3", name: "Delta Air Lines" },
  { id: "4", name: "Southwest Airlines" },
  { id: "5", name: "British Airways" },
];

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  priceRange = [0, 2000],
  onPriceRangeChange = () => {},
  airlines = defaultAirlines,
  selectedAirlines = [],
  onAirlineChange = () => {},
  departureTimeRange = [0, 24],
  onDepartureTimeChange = () => {},
}) => {
  return (
    <Card className="w-[280px] p-4 bg-white">
      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-6">
          {/* Price Range Filter */}
          <div className="space-y-2">
            <h3 className="font-semibold">Price Range</h3>
            <Slider
              defaultValue={priceRange}
              max={2000}
              step={10}
              onValueChange={(value) =>
                onPriceRangeChange(value as [number, number])
              }
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>

          {/* Airlines Filter */}
          <div className="space-y-2">
            <h3 className="font-semibold">Airlines</h3>
            <div className="space-y-2">
              {airlines.map((airline) => (
                <div key={airline.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`airline-${airline.id}`}
                    checked={selectedAirlines.includes(airline.id)}
                    onCheckedChange={() => onAirlineChange(airline.id)}
                  />
                  <Label htmlFor={`airline-${airline.id}`}>
                    {airline.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Departure Time Filter */}
          <div className="space-y-2">
            <h3 className="font-semibold">Departure Time</h3>
            <Slider
              defaultValue={departureTimeRange}
              max={24}
              step={1}
              onValueChange={(value) =>
                onDepartureTimeChange(value as [number, number])
              }
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{departureTimeRange[0]}:00</span>
              <span>{departureTimeRange[1]}:00</span>
            </div>
          </div>
        </div>
      </ScrollArea>
    </Card>
  );
};

export default FilterSidebar;
