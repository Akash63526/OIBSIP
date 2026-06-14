import React from 'react';
import { useSelector } from 'react-redux';
import { selectCartTotal } from '../../features/cart/cartSlice';
import Button from '../ui/Button';

const CartSummary = ({ onCheckout, isCheckingOut }) => {
  const total = useSelector(selectCartTotal);
  const tax = total * 0.05; // 5% tax
  const delivery = total > 500 ? 0 : 50; // Free delivery over 500
  const grandTotal = total + tax + delivery;

  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
      
      <div className="space-y-4 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-medium text-gray-900">₹{total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax (5%)</span>
          <span className="font-medium text-gray-900">₹{tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery</span>
          <span className="font-medium text-gray-900">
            {delivery === 0 ? 'Free' : `₹${delivery.toFixed(2)}`}
          </span>
        </div>
        
        <div className="border-t border-gray-200 pt-4 flex justify-between">
          <span className="text-base font-bold text-gray-900">Total</span>
          <span className="text-xl font-bold text-red-600">₹{grandTotal.toFixed(2)}</span>
        </div>
      </div>

      <Button 
        onClick={onCheckout} 
        className="w-full mt-6" 
        size="lg"
        isLoading={isCheckingOut}
        disabled={total === 0}
      >
        Proceed to Checkout
      </Button>
    </div>
  );
};

export default CartSummary;
