import { User } from "../models/User";
import { hashPassword, comparePassword, generateToken } from "../lib/auth";

export const signup = async (
  email: string,
  password: string,
  role: "customer" | "admin",
) => {
  const hashedPassword = await hashPassword(password);
  const user = await User.create({ email, password: hashedPassword, role });
  const token = generateToken(user._id, role);
  return { user, token };
};

export const login = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const isValid = await comparePassword(password, user.password);
  if (!isValid) throw new Error("Invalid password");

  const token = generateToken(user._id, user.role);
  return { user, token };
};
