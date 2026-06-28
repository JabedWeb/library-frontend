"use client";

import { toast } from "sonner";

import { deleteOrder } from "@/services/orders";
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
  orderId: number | null;
  onSuccess: () => void;
};

export function DeleteOrderDialog({
  open,
  onOpenChange,
  orderId,
  onSuccess,
}: Props) {
  const handleDelete = async () => {
    if (!orderId) return;

    try {
      await deleteOrder(orderId);

      toast.success("Order deleted successfully.");
      onSuccess();
      onOpenChange(false);
    } catch {
      toast.error("Failed to delete order.");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Order</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this order? Deleting an order does
            not restore book stock.
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
