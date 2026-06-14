import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Toast from '../../components/ui/Toast';
import { 
  LockClosedIcon, 
  CheckIcon, 
  PlusIcon, 
  XMarkIcon
} from '@heroicons/react/24/solid';
import { orderApi } from '../../api/orderApi';
import { paymentApi } from '../../api/paymentApi';
import { clearCart } from '../../features/cart/cartSlice';

const INITIAL_ADDRESSES = [
  {
    id: 'home',
    label: 'Home',
    isDefault: true,
    addressLine: 'Apt 101, Green Park Residency\nMG Road, Bengaluru - 560001\nKarnataka, India',
    phone: '+91 98765 43210'
  },
  {
    id: 'work',
    label: 'Work',
    isDefault: false,
    addressLine: 'Office 402, Tech Tower\nOuter Ring Road, Bengaluru -\n560037\nKarnataka, India',
    phone: '+91 91234 56789'
  },
  {
    id: 'parents',
    label: 'Parents',
    isDefault: false,
    addressLine: '12, 3rd Cross, Indiranagar\nBengaluru - 560038\nKarnataka, India',
    phone: '+91 99807 76555'
  }
];

const INITIAL_ITEMS = [
  {
    id: 'checkout-item-1',
    name: 'Veggie Delight Pizza',
    details: 'Regular | Classic Crust',
    quantity: 1,
    price: 249,
    image: '/images/Signature_Veg_Pizzas/Veg_Extravaganza.jpg'
  },
  {
    id: 'checkout-item-2',
    name: 'Garlic Bread',
    details: 'Cheesy Garlic Bread',
    quantity: 1,
    price: 79, // matches mockup ₹79
    image: '/images/Garlic_Breads_and_Sides/Cheese_Garlic_Bread.jpg'
  },
  {
    id: 'checkout-item-3',
    name: 'Coke (500ml)',
    details: 'Chilled Soft Drink',
    quantity: 1,
    price: 40,
    image: '/images/Beverages/Coco_cola.jpg'
  }
];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Core state declarations
  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES);
  const [selectedAddressId, setSelectedAddressId] = useState('home');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const items = useSelector(state => state.cart.items);
  const [toast, setToast] = useState(null);

  // Address edit modal state
  const [editingAddress, setEditingAddress] = useState(null);
  const [isNewAddress, setIsNewAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({ label: '', addressLine: '', phone: '' });

  // Razorpay payment modal state
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [paymentTab, setPaymentTab] = useState('upi'); // 'upi', 'card', 'netbanking', 'wallet'
  const [upiId, setUpiId] = useState('you@upi');
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState('12/29');
  const [cardCvv, setCardCvv] = useState('123');
  const [selectedBank, setSelectedBank] = useState('hdfc');
  const [selectedWallet, setSelectedWallet] = useState('phonepe');

  // Math Calculations (exactly matching screenshot metric ₹437)
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 39;
  const packagingFee = 30; // matches mockup ₹30
  const totalPayable = subtotal + deliveryFee + packagingFee;

  // Address management handlers
  const handleSelectAddress = (id) => {
    setSelectedAddressId(id);
  };

  const handleEditClick = (address, event) => {
    event.stopPropagation();
    setIsNewAddress(false);
    setEditingAddress(address);
    setAddressForm({
      label: address.label,
      addressLine: address.addressLine,
      phone: address.phone
    });
  };

  const handleAddNewClick = () => {
    setIsNewAddress(true);
    setEditingAddress({});
    setAddressForm({
      label: '',
      addressLine: '',
      phone: ''
    });
  };

  const handleSaveAddress = () => {
    if (!addressForm.label.trim() || !addressForm.addressLine.trim() || !addressForm.phone.trim()) {
      setToast('Please fill out all address fields.');
      return;
    }

    if (isNewAddress) {
      const newId = `addr-${Date.now()}`;
      const newAddrObj = {
        id: newId,
        label: addressForm.label,
        isDefault: false,
        addressLine: addressForm.addressLine,
        phone: addressForm.phone
      };
      setAddresses([...addresses, newAddrObj]);
      setSelectedAddressId(newId);
    } else {
      setAddresses(addresses.map(addr => 
        addr.id === editingAddress.id 
          ? { ...addr, label: addressForm.label, addressLine: addressForm.addressLine, phone: addressForm.phone }
          : addr
      ));
    }
    setEditingAddress(null);
    setToast(isNewAddress ? 'Address added successfully!' : 'Address updated successfully!');
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setToast('Please enter a coupon code.');
      return;
    }
    setToast(`Coupon "${couponCode.toUpperCase()}" applied successfully!`);
    setCouponCode('');
  };

  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleOpenRazorpay = async () => {
    if (items.length === 0) {
      setToast('Cart is empty.');
      return;
    }

    if (!window.Razorpay) {
      setToast('Payment Gateway is still loading. Please try again in a few seconds.');
      return;
    }

    try {
      // 1. Prepare Order Data
      const orderItems = items.map(item => {
        if (!item.isCustom) {
          return {
            pizzaId: item.pizzaId,
            isCustom: false,
            quantity: item.quantity,
            price: item.price
          };
        } else {
          const cfg = item.pizzaConfig;
          return {
            isCustom: true,
            pizzaConfig: {
              base: cfg.base?._id,
              sauce: cfg.sauce?._id,
              cheese: cfg.cheese?._id,
              veggies: cfg.veggies?.map(v => v._id) || [],
              meat: cfg.meat ? [cfg.meat._id] : []
            },
            quantity: item.quantity,
            price: item.price
          };
        }
      });

      // 2. Create Razorpay & DB Order via Payment API
      const rzpOrderResponse = await paymentApi.createRazorpayOrder({
        amount: totalPayable,
        items: orderItems,
        deliveryAddress: {
          street: addressForm.addressLine || 'MG Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          zipCode: '560001'
        }
      });
      
      const { razorpayOrderId, razorpayKeyId, dbOrderId, amount, currency } = rzpOrderResponse.data;
      
      // 3. Open Razorpay Checkout
      const options = {
        key: razorpayKeyId,
        amount: amount,
        currency: currency,
        name: 'SliceSprint Pizza',
        description: 'Test Transaction',
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            await paymentApi.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              dbOrderId: dbOrderId
            });
            dispatch(clearCart());
            setToast('Payment completed successfully! Order placed.');
            setTimeout(() => {
              navigate('/orders');
            }, 1800);
          } catch (err) {
            setToast('Payment verification failed.');
          }
        },
        prefill: {
          name: 'Dummy User',
          email: 'dummy@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#FF6B00'
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response) {
        setToast('Payment Failed: ' + response.error.description);
      });
      rzp1.open();

    } catch (error) {
      console.error(error);
      setToast('Failed to initialize checkout. Please try again.');
    }
  };

  const handlePaymentSuccess = () => {
    // legacy mock flow fallback
    setShowRazorpay(false);
    dispatch(clearCart());
    setToast('Payment completed successfully! Order placed.');
    setTimeout(() => {
      navigate('/orders');
    }, 1800);
  };

  // Helper address SVGs
  const getAddressIcon = (label) => {
    const l = label.toLowerCase();
    if (l === 'home') {
      return (
        <svg className="w-5 h-5 text-[#FF6B00] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>
      );
    } else if (l === 'work') {
      return (
        <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
        </svg>
      );
    } else {
      return (
        <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
      );
    }
  };

  return (
    <div className="bg-white min-h-screen pb-16 font-sans select-none text-left">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Title and Subtitle Section */}
        <div className="mb-8 pl-1">
          <h1 className="text-[28px] sm:text-[34px] font-black text-gray-900 tracking-tight leading-none mb-2">
            Checkout
          </h1>
          <p className="text-gray-400 font-bold text-sm sm:text-base leading-none">
            Review your order and complete your payment
          </p>
        </div>

        {/* Double Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Address Selection & Instructions (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* 1. Confirm Address Container */}
            <div className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-[0_15px_40px_rgba(0,0,0,0.015)] relative">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <span className="h-6 w-6 rounded-full bg-[#FF6B00] text-white flex items-center justify-center font-black text-[12px] shadow-sm shadow-orange-500/10">1</span>
                  <h2 className="text-lg font-black text-gray-900 tracking-tight">Confirm Address</h2>
                </div>
                <button 
                  onClick={handleAddNewClick}
                  className="text-sm font-black text-[#FF6B00] hover:underline flex items-center gap-1.5 transition-all"
                >
                  <PlusIcon className="w-3.5 h-3.5" strokeWidth={3.5} /> Add New Address
                </button>
              </div>

              {/* Address Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {addresses.map((addr) => {
                  const isSelected = selectedAddressId === addr.id;
                  return (
                    <div 
                      key={addr.id}
                      onClick={() => handleSelectAddress(addr.id)}
                      className={`cursor-pointer rounded-2xl p-5 border-2 transition-all duration-300 flex flex-col justify-between h-[190px] relative ${
                        isSelected 
                          ? 'border-[#FF6B00] bg-orange-50/5 shadow-[0_8px_25px_rgba(255,107,0,0.04)]' 
                          : 'border-gray-100 hover:border-gray-200 bg-white'
                      }`}
                    >
                      {/* Checkmark Overlap for Selected Card */}
                      {isSelected && (
                        <div className="absolute -top-2.5 -right-2.5 bg-[#FF6B00] text-white w-6.5 h-6.5 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                          <CheckIcon className="w-3.5 h-3.5 text-white" strokeWidth={3.5} />
                        </div>
                      )}

                      <div className="space-y-3">
                        {/* Label, Icon and Default Badge */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getAddressIcon(addr.label)}
                            <span className="text-[14px] font-black text-gray-900 leading-none">{addr.label}</span>
                          </div>
                          {addr.isDefault && (
                            <span className="bg-[#E6F4EA] text-[#137333] text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                              Default
                            </span>
                          )}
                        </div>

                        {/* Address detail lines */}
                        <p className="text-[12px] font-semibold text-gray-400 leading-normal whitespace-pre-line">
                          {addr.addressLine}
                        </p>
                      </div>

                      {/* Phone & Edit capsule button row */}
                      <div className="flex justify-between items-center mt-auto border-t border-gray-50 pt-3.5">
                        <span className="text-[11px] font-bold text-gray-800 tracking-tight">{addr.phone}</span>
                        <button 
                          onClick={(e) => handleEditClick(addr, e)}
                          className="border border-[#FF6B00] text-[#FF6B00] hover:bg-orange-50/20 px-3 py-1 rounded-xl text-[11px] font-black flex items-center gap-1 transition-all active:scale-95 flex-shrink-0 cursor-pointer"
                        >
                          <svg className="w-3 h-3 text-[#FF6B00] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"/>
                          </svg>
                          Edit
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Delivery Instructions Container */}
            <div className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-[0_15px_40px_rgba(0,0,0,0.015)]">
              <div className="flex items-center gap-3 mb-5">
                <span className="h-6 w-6 rounded-full bg-[#FF6B00] text-white flex items-center justify-center font-black text-[12px] shadow-sm shadow-orange-500/10">2</span>
                <h2 className="text-lg font-black text-gray-900 tracking-tight">Delivery Instructions</h2>
              </div>
              
              <div className="relative border border-gray-100 rounded-2xl bg-[#FAFAFA]">
                <textarea 
                  placeholder="E.g. Please leave at the door, ring the bell, etc." 
                  maxLength={120}
                  value={deliveryInstructions}
                  onChange={(e) => setDeliveryInstructions(e.target.value)}
                  className="w-full min-h-[90px] bg-transparent border-none focus:ring-0 outline-none p-4 text-gray-800 font-bold placeholder-gray-400 text-[13.5px] transition-all resize-none"
                />
                <span className="absolute bottom-4 right-4 text-[10px] font-black text-gray-400 tracking-wider">
                  {deliveryInstructions.length}/120
                </span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Order Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 3. Order Summary Container */}
            <div className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-[0_15px_40px_rgba(0,0,0,0.015)]">
              <div className="flex items-center gap-3 mb-6">
                <span className="h-6 w-6 rounded-full bg-[#FF6B00] text-white flex items-center justify-center font-black text-[12px] shadow-sm shadow-orange-500/10">3</span>
                <h2 className="text-lg font-black text-gray-900 tracking-tight">Order Summary</h2>
              </div>

              {/* Items Card List */}
              <div className="space-y-3.5 mb-6">
                {items.map((item, idx) => (
                  <div key={item.pizzaId + idx} className="flex items-center gap-4 bg-white rounded-2xl p-3 border border-gray-100 shadow-[0_4px_15px_rgba(0,0,0,0.005)]">
                    <div className="h-14 w-14 rounded-2xl overflow-hidden border border-gray-100 bg-white flex-shrink-0">
                      {item.image && <img src={item.image} alt={item.name} className="h-full w-full object-cover" />}
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="text-[13.5px] font-black text-gray-900 truncate leading-tight mb-0.5">{item.name}</h4>
                      <p className="text-[11px] font-bold text-gray-400 leading-normal">{item.isCustom ? 'Custom Build' : 'Standard Menu Item'}</p>
                    </div>
                    <div className="text-right flex-shrink-0 flex items-center gap-5 pr-2">
                      <span className="text-[13.5px] font-bold text-gray-400">{item.quantity}</span>
                      <span className="text-[14px] font-black text-gray-900">₹{item.price}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon code input & button with identical height (h-12) */}
              <div className="flex gap-3 mb-6 w-full items-center">
                <input 
                  type="text" 
                  placeholder="Enter coupon code" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-grow bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 text-[13.5px] font-extrabold text-gray-800 placeholder-gray-450 outline-none focus:border-orange-500/50 transition-colors h-12"
                />
                <button 
                  onClick={handleApplyCoupon}
                  className="border-2 border-[#FF6B00] text-[#FF6B00] bg-white hover:bg-orange-50/20 px-6 rounded-xl text-[13.5px] font-black transition-all active:scale-95 flex-shrink-0 h-12 flex items-center justify-center cursor-pointer"
                >
                  Apply
                </button>
              </div>

              {/* Pricing Math breakdowns */}
              <div className="space-y-3.5 mb-6 border-t border-gray-100 pt-5">
                <div className="flex justify-between items-center text-[13.5px] font-bold text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-gray-900 font-black">₹{subtotal}</span>
                </div>
                <div className="flex justify-between items-center text-[13.5px] font-bold text-gray-400">
                  <span>Delivery Fee</span>
                  <span className="text-gray-900 font-black">₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between items-center text-[13.5px] font-bold text-gray-400">
                  <span>Packaging Fee</span>
                  <span className="text-gray-900 font-black">₹{packagingFee}</span>
                </div>
                <div className="h-[1px] bg-gray-100 w-full pt-0.5"></div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm font-black text-gray-900">Total Payable</span>
                  <span className="text-2xl font-black text-[#FF6B00]">₹{totalPayable}</span>
                </div>
              </div>

              {/* Pay with Razorpay Button */}
              <button 
                onClick={handleOpenRazorpay}
                className="w-full bg-[#FF6B00] hover:bg-[#e66000] text-white h-12 rounded-xl font-bold text-sm tracking-wide shadow-md shadow-orange-500/10 hover:shadow-orange-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mb-4 cursor-pointer"
              >
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                Pay with Razorpay
              </button>

              {/* Payment Security Tag - Side-by-side matching size checkmark icon and text */}
              <div className="flex items-center justify-center gap-2 text-[#137333]">
                <svg className="w-[18px] h-[18px] text-[#22C55E] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[13.5px] font-black leading-none">100% Secure Payments</span>
              </div>

            </div>

          </div>

        </div>

        {/* BOTTOM SECTION: trust badges strip matching mockup */}
        <div className="bg-[#FAF3E8]/60 border border-orange-100/50 rounded-[2rem] p-6 mt-16 shadow-[0_8px_30px_rgba(0,0,0,0.005)]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-orange-200/25">
            
            {/* Feature 1 */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 py-2 px-4">
              <div className="w-10 h-10 rounded-full bg-orange-100/30 flex items-center justify-center text-[#FF6B00]">
                <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
              </div>
              <div className="text-left leading-none">
                <span className="text-[14px] font-black text-gray-800 block mb-1">Secure Payments</span>
                <span className="text-[11px] font-bold text-gray-400 leading-none">100% Protected</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 py-2 px-4 border-t border-orange-200/25 md:border-t-0">
              <div className="w-10 h-10 rounded-full bg-orange-100/30 flex items-center justify-center text-[#FF6B00]">
                <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 11m8 0v10M4 11v10"/>
                </svg>
              </div>
              <div className="text-left leading-none">
                <span className="text-[14px] font-black text-gray-800 block mb-1">Easy Returns</span>
                <span className="text-[11px] font-bold text-gray-400 leading-none">No Worries</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 py-2 px-4 border-t border-orange-200/25 md:border-t-0">
              <div className="w-10 h-10 rounded-full bg-orange-100/30 flex items-center justify-center text-[#FF6B00]">
                <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.75a1.125 1.125 0 01-1.125-1.125V14.25m0 0h4.875c.621 0 1.125-.504 1.125-1.125V11.25c0-.621-.504-1.125-1.125-1.125H2.625M2.625 11.25V9a1.125 1.125 0 011.125-1.125h8.25M16.5 13.5v-3.75m0 3.75a1.5 1.5 0 01-3 0m3 0h3.008a1.125 1.125 0 001.123-1.012l.742-6.68A1.125 1.125 0 0017.25 4.5H16.5m-3 9V10.5m-9 3.75h1.125c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.75"/>
                </svg>
              </div>
              <div className="text-left leading-none">
                <span className="text-[14px] font-black text-gray-800 block mb-1">On-Time Delivery</span>
                <span className="text-[11px] font-bold text-gray-400 leading-none">Track in real-time</span>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 py-2 px-4 border-t border-orange-200/25 md:border-t-0">
              <div className="w-10 h-10 rounded-full bg-orange-100/30 flex items-center justify-center text-[#FF6B00]">
                <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.907a1 1 0 00.95-.69l1.519-4.674z"/>
                </svg>
              </div>
              <div className="text-left leading-none">
                <span className="text-[14px] font-black text-gray-800 block mb-1">Best Quality</span>
                <span className="text-[11px] font-bold text-gray-400 leading-none">Always Fresh</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* DIALOG MODAL: Edit Address */}
      {editingAddress && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-gray-100 flex flex-col relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setEditingAddress(null)}
              className="absolute top-6 right-6 p-1.5 rounded-full bg-gray-50 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <XMarkIcon className="w-5 h-5" strokeWidth={2.5} />
            </button>

            <h3 className="text-[20px] font-black text-gray-900 tracking-tight mb-5">
              {isNewAddress ? 'Add New Address' : 'Edit Address'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-[12px] font-black text-gray-400 uppercase tracking-wide block mb-1.5">Label (e.g. Home, Work)</label>
                <input 
                  type="text" 
                  value={addressForm.label}
                  onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                  placeholder="e.g. Home"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-[13.5px] outline-none font-bold"
                />
              </div>

              <div>
                <label className="text-[12px] font-black text-gray-400 uppercase tracking-wide block mb-1.5">Address Details</label>
                <textarea 
                  value={addressForm.addressLine}
                  onChange={(e) => setAddressForm({ ...addressForm, addressLine: e.target.value })}
                  placeholder="Street, Building, Landmark, City, Pincode"
                  rows={3}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-[13.5px] outline-none font-bold resize-none"
                />
              </div>

              <div>
                <label className="text-[12px] font-black text-gray-400 uppercase tracking-wide block mb-1.5">Phone Number</label>
                <input 
                  type="text" 
                  value={addressForm.phone}
                  onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                  placeholder="+91 99999 99999"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-[13.5px] outline-none font-bold"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button 
                onClick={() => setEditingAddress(null)}
                className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-500 py-3 rounded-2xl text-[13.5px] font-black transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveAddress}
                className="flex-1 bg-[#FF6B00] hover:bg-[#e66000] text-white py-3 rounded-2xl text-[13.5px] font-black shadow-sm transition-colors"
              >
                Save Address
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RAZORPAY TEST PAYMENT GATEWAY POPUP MODAL */}
      {showRazorpay && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-[420px] shadow-2xl border border-gray-100 overflow-hidden flex flex-col relative animate-in fade-in zoom-in duration-200">
            
            {/* Razorpay Top Header strip */}
            <div className="flex justify-between items-center px-6 py-5 bg-gray-50/50 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[15px] tracking-tight text-gray-800">Razorpay Test Payment</span>
              </div>
              <button 
                onClick={() => setShowRazorpay(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-900 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" strokeWidth={2.5} />
              </button>
            </div>

            {/* Paying To box info */}
            <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100 bg-gray-50/10">
              <div>
                <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">Paying To</span>
                <span className="text-[14px] font-black text-gray-900">SliceSprint Foods Pvt. Ltd.</span>
                <span className="text-[10px] text-gray-400 block mt-1">Order ID: SS_ORD_84521</span>
              </div>
              <div className="text-right">
                <span className="text-xl sm:text-2xl font-black text-gray-900">₹{totalPayable}.00</span>
              </div>
            </div>

            {/* Choose Method labels */}
            <div className="p-4 bg-white">
              <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest block px-2 mb-3">Choose Payment Method</span>
              
              <div className="grid grid-cols-4 gap-2 border border-gray-100 p-1.5 rounded-2xl bg-gray-50/30">
                {[
                  { id: 'upi', label: 'UPI', icon: '⚡' },
                  { id: 'card', label: 'Card', icon: '💳' },
                  { id: 'netbanking', label: 'NetBanking', icon: '🏦' },
                  { id: 'wallet', label: 'Wallet', icon: '💼' }
                ].map((method) => {
                  const isActive = paymentTab === method.id;
                  return (
                    <button 
                      key={method.id}
                      onClick={() => setPaymentTab(method.id)}
                      className={`flex flex-col items-center justify-center py-2.5 rounded-xl border transition-all ${
                        isActive 
                          ? 'border-[#FF6B00] bg-orange-50/10 text-[#FF6B00] shadow-sm' 
                          : 'border-transparent bg-transparent text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      <span className="text-[17px] mb-1">{method.icon}</span>
                      <span className="text-[11px] font-black tracking-tight">{method.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interactive method sub-forms block */}
            <div className="px-6 pb-6 flex-grow">
              
              {/* TAB 1: UPI */}
              {paymentTab === 'upi' && (
                <div className="space-y-5">
                  <div>
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block mb-2">UPI ID</label>
                    <div className="flex items-center bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 focus-within:ring-2 focus-within:ring-orange-100 focus-within:border-[#FF6B00] transition-all">
                      <span className="text-gray-400 text-lg mr-3">⚡</span>
                      <input 
                        type="text" 
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="you@upi"
                        className="w-full bg-transparent border-none outline-none font-bold text-[14px] text-gray-800"
                      />
                      <span className="text-gray-400 text-xs font-black cursor-pointer ml-2">▼</span>
                    </div>
                  </div>

                  {/* Warning Test Gateway Alert Box */}
                  <div className="bg-[#FAF3E8]/80 border border-[#FAF3E8] rounded-2xl p-4 flex gap-3.5 items-start">
                    <span className="text-lg leading-none pt-0.5">ℹ</span>
                    <div className="text-left">
                      <span className="text-[12px] font-bold text-amber-900 block leading-tight mb-0.5">This is a test payment gateway.</span>
                      <span className="text-[10px] font-semibold text-amber-700/80 leading-normal block">No real transactions will be processed. Keep testing freely.</span>
                    </div>
                  </div>

                  {/* Large secured pay locked button */}
                  <button 
                    onClick={handlePaymentSuccess}
                    className="w-full bg-[#FF6B00] hover:bg-[#e66000] text-white py-4 rounded-2xl font-black text-[15px] shadow-md shadow-orange-500/10 hover:shadow-orange-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    <LockClosedIcon className="h-4.5 w-4.5 text-white" strokeWidth={3} />
                    Pay ₹{totalPayable}.00
                  </button>
                </div>
              )}

              {/* TAB 2: Card */}
              {paymentTab === 'card' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">Card Number</label>
                      <input 
                        type="text" 
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-[13.5px] outline-none font-bold"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">Expiry</label>
                        <input 
                           type="text" 
                           value={cardExpiry}
                           onChange={(e) => setCardExpiry(e.target.value)}
                           className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-[13.5px] outline-none font-bold text-center"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">CVV</label>
                        <input 
                          type="password" 
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-[13.5px] outline-none font-bold text-center"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Warning Test Gateway Alert Box */}
                  <div className="bg-[#FAF3E8]/80 border border-[#FAF3E8] rounded-2xl p-4 flex gap-3.5 items-start">
                    <span className="text-lg leading-none pt-0.5">ℹ</span>
                    <div className="text-left">
                      <span className="text-[12px] font-bold text-amber-900 block leading-tight mb-0.5">This is a test payment gateway.</span>
                      <span className="text-[10px] font-semibold text-amber-700/80 leading-normal block">No real transactions will be processed. Keep testing freely.</span>
                    </div>
                  </div>

                  <button 
                    onClick={handlePaymentSuccess}
                    className="w-full bg-[#FF6B00] hover:bg-[#e66000] text-white py-4 rounded-2xl font-black text-[15px] shadow-md shadow-orange-500/10 hover:shadow-orange-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    <LockClosedIcon className="h-4.5 w-4.5 text-white" strokeWidth={3} />
                    Pay ₹{totalPayable}.00
                  </button>
                </div>
              )}

              {/* TAB 3: NetBanking */}
              {paymentTab === 'netbanking' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <div>
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block mb-2">Select Bank</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'hdfc', name: 'HDFC Bank' },
                        { id: 'icici', name: 'ICICI Bank' },
                        { id: 'sbi', name: 'State Bank of India' },
                        { id: 'axis', name: 'Axis Bank' }
                      ].map((bank) => (
                        <button
                          key={bank.id}
                          onClick={() => setSelectedBank(bank.id)}
                          className={`py-3 rounded-2xl border text-[13px] font-black text-center transition-all ${
                            selectedBank === bank.id
                              ? 'border-[#FF6B00] bg-orange-50/10 text-[#FF6B00]'
                              : 'border-gray-100 bg-gray-50/30 text-gray-600 hover:border-gray-200'
                          }`}
                        >
                          {bank.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Warning Test Gateway Alert Box */}
                  <div className="bg-[#FAF3E8]/80 border border-[#FAF3E8] rounded-2xl p-4 flex gap-3.5 items-start">
                    <span className="text-lg leading-none pt-0.5">ℹ</span>
                    <div className="text-left">
                      <span className="text-[12px] font-bold text-amber-900 block leading-tight mb-0.5">This is a test payment gateway.</span>
                      <span className="text-[10px] font-semibold text-amber-700/80 leading-normal block">No real transactions will be processed. Keep testing freely.</span>
                    </div>
                  </div>

                  <button 
                    onClick={handlePaymentSuccess}
                    className="w-full bg-[#FF6B00] hover:bg-[#e66000] text-white py-4 rounded-2xl font-black text-[15px] shadow-md shadow-orange-500/10 hover:shadow-orange-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    <LockClosedIcon className="h-4.5 w-4.5 text-white" strokeWidth={3} />
                    Pay ₹{totalPayable}.00
                  </button>
                </div>
              )}

              {/* TAB 4: Wallet */}
              {paymentTab === 'wallet' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <div>
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block mb-2">Select Wallet</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'phonepe', name: 'PhonePe' },
                        { id: 'paytm', name: 'Paytm' },
                        { id: 'mobikwik', name: 'MobiKwik' }
                      ].map((wallet) => (
                        <button
                          key={wallet.id}
                          onClick={() => setSelectedWallet(wallet.id)}
                          className={`py-3.5 rounded-2xl border text-[13px] font-black text-center transition-all ${
                            selectedWallet === wallet.id
                              ? 'border-[#FF6B00] bg-orange-50/10 text-[#FF6B00]'
                              : 'border-gray-100 bg-gray-50/30 text-gray-600 hover:border-gray-200'
                          }`}
                        >
                          {wallet.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Warning Test Gateway Alert Box */}
                  <div className="bg-[#FAF3E8]/80 border border-[#FAF3E8] rounded-2xl p-4 flex gap-3.5 items-start">
                    <span className="text-lg leading-none pt-0.5">ℹ</span>
                    <div className="text-left">
                      <span className="text-[12px] font-bold text-amber-900 block leading-tight mb-0.5">This is a test payment gateway.</span>
                      <span className="text-[10px] font-semibold text-amber-700/80 leading-normal block">No real transactions will be processed. Keep testing freely.</span>
                    </div>
                  </div>

                  <button 
                    onClick={handlePaymentSuccess}
                    className="w-full bg-[#FF6B00] hover:bg-[#e66000] text-white py-4 rounded-2xl font-black text-[15px] shadow-md shadow-orange-500/10 hover:shadow-orange-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    <LockClosedIcon className="h-4.5 w-4.5 text-white" strokeWidth={3} />
                    Pay ₹{totalPayable}.00
                  </button>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

      {toast && <Toast message={toast} type="success" onClose={() => setToast(null)} />}
    </div>
  );
};

export default CheckoutPage;
