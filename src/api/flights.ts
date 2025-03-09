// This file will handle API calls to fetch flight data

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: Date;
  returnDate?: Date;
  passengers: number;
}

export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  departureAirport: string;
  arrivalAirport: string;
}

// Mock API call - replace with actual API call later
export const searchFlights = async (
  params: FlightSearchParams,
): Promise<Flight[]> => {
  console.log("Searching flights with params:", params);

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Return mock data for now
  return [
    {
      id: "1",
      airline: "American Airlines",
      flightNumber: "AA123",
      departureTime: "10:00 AM",
      arrivalTime: "12:00 PM",
      duration: "2h 00m",
      price: 299.99,
      departureAirport: params.origin.toUpperCase(),
      arrivalAirport: params.destination.toUpperCase(),
    },
    {
      id: "2",
      airline: "United Airlines",
      flightNumber: "UA456",
      departureTime: "2:00 PM",
      arrivalTime: "5:00 PM",
      duration: "3h 00m",
      price: 399.99,
      departureAirport: params.origin.toUpperCase(),
      arrivalAirport: params.destination.toUpperCase(),
    },
    {
      id: "3",
      airline: "Delta Air Lines",
      flightNumber: "DL789",
      departureTime: "4:00 PM",
      arrivalTime: "8:00 PM",
      duration: "4h 00m",
      price: 499.99,
      departureAirport: params.origin.toUpperCase(),
      arrivalAirport: params.destination.toUpperCase(),
    },
  ];
};
