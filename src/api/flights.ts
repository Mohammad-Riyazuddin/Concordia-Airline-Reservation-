import { Flight } from "../models/Flight";

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

// Add a new flight
export const addFlight = async (flightData: FlightData) => {
  try {
    // Check if flight with the same number already exists
    const existingFlight = await Flight.findOne({
      flightNumber: flightData.flightNumber,
    });
    if (existingFlight) {
      throw new Error("A flight with this number already exists");
    }

    // Create new flight
    const newFlight = await Flight.create(flightData);
    return newFlight;
  } catch (error) {
    console.error("Error adding flight:", error);
    throw error;
  }
};

// Get all flights
export const getAllFlights = async () => {
  try {
    const flights = await Flight.find({}).sort({ departureTime: 1 });
    return flights;
  } catch (error) {
    console.error("Error fetching flights:", error);
    throw error;
  }
};

// Get a specific flight by flight number
export const getFlightByNumber = async (flightNumber: string) => {
  try {
    const flight = await Flight.findOne({ flightNumber });
    if (!flight) {
      throw new Error("Flight not found");
    }
    return flight;
  } catch (error) {
    console.error("Error fetching flight:", error);
    throw error;
  }
};

// Update a flight
export const updateFlight = async (
  flightNumber: string,
  updateData: Partial<FlightData>,
) => {
  try {
    const updatedFlight = await Flight.findOneAndUpdate(
      { flightNumber },
      { $set: updateData },
      { new: true },
    );

    if (!updatedFlight) {
      throw new Error("Flight not found");
    }

    return updatedFlight;
  } catch (error) {
    console.error("Error updating flight:", error);
    throw error;
  }
};

// Delete a flight
export const deleteFlight = async (flightNumber: string) => {
  try {
    const result = await Flight.findOneAndDelete({ flightNumber });

    if (!result) {
      throw new Error("Flight not found");
    }

    return { success: true, message: "Flight deleted successfully" };
  } catch (error) {
    console.error("Error deleting flight:", error);
    throw error;
  }
};

// Search flights - this is the original function that will now use the database
export const searchFlights = async (
  params: FlightSearchParams,
): Promise<FlightResponse[]> => {
  console.log("Searching flights with params:", params);

  try {
    // Convert the departure date to a Date object if it's not already
    const departureDate = new Date(params.departureDate);

    // Set the start and end of the day for the departure date
    const startOfDay = new Date(departureDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(departureDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Query the database for flights matching the criteria
    const flights = await Flight.find({
      origin: { $regex: new RegExp(params.origin, "i") },
      destination: { $regex: new RegExp(params.destination, "i") },
      departureTime: { $gte: startOfDay, $lte: endOfDay },
    }).sort({ departureTime: 1 });

    // Transform the database results to match the expected response format
    return flights.map((flight) => {
      const departureTime = new Date(flight.departureTime);
      const arrivalTime = new Date(flight.arrivalTime);

      // Calculate duration in hours and minutes
      const durationMs = arrivalTime.getTime() - departureTime.getTime();
      const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
      const durationMinutes = Math.floor(
        (durationMs % (1000 * 60 * 60)) / (1000 * 60),
      );

      return {
        id: flight._id.toString(),
        airline: flight.airline,
        flightNumber: flight.flightNumber,
        departureTime: departureTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        arrivalTime: arrivalTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        duration: `${durationHours}h ${durationMinutes.toString().padStart(2, "0")}m`,
        price: flight.price,
        departureAirport: flight.origin.toUpperCase(),
        arrivalAirport: flight.destination.toUpperCase(),
      };
    });
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
