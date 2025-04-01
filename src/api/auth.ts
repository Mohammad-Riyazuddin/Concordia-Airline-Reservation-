import { User } from "../models/User";
import { hashPassword, comparePassword, generateToken } from "../lib/auth";

// User registration endpoint: /register
export const register = async (
  name: string,
  email: string,
  password: string,
) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await hashPassword(password);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "customer",
  });
  const token = generateToken(user._id, user.role);
  return { user, token };
};

// User login endpoint: /login
export const login = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const isValid = await comparePassword(password, user.password);
  if (!isValid) throw new Error("Invalid password");

  const token = generateToken(user._id, user.role);
  return { user, token };
};

// Admin registration endpoint: /admin/register
export const adminRegister = async (
  name: string,
  email: string,
  password: string,
) => {
  // Check if admin already exists
  const existingAdmin = await User.findOne({ email });
  if (existingAdmin) throw new Error("Admin already exists");

  const hashedPassword = await hashPassword(password);
  const admin = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "admin",
  });
  const token = generateToken(admin._id, admin.role);
  return { user: admin, token };
};

// Admin login endpoint: /admin/login
export const adminLogin = async (email: string, password: string) => {
  const admin = await User.findOne({ email, role: "admin" });
  if (!admin) throw new Error("Admin not found");

  const isValid = await comparePassword(password, admin.password);
  if (!isValid) throw new Error("Invalid password");

  const token = generateToken(admin._id, admin.role);
  return { user: admin, token };
};
