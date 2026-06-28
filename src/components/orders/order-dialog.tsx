"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";

import { toast } from "sonner";

import { getBooks } from "@/services/books";
import { createOrder, updateOrder } from "@/services/orders";
import { getStudents } from "@/services/students";
import type { Book } from "@/types/book";
import type { Student } from "@/types/student";
import type { Order, OrderStatus } from "@/types/order";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order?: Order | null;
  onSuccess: () => void;
};

const orderStatuses: OrderStatus[] = ["BORROWED", "RETURNED", "OVERDUE"];

const toDateInputValue = (value?: string | null) => {
  if (!value) return "";

  return value.slice(0, 10);
};

export function OrderDialog({ open, onOpenChange, order, onSuccess }: Props) {
  const [studentId, setStudentId] = useState("");
  const [bookId, setBookId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<OrderStatus>("BORROWED");
  const [returnDate, setReturnDate] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    async function loadOptions() {
      try {
        const [studentData, bookData] = await Promise.all([
          getStudents(),
          getBooks(),
        ]);

        setStudents(studentData);
        setBooks(bookData);
      } catch {
        toast.error("Failed to load order form options.");
      }
    }

    loadOptions();
  }, [open]);

  useEffect(() => {
    setStudentId(String(order?.studentId ?? order?.student?.id ?? ""));
    setBookId(String(order?.bookId ?? order?.book?.id ?? ""));
    setDueDate(toDateInputValue(order?.dueDate));
    setStatus(order?.status ?? "BORROWED");
    setReturnDate(toDateInputValue(order?.returnDate));
  }, [order]);

  useEffect(() => {
    if (status === "RETURNED" && !returnDate) {
      setReturnDate(new Date().toISOString().slice(0, 10));
    }

    if (status !== "RETURNED" && returnDate && !order?.returnDate) {
      setReturnDate("");
    }
  }, [order?.returnDate, returnDate, status]);

  const handleSubmit = async () => {
    const parsedStudentId = Number(studentId);
    const parsedBookId = Number(bookId);

    if (!Number.isInteger(parsedStudentId) || parsedStudentId <= 0) {
      toast.error("Student is required.");
      return;
    }

    if (!Number.isInteger(parsedBookId) || parsedBookId <= 0) {
      toast.error("Book is required.");
      return;
    }

    if (!dueDate) {
      toast.error("Due date is required.");
      return;
    }

    if (status === "RETURNED" && !returnDate) {
      toast.error("Return date is required for returned orders.");
      return;
    }

    try {
      setSaving(true);

      if (order) {
        await updateOrder(order.id, {
          studentId: parsedStudentId,
          bookId: parsedBookId,
          dueDate,
          status,
          ...(returnDate ? { returnDate } : {}),
        });

        toast.success("Order updated successfully.");
      } else {
        await createOrder({
          studentId: parsedStudentId,
          bookId: parsedBookId,
          dueDate,
        });

        toast.success("Order created successfully.");
      }

      onSuccess();
      onOpenChange(false);
    } catch {
      toast.error("Failed to save order.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{order ? "Edit Order" : "Borrow Book"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="order-student">Student</Label>
            <select
              id="order-student"
              className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              value={studentId}
              onChange={(event) => setStudentId(event.target.value)}
            >
              <option value="">Select student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} ({student.email})
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="order-book">Book</Label>
            <select
              id="order-book"
              className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              value={bookId}
              onChange={(event) => setBookId(event.target.value)}
            >
              <option value="">Select book</option>
              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title} (stock: {book.stock})
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="order-due-date">Due Date</Label>
            <Input
              id="order-due-date"
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
            />
          </div>

          {order && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="order-status">Status</Label>
                <select
                  id="order-status"
                  className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value as OrderStatus)
                  }
                >
                  {orderStatuses.map((orderStatus) => (
                    <option key={orderStatus} value={orderStatus}>
                      {orderStatus}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="order-return-date">Return Date</Label>
                <Input
                  id="order-return-date"
                  type="date"
                  value={returnDate}
                  onChange={(event) => setReturnDate(event.target.value)}
                  disabled={status !== "RETURNED"}
                />
              </div>
            </>
          )}

          <Button disabled={saving} onClick={handleSubmit}>
            {saving ? "Saving..." : order ? "Update Order" : "Create Order"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
