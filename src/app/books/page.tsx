"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { toast } from "sonner";

import { AuthGuard } from "@/components/auth-guard";
import { BookDialog } from "@/components/books/book-dialog";
import { DeleteBookDialog } from "@/components/books/delete-book-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getBooks } from "@/services/books";
import type { Book, BookSearchParams } from "@/types/book";

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filters, setFilters] = useState<BookSearchParams>({
    title: "",
    author: "",
    category: "",
  });
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);

  const loadBooks = async (searchFilters = filters) => {
    try {
      setLoading(true);

      const data = await getBooks({
        title: searchFilters.title?.trim() || undefined,
        author: searchFilters.author?.trim() || undefined,
        category: searchFilters.category?.trim() || undefined,
      });

      setBooks(data);
    } catch {
      toast.error("Failed to load books.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function loadInitialBooks() {
      try {
        const data = await getBooks();

        setBooks(data);
      } catch {
        toast.error("Failed to load books.");
      } finally {
        setLoading(false);
      }
    }

    loadInitialBooks();
  }, []);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    loadBooks();
  };

  const clearSearch = () => {
    const emptyFilters = { title: "", author: "", category: "" };

    setFilters(emptyFilters);
    loadBooks(emptyFilters);
  };

  return (
    <AuthGuard>
      <div className="container mx-auto p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Books</h1>
            <p className="text-muted-foreground">
              Search inventory and manage library books
            </p>
          </div>

          <Button
            onClick={() => {
              setSelectedBook(null);
              setDialogOpen(true);
            }}
          >
            Add Book
          </Button>
        </div>

        <form
          className="mb-6 grid gap-3 rounded-lg border p-4 md:grid-cols-[1fr_1fr_1fr_auto_auto]"
          onSubmit={handleSearch}
        >
          <Input
            placeholder="Search by title"
            value={filters.title}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                title: event.target.value,
              }))
            }
          />

          <Input
            placeholder="Search by author"
            value={filters.author}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                author: event.target.value,
              }))
            }
          />

          <Input
            placeholder="Search by category"
            value={filters.category}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                category: event.target.value,
              }))
            }
          />

          <Button type="submit">
            <Search />
            Search
          </Button>

          <Button type="button" variant="outline" onClick={clearSearch}>
            Clear
          </Button>
        </form>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>ISBN</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Categories</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {books.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center">
                    No books found.
                  </TableCell>
                </TableRow>
              ) : (
                books.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell>{book.id}</TableCell>
                    <TableCell className="font-medium">{book.title}</TableCell>
                    <TableCell>{book.isbn || "N/A"}</TableCell>
                    <TableCell>{book.author?.name || "N/A"}</TableCell>
                    <TableCell>
                      {book.categories.map((category) => category.name).join(", ")}
                    </TableCell>
                    <TableCell>{book.stock}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button asChild size="sm">
                          <Link href={`/books/${book.id}`}>View</Link>
                        </Button>

                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setSelectedBook(book);
                            setDialogOpen(true);
                          }}
                        >
                          Edit
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setSelectedBookId(book.id);
                            setDeleteOpen(true);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <BookDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        book={selectedBook}
        onSuccess={loadBooks}
      />

      <DeleteBookDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        bookId={selectedBookId}
        onSuccess={loadBooks}
      />
    </AuthGuard>
  );
}
