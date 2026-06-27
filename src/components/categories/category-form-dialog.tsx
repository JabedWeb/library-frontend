"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";

import { toast } from "sonner";

import { createCategory, updateCategory } from "@/services/categories";
import type { Category } from "@/types/category";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
  onSuccess: () => void;
};

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
  onSuccess,
}: Props) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(category?.name ?? "");
  }, [category]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Category name is required.");
      return;
    }

    try {
      setLoading(true);

      if (category) {
        await updateCategory(category.id, {
          name: name.trim(),
        });

        toast.success("Category updated successfully.");
      } else {
        await createCategory({
          name: name.trim(),
        });

        toast.success("Category created successfully.");
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
          <DialogTitle>
            {category ? "Edit Category" : "Add Category"}
          </DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Category name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <Button disabled={loading} onClick={handleSubmit}>
          {loading ? "Saving..." : category ? "Update" : "Create"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
