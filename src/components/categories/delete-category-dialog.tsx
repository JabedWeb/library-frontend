"use client";

import { toast } from "sonner";

import { deleteCategory } from "@/services/categories";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryId: number | null;
  onSuccess: () => void;
};

export function DeleteCategoryDialog({
  open,
  onOpenChange,
  categoryId,
  onSuccess,
}: Props) {
  const handleDelete = async () => {
    if (!categoryId) return;

    try {
      await deleteCategory(categoryId);

      toast.success("Category deleted successfully.");
      onSuccess();
      onOpenChange(false);
    } catch {
      toast.error("Failed to delete category.");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Category</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this category? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
