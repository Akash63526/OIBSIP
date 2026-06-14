import { createSlice } from '@reduxjs/toolkit';

const DEFAULT_ITEMS = [
  {
    pizzaId: 'custom',
    name: 'Custom Pizza',
    price: 14.99,
    quantity: 1,
    isCustom: true,
    pizzaConfig: {
      base: { name: 'Thin Crust' },
      sauce: { name: 'Tomato Basil Sauce' },
      cheese: { name: 'Mozzarella' },
      veggies: [{ name: 'Onion' }, { name: 'Capsicum' }],
      meat: { name: 'Chicken' }
    },
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=600&q=80'
  },
  {
    pizzaId: 'p3',
    name: 'Pepperoni Feast',
    price: 12.49,
    quantity: 1,
    isCustom: false,
    pizzaConfig: {
      base: { name: 'Regular Crust' }
    },
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80'
  },
  {
    pizzaId: 'gb1',
    name: 'Garlic Bread',
    price: 4.49,
    quantity: 1,
    isCustom: false,
    pizzaConfig: {
      description: 'Cheesy Garlic Bread'
    },
    image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=600&q=80'
  }
];

const loadCartFromStorage = () => {
  try {
    const serializedCart = localStorage.getItem('cart');
    if (serializedCart === null || JSON.parse(serializedCart).length === 0) {
      localStorage.setItem('cart', JSON.stringify(DEFAULT_ITEMS));
      return DEFAULT_ITEMS;
    }
    return JSON.parse(serializedCart);
  } catch (err) {
    return DEFAULT_ITEMS;
  }
};

const initialState = {
  items: loadCartFromStorage(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItemIndex = state.items.findIndex(
        (item) => 
          item.pizzaId === action.payload.pizzaId && 
          JSON.stringify(item.pizzaConfig) === JSON.stringify(action.payload.pizzaConfig)
      );

      if (existingItemIndex >= 0) {
        state.items[existingItemIndex].quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((_, index) => index !== action.payload);
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const { index, quantity } = action.payload;
      if (quantity > 0) {
        state.items[index].quantity = quantity;
      } else {
        state.items = state.items.filter((_, i) => i !== index);
      }
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('cart');
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

export const selectCartTotal = (state) => 
  state.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

export default cartSlice.reducer;
