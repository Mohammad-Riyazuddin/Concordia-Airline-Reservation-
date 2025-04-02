export interface LoyaltyProgramData {
  programId: string;
  programName: string;
  pointsPerDollar: number;
  tier: string;
  active: boolean;
  validTill: string;
}

// Add a new loyalty program - now using fetch API
export const addLoyaltyProgram = async (programData: LoyaltyProgramData) => {
  try {
    const response = await fetch("http://localhost:3000/loyalty-programs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(programData),
    });

    if (!response.ok) {
      throw new Error(`Failed to add loyalty program: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding loyalty program:", error);
    throw error;
  }
};

// Get all loyalty programs - now using fetch API
export const getAllLoyaltyPrograms = async () => {
  try {
    const response = await fetch("http://localhost:3000/loyalty-programs");

    if (!response.ok) {
      throw new Error(
        `Failed to fetch loyalty programs: ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching loyalty programs:", error);
    throw error;
  }
};

// Get a specific loyalty program by ID - now using fetch API
export const getLoyaltyProgramById = async (programId: string) => {
  try {
    const response = await fetch(
      `http://localhost:3000/loyalty-programs/${programId}`,
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch loyalty program: ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching loyalty program:", error);
    throw error;
  }
};

// Update a loyalty program - now using fetch API
export const updateLoyaltyProgram = async (
  programId: string,
  updateData: Partial<LoyaltyProgramData>,
) => {
  try {
    const response = await fetch(
      `http://localhost:3000/loyalty-programs/${programId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to update loyalty program: ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating loyalty program:", error);
    throw error;
  }
};

// Delete a loyalty program - now using fetch API
export const deleteLoyaltyProgram = async (programId: string) => {
  try {
    const response = await fetch(
      `http://localhost:3000/loyalty-programs/${programId}`,
      {
        method: "DELETE",
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to delete loyalty program: ${response.statusText}`,
      );
    }

    return { success: true, message: "Loyalty program deleted successfully" };
  } catch (error) {
    console.error("Error deleting loyalty program:", error);
    throw error;
  }
};
