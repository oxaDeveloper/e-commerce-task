import { configureStore } from "@reduxjs/toolkit";
import authReducer, { logout } from "./slices/authSlice";
import productsReducer from "./slices/productsSlice";
import ordersReducer from "./slices/ordersSlice";
import cartReducer from "./slices/cartSlice";
import { setUnauthorizedCallback } from "../services/api";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    orders: ordersReducer,
    cart: cartReducer,
  },
});

setUnauthorizedCallback(() => {
  store.dispatch(logout());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
