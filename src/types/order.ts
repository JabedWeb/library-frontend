import type { Book } from "@/types/book";
import type { Student } from "@/types/student";

export type OrderStatus = "BORROWED" | "RETURNED" | "OVERDUE";

export type Order = {
  id: number;
  studentId: number;
  bookId: number;
  status: OrderStatus;
  orderDate: string;
  dueDate: string;
  returnDate: string | null;
  pdfPath?: string | null;
  createdAt?: string;
  student?: Student;
  book?: Book;
};

export type CreateOrderPayload = {
  studentId: number;
  bookId: number;
  dueDate: string;
};

export type UpdateOrderPayload = Partial<{
  studentId: number;
  bookId: number;
  dueDate: string;
  status: OrderStatus;
  returnDate: string;
}>;
