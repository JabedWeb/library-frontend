"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { useParams, useRouter } from "next/navigation";

import { toast } from "sonner";

import { AuthGuard } from "@/components/auth-guard";
import { Button } from "@/components/ui/button";
import { getCategoryBooks } from "@/services/categories";
import type { Category } from "@/types/category";

export default function CategoryDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategory() {
      const categoryId = Number(id);

      if (!Number.isInteger(categoryId) || categoryId <= 0) {
        router.replace("/404");
        return;
      }

      try {
        const data = await getCategoryBooks(categoryId);

        if (!data) {
          router.replace("/404");
          return;
        }

        setCategory(data);
      } catch {
        toast.error("Failed to load category.");
        router.replace("/404");
      } finally {
        setLoading(false);
      }
    }

    loadCategory();
  }, [id, router]);

  if (loading) {
    return (
      <AuthGuard>
        <div className="container mx-auto p-6">Loading...</div>
      </AuthGuard>
    );
  }

  if (!category) {
    return null;
  }

  const books = category.books ?? [];

  return (
    <AuthGuard>
      <div className="container mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{category.name}</h1>
            <p className="text-muted-foreground">
              Total Books: {books.length}
            </p>
          </div>

          <Button asChild>
            <Link href="/categories">Back</Link>
          </Button>
        </div>

        <div className="rounded-lg border">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">ISBN</th>
                <th className="p-3 text-left">Stock</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {books.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center">
                    No books found.
                  </td>
                </tr>
              ) : (
                books.map((book) => (
                  <tr key={book.id} className="border-b">
                    <td className="p-3">{book.title}</td>
                    <td className="p-3">{book.isbn || "N/A"}</td>
                    <td className="p-3">{book.stock}</td>
                    <td className="p-3">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/books/${book.id}`}>View Book</Link>
                      </Button>
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
