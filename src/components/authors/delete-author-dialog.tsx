"use client";

import { toast } from "sonner";

import { deleteAuthor } from "@/services/authors";

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
  authorId: number | null;
  onSuccess: () => void;
};

export function DeleteAuthorDialog({
  open,
  onOpenChange,
  authorId,
  onSuccess,
}: Props) {
  const handleDelete = async () => {
    if (!authorId) return;

    try {
      await deleteAuthor(authorId);

      toast.success("Author deleted successfully.");

      onSuccess();

      onOpenChange(false);
    } catch {
      toast.error("Failed to delete author.");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Author</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete this author? This action cannot be
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
