import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import FlightSearchForm from "./FlightSearchForm";
import FlightResults from "./FlightResults";
import BookingWizard from "./BookingWizard";
import { Button } from "./ui/button";
import { searchFlights, FlightSearchParams } from "../api/flights";

const Home = () => {
  const [searchParams, setSearchParams] = useState<FlightSearchParams | null>(
    null,
  );
  const [showResults, setShowResults] = useState(false);
  const [showBookingWizard, setShowBookingWizard] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);

  const handleSearch = (params: FlightSearchParams) => {
    setSearchParams(params);
    setShowResults(true);
    setShowBookingWizard(false);
  };

  const handleSelectFlight = (flight: any) => {
    setSelectedFlight(flight);
    setShowBookingWizard(true);
  };

  const handleBackToResults = () => {
    setShowBookingWizard(false);
  };

  return (
    <div className="container mx-auto p-4 bg-white min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-blue-600">SkyWay Airlines</h1>
        <div className="flex justify-end mt-2">
          <Link
            to="/auth?mode=login"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors mr-4 text-sm font-medium"
          >
            Login
          </Link>
          <Link
            to="/auth?mode=signup"
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors text-sm font-medium"
          >
            Sign Up
          </Link>
        </div>
      </header>

      <main>
        <section className="mb-8">
          <FlightSearchForm onSearch={handleSearch} />
        </section>

        {showResults && searchParams && (
          <section className="mb-8">
            <FlightResults
              searchParams={searchParams}
              onSelectFlight={handleSelectFlight}
            />
          </section>
        )}

        {showBookingWizard && selectedFlight && (
          <section>
            <BookingWizard
              flight={selectedFlight}
              onBack={handleBackToResults}
            />
          </section>
        )}
      </main>
    </div>
  );
};

export default Home;
