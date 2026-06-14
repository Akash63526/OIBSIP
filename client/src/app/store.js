import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import cartReducer from '../features/cart/cartSlice';
import pizzaReducer from '../features/pizza/pizzaSlice';
import orderReducer from '../features/order/orderSlice';
import inventoryReducer from '../features/inventory/inventorySlice';
import adminReducer from '../features/admin/adminSlice';
import notificationReducer from '../features/notification/notificationSlice';
import paymentReducer from '../features/payment/paymentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    pizza: pizzaReducer,
    order: orderReducer,
    inventory: inventoryReducer,
    admin: adminReducer,
    notification: notificationReducer,
    payment: paymentReducer
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: import.meta.env.MODE !== 'production',
});
