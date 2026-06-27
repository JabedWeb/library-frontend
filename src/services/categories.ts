import { api } from "@/lib/axios";
import type { Category } from "@/types/book";

export type CategoryWithBooks = Category & {
  books?: unknown[];
};

export const getCategories = async (): Promise<CategoryWithBooks[]> => {
  const response = await api.get<CategoryWithBooks[]>("/categories");

  return response.data;
};
