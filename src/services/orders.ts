import { api } from "@/lib/axios";
import type {
  CreateOrderPayload,
  Order,
  UpdateOrderPayload,
} from "@/types/order";

export const getOrders = async (): Promise<Order[]> => {
  const response = await api.get<Order[]>("/orders");

  return response.data;
};

export const getOrder = async (id: number): Promise<Order> => {
  const response = await api.get<Order>(`/orders/${id}`);

  return response.data;
};

export const createOrder = async (
  data: CreateOrderPayload,
): Promise<Order> => {
  const response = await api.post<Order>("/orders", data);

  return response.data;
};

export const updateOrder = async (
  id: number,
  data: UpdateOrderPayload,
): Promise<Order> => {
  const response = await api.patch<Order>(`/orders/${id}`, data);

  return response.data;
};

export const deleteOrder = async (id: number): Promise<Order> => {
  const response = await api.delete<Order>(`/orders/${id}`);

  return response.data;
};

export const downloadOrderPdf = async (id: number): Promise<Blob> => {
  const response = await api.get<Blob>(`/orders/${id}/pdf`, {
    responseType: "blob",
  });

  return response.data;
};
