import React, { useState } from "react";
import FilterSidebar from "./FilterSidebar";
import FlightCard from "./FlightCard";
import { Flight } from "../api/flights";

interface FlightResultsProps {
  flights: Flight[];
  onFlightSelect?: (flightId: string) => void;
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

  // Filter flights based on selected criteria
  const filteredFlights = flights.filter((flight) => {
    const price = flight.price;
    const isInPriceRange = price >= priceRange[0] && price <= priceRange[1];

    const isAirlineSelected =
      selectedAirlines.length === 0 ||
      selectedAirlines.includes(flight.airline);

    // Convert time string to hour number for filtering
    const departureHour = parseInt(flight.departureTime.split(":")[0]);
    const isInTimeRange =
      departureHour >= departureTimeRange[0] &&
      departureHour <= departureTimeRange[1];

    // Convert duration string to hours for filtering
    const durationHours = parseInt(flight.duration.split("h")[0]);
    const isInDurationRange =
      durationHours >= durationRange[0] && durationHours <= durationRange[1];

    return (
      isInPriceRange && isAirlineSelected && isInTimeRange && isInDurationRange
    );
  });

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
          {filteredFlights.map((flight) => (
            <FlightCard
              key={flight.id}
              airline={flight.airline}
              flightNumber={flight.flightNumber}
              departureTime={flight.departureTime}
              arrivalTime={flight.arrivalTime}
              duration={flight.duration}
              price={flight.price}
              departureAirport={flight.departureAirport}
              arrivalAirport={flight.arrivalAirport}
              onSelect={() => onFlightSelect(flight.id)}
            />
          ))}

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
