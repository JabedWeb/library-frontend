"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

import { Download, Search } from "lucide-react";
import { toast } from "sonner";

import { AuthGuard } from "@/components/auth-guard";
import { DeleteOrderDialog } from "@/components/orders/delete-order-dialog";
import { OrderDialog } from "@/components/orders/order-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { downloadOrderPdf, getOrders } from "@/services/orders";
import type { Order, OrderStatus } from "@/types/order";

const formatDate = (value?: string | null) => {
  if (!value) return "N/A";

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(value));
};

const statusLabels: Record<OrderStatus, string> = {
  BORROWED: "Borrowed",
  RETURNED: "Returned",
  OVERDUE: "Overdue",
};

const statusClassNames: Record<OrderStatus, string> = {
  BORROWED: "bg-blue-50 text-blue-700",
  RETURNED: "bg-green-50 text-green-700",
  OVERDUE: "bg-red-50 text-red-700",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | OrderStatus>("ALL");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [downloadingOrderId, setDownloadingOrderId] = useState<number | null>(
    null,
  );

  const loadOrders = async () => {
    try {
      setLoading(true);

      const data = await getOrders();

      setOrders(data);
    } catch {
      toast.error("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function loadInitialOrders() {
      try {
        const data = await getOrders();

        setOrders(data);
      } catch {
        toast.error("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    }

    loadInitialOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const normalizedSearch = submittedSearch.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "ALL" || order.status === statusFilter;

      if (!matchesStatus) return false;
      if (!normalizedSearch) return true;

      return [
        String(order.id),
        order.student?.name,
        order.student?.email,
        order.book?.title,
        order.status,
      ]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(normalizedSearch));
    });
  }, [orders, statusFilter, submittedSearch]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmittedSearch(search);
  };

  const clearFilters = () => {
    setSearch("");
    setSubmittedSearch("");
    setStatusFilter("ALL");
  };

  const handleDownloadPdf = async (orderId: number) => {
    try {
      setDownloadingOrderId(orderId);

      const pdf = await downloadOrderPdf(orderId);
      const url = URL.createObjectURL(pdf);
      const link = document.createElement("a");

      link.href = url;
      link.download = `order-${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Failed to download order PDF.");
    } finally {
      setDownloadingOrderId(null);
    }
  };

  return (
    <AuthGuard>
      <div className="container mx-auto p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Orders</h1>
            <p className="text-muted-foreground">
              Borrow, return, and manage book orders
            </p>
          </div>

          <Button
            onClick={() => {
              setSelectedOrder(null);
              setDialogOpen(true);
            }}
          >
            Borrow Book
          </Button>
        </div>

        <form
          className="mb-6 grid gap-3 rounded-lg border p-4 md:grid-cols-[1fr_180px_auto_auto]"
          onSubmit={handleSearch}
        >
          <Input
            placeholder="Search by ID, student, book, or status"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as "ALL" | OrderStatus)
            }
          >
            <option value="ALL">All statuses</option>
            <option value="BORROWED">Borrowed</option>
            <option value="RETURNED">Returned</option>
            <option value="OVERDUE">Overdue</option>
          </select>

          <Button type="submit">
            <Search />
            Search
          </Button>

          <Button type="button" variant="outline" onClick={clearFilters}>
            Clear
          </Button>
        </form>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Book</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Borrowed</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Returned</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-8 text-center">
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {order.student?.name ?? `Student #${order.studentId}`}
                      </div>
                      {order.student?.email && (
                        <div className="text-xs text-muted-foreground">
                          {order.student.email}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {order.book?.title ?? `Book #${order.bookId}`}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${statusClassNames[order.status]}`}
                      >
                        {statusLabels[order.status]}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(order.orderDate)}</TableCell>
                    <TableCell>{formatDate(order.dueDate)}</TableCell>
                    <TableCell>{formatDate(order.returnDate)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={downloadingOrderId === order.id}
                          onClick={() => handleDownloadPdf(order.id)}
                        >
                          <Download />
                          PDF
                        </Button>

                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setSelectedOrder(order);
                            setDialogOpen(true);
                          }}
                        >
                          Edit
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setSelectedOrderId(order.id);
                            setDeleteOpen(true);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <OrderDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        order={selectedOrder}
        onSuccess={loadOrders}
      />

      <DeleteOrderDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        orderId={selectedOrderId}
        onSuccess={loadOrders}
      />
    </AuthGuard>
  );
}
