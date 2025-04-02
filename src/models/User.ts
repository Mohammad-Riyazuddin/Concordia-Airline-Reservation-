// This file is kept as a placeholder but Mongoose model is removed
// as the application is now frontend-only with API calls to a backend

export interface User {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: "customer" | "admin";
  createdAt?: Date;
}
