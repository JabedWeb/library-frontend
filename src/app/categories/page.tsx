"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { toast } from "sonner";

import { AuthGuard } from "@/components/auth-guard";
import { CategoryFormDialog } from "@/components/categories/category-form-dialog";
import { DeleteCategoryDialog } from "@/components/categories/delete-category-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCategories } from "@/services/categories";
import type { Category } from "@/types/category";

export default function CategoriesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadCategories = async (searchValue = search) => {
    try {
      setLoading(true);

      const data = await getCategories(searchValue);

      setCategories(data);
    } catch {
      toast.error("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function loadInitialCategories() {
      try {
        const data = await getCategories();

        setCategories(data);
      } catch {
        toast.error("Failed to load categories.");
      } finally {
        setLoading(false);
      }
    }

    loadInitialCategories();
  }, []);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    loadCategories();
  };

  const clearSearch = () => {
    setSearch("");
    loadCategories("");
  };

  return (
    <AuthGuard>
      <div className="container mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Categories</h1>

          <Button
            onClick={() => {
              setSelectedCategory(null);
              setDialogOpen(true);
            }}
          >
            Add Category
          </Button>
        </div>

        <form className="mb-4 flex max-w-md gap-2" onSubmit={handleSearch}>
          <Input
            placeholder="Search categories..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <Button type="submit">Search</Button>
          <Button type="button" variant="outline" onClick={clearSearch}>
            Clear
          </Button>
        </form>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Books</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center">
                    No categories found.
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="border-b">
                    <td className="p-3">{category.id}</td>
                    <td className="p-3">{category.name}</td>
                    <td className="p-3">{category.books?.length ?? 0}</td>
                    <td className="space-x-2 p-3 text-center">
                      <Button asChild size="sm">
                        <Link href={`/categories/${category.id}`}>View</Link>
                      </Button>

                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setSelectedCategory(category);
                          setDialogOpen(true);
                        }}
                      >
                        Edit
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setSelectedCategoryId(category.id);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      <CategoryFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={selectedCategory}
        onSuccess={loadCategories}
      />

      <DeleteCategoryDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        categoryId={selectedCategoryId}
        onSuccess={loadCategories}
      />
    </AuthGuard>
  );
}
