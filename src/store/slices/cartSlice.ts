import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

// LocalStorage functions for cart persistence
const CART_STORAGE_KEY = "ecommerce_cart";

const loadCartFromStorage = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to load cart from localStorage:", error);
    return [];
  }
};

const saveCartToStorage = (items: CartItem[]): void => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Failed to save cart to localStorage:", error);
  }
};

const initialState: CartState = {
  items: loadCartFromStorage(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      const exists = state.items.find(
        (i) => i.productId === action.payload.productId
      );
      if (!exists) {
        state.items.push(action.payload);
      } else {
        // If item exists, update quantity
        exists.quantity += action.payload.quantity;
      }
      saveCartToStorage(state.items);
    },
    updateQuantity(
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) {
      const item = state.items.find(
        (i) => i.productId === action.payload.productId
      );
      if (item) {
        item.quantity = action.payload.quantity;
        saveCartToStorage(state.items);
      }
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.productId !== action.payload);
      saveCartToStorage(state.items);
    },
    clearCart(state) {
      state.items = [];
      saveCartToStorage(state.items);
    },
    // New action to load cart from storage (useful for initialization)
    initializeCartFromStorage(state) {
      state.items = loadCartFromStorage();
    },
  },
});

export const {
  addItem,
  updateQuantity,
  removeItem,
  clearCart,
  initializeCartFromStorage,
} = cartSlice.actions;
export default cartSlice.reducer;
