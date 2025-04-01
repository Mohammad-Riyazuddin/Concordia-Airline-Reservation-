import mongoose from "mongoose";

const loyaltyProgramSchema = new mongoose.Schema({
  programId: {
    type: String,
    required: true,
    unique: true,
  },
  programName: {
    type: String,
    required: true,
  },
  pointsPerDollar: {
    type: Number,
    required: true,
  },
  tier: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  validTill: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const LoyaltyProgram =
  mongoose.models.LoyaltyProgram ||
  mongoose.model("LoyaltyProgram", loyaltyProgramSchema);
