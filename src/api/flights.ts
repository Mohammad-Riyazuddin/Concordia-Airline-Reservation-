export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: Date;
  returnDate?: Date;
  passengers: number;
}

export interface FlightData {
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  origin: string;
  destination: string;
  price: number;
  airline: string;
  availableSeats: {
    seatNumber: string;
    class: "Economy" | "Business" | "First";
    isOccupied: boolean;
  }[];
}

export interface FlightResponse {
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

// Add a new flight - now using fetch API
export const addFlight = async (flightData: FlightData) => {
  try {
    const response = await fetch("http://localhost:3000/flights", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(flightData),
    });

    if (!response.ok) {
      throw new Error(`Failed to add flight: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding flight:", error);
    throw error;
  }
};

// Get all flights - now using fetch API
export const getAllFlights = async () => {
  try {
    const response = await fetch("http://localhost:3000/flights");

    if (!response.ok) {
      throw new Error(`Failed to fetch flights: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching flights:", error);
    throw error;
  }
};

// Get a specific flight by flight number - now using fetch API
export const getFlightByNumber = async (flightNumber: string) => {
  try {
    const response = await fetch(
      `http://localhost:3000/flights/${flightNumber}`,
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch flight: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching flight:", error);
    throw error;
  }
};

// Update a flight - now using fetch API
export const updateFlight = async (
  flightId: string,
  updateData: Partial<FlightData>,
) => {
  try {
    const response = await fetch(
      `http://localhost:3000/flight/${flightId}/update`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to update flight: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating flight:", error);
    throw error;
  }
};

// Delete a flight - now using fetch API
export const deleteFlight = async (flightId: string) => {
  try {
    const response = await fetch(
      `http://localhost:3000/flight/${flightId}/delete`,
      {
        method: "DELETE",
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to delete flight: ${response.statusText}`);
    }

    return { success: true, message: "Flight deleted successfully" };
  } catch (error) {
    console.error("Error deleting flight:", error);
    throw error;
  }
};

// Search flights - now using fetch API
export const searchFlights = async (
  params: FlightSearchParams,
): Promise<FlightResponse[]> => {
  console.log("Searching flights with params:", params);

  try {
    // Construct the URL with query parameters
    const searchUrl = `http://localhost:3000/flights?origin=${encodeURIComponent(params.origin)}&destination=${encodeURIComponent(params.destination)}`;

    const response = await fetch(searchUrl);

    if (!response.ok) {
      throw new Error(`Failed to search flights: ${response.statusText}`);
    }

    const flights = await response.json();
    return flights;
  } catch (error) {
    console.error("Error searching flights:", error);

    // If there's an error, fall back to mock data
    console.log("Falling back to mock data");

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Return mock data
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
  }
};
