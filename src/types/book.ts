export type Category = {
  id: number;
  name: string;
  createdAt?: string;
};

export type Author = {
  id: number;
  name: string;
  bio?: string | null;
  photoUrl?: string | null;
  createdAt?: string;
};

export type Book = {
  id: number;
  title: string;
  isbn: string | null;
  stock: number;
  imageUrl?: string | null;
  authorId?: number;
  createdAt?: string;
  author: Author;
  categories: Category[];
};

export type BookSearchParams = {
  title?: string;
  author?: string;
  category?: string;
};

export type CreateBookPayload = {
  title: string;
  isbn?: string;
  stock: number;
  authorId: number;
  categoryIds: number[];
};

export type UpdateBookPayload = Partial<CreateBookPayload>;

export type BookSummary = {
  book: {
    id: number;
    title: string;
    isbn: string | null;
    stock: number;
    author: string;
    categories: string[];
  };
  totalBorrowed: number;
  borrowedBy: {
    orderId: number;
    studentId: number;
    studentName: string;
    status: string;
    orderDate: string;
    returnDate: string | null;
  }[];
};
