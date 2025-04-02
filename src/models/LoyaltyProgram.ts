// This file is kept as a placeholder but Mongoose model is removed
// as the application is now frontend-only with API calls to a backend

export interface LoyaltyProgram {
  _id?: string;
  programId: string;
  programName: string;
  pointsPerDollar: number;
  tier: string;
  active: boolean;
  validTill: string;
  createdAt?: Date;
}
