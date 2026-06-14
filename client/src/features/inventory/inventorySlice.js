import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { inventoryApi } from '../../api/inventoryApi';

export const fetchInventoryItems = createAsyncThunk(
  'inventory/fetchItems',
  async (_, { rejectWithValue }) => {
    try {
      const response = await inventoryApi.getAllInventory();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch inventory');
    }
  }
);

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventoryItems.pending, (state) => { state.isLoading = true; })
      .addCase(fetchInventoryItems.fulfilled, (state, action) => { state.isLoading = false; state.items = action.payload.data; })
      .addCase(fetchInventoryItems.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; });
  },
});

export default inventorySlice.reducer;
