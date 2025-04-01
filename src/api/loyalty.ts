import { LoyaltyProgram } from "../models/LoyaltyProgram";

export interface LoyaltyProgramData {
  programId: string;
  programName: string;
  pointsPerDollar: number;
  tier: string;
  active: boolean;
  validTill: string;
}

// Add a new loyalty program
export const addLoyaltyProgram = async (programData: LoyaltyProgramData) => {
  try {
    // Check if program with the same ID already exists
    const existingProgram = await LoyaltyProgram.findOne({
      programId: programData.programId,
    });
    if (existingProgram) {
      throw new Error("A loyalty program with this ID already exists");
    }

    // Create new loyalty program
    const newProgram = await LoyaltyProgram.create(programData);
    return newProgram;
  } catch (error) {
    console.error("Error adding loyalty program:", error);
    throw error;
  }
};

// Get all loyalty programs
export const getAllLoyaltyPrograms = async () => {
  try {
    const programs = await LoyaltyProgram.find({}).sort({ createdAt: -1 });
    return programs;
  } catch (error) {
    console.error("Error fetching loyalty programs:", error);
    throw error;
  }
};

// Get a specific loyalty program by ID
export const getLoyaltyProgramById = async (programId: string) => {
  try {
    const program = await LoyaltyProgram.findOne({ programId });
    if (!program) {
      throw new Error("Loyalty program not found");
    }
    return program;
  } catch (error) {
    console.error("Error fetching loyalty program:", error);
    throw error;
  }
};

// Update a loyalty program
export const updateLoyaltyProgram = async (
  programId: string,
  updateData: Partial<LoyaltyProgramData>,
) => {
  try {
    const updatedProgram = await LoyaltyProgram.findOneAndUpdate(
      { programId },
      { $set: updateData },
      { new: true },
    );

    if (!updatedProgram) {
      throw new Error("Loyalty program not found");
    }

    return updatedProgram;
  } catch (error) {
    console.error("Error updating loyalty program:", error);
    throw error;
  }
};

// Delete a loyalty program
export const deleteLoyaltyProgram = async (programId: string) => {
  try {
    const result = await LoyaltyProgram.findOneAndDelete({ programId });

    if (!result) {
      throw new Error("Loyalty program not found");
    }

    return { success: true, message: "Loyalty program deleted successfully" };
  } catch (error) {
    console.error("Error deleting loyalty program:", error);
    throw error;
  }
};
