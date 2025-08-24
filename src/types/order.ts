export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "CANCELLED"
  | "DELIVERED"
  | "PROCESSING"
  | "RETURNED"
  | "ON_HOLD";

export const ALL_ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "CANCELLED",
  "DELIVERED",
  "PROCESSING",
  "RETURNED",
  "ON_HOLD",
];

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
}

export interface Order {
  id: string;
  customerEmail: string;
  customerName?: string;
  status: OrderStatus;
  totalAmount: number;
  items: OrderItem[];
}
