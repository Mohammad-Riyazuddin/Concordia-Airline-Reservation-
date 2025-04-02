// This file is kept as a placeholder but Mongoose model is removed
// as the application is now frontend-only with API calls to a backend

export interface Seat {
  seatNumber: string;
  class: "Economy" | "Business" | "First";
  isOccupied: boolean;
}

export interface Flight {
  _id?: string;
  flightNumber: string;
  departureTime: Date | string;
  arrivalTime: Date | string;
  origin: string;
  destination: string;
  price: number;
  airline: string;
  availableSeats: Seat[];
  createdAt?: Date;
}
