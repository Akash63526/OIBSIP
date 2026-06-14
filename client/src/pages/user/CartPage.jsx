import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import CartItem from '../../components/cart/CartItem';
import { selectCartTotal, clearCart } from '../../features/cart/cartSlice';
import Toast from '../../components/ui/Toast';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { LockClosedIcon, InformationCircleIcon } from '@heroicons/react/24/solid';

const CartPage = () => {
  const { items } = useSelector((state) => state.cart);
  const total = useSelector(selectCartTotal);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [couponCode, setCouponCode] = useState('');
  const [toast, setToast] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const subtotal = total;

  // Auto-apply saved coupon from Offers Page on mount
  React.useEffect(() => {
    const savedCode = localStorage.getItem('appliedCouponCode');
    if (savedCode && items.length > 0) {
      const code = savedCode.trim().toUpperCase();
      let discount = 0;
      let success = false;

      if (code === 'WELCOME20' || code === 'FIRST20' || code === 'SUMMER20' || code === 'MATCH20' || code === 'LOVEPIZZA') {
        if (subtotal >= 199) {
          discount = subtotal * 0.20;
          success = true;
        }
      } else if (code === 'PIZZA30') {
        if (subtotal >= 249) {
          discount = subtotal * 0.30;
          success = true;
        }
      } else if (code === 'CHEESELOVER') {
        if (subtotal >= 349) {
          discount = subtotal * 0.25;
          success = true;
        }
      } else if (code === 'COMBO499') {
        if (subtotal >= 499) {
          discount = 150;
          success = true;
        }
      } else if (code === 'WEEKENDSALE' || code === 'SLICESPRINT40') {
        if (subtotal >= 400) {
          discount = subtotal * 0.40;
          success = true;
        }
      } else if (code === 'BUY1GET1' || code === 'BOGO') {
        const pizzaPrices = [];
        items.forEach(item => {
          const isPizza = item.category?.toLowerCase() === 'pizza' || 
                          item.name?.toLowerCase().includes('pizza') || 
                          item.isCustom;
          if (isPizza) {
            for (let i = 0; i < item.quantity; i++) {
              pizzaPrices.push(item.price);
            }
          }
        });
        if (pizzaPrices.length >= 2) {
          pizzaPrices.sort((a, b) => a - b);
          const freeCount = Math.floor(pizzaPrices.length / 2);
          let bogoDiscount = 0;
          for (let i = 0; i < freeCount; i++) {
            bogoDiscount += pizzaPrices[i];
          }
          discount = bogoDiscount;
          success = true;
        }
      } else if (code === 'NEWYEAR50' || code === 'FESTIVE50' || code === 'PIZZA50') {
        if (subtotal >= 299) {
          discount = 50;
          success = true;
        }
      } else if (code === 'FREEDELIVERY' || code === 'FREESHIP') {
        if (subtotal >= 299) {
          success = true;
        }
      }

      if (success) {
        setAppliedCoupon({ code, discountAmount: discount });
        setToast(`Auto-applied saved coupon "${code}"!`);
      }
      localStorage.removeItem('appliedCouponCode');
    }
  }, [items, subtotal]);

  // Calculate discount dynamically based on active coupon code
  let discountAmount = 0;
  if (appliedCoupon) {
    const code = appliedCoupon.code;
    if (code === 'WELCOME20' || code === 'FIRST20' || code === 'SUMMER20' || code === 'MATCH20' || code === 'LOVEPIZZA') {
      discountAmount = subtotal * 0.20;
    } else if (code === 'PIZZA30') {
      discountAmount = subtotal * 0.30;
    } else if (code === 'CHEESELOVER') {
      discountAmount = subtotal * 0.25;
    } else if (code === 'WEEKENDSALE' || code === 'SLICESPRINT40') {
      discountAmount = subtotal * 0.40;
    } else if (code === 'COMBO499') {
      discountAmount = 150;
    } else if (code === 'NEWYEAR50' || code === 'FESTIVE50' || code === 'PIZZA50') {
      discountAmount = 50;
    } else if (code === 'MEGA100') {
      discountAmount = 100;
    } else if (code === 'WEEKEND30') {
      discountAmount = subtotal * 0.30;
    } else if (code === 'BUY1GET1' || code === 'BOGO') {
      const pizzaPrices = [];
      items.forEach(item => {
        const isPizza = item.category?.toLowerCase() === 'pizza' || 
                        item.name?.toLowerCase().includes('pizza') || 
                        item.isCustom;
        if (isPizza) {
          for (let i = 0; i < item.quantity; i++) {
            pizzaPrices.push(item.price);
          }
        }
      });
      pizzaPrices.sort((a, b) => a - b);
      const freeCount = Math.floor(pizzaPrices.length / 2);
      let bogoDiscount = 0;
      for (let i = 0; i < freeCount; i++) {
        bogoDiscount += pizzaPrices[i];
      }
      discountAmount = bogoDiscount;
    }
  }

  // Free delivery over 500, or if FREEDELIVERY / FREESHIP coupon is active!
  const deliveryFee = (appliedCoupon?.code === 'FREEDELIVERY' || appliedCoupon?.code === 'FREESHIP' || subtotal > 500) ? 0 : 50;
  
  // 5% GST calculated on subtotal AFTER discount!
  const taxesAndFees = Math.max(0, Math.round((subtotal - discountAmount) * 0.05 * 100) / 100);
  
  const grandTotal = subtotal > 0 ? Math.max(0, subtotal - discountAmount + deliveryFee + taxesAndFees) : 0;

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setToast('Please enter a coupon code.');
      return;
    }

    let discount = 0;
    let message = '';
    let success = false;

    if (code === 'WELCOME20' || code === 'FIRST20' || code === 'SUMMER20' || code === 'MATCH20' || code === 'LOVEPIZZA') {
      if (subtotal < 199) {
        setToast('Code requires a minimum order of ₹199.');
        return;
      }
      discount = subtotal * 0.20;
      message = `Coupon applied successfully! 20% discount (${code}) deducted.`;
      success = true;
    } else if (code === 'PIZZA30') {
      if (subtotal < 249) {
        setToast('Code requires a minimum order of ₹249.');
        return;
      }
      discount = subtotal * 0.30;
      message = 'Coupon applied successfully! 30% discount deducted.';
      success = true;
    } else if (code === 'CHEESELOVER') {
      if (subtotal < 349) {
        setToast('Code requires a minimum order of ₹349.');
        return;
      }
      discount = subtotal * 0.25;
      message = 'Cheese Lovers Special applied! 25% discount deducted.';
      success = true;
    } else if (code === 'COMBO499') {
      if (subtotal < 499) {
        setToast('Code requires a minimum order of ₹499.');
        return;
      }
      discount = 150;
      message = 'Super Combo Offer applied! Flat ₹150 discount deducted.';
      success = true;
    } else if (code === 'WEEKENDSALE' || code === 'SLICESPRINT40') {
      if (subtotal < 400) {
        setToast('Code requires a minimum order of ₹400.');
        return;
      }
      discount = subtotal * 0.40;
      message = 'Mega discount applied! 40% discount deducted.';
      success = true;
    } else if (code === 'BUY1GET1' || code === 'BOGO') {
      const pizzaPrices = [];
      items.forEach(item => {
        const isPizza = item.category?.toLowerCase() === 'pizza' || 
                        item.name?.toLowerCase().includes('pizza') || 
                        item.isCustom;
        if (isPizza) {
          for (let i = 0; i < item.quantity; i++) {
            pizzaPrices.push(item.price);
          }
        }
      });
      if (pizzaPrices.length < 2) {
        setToast('BOGO coupon requires at least 2 pizzas in your cart.');
        return;
      }
      pizzaPrices.sort((a, b) => a - b);
      const freeCount = Math.floor(pizzaPrices.length / 2);
      let bogoDiscount = 0;
      for (let i = 0; i < freeCount; i++) {
        bogoDiscount += pizzaPrices[i];
      }
      discount = bogoDiscount;
      message = `BOGO applied! You saved ₹${bogoDiscount.toFixed(2)} on ${freeCount} free pizza(s).`;
      success = true;
    } else if (code === 'NEWYEAR50' || code === 'FESTIVE50' || code === 'PIZZA50') {
      if (subtotal < 299) {
        setToast('Code requires a minimum order of ₹299.');
        return;
      }
      discount = 50;
      message = `Festive coupon applied! Flat ₹50 discount deducted.`;
      success = true;
    } else if (code === 'FREEDELIVERY' || code === 'FREESHIP') {
      if (subtotal < 299) {
        setToast('Code requires a minimum order of ₹299.');
        return;
      }
      message = 'Free Delivery applied successfully!';
      success = true;
    } else if (code === 'MEGA100') {
      if (subtotal < 699) {
        setToast('Code requires a minimum order of ₹699.');
        return;
      }
      discount = 100;
      message = 'Flat ₹100 discount applied successfully!';
      success = true;
    } else if (code === 'WEEKEND30') {
      if (subtotal < 249) {
        setToast('Code requires a minimum order of ₹249.');
        return;
      }
      discount = subtotal * 0.30;
      message = 'Weekend special applied! 30% discount deducted.';
      success = true;
    } else {
      setToast('Invalid coupon code. Try WELCOME20, FREEDELIVERY, COMBO499, or WEEKENDSALE.');
      return;
    }

    if (success) {
      setAppliedCoupon({ code, discountAmount: discount });
      setToast(message);
      setCouponCode('');
    }
  };

  const handleCheckout = () => {
    setToast('Redirecting to checkout...');
    setTimeout(() => {
      navigate('/checkout');
    }, 1000);
  };

  if (items.length === 0) {
    return (
      <div className="bg-white min-h-screen pb-16 font-sans">
        <div className="max-w-[850px] mx-auto px-4 sm:px-6 mt-12 text-center py-20 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
          <ShoppingBagIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Your cart is empty</h2>
          <p className="text-gray-500 mb-8 font-semibold">Looks like you haven't added any pizzas yet.</p>
          <Link 
            to="/" 
            className="inline-flex bg-[#FF6B00] hover:bg-[#e66000] text-white px-8 py-3 rounded-full font-black text-sm shadow-sm hover:shadow-orange-500/10 active:scale-95 transition-all"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  // Count items total quantity
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-white min-h-screen pb-16 font-sans">
      <div className="max-w-[850px] mx-auto px-4 sm:px-6 mt-6">
        
        {/* Cart Title & Badges Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-[28px] sm:text-[32px] font-black text-gray-900 tracking-tight">
            Cart Summary
          </h1>
          <span className="bg-gray-100 text-gray-700 font-extrabold text-[13px] px-4 py-1.5 rounded-full shadow-sm">
            {totalItemCount} {totalItemCount === 1 ? 'Item' : 'Items'}
          </span>
        </div>

        {/* Free Delivery alert banner */}
        <div className="bg-[#ECFDF5] border border-green-100/60 rounded-2xl p-4 flex items-center gap-3 mb-8 shadow-sm">
          <span className="text-xl">🚚</span>
          <p className="text-[#047857] text-[13.5px] sm:text-[14px] font-extrabold tracking-wide leading-tight">
            Yay! You're getting free delivery on this order.
          </p>
        </div>

        {/* Cart items list wrapped in a premium white container */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100/80 shadow-[0_15px_40px_rgba(0,0,0,0.02)] mb-8">
          <div className="divide-y divide-gray-100">
            {items.map((item, index) => (
              <CartItem key={index} item={item} index={index} />
            ))}
          </div>
        </div>

        {/* Coupon Code Input Card with dynamic Active state */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-100/80 shadow-[0_15px_40px_rgba(0,0,0,0.015)] mb-8 flex flex-col gap-3">
          <div className="flex flex-row items-center gap-4 justify-between">
            <div className="flex items-center gap-3 pl-2 flex-grow">
              <span className="text-gray-400 text-xl">🏷</span>
              <input 
                type="text" 
                placeholder="Enter coupon code (e.g. SLICESPRINT40)" 
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 text-gray-800 placeholder-gray-400 font-extrabold text-[14px] outline-none"
              />
            </div>
            <button 
              onClick={handleApplyCoupon}
              className="bg-[#FF6B00] hover:bg-[#e66000] text-white px-8 py-3 rounded-2xl font-black text-sm shadow-sm active:scale-95 transition-all"
            >
              Apply
            </button>
          </div>
          {appliedCoupon && (
            <div className="flex justify-between items-center bg-[#ECFDF5] border border-green-100 rounded-xl px-4 py-2 text-xs font-bold text-green-700">
              <span>Code Applied: <strong className="font-extrabold uppercase">{appliedCoupon.code}</strong></span>
              <button 
                onClick={() => setAppliedCoupon(null)}
                className="text-gray-400 hover:text-red-500 font-black text-sm"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Checkout Cost Details summary wrapper */}
        <div className="bg-[#FDFBF9]/80 rounded-3xl p-6 sm:p-8 border border-[#FAF3E8] shadow-[0_15px_40px_rgba(0,0,0,0.01)] mb-8">
          <div className="space-y-4 mb-6">
            
            <div className="flex justify-between items-center text-[14px] font-bold text-gray-500">
              <span>Subtotal</span>
              <span className="text-gray-900 font-extrabold">₹{subtotal.toFixed(2)}</span>
            </div>

            {appliedCoupon && (
              <div className="flex justify-between items-center text-[14px] font-bold text-green-600">
                <span>Discount ({appliedCoupon.code})</span>
                <span>-₹{appliedCoupon.code === 'FREESHIP' ? '0.00 (Free Shipping)' : discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between items-center text-[14px] font-bold text-gray-500">
              <div className="flex items-center gap-1.5">
                <span>Delivery Fee</span>
                <InformationCircleIcon className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
              </div>
              <span className="text-gray-900 font-extrabold">{deliveryFee === 0 ? 'Free' : `₹${deliveryFee.toFixed(2)}`}</span>
            </div>

            <div className="flex justify-between items-center text-[14px] font-bold text-gray-500">
              <div className="flex items-center gap-1.5">
                <span>Taxes & Fees</span>
                <InformationCircleIcon className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
              </div>
              <span className="text-gray-900 font-extrabold">₹{taxesAndFees.toFixed(2)}</span>
            </div>

            <div className="h-px bg-gray-200/50 w-full pt-1"></div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-base font-black text-gray-900">Total (INR)</span>
              <span className="text-2xl sm:text-[28px] font-black text-[#FF6B00]">₹{grandTotal.toFixed(2)}</span>
            </div>

          </div>

          {/* Checkout locked trigger button */}
          <button 
            onClick={handleCheckout}
            className="w-full bg-[#FF6B00] hover:bg-[#e66000] text-white py-4 rounded-2xl font-black text-[15px] shadow-md shadow-orange-500/10 hover:shadow-orange-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <LockClosedIcon className="h-4 w-4 text-white" strokeWidth={3} />
            Checkout
          </button>
        </div>

        {/* Secure checkout features trust strip */}
        <div className="border-t border-gray-100 pt-8 pb-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            
            {/* Badge 1 */}
            <div className="flex flex-row items-center justify-center gap-2.5">
              <span className="h-6 w-6 rounded-full bg-green-50 flex items-center justify-center text-[12px] text-green-600">✔</span>
              <div className="text-left">
                <span className="text-[13.5px] font-black text-gray-800 block leading-tight">Secure Payment</span>
                <span className="text-[11px] font-semibold text-gray-400">100% Protected</span>
              </div>
            </div>

            {/* Badge 2 */}
            <div className="flex flex-row items-center justify-center gap-2.5">
              <span className="h-6 w-6 rounded-full bg-orange-50 flex items-center justify-center text-[12px] text-[#FF6B00]">🔄</span>
              <div className="text-left">
                <span className="text-[13.5px] font-black text-gray-800 block leading-tight">Easy Returns</span>
                <span className="text-[11px] font-semibold text-gray-400">No Worries</span>
              </div>
            </div>

            {/* Badge 3 */}
            <div className="flex flex-row items-center justify-center gap-2.5">
              <span className="h-6 w-6 rounded-full bg-blue-50 flex items-center justify-center text-[12px] text-blue-500">⏱</span>
              <div className="text-left">
                <span className="text-[13.5px] font-black text-gray-800 block leading-tight">Fresh & Fast</span>
                <span className="text-[11px] font-semibold text-gray-400">On Time Delivery</span>
              </div>
            </div>

          </div>
        </div>

        {/* Accepted Payment Partner Brands Strip */}
        <div className="text-center py-4">
          <p className="text-[12px] font-black text-gray-400 uppercase tracking-widest mb-3">We accept:</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-gray-400">
            {/* VISA */}
            <span className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg flex items-center justify-center font-black italic tracking-wide text-blue-900 shadow-sm">VISA</span>
            {/* MasterCard */}
            <span className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg flex items-center justify-center font-black text-gray-800 shadow-sm">Mastercard</span>
            {/* Amex */}
            <span className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg flex items-center justify-center font-black tracking-tighter text-blue-500 shadow-sm">AMEX</span>
            {/* PayPal */}
            <span className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg flex items-center justify-center font-black italic text-blue-700 shadow-sm">PayPal</span>
            {/* Apple Pay */}
            <span className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg flex items-center justify-center font-black text-gray-900 shadow-sm"> Pay</span>
            {/* Google Pay */}
            <span className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg flex items-center justify-center font-black text-gray-600 shadow-sm"><span className="text-blue-500 font-extrabold">G</span> Pay</span>
          </div>
        </div>

      </div>

      {toast && <Toast message={toast} type="success" onClose={() => setToast(null)} />}
    </div>
  );
};

export default CartPage;
