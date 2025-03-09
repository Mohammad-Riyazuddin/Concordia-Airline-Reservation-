import React from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface SeatProps {
  id: string;
  number: string;
  type: "economy" | "business" | "first";
  isOccupied: boolean;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const Seat = ({
  id = "1A",
  number = "1A",
  type = "economy",
  isOccupied = false,
  isSelected = false,
  onSelect = () => {},
}: SeatProps) => {
  const baseClasses =
    "w-10 h-10 m-1 flex items-center justify-center rounded-lg transition-colors";
  const typeClasses = {
    economy: "bg-gray-100 hover:bg-gray-200",
    business: "bg-blue-100 hover:bg-blue-200",
    first: "bg-purple-100 hover:bg-purple-200",
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className={`${baseClasses} ${typeClasses[type]} ${isOccupied ? "bg-gray-300 cursor-not-allowed" : ""} ${isSelected ? "ring-2 ring-blue-500" : ""}`}
            onClick={() => !isOccupied && onSelect(id)}
            disabled={isOccupied}
          >
            {number}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            Seat {number} - {type.charAt(0).toUpperCase() + type.slice(1)}
          </p>
          <p>{isOccupied ? "Occupied" : "Available"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

interface SeatMapProps {
  seats?: Array<{
    id: string;
    number: string;
    type: "economy" | "business" | "first";
    isOccupied: boolean;
  }>;
  selectedSeatId?: string;
  onSeatSelect?: (id: string) => void;
}

const SeatMap = ({
  seats = [
    { id: "1A", number: "1A", type: "first", isOccupied: false },
    { id: "1B", number: "1B", type: "first", isOccupied: true },
    { id: "2A", number: "2A", type: "business", isOccupied: false },
    { id: "2B", number: "2B", type: "business", isOccupied: false },
    { id: "3A", number: "3A", type: "economy", isOccupied: false },
    { id: "3B", number: "3B", type: "economy", isOccupied: true },
  ],
  selectedSeatId = "",
  onSeatSelect = () => {},
}: SeatMapProps) => {
  return (
    <Card className="p-6 bg-white w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Select Your Seat</h2>
        <div className="flex gap-4 mb-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-100 rounded mr-2"></div>
            <span>Economy</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-100 rounded mr-2"></div>
            <span>Business</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-100 rounded mr-2"></div>
            <span>First Class</span>
          </div>
        </div>
      </div>

      <div className="relative w-full aspect-[2/1] bg-gray-50 rounded-lg p-4">
        {/* Airplane outline */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-full border-2 border-gray-300 rounded-t-full">
          {/* Seats container */}
          <div className="mt-16 flex flex-wrap justify-center gap-2 px-8">
            {seats.map((seat) => (
              <Seat
                key={seat.id}
                {...seat}
                isSelected={selectedSeatId === seat.id}
                onSelect={onSeatSelect}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {selectedSeatId
            ? `Selected seat: ${selectedSeatId}`
            : "No seat selected"}
        </div>
        <Button
          variant="default"
          disabled={!selectedSeatId}
          onClick={() => console.log(`Confirming seat ${selectedSeatId}`)}
        >
          Confirm Selection
        </Button>
      </div>
    </Card>
  );
};

export default SeatMap;
