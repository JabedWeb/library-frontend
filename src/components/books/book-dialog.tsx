"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useState } from "react";

import { toast } from "sonner";

import { createBook, updateBook } from "@/services/books";
import { getCategories } from "@/services/categories";
import { getAuthors, type Author } from "@/services/authors";
import type { Book, Category } from "@/types/book";
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
  book?: Book | null;
  onSuccess: () => void;
};

export function BookDialog({ open, onOpenChange, book, onSuccess }: Props) {
  const [title, setTitle] = useState("");
  const [isbn, setIsbn] = useState("");
  const [stock, setStock] = useState("0");
  const [authorId, setAuthorId] = useState("");
  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);

  const selectedCategoryText = useMemo(() => {
    if (categoryIds.length === 0) return "No categories selected";

    return categories
      .filter((category) => categoryIds.includes(category.id))
      .map((category) => category.name)
      .join(", ");
  }, [categories, categoryIds]);

  useEffect(() => {
    if (!open) return;

    async function loadOptions() {
      try {
        const [categoryData, authorData] = await Promise.all([
          getCategories(),
          getAuthors(),
        ]);

        setCategories(categoryData);
        setAuthors(authorData);
      } catch {
        try {
          const categoryData = await getCategories();

          setCategories(categoryData);
          setAuthors([]);
        } catch {
          toast.error("Failed to load book form options.");
        }
      }
    }

    loadOptions();
  }, [open]);

  useEffect(() => {
    setTitle(book?.title ?? "");
    setIsbn(book?.isbn ?? "");
    setStock(String(book?.stock ?? 0));
    setAuthorId(String(book?.authorId ?? book?.author?.id ?? ""));
    setCategoryIds(book?.categories.map((category) => category.id) ?? []);
  }, [book]);

  const toggleCategory = (categoryId: number) => {
    setCategoryIds((current) =>
      current.includes(categoryId)
        ? current.filter((id) => id !== categoryId)
        : [...current, categoryId],
    );
  };

  const handleSubmit = async () => {
    const parsedStock = Number(stock);
    const parsedAuthorId = Number(authorId);

    if (!title.trim()) {
      toast.error("Book title is required.");
      return;
    }

    if (!Number.isInteger(parsedStock) || parsedStock < 0) {
      toast.error("Stock must be zero or a positive whole number.");
      return;
    }

    if (!Number.isInteger(parsedAuthorId) || parsedAuthorId <= 0) {
      toast.error("Author is required.");
      return;
    }

    if (categoryIds.length === 0) {
      toast.error("Select at least one category.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: title.trim(),
        isbn: isbn.trim() || undefined,
        stock: parsedStock,
        authorId: parsedAuthorId,
        categoryIds,
      };

      if (book) {
        await updateBook(book.id, payload);
        toast.success("Book updated successfully.");
      } else {
        await createBook(payload);
        toast.success("Book created successfully.");
      }

      onSuccess();
      onOpenChange(false);
    } catch {
      toast.error("Failed to save book.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{book ? "Edit Book" : "Add Book"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="book-title">Title</Label>
            <Input
              id="book-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Book title"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="book-isbn">ISBN</Label>
            <Input
              id="book-isbn"
              value={isbn}
              onChange={(event) => setIsbn(event.target.value)}
              placeholder="9781234567890"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="book-stock">Stock</Label>
            <Input
              id="book-stock"
              type="number"
              min={0}
              value={stock}
              onChange={(event) => setStock(event.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="book-author">Author</Label>
            {authors.length > 0 ? (
              <select
                id="book-author"
                className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                value={authorId}
                onChange={(event) => setAuthorId(event.target.value)}
              >
                <option value="">Select author</option>
                {authors.map((author) => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))}
              </select>
            ) : (
              <Input
                id="book-author"
                type="number"
                min={1}
                value={authorId}
                onChange={(event) => setAuthorId(event.target.value)}
                placeholder="Author ID"
              />
            )}
          </div>

          <div className="grid gap-2">
            <Label>Categories</Label>
            <div className="rounded-lg border p-3">
              <p className="mb-3 text-sm text-muted-foreground">
                {selectedCategoryText}
              </p>

              <div className="grid max-h-36 gap-2 overflow-y-auto sm:grid-cols-2">
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={categoryIds.includes(category.id)}
                      onChange={() => toggleCategory(category.id)}
                    />
                    <span>{category.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <Button disabled={saving} onClick={handleSubmit}>
            {saving ? "Saving..." : book ? "Update Book" : "Create Book"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
