import React, { useState } from "react";
import FilterSidebar from "./FilterSidebar";
import FlightCard from "./FlightCard";
import { FlightData, FlightResponse } from "../api/flights";

interface FlightResultsProps {
  flights: FlightData[] | FlightResponse[];
  onFlightSelect?: (flight: FlightData | FlightResponse) => void;
}

const FlightResults: React.FC<FlightResultsProps> = ({
  flights = [],
  onFlightSelect = () => {},
}) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [departureTimeRange, setDepartureTimeRange] = useState<
    [number, number]
  >([0, 24]);
  const [durationRange, setDurationRange] = useState<[number, number]>([0, 24]);

  // Get unique airlines from flights for the filter
  const airlines = [...new Set(flights.map((flight) => flight.airline))].map(
    (airline) => ({ id: airline, name: airline }),
  );

  // Helper function to extract hour from ISO date string or regular time string
  const extractHour = (timeString: string) => {
    if (timeString.includes("T")) {
      // Handle ISO date string format
      return parseInt(timeString.split("T")[1].split(":")[0]);
    }
    // Handle regular time string format (e.g., "10:00 AM")
    return parseInt(timeString.split(":")[0]);
  };

  // Calculate duration in hours (simple approximation for filtering)
  const calculateDuration = (departure: string, arrival: string) => {
    try {
      const departureDate = new Date(departure);
      const arrivalDate = new Date(arrival);
      const durationMs = arrivalDate.getTime() - departureDate.getTime();
      return Math.ceil(durationMs / (1000 * 60 * 60)); // Convert ms to hours
    } catch (e) {
      return 2; // Default duration if calculation fails
    }
  };

  // Filter flights based on selected criteria
  const filteredFlights = flights.filter((flight) => {
    // Skip filtering if flight data is missing required properties
    if (
      !flight ||
      !flight.price ||
      !flight.departureTime ||
      !flight.arrivalTime
    ) {
      console.log("Skipping invalid flight data:", flight);
      return false;
    }

    const price = flight.price;
    const isInPriceRange = price >= priceRange[0] && price <= priceRange[1];

    const isAirlineSelected =
      selectedAirlines.length === 0 ||
      selectedAirlines.includes(flight.airline);

    // Extract hour from departure time
    const departureHour = extractHour(flight.departureTime);
    const isInTimeRange =
      departureHour >= departureTimeRange[0] &&
      departureHour <= departureTimeRange[1];

    // Calculate duration
    const durationHours = calculateDuration(
      flight.departureTime,
      flight.arrivalTime,
    );
    const isInDurationRange =
      durationHours >= durationRange[0] && durationHours <= durationRange[1];

    return (
      isInPriceRange && isAirlineSelected && isInTimeRange && isInDurationRange
    );
  });

  // Format date for display
  const formatDateTime = (dateTimeStr: string) => {
    if (dateTimeStr.includes("T")) {
      const date = new Date(dateTimeStr);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return dateTimeStr; // Return as is if not ISO format
  };

  return (
    <div className="flex gap-6 p-6 min-h-screen bg-gray-50">
      <FilterSidebar
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        airlines={airlines.length > 0 ? airlines : undefined}
        selectedAirlines={selectedAirlines}
        onAirlineChange={(airlineId) => {
          setSelectedAirlines((prev) =>
            prev.includes(airlineId)
              ? prev.filter((id) => id !== airlineId)
              : [...prev, airlineId],
          );
        }}
        departureTimeRange={departureTimeRange}
        onDepartureTimeChange={setDepartureTimeRange}
        durationRange={durationRange}
        onDurationChange={setDurationRange}
      />

      <div className="flex-1 space-y-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-2">
            {filteredFlights.length} Flights Found
          </h2>
          <p className="text-gray-600">
            Showing results based on your selected filters
          </p>
        </div>

        <div className="space-y-4">
          {filteredFlights.map((flight, index) => {
            console.log("Rendering flight:", flight);
            // Handle both FlightData and FlightResponse interfaces
            const departureAirport =
              "departureAirport" in flight
                ? flight.departureAirport
                : flight.origin;
            const arrivalAirport =
              "arrivalAirport" in flight
                ? flight.arrivalAirport
                : flight.destination;
            const duration =
              "duration" in flight
                ? flight.duration
                : `${calculateDuration(flight.departureTime, flight.arrivalTime)}h 00m`;

            return (
              <FlightCard
                key={`${flight.flightNumber}-${index}`}
                airline={flight.airline || "Unknown"}
                flightNumber={flight.flightNumber || "Unknown"}
                departureTime={
                  flight.departureTime
                    ? formatDateTime(flight.departureTime)
                    : "Unknown"
                }
                arrivalTime={
                  flight.arrivalTime
                    ? formatDateTime(flight.arrivalTime)
                    : "Unknown"
                }
                duration={duration}
                price={flight.price || 0}
                departureAirport={departureAirport || "Unknown"}
                arrivalAirport={arrivalAirport || "Unknown"}
                onSelect={() => onFlightSelect(flight)}
              />
            );
          })}

          {filteredFlights.length === 0 && (
            <div className="bg-white p-8 rounded-lg text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                No flights found
              </h3>
              <p className="text-gray-600">
                Try adjusting your filters to see more results
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlightResults;
