"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { getBook, getBookSummary } from "@/services/books";
import type { Book, BookSummary } from "@/types/book";

export default function BookDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [summary, setSummary] = useState<BookSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBook() {
      const bookId = Number(id);

      if (!Number.isInteger(bookId) || bookId <= 0) {
        router.replace("/404");
        return;
      }

      try {
        const [bookData, summaryData] = await Promise.all([
          getBook(bookId),
          getBookSummary(bookId),
        ]);

        if (!bookData) {
          router.replace("/404");
          return;
        }

        setBook(bookData);
        setSummary(summaryData);
      } catch {
        toast.error("Failed to load book details.");
        router.replace("/404");
      } finally {
        setLoading(false);
      }
    }

    loadBook();
  }, [id, router]);

  if (loading) {
    return <div className="container mx-auto p-6">Loading...</div>;
  }

  if (!book) {
    return null;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{book.title}</h1>
          <p className="text-muted-foreground">
            Detailed book information and borrowing summary
          </p>
        </div>

        <Button asChild>
          <Link href="/books">Back</Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">Book Information</h2>

          <div className="space-y-2">
            <p>
              <strong>ID:</strong> {book.id}
            </p>
            <p>
              <strong>Title:</strong> {book.title}
            </p>
            <p>
              <strong>ISBN:</strong> {book.isbn || "N/A"}
            </p>
            <p>
              <strong>Stock:</strong> {book.stock}
            </p>
            <p>
              <strong>Author:</strong> {book.author?.name || "N/A"}
            </p>
            <p>
              <strong>Categories:</strong>{" "}
              {book.categories.map((category) => category.name).join(", ") ||
                "N/A"}
            </p>
            {book.createdAt && (
              <p>
                <strong>Created:</strong>{" "}
                {new Date(book.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </section>

        <section className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">Borrowing Summary</h2>

          {summary ? (
            <div className="space-y-2">
              <p>
                <strong>Total Borrowed:</strong> {summary.totalBorrowed}
              </p>
              <p>
                <strong>Currently Listed Stock:</strong> {summary.book.stock}
              </p>
              <p>
                <strong>Summary Author:</strong> {summary.book.author}
              </p>
              <p>
                <strong>Summary Categories:</strong>{" "}
                {summary.book.categories.join(", ") || "N/A"}
              </p>
            </div>
          ) : (
            <p>No borrowing summary found.</p>
          )}
        </section>
      </div>

      <div className="mt-6 rounded-lg border">
        <div className="border-b p-4">
          <h2 className="text-xl font-semibold">Borrowed By</h2>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-left">Order</th>
              <th className="p-3 text-left">Student</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Borrow Date</th>
              <th className="p-3 text-left">Return Date</th>
            </tr>
          </thead>

          <tbody>
            {!summary || summary.borrowedBy.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center">
                  No borrowing records found.
                </td>
              </tr>
            ) : (
              summary.borrowedBy.map((borrower) => (
                <tr key={borrower.orderId} className="border-b">
                  <td className="p-3">{borrower.orderId}</td>
                  <td className="p-3">
                    <Link
                      className="underline underline-offset-4"
                      href={`/students/${borrower.studentId}`}
                    >
                      {borrower.studentName}
                    </Link>
                  </td>
                  <td className="p-3">{borrower.status}</td>
                  <td className="p-3">
                    {new Date(borrower.orderDate).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    {borrower.returnDate
                      ? new Date(borrower.returnDate).toLocaleDateString()
                      : "Not returned"}
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
