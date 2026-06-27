import { api } from "@/lib/axios";
import axios from "axios";
import type {
  Book,
  BookSearchParams,
  BookSummary,
  CreateBookPayload,
  UpdateBookPayload,
} from "@/types/book";

export const getBooks = async (
  params: BookSearchParams = {},
): Promise<Book[]> => {
  const response = await api.get<Book[]>("/books", {
    params,
  });

  return response.data;
};

export const getBook = async (id: number): Promise<Book | null> => {
  try {
    const response = await api.get<Book>(`/books/${id}`);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }

    throw error;
  }
};

export const getBookSummary = async (
  id: number,
): Promise<BookSummary | null> => {
  try {
    const response = await api.get<BookSummary>(`/books/${id}/summary`);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }

    throw error;
  }
};

export const createBook = async (data: CreateBookPayload): Promise<Book> => {
  const response = await api.post<Book>("/books", data);

  return response.data;
};

export const updateBook = async (
  id: number,
  data: UpdateBookPayload,
): Promise<Book> => {
  const response = await api.patch<Book>(`/books/${id}`, data);

  return response.data;
};

export const deleteBook = async (id: number) => {
  const response = await api.delete<Book>(`/books/${id}`);

  return response.data;
};
