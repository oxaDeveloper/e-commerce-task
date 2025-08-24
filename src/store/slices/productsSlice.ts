import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../services/api";

export interface Product {
  id: string;
  name: string;
  price: number;
  category?: string;
  stock?: number;
}

interface ProductsState {
  items: Product[];
  total: number;
  page: number; // 1-based for UI
  size: number;
  query: { name?: string; category?: string };
  status: "idle" | "loading" | "failed";
  error: string | null;
  current?: Product | null;
}

const initialState: ProductsState = {
  items: [],
  total: 0,
  page: 1,
  size: 10,
  query: {},
  status: "idle",
  error: null,
  current: null,
};

export const fetchProducts = createAsyncThunk(
  "products/fetch",
  async (
    params: {
      page?: number;
      size?: number;
      name?: string;
      category?: string;
    } = {}
  ) => {
    const { page = 1, size = 10, name, category } = params;
    const apiPage = Math.max(0, page - 1); // backend expects 0-based

    // Debug logging
    console.log("fetchProducts called with params:", params);

    // Build query parameters, only include non-empty values
    const queryParams: any = { page: apiPage, size };
    if (name && name.trim()) queryParams.name = name.trim();
    if (category && category.trim()) queryParams.category = category.trim();

    console.log("Final query params:", queryParams);

    const res = await api.get<any>("/products", {
      params: queryParams,
    });

    let payload: any = res.data;
    if (payload && typeof payload === "object" && "data" in payload) {
      payload = payload.data;
    }

    let items: Product[] = [];
    let total = 0;
    if (Array.isArray(payload)) {
      items = payload as Product[];
      total = items.length;
    } else if (payload && typeof payload === "object") {
      items = (payload.content || payload.items || []) as Product[];
      total = (payload.totalElements ||
        payload.total ||
        (Array.isArray(items) ? items.length : 0)) as number;
    }

    console.log("API response:", { items: items.length, total, payload });

    return { items, total, page, size };
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchById",
  async (id: string) => {
    const res = await api.get<any>(`/products/${id}`);
    let data: any = res.data;
    if (data && typeof data === "object" && "data" in data) data = data.data;
    return data as Product;
  }
);

export const createProduct = createAsyncThunk(
  "products/create",
  async (payload: {
    name: string;
    price: number;
    category?: string;
    stock?: number;
  }) => {
    const res = await api.post<any>("/products", payload);
    let data: any = res.data;
    if (data && typeof data === "object" && "data" in data) {
      data = data.data;
    }
    return data as Product;
  }
);

export const updateProduct = createAsyncThunk(
  "products/update",
  async (payload: { id: string; changes: Partial<Product> }) => {
    const res = await api.put<any>(`/products/${payload.id}`, payload.changes);
    let data: any = res.data;
    if (data && typeof data === "object" && "data" in data) data = data.data;
    return data as Product;
  }
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id: string) => {
    await api.delete(`/products/${id}`);
    return id;
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setSize(state, action: PayloadAction<number>) {
      state.size = action.payload;
    },
    setQuery(
      state,
      action: PayloadAction<{ name?: string; category?: string }>
    ) {
      console.log("productsSlice: setQuery called with:", action.payload);
      console.log("Previous query state:", state.query);
      state.query = action.payload;
      console.log("New query state:", state.query);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "idle";
        state.items = action.payload.items || [];
        state.total = action.payload.total || 0;
        state.page = action.payload.page; // keep UI page as-is (1-based)
        state.size = action.payload.size;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to load products";
        state.items = [];
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        // Optimistically insert new product at top
        state.items = [action.payload, ...state.items];
        state.total += 1;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      });
  },
});

export const { setPage, setSize, setQuery } = productsSlice.actions;
export default productsSlice.reducer;
