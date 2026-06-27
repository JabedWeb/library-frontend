"use client";

import { useEffect, useState } from "react";

import { toast } from "sonner";

import { createAuthor, updateAuthor, Author } from "@/services/authors";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  author?: Author | null;
};

export function AuthorFormDialog({
  open,
  onOpenChange,
  onSuccess,
  author,
}: Props) {
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (author) {
      setName(author.name);
    } else {
      setName("");
    }
  }, [author]);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (author) {
        await updateAuthor(author.id, {
          name,
        });

        toast.success("Author updated successfully.");
      } else {
        await createAuthor({
          name,
        });

        toast.success("Author created successfully.");
      }

      onSuccess();

      onOpenChange(false);
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{author ? "Edit Author" : "Add Author"}</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Author name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Button disabled={loading} onClick={handleSubmit}>
          {loading ? "Saving..." : author ? "Update" : "Create"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
