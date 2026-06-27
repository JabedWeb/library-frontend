"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { useParams } from "next/navigation";

import { toast } from "sonner";

import { AuthGuard } from "@/components/auth-guard";

import { Button } from "@/components/ui/button";

import { getAuthorBooks } from "@/services/authors";

type Category = {
  id: number;
  name: string;
};

type Book = {
  id: number;
  title: string;
  isbn: string;
  stock: number;
  categories: Category[];
};

type AuthorResponse = {
  id: number;
  name: string;
  books: Book[];
};

export default function AuthorDetailsPage() {
  const params = useParams();

  const [author, setAuthor] = useState<AuthorResponse | null>(null);

  const [loading, setLoading] = useState(true);

  const loadAuthor = async () => {
    try {
      const data = await getAuthorBooks(Number(params.id));

      setAuthor(data);
    } catch {
      toast.error("Failed to load author.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuthor();
  }, []);

  if (loading) {
    return (
      <AuthGuard >
        <div className="container mx-auto p-6">Loading...</div>
      </AuthGuard>
    );
  }

  if (!author) {
    return (
      <AuthGuard >
        <div className="container mx-auto p-6">Author not found.</div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="container mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{author.name}</h1>

            <p className="text-muted-foreground">
              Total Books: {author.books.length}
            </p>
          </div>

          <Button asChild>
            <Link href="/authors">Back</Link>
          </Button>
        </div>

        <div className="rounded-lg border">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-3 text-left">Title</th>

                <th className="p-3 text-left">ISBN</th>

                <th className="p-3 text-left">Stock</th>

                <th className="p-3 text-left">Categories</th>
              </tr>
            </thead>

            <tbody>
              {author.books.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center">
                    No books found.
                  </td>
                </tr>
              ) : (
                author.books.map((book) => (
                  <tr key={book.id} className="border-b">
                    <td className="p-3">{book.title}</td>

                    <td className="p-3">{book.isbn}</td>

                    <td className="p-3">{book.stock}</td>

                    <td className="p-3">
                      {book.categories
                        .map((category) => category.name)
                        .join(", ")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AuthGuard>
  );
}
