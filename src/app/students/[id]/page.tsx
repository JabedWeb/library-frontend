"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { getStudentSummary } from "@/services/students";

type Book = {
  id: number;
  title: string;
};

type OrderHistoryItem = {
  id: number;
  status: string;
  orderDate: string;
  dueDate: string;
  book: {
    title: string;
  };
};

type StudentSummary = {
  student: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
  totalBooksBorrowed: number;
  currentlyBorrowed: Book[];
  orderHistory: OrderHistoryItem[];
};

export default function StudentDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [summary, setSummary] = useState<StudentSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStudent() {
      const studentId = Number(id);

      if (!Number.isInteger(studentId) || studentId <= 0) {
        router.replace("/404");
        return;
      }

      try {
        const data = await getStudentSummary(studentId);

        if (!data) {
          router.replace("/404");
          return;
        }

        setSummary(data);
      } catch (error) {
        console.error(error);
        router.replace("/404");
      } finally {
        setLoading(false);
      }
    }

    loadStudent();
  }, [id, router]);

  if (loading) {
    return <div className="container mx-auto p-6">Loading...</div>;
  }

  if (!summary) {
    return null;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Student Details</h1>

          <p className="text-muted-foreground">
            Borrowing summary and order history
          </p>
        </div>

        <Button asChild>
          <Link href="/students">Back</Link>
        </Button>
      </div>

      <div className="rounded-lg border p-6">
        <h2 className="mb-4 text-xl font-semibold">Student Information</h2>

        <p>
          <strong>ID:</strong> {summary.student.id}
        </p>

        <p>
          <strong>Name:</strong> {summary.student.name}
        </p>

        <p>
          <strong>Email:</strong> {summary.student.email}
        </p>

        <p>
          <strong>Phone:</strong> {summary.student.phone}
        </p>
      </div>

      <div className="mt-6 rounded-lg border p-6">
        <h2 className="mb-4 text-xl font-semibold">Summary</h2>

        <p>
          <strong>Total Books Borrowed:</strong> {summary.totalBooksBorrowed}
        </p>

        <p>
          <strong>Currently Borrowed:</strong>{" "}
          {summary.currentlyBorrowed.length}
        </p>
      </div>

      <div className="mt-6 rounded-lg border p-6">
        <h2 className="mb-4 text-xl font-semibold">Currently Borrowed Books</h2>

        {summary.currentlyBorrowed.length === 0 ? (
          <p>No books are currently borrowed.</p>
        ) : (
          <ul className="list-disc pl-6">
            {summary.currentlyBorrowed.map((book) => (
              <li key={book.id}>{book.title}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 rounded-lg border">
        <div className="border-b p-4">
          <h2 className="text-xl font-semibold">Order History</h2>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-left">Book</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Borrow Date</th>
              <th className="p-3 text-left">Due Date</th>
            </tr>
          </thead>

          <tbody>
            {summary.orderHistory.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-6 text-center">
                  No orders found.
                </td>
              </tr>
            ) : (
              summary.orderHistory.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="p-3">{order.book.title}</td>
                  <td className="p-3">{order.status}</td>
                  <td className="p-3">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    {new Date(order.dueDate).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
