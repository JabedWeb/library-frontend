import { api } from "@/lib/axios";
import axios from "axios";

export const getStudents = async () => {
  const response = await api.get("/students");

  return response.data;
};

export const createStudent = async (data: {
  name: string;
  email: string;
  phone: string;
}) => {
  const response = await api.post("/students", data);

  return response.data;
};

export const updateStudent = async (
  id: number,
  data: {
    name: string;
    email: string;
    phone: string;
  },
) => {
  const response = await api.patch(`/students/${id}`, data);

  return response.data;
};

export const deleteStudent = async (id: number) => {
  await api.delete(`/students/${id}`);
};



export const getStudent = async (id: number) => {
  try {
    const response = await api.get(`/students/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }

    throw error;
  }
};
