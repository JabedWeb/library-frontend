"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { toast } from "sonner";

import { deleteStudent } from "@/services/students";

type Props = {
  open: boolean;

  onOpenChange: (open: boolean) => void;

  studentId: number;

  onSuccess: () => void;
};

export function DeleteStudentDialog({
  open,
  onOpenChange,
  studentId,
  onSuccess,
}: Props) {
  const handleDelete = async () => {
    try {
      await deleteStudent(studentId);

      toast.success("Student deleted");

      onSuccess();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Student?</AlertDialogTitle>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
