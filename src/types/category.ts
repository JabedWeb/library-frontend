export type Book = {
  id: number;
  title: string;
  isbn: string | null;
  stock: number;
};

export type Category = {
  id: number;
  name: string;
  createdAt?: string;
  books?: Book[];
};

export type CategoryPayload = {
  name: string;
};
