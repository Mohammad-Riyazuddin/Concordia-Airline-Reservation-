import React, { useState } from "react";
import FlightSearchForm from "./FlightSearchForm";
import FlightResults from "./FlightResults";
import BookingWizard from "./BookingWizard";
import { searchFlights, Flight, FlightSearchParams } from "../api/flights";

const Home = () => {
  const [showResults, setShowResults] = useState(false);
  const [showBookingWizard, setShowBookingWizard] = useState(false);
  const [selectedFlightId, setSelectedFlightId] = useState<string>("");
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (searchParams: FlightSearchParams) => {
    try {
      setLoading(true);
      setError(null);
      console.log("Search params:", searchParams);

      // Call the API to get flights
      const flightResults = await searchFlights(searchParams);
      setFlights(flightResults);
      setShowResults(true);
    } catch (err) {
      setError("Failed to search flights. Please try again.");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFlightSelect = (flightId: string) => {
    setSelectedFlightId(flightId);
    setShowBookingWizard(true);
  };

  const handleBookingComplete = (bookingData: any) => {
    console.log("Booking completed:", {
      flightId: selectedFlightId,
      ...bookingData,
    });
    setShowBookingWizard(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Find Your Perfect Flight</h1>
          <p className="text-xl opacity-90">
            Search and book flights to destinations worldwide
          </p>
        </div>
      </div>

      {/* Search Form Section */}
      <div className="container mx-auto px-4 -mt-8">
        <FlightSearchForm onSearch={handleSearch} />
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="container mx-auto px-4 mt-8 text-center">
          <div className="p-4 bg-white rounded-lg shadow">
            <p className="text-lg">Searching for flights...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="container mx-auto px-4 mt-8">
          <div className="p-4 bg-red-50 text-red-700 rounded-lg">
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Results Section */}
      {showResults && !loading && (
        <div className="container mx-auto px-4 mt-8">
          <FlightResults
            flights={flights}
            onFlightSelect={handleFlightSelect}
          />
        </div>
      )}

      {/* Booking Wizard */}
      <BookingWizard
        isOpen={showBookingWizard}
        onClose={() => setShowBookingWizard(false)}
        onComplete={handleBookingComplete}
      />
    </div>
  );
};

export default Home;
