"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

import Link from "next/link";

import { toast } from "sonner";

import { AuthGuard } from "@/components/auth-guard";

import { Button } from "@/components/ui/button";

import { Author, getAuthors } from "@/services/authors";
import { AuthorFormDialog } from "@/components/authors/author-form-dialog";
import { DeleteAuthorDialog } from "@/components/authors/delete-author-dialog";
import { Input } from "@/components/ui/input";

export default function AuthorsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);

  const [authors, setAuthors] = useState<Author[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [selectedAuthorId, setSelectedAuthorId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [sortBy, setSortBy] = useState<"id" | "name">("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const loadAuthors = async () => {
    try {
      setLoading(true);

      const data = await getAuthors();

      setAuthors(data);
    } catch {
      toast.error("Failed to load authors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function loadInitialAuthors() {
      try {
        const data = await getAuthors();

        setAuthors(data);
      } catch {
        toast.error("Failed to load authors.");
      } finally {
        setLoading(false);
      }
    }

    loadInitialAuthors();
  }, []);

  const filteredAuthors = useMemo(() => {
    const normalizedSearch = submittedSearch.trim().toLowerCase();

    return authors
      .filter((author) => {
        if (!normalizedSearch) return true;

        return (
          author.name.toLowerCase().includes(normalizedSearch) ||
          String(author.id).includes(normalizedSearch)
        );
      })
      .toSorted((firstAuthor, secondAuthor) => {
        const direction = sortDirection === "asc" ? 1 : -1;

        if (sortBy === "name") {
          return firstAuthor.name.localeCompare(secondAuthor.name) * direction;
        }

        return (firstAuthor.id - secondAuthor.id) * direction;
      });
  }, [authors, submittedSearch, sortBy, sortDirection]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmittedSearch(search);
  };

  const clearFilters = () => {
    setSearch("");
    setSubmittedSearch("");
    setSortBy("id");
    setSortDirection("desc");
  };

  return (
    <AuthGuard>
      <div className="container mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Authors</h1>

          <Button
            onClick={() => {
              setSelectedAuthor(null);
              setDialogOpen(true);
            }}
          >
            Add Author
          </Button>
        </div>

        <form
          className="mb-4 grid gap-3 md:grid-cols-[1fr_160px_180px_auto_auto]"
          onSubmit={handleSearch}
        >
          <Input
            placeholder="Filter by name or ID..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as "id" | "name")}
          >
            <option value="id">Sort by ID</option>
            <option value="name">Sort by Name</option>
          </select>

          <select
            className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            value={sortDirection}
            onChange={(event) =>
              setSortDirection(event.target.value as "asc" | "desc")
            }
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>

          <Button type="submit">Apply</Button>

          <Button type="button" variant="outline" onClick={clearFilters}>
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

                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredAuthors.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-6 text-center">
                    No authors found.
                  </td>
                </tr>
              ) : (
                filteredAuthors.map((author) => (
                  <tr key={author.id} className="border-b">
                    <td className="p-3">{author.id}</td>

                    <td className="p-3">{author.name}</td>

                    <td className="space-x-2 p-3 text-center">
                      <Button asChild size="sm">
                        <Link href={`/authors/${author.id}`}>View</Link>
                      </Button>

                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setSelectedAuthor(author);
                          setDialogOpen(true);
                        }}
                      >
                        Edit
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setSelectedAuthorId(author.id);
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
      <AuthorFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        author={selectedAuthor}
        onSuccess={loadAuthors}
      />
      <DeleteAuthorDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        authorId={selectedAuthorId}
        onSuccess={loadAuthors}
      />
    </AuthGuard>
  );
}
