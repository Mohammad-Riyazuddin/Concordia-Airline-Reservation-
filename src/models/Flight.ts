import mongoose from "mongoose";

interface Seat {
  seatNumber: string;
  class: "Economy" | "Business" | "First";
  isOccupied: boolean;
}

const seatSchema = new mongoose.Schema({
  seatNumber: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    enum: ["Economy", "Business", "First"],
    default: "Economy",
  },
  isOccupied: {
    type: Boolean,
    default: false,
  },
});

const flightSchema = new mongoose.Schema({
  flightNumber: {
    type: String,
    required: true,
    unique: true,
  },
  departureTime: {
    type: Date,
    required: true,
  },
  arrivalTime: {
    type: Date,
    required: true,
  },
  origin: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  airline: {
    type: String,
    required: true,
  },
  availableSeats: {
    type: [seatSchema],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Flight =
  mongoose.models.Flight || mongoose.model("Flight", flightSchema);
