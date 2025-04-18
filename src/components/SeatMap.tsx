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
    "w-8 h-8 flex items-center justify-center rounded-lg transition-colors text-sm";
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
            className={`${baseClasses} ${isOccupied ? "bg-gray-400 text-white cursor-not-allowed" : typeClasses[type]} ${isSelected ? "ring-2 ring-blue-500" : ""}`}
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
    // First Class (6 seats)
    { id: "1A", number: "1A", type: "first", isOccupied: false },
    { id: "1B", number: "1B", type: "first", isOccupied: true },
    { id: "1C", number: "1C", type: "first", isOccupied: false },
    { id: "1D", number: "1D", type: "first", isOccupied: false },
    { id: "1E", number: "1E", type: "first", isOccupied: false },
    { id: "1F", number: "1F", type: "first", isOccupied: true },

    // Business Class (6 seats)
    { id: "2A", number: "2A", type: "business", isOccupied: false },
    { id: "2B", number: "2B", type: "business", isOccupied: false },
    { id: "2C", number: "2C", type: "business", isOccupied: true },
    { id: "2D", number: "2D", type: "business", isOccupied: false },
    { id: "2E", number: "2E", type: "business", isOccupied: false },
    { id: "2F", number: "2F", type: "business", isOccupied: true },

    // Economy Class (18 seats)
    { id: "3A", number: "3A", type: "economy", isOccupied: false },
    { id: "3B", number: "3B", type: "economy", isOccupied: true },
    { id: "3C", number: "3C", type: "economy", isOccupied: false },
    { id: "3D", number: "3D", type: "economy", isOccupied: false },
    { id: "3E", number: "3E", type: "economy", isOccupied: false },
    { id: "3F", number: "3F", type: "economy", isOccupied: true },
    { id: "4A", number: "4A", type: "economy", isOccupied: false },
    { id: "4B", number: "4B", type: "economy", isOccupied: false },
    { id: "4C", number: "4C", type: "economy", isOccupied: true },
    { id: "4D", number: "4D", type: "economy", isOccupied: false },
    { id: "4E", number: "4E", type: "economy", isOccupied: false },
    { id: "4F", number: "4F", type: "economy", isOccupied: false },
    { id: "5A", number: "5A", type: "economy", isOccupied: true },
    { id: "5B", number: "5B", type: "economy", isOccupied: false },
    { id: "5C", number: "5C", type: "economy", isOccupied: false },
    { id: "5D", number: "5D", type: "economy", isOccupied: true },
    { id: "5E", number: "5E", type: "economy", isOccupied: false },
    { id: "5F", number: "5F", type: "economy", isOccupied: false },
  ],
  selectedSeatId = "",
  onSeatSelect = () => {},
}: SeatMapProps) => {
  // Group seats by type for better organization
  const seatsByType = {
    first: seats.filter((seat) => seat.type === "first"),
    business: seats.filter((seat) => seat.type === "business"),
    economy: seats.filter((seat) => seat.type === "economy"),
  };

  // Group seats by row for better organization
  const groupSeatsByRow = (
    seats: Array<{
      id: string;
      number: string;
      type: "economy" | "business" | "first";
      isOccupied: boolean;
    }>,
  ) => {
    // Extract row numbers from seat IDs (assuming format like "1A", "2B", etc.)
    const rows: Record<string, typeof seats> = {};

    seats.forEach((seat) => {
      // Extract the row identifier (number part) from the seat number
      const rowId = seat.number.match(/^\d+/)?.[0] || "";
      if (!rows[rowId]) {
        rows[rowId] = [];
      }
      rows[rowId].push(seat);
    });

    // Sort seats within each row by column letter
    Object.keys(rows).forEach((rowId) => {
      rows[rowId].sort((a, b) => {
        const colA = a.number.replace(/^\d+/, "");
        const colB = b.number.replace(/^\d+/, "");
        return colA.localeCompare(colB);
      });
    });

    return rows;
  };

  return (
    <Card className="p-3 bg-white w-full max-w-2xl mx-auto">
      <div className="mb-3 flex justify-between items-center">
        <h2 className="text-xl font-bold">Select Your Seat</h2>
        <div className="flex gap-3">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-100 rounded mr-1"></div>
            <span className="text-sm">Economy</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-100 rounded mr-1"></div>
            <span className="text-sm">Business</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-100 rounded mr-1"></div>
            <span className="text-sm">First Class</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-400 rounded mr-1"></div>
            <span className="text-sm">Occupied</span>
          </div>
        </div>
      </div>

      <div className="relative w-full bg-gray-50 rounded-lg p-4">
        {/* Airplane outline */}
        <div className="relative border-2 border-gray-300 rounded-t-3xl p-4">
          {/* First Class Section */}
          {seatsByType.first.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2 text-purple-700">
                First Class
              </h3>
              <div className="max-w-md mx-auto">
                {Object.entries(groupSeatsByRow(seatsByType.first)).map(
                  ([rowId, rowSeats]) => (
                    <div
                      key={`first-row-${rowId}`}
                      className="flex justify-center gap-1 mb-1"
                    >
                      <div className="w-6 flex items-center justify-center text-xs text-gray-500">
                        {rowId}
                      </div>
                      {rowSeats.map((seat) => (
                        <Seat
                          key={seat.id}
                          {...seat}
                          isSelected={selectedSeatId === seat.id}
                          onSelect={onSeatSelect}
                        />
                      ))}
                    </div>
                  ),
                )}
              </div>
            </div>
          )}

          {/* Business Class Section */}
          {seatsByType.business.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2 text-blue-700">
                Business Class
              </h3>
              <div className="max-w-md mx-auto">
                {Object.entries(groupSeatsByRow(seatsByType.business)).map(
                  ([rowId, rowSeats]) => (
                    <div
                      key={`business-row-${rowId}`}
                      className="flex justify-center gap-1 mb-1"
                    >
                      <div className="w-6 flex items-center justify-center text-xs text-gray-500">
                        {rowId}
                      </div>
                      {rowSeats.map((seat) => (
                        <Seat
                          key={seat.id}
                          {...seat}
                          isSelected={selectedSeatId === seat.id}
                          onSelect={onSeatSelect}
                        />
                      ))}
                    </div>
                  ),
                )}
              </div>
            </div>
          )}

          {/* Economy Class Section */}
          {seatsByType.economy.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2 text-gray-700">
                Economy Class
              </h3>
              <div className="max-w-md mx-auto">
                {Object.entries(groupSeatsByRow(seatsByType.economy)).map(
                  ([rowId, rowSeats]) => (
                    <div
                      key={`economy-row-${rowId}`}
                      className="flex justify-center gap-1 mb-1"
                    >
                      <div className="w-6 flex items-center justify-center text-xs text-gray-500">
                        {rowId}
                      </div>
                      {rowSeats.map((seat) => (
                        <Seat
                          key={seat.id}
                          {...seat}
                          isSelected={selectedSeatId === seat.id}
                          onSelect={onSeatSelect}
                        />
                      ))}
                    </div>
                  ),
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {selectedSeatId
            ? `Selected seat: ${selectedSeatId}`
            : "No seat selected"}
        </div>
        <Button
          variant="default"
          disabled={!selectedSeatId}
          onClick={() => onSeatSelect(selectedSeatId)}
        >
          Confirm Selection
        </Button>
      </div>
    </Card>
  );
};

export default SeatMap;
