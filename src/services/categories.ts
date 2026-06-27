import { api } from "@/lib/axios";
import axios from "axios";
import type { Category, CategoryPayload } from "@/types/category";

export const getCategories = async (search = ""): Promise<Category[]> => {
  const response = await api.get<Category[]>("/categories", {
    params: {
      search,
    },
  });

  return response.data;
};

export const getCategory = async (id: number): Promise<Category | null> => {
  try {
    const response = await api.get<Category>(`/categories/${id}`);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }

    throw error;
  }
};

export const getCategoryBooks = async (
  id: number,
): Promise<Category | null> => {
  return getCategory(id);
};

export const createCategory = async (
  data: CategoryPayload,
): Promise<Category> => {
  const response = await api.post<Category>("/categories", data);

  return response.data;
};

export const updateCategory = async (
  id: number,
  data: CategoryPayload,
): Promise<Category> => {
  const response = await api.patch<Category>(`/categories/${id}`, data);

  return response.data;
};

export const deleteCategory = async (id: number): Promise<Category> => {
  const response = await api.delete<Category>(`/categories/${id}`);

  return response.data;
};
