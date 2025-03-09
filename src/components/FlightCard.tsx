import React from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Plane, Clock, DollarSign } from "lucide-react";

interface FlightCardProps {
  airline?: string;
  flightNumber?: string;
  departureTime?: string;
  arrivalTime?: string;
  duration?: string;
  price?: number;
  departureAirport?: string;
  arrivalAirport?: string;
  onSelect?: () => void;
}

const FlightCard = ({
  airline = "Sample Airlines",
  flightNumber = "SA123",
  departureTime = "10:00 AM",
  arrivalTime = "12:00 PM",
  duration = "2h 00m",
  price = 299.99,
  departureAirport = "JFK",
  arrivalAirport = "LAX",
  onSelect = () => console.log("Flight selected"),
}: FlightCardProps) => {
  return (
    <Card className="w-full bg-white hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <div className="space-y-4 flex-1">
            {/* Airline and Flight Number */}
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Plane className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{airline}</h3>
                <p className="text-sm text-gray-500">{flightNumber}</p>
              </div>
            </div>

            {/* Flight Times */}
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <p className="text-xl font-bold">{departureTime}</p>
                  <p className="text-sm text-gray-500">{departureAirport}</p>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <p className="text-xl font-bold">{arrivalTime}</p>
                  <p className="text-sm text-gray-500">{arrivalAirport}</p>
                </div>
              </div>

              {/* Duration */}
              <div className="flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-lg">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">{duration}</span>
              </div>
            </div>
          </div>

          {/* Price and Select Button */}
          <div className="flex flex-col items-end space-y-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="text-2xl font-bold text-green-600">
                {price.toFixed(2)}
              </span>
            </div>
            <Button
              onClick={onSelect}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Select Flight
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FlightCard;
