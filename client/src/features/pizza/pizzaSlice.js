import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { pizzaApi } from '../../api/pizzaApi';

export const fetchPizzas = createAsyncThunk(
  'pizza/fetchPizzas',
  async (params, { rejectWithValue }) => {
    try {
      const response = await pizzaApi.getAllPizzas(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch pizzas');
    }
  }
);

const pizzaSlice = createSlice({
  name: 'pizza',
  initialState: {
    pizzas: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPizzas.pending, (state) => { state.isLoading = true; })
      .addCase(fetchPizzas.fulfilled, (state, action) => { state.isLoading = false; state.pizzas = action.payload.data; })
      .addCase(fetchPizzas.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; });
  },
});

export default pizzaSlice.reducer;
