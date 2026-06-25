import { api } from "@/lib/axios";

export type LoginDto = {
  email: string;
  password: string;
};

export type RegisterDto = {
  name: string;
  email: string;
  password: string;
  role?: "ADMIN" | "LIBRARIAN";
};

export const register = async (data: RegisterDto) => {
  const response = await api.post("/auth/register", data);

  return response.data;
};

export const login = async (data: LoginDto) => {
  const response = await api.post("/auth/login", data);

  return response.data;
};

export const getProfile = async () => {
  const response = await api.get("/auth/profile");

  return response.data;
};
