import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { paymentApi } from '../../api/paymentApi';

export const processPayment = createAsyncThunk(
  'payment/process',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await paymentApi.verifyPayment(paymentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Payment failed');
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    isProcessing: false,
    error: null,
    paymentStatus: null,
  },
  reducers: {
    resetPaymentStatus: (state) => {
      state.paymentStatus = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(processPayment.pending, (state) => { state.isProcessing = true; state.error = null; })
      .addCase(processPayment.fulfilled, (state) => { state.isProcessing = false; state.paymentStatus = 'success'; })
      .addCase(processPayment.rejected, (state, action) => { state.isProcessing = false; state.error = action.payload; state.paymentStatus = 'failed'; });
  },
});

export const { resetPaymentStatus } = paymentSlice.actions;
export default paymentSlice.reducer;
