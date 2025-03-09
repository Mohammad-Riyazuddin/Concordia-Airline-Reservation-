import React, { useState } from "react";
import FlightSearchForm from "./FlightSearchForm";
import FlightResults from "./FlightResults";
import BookingWizard from "./BookingWizard";

interface SearchParams {
  origin: string;
  destination: string;
  departureDate: Date;
  returnDate?: Date;
  passengers: number;
}

const Home = () => {
  const [showResults, setShowResults] = useState(false);
  const [showBookingWizard, setShowBookingWizard] = useState(false);
  const [selectedFlightId, setSelectedFlightId] = useState<string>("");

  const handleSearch = (searchParams: SearchParams) => {
    console.log("Search params:", searchParams);
    setShowResults(true);
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

      {/* Results Section */}
      {showResults && (
        <div className="container mx-auto px-4 mt-8">
          <FlightResults onFlightSelect={handleFlightSelect} />
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
