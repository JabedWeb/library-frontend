"use client";

import { toast } from "sonner";

import { deleteBook } from "@/services/books";
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
  bookId: number | null;
  onSuccess: () => void;
};

export function DeleteBookDialog({
  open,
  onOpenChange,
  bookId,
  onSuccess,
}: Props) {
  const handleDelete = async () => {
    if (!bookId) return;

    try {
      await deleteBook(bookId);

      toast.success("Book deleted successfully.");
      onSuccess();
      onOpenChange(false);
    } catch {
      toast.error("Failed to delete book.");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Book</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this book? Books with orders may not
            be removable.
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
