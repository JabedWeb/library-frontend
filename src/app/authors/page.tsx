"use client";

import { useEffect, useState } from "react";

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

  const loadAuthors = async () => {
    try {
      const data = await getAuthors(search);

      setAuthors(data);
    } catch {
      toast.error("Failed to load authors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuthors();
  }, [search]);

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

        <div className="mb-4 w-50" >
          <Input
            placeholder="Search authors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

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
              {authors.map((author) => (
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
              ))}
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
