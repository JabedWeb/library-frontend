import { api } from "@/lib/axios";

export type Author = {
  id: number;
  name: string;
};

export const getAuthors = async (search = "") => {
  const response = await api.get("/authors", {
    params: {
      search,
    },
  });

  return response.data;
};

export const getAuthor = async (id: number) => {
  const response = await api.get(`/authors/${id}`);

  return response.data;
};

export const getAuthorBooks = async (id: number) => {
  const response = await api.get(`/authors/${id}/books`);

  return response.data;
};

export const createAuthor = async (data: { name: string }) => {
  const response = await api.post("/authors", data);

  return response.data;
};

export const updateAuthor = async (id: number, data: { name: string }) => {
  const response = await api.patch(`/authors/${id}`, data);

  return response.data;
};

export const deleteAuthor = async (id: number) => {
  const response = await api.delete(`/authors/${id}`);

  return response.data;
};
