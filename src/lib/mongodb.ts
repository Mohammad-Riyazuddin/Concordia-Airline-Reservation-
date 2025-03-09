import mongoose from "mongoose";

const MONGODB_URI = import.meta.env.VITE_MONGODB_URI || "";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
