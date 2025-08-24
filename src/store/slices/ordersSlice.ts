import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/api";
import { OrderStatus } from "../../types/order";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerEmail: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
}

interface OrdersState {
  items: Order[];
  status: "idle" | "loading" | "failed";
  error: string | null;
}

const initialState: OrdersState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchOrders = createAsyncThunk("orders/fetch", async () => {
  const res = await api.get<any>("/orders");
  let data: any = res.data;
  if (data && typeof data === "object" && "data" in data) data = data.data;
  if (data && typeof data === "object" && "content" in data)
    data = data.content;
  return Array.isArray(data) ? data : [];
});

export const fetchMyOrders = createAsyncThunk(
  "orders/fetchMy",
  async (email: string) => {
    const res = await api.get<any>(`/orders/customer/${email}`);
    let data: any = res.data;
    if (data && typeof data === "object" && "data" in data) data = data.data;
    if (data && typeof data === "object" && "content" in data)
      data = data.content;
    return Array.isArray(data) ? data : [];
  }
);

export const updateOrderStatus = createAsyncThunk(
  "orders/updateStatus",
  async (payload: { id: string; status: OrderStatus }) => {
    const res = await api.put<any>(`/orders/${payload.id}/status`, {
      status: payload.status,
    });
    let data: any = res.data;
    if (data && typeof data === "object" && "data" in data) data = data.data;
    return data as Order;
  }
);

export const createOrder = createAsyncThunk(
  "orders/create",
  async (payload: {
    items: Array<{ productId: string | number; quantity: number }>;
    customerEmail: string;
    customerName?: string;
  }) => {
    const orderItems = payload.items.map((i) => ({
      productId: Number(i.productId),
      quantity: i.quantity,
    }));
    const body = {
      customerName: payload.customerName || "",
      customerEmail: payload.customerEmail,
      orderItems,
    };
    const res = await api.post<any>("/orders", body);
    let data: any = res.data;
    if (data && typeof data === "object" && "data" in data) data = data.data;
    return data as Order;
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = "idle";
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch orders";
      })
      .addCase(fetchMyOrders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.status = "idle";
        state.items = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch my orders";
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex((o) => o.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.items = [action.payload, ...state.items];
      });
  },
});

export default ordersSlice.reducer;
