import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Toast from '../../components/ui/Toast';
import { 
  CheckIcon, 
  ChevronDownIcon, 
  StarIcon, 
  PhoneIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/solid';
import { fetchMyOrders } from '../../features/order/orderSlice';

const HIGH_FIDELITY_ORDERS = [
  {
    id: 'SS_ORD_84521',
    date: 'May 11, 2024 • 07:45 PM',
    status: 'Delivered',
    statusColor: 'text-green-600 bg-green-50',
    itemCount: 3,
    total: 437,
    itemsList: [
      { name: 'Veggie Delight Pizza', details: 'Regular | Classic Crust', qty: 1, price: 249, image: '/images/Signature_Veg_Pizzas/Veg_Extravaganza.jpg' },
      { name: 'Garlic Bread', details: 'Cheesy Garlic Bread', qty: 1, price: 148, image: '/images/Garlic_Breads_and_Sides/Cheese_Garlic_Bread.jpg' },
      { name: 'Coke (500ml)', details: 'Chilled Soft Drink', qty: 1, price: 40, image: '/images/Beverages/Coco_cola.jpg' }
    ],
    payment: 'Online',
    tracking: [
      { status: 'ORDER_RECEIVED', date: 'May 11, 2024 • 07:02 PM', desc: 'Your order has been received.', state: 'completed' },
      { status: 'IN_KITCHEN', date: 'May 11, 2024 • 07:08 PM', desc: 'Your order has been prepared.', state: 'completed' },
      { status: 'SENT_TO_DELIVERY', date: 'May 11, 2024 • 07:20 PM', desc: 'Your order is on the way.', state: 'completed' },
      { status: 'DELIVERED', date: 'May 11, 2024 • 07:45 PM', desc: 'Your order was successfully delivered.', state: 'completed' }
    ],
    driver: { name: 'Rahul Sharma', rating: 4.8, status: 'Delivered', phone: '+91 98765 43210', avatar: 'https://i.pravatar.cc/100?img=11' },
    map: { minutes: 'Delivered', distance: '0 km', active: false },
    updates: [
      { time: '07:45 PM', text: 'Your order has been delivered successfully. Enjoy your hot food!' },
      { time: '07:20 PM', text: 'Your order has been picked up by Rahul Sharma.' },
      { time: '07:08 PM', text: 'Your order is being prepared in the kitchen.' }
    ]
  },
  {
    id: 'SS_ORD_83567',
    date: 'May 09, 2024 • 01:20 PM',
    status: 'In Transit',
    statusColor: 'text-[#FF6B00] bg-orange-50',
    itemCount: 2,
    total: 349,
    itemsList: [
      { name: 'Pepperoni Feast Pizza', details: 'Regular | Classic Crust', qty: 1, price: 249, image: '/images/Signature_Non-Veg_Pizzas/Chicken_Pepperoni_Feast.jpg' },
      { name: 'Cheesy Garlic Bread', details: 'Garlic Bread', qty: 1, price: 79, image: '/images/Garlic_Breads_and_Sides/Cheese_Garlic_Bread.jpg' },
      { name: 'Coke (500ml)', details: 'Chilled Soft Drink', qty: 1, price: 21, image: '/images/Beverages/Coco_cola.jpg' }
    ],
    payment: 'Online',
    tracking: [
      { status: 'ORDER_RECEIVED', date: 'May 09, 2024 • 01:20 PM', desc: 'Your order has been received.', state: 'completed' },
      { status: 'IN_KITCHEN', date: 'May 09, 2024 • 01:24 PM', desc: 'Your order is being prepared.', state: 'completed' },
      { status: 'SENT_TO_DELIVERY', date: 'May 09, 2024 • 01:45 PM', desc: 'Your order is on the way.', state: 'active' },
      { status: 'DELIVERED', date: 'Estimated: 02:05 PM', desc: 'Your order will be delivered soon.', state: 'pending' }
    ],
    driver: { name: 'Rahul Sharma', rating: 4.8, status: 'On the way', phone: '+91 98765 43210', avatar: 'https://i.pravatar.cc/100?img=11' },
    map: { minutes: '8 mins away', distance: '1.2 km', active: true },
    updates: [
      { time: '01:45 PM', text: 'Your order has been picked up by Rahul Sharma.' },
      { time: '01:24 PM', text: 'Your order is being prepared in the kitchen.' }
    ]
  },
  {
    id: 'SS_ORD_82410',
    date: 'May 07, 2024 • 08:10 PM',
    status: 'Delivered',
    statusColor: 'text-green-600 bg-green-50',
    itemCount: 4,
    total: 528,
    itemsList: [
      { name: 'Meat Lover Pizza', details: 'Pan Crust | Double Cheese', qty: 1, price: 399, image: '/images/Signature_Non-Veg_Pizzas/Meat_Lovers_Special.jpg' },
      { name: 'Farmhouse Pizza', details: 'Thin Crust', qty: 1, price: 129, image: '/images/Signature_Veg_Pizzas/Farmhouse_Supreme.jpg' }
    ],
    payment: 'Cash on Delivery',
    tracking: [
      { status: 'ORDER_RECEIVED', date: 'May 07, 2024 • 07:30 PM', desc: 'Your order has been received.', state: 'completed' },
      { status: 'IN_KITCHEN', date: 'May 07, 2024 • 07:35 PM', desc: 'Your order is being prepared.', state: 'completed' },
      { status: 'SENT_TO_DELIVERY', date: 'May 07, 2024 • 07:50 PM', desc: 'Your order is on the way.', state: 'completed' },
      { status: 'DELIVERED', date: 'May 07, 2024 • 08:10 PM', desc: 'Your order was successfully delivered.', state: 'completed' }
    ],
    driver: { name: 'Amit Kumar', rating: 4.7, status: 'Delivered', phone: '+91 99999 88888', avatar: 'https://i.pravatar.cc/100?img=12' },
    map: { minutes: 'Delivered', distance: '0 km', active: false },
    updates: [
      { time: '08:10 PM', text: 'Order delivered successfully. Cash payment received.' },
      { time: '07:50 PM', text: 'Order picked up by Amit Kumar.' }
    ]
  },
  {
    id: 'SS_ORD_81239',
    date: 'May 05, 2024 • 06:30 PM',
    status: 'Cancelled',
    statusColor: 'text-red-600 bg-red-50',
    itemCount: 1,
    total: 259,
    itemsList: [
      { name: 'Margherita Pizza', details: 'Thin Crust', qty: 1, price: 199, image: '/images/Signature_Veg_Pizzas/Margherita_Classic.jpg' },
      { name: 'Garlic Bread', details: 'Classic Garlic Bread', qty: 1, price: 60, image: '/images/Garlic_Breads_and_Sides/Garlic_Breadsticks.jpg' }
    ],
    payment: 'Online Refunded',
    tracking: [
      { status: 'ORDER_RECEIVED', date: 'May 05, 2024 • 06:30 PM', desc: 'Your order has been received.', state: 'completed' },
      { status: 'CANCELLED', date: 'May 05, 2024 • 06:35 PM', desc: 'Your order was cancelled by customer.', state: 'cancelled' }
    ],
    driver: null,
    map: { minutes: 'Cancelled', distance: '0 km', active: false },
    updates: [
      { time: '06:35 PM', text: 'Order cancelled by customer. Online refund initiated successfully.' }
    ]
  },
  {
    id: 'SS_ORD_80311',
    date: 'May 03, 2024 • 12:15 PM',
    status: 'Delivered',
    statusColor: 'text-green-600 bg-green-50',
    itemCount: 2,
    total: 199,
    itemsList: [
      { name: 'Veggie Delight Pizza', details: 'Classic Crust', qty: 1, price: 199, image: '/images/Signature_Veg_Pizzas/Veg_Extravaganza.jpg' }
    ],
    payment: 'Online',
    tracking: [
      { status: 'ORDER_RECEIVED', date: 'May 03, 2024 • 11:45 AM', desc: 'Your order has been received.', state: 'completed' },
      { status: 'IN_KITCHEN', date: 'May 03, 2024 • 11:50 AM', desc: 'Your order is being prepared.', state: 'completed' },
      { status: 'SENT_TO_DELIVERY', date: 'May 03, 2024 • 12:00 PM', desc: 'Your order is on the way.', state: 'completed' },
      { status: 'DELIVERED', date: 'May 03, 2024 • 12:15 PM', desc: 'Your order was successfully delivered.', state: 'completed' }
    ],
    driver: { name: 'Vikram Singh', rating: 4.6, status: 'Delivered', phone: '+91 99999 77777', avatar: 'https://i.pravatar.cc/100?img=13' },
    map: { minutes: 'Delivered', distance: '0 km', active: false },
    updates: [
      { time: '12:15 PM', text: 'Order delivered successfully by Vikram Singh.' }
    ]
  }
];

const mapDbOrderToUiOrder = (dbOrder) => {
  const statusMapping = {
    'ORDER_RECEIVED': { label: 'Order Placed', color: 'text-blue-600 bg-blue-50' },
    'IN_KITCHEN': { label: 'In Kitchen', color: 'text-amber-600 bg-amber-50' },
    'SENT_TO_DELIVERY': { label: 'In Transit', color: 'text-[#FF6B00] bg-orange-50' },
    'DELIVERED': { label: 'Delivered', color: 'text-green-600 bg-green-50' },
    'CANCELLED': { label: 'Cancelled', color: 'text-red-600 bg-red-50' }
  };
  
  const statusInfo = statusMapping[dbOrder.status] || { label: dbOrder.status, color: 'text-gray-600 bg-gray-50' };
  
  // Format Date
  const dateObj = new Date(dbOrder.createdAt);
  const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) + ' • ' + 
                       dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  const itemsList = dbOrder.items.map(item => {
    if (item.isCustom) {
      const cfg = item.pizzaConfig || {};
      const detailsArray = [
        cfg.base?.name,
        cfg.sauce?.name,
        cfg.cheese?.name
      ].filter(Boolean);
      return {
        name: 'Custom Pizza',
        details: detailsArray.length > 0 ? detailsArray.join(' | ') : 'Custom Crust & Toppings',
        qty: item.quantity,
        price: item.price,
        image: '/images/Crust/Classic_Hand_Tossed.jpg'
      };
    } else {
      const pizza = item.pizzaId || {};
      return {
        name: pizza.name || 'Signature Pizza',
        details: pizza.description || 'Delicious oven-baked pizza',
        qty: item.quantity,
        price: item.price,
        image: pizza.image || '/images/Signature_Veg_Pizzas/Veg_Extravaganza.jpg'
      };
    }
  });

  // Dynamic tracking steps state
  const orderStatus = dbOrder.status;
  const tracking = [
    { 
      status: 'Order Placed', 
      date: formattedDate, 
      desc: 'Your order has been received.', 
      state: 'completed' 
    },
    { 
      status: 'In Kitchen', 
      date: orderStatus === 'ORDER_RECEIVED' ? 'Pending' : formattedDate, 
      desc: 'Your order is being prepared in the kitchen.', 
      state: orderStatus === 'ORDER_RECEIVED' ? 'pending' : (orderStatus === 'IN_KITCHEN' ? 'active' : 'completed') 
    },
    { 
      status: 'In Transit', 
      date: ['ORDER_RECEIVED', 'IN_KITCHEN'].includes(orderStatus) ? 'Pending' : formattedDate, 
      desc: 'Your order is on the way.', 
      state: ['ORDER_RECEIVED', 'IN_KITCHEN'].includes(orderStatus) ? 'pending' : (orderStatus === 'SENT_TO_DELIVERY' ? 'active' : 'completed') 
    },
    { 
      status: 'Delivered', 
      date: orderStatus === 'DELIVERED' ? formattedDate : 'Estimated: 30 mins', 
      desc: 'Your order has been successfully delivered.', 
      state: orderStatus === 'DELIVERED' ? 'completed' : 'pending' 
    }
  ];

  if (orderStatus === 'CANCELLED') {
    tracking[1] = { status: 'Cancelled', date: formattedDate, desc: 'Your order was cancelled.', state: 'cancelled' };
    tracking.splice(2); // remove subsequent steps
  }

  // Driver details
  let driver = null;
  if (['SENT_TO_DELIVERY', 'DELIVERED'].includes(orderStatus)) {
    driver = {
      name: 'Rahul Sharma',
      rating: 4.8,
      status: orderStatus === 'DELIVERED' ? 'Delivered' : 'On the way',
      phone: '+91 98765 43210',
      avatar: 'https://i.pravatar.cc/100?img=11'
    };
  }

  // Map Details
  const map = {
    minutes: orderStatus === 'DELIVERED' ? 'Delivered' : '8 mins away',
    distance: orderStatus === 'DELIVERED' ? '0 km' : '1.2 km',
    active: orderStatus === 'SENT_TO_DELIVERY'
  };

  // Updates Feed Log
  const updates = [];
  updates.push({ time: dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }), text: 'Your order has been placed successfully.' });
  if (['IN_KITCHEN', 'SENT_TO_DELIVERY', 'DELIVERED'].includes(orderStatus)) {
    updates.unshift({ time: dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }), text: 'Your order is being prepared in the kitchen.' });
  }
  if (['SENT_TO_DELIVERY', 'DELIVERED'].includes(orderStatus)) {
    updates.unshift({ time: dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }), text: 'Your order has been picked up by Rahul Sharma.' });
  }
  if (orderStatus === 'DELIVERED') {
    updates.unshift({ time: dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }), text: 'Your order has been delivered successfully. Enjoy your hot food!' });
  }
  if (orderStatus === 'CANCELLED') {
    updates.unshift({ time: dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }), text: 'Order cancelled. Refund initiated if paid online.' });
  }

  return {
    id: 'SS_ORD_' + dbOrder._id.toString().substring(18).toUpperCase(),
    date: formattedDate,
    status: statusInfo.label,
    statusColor: statusInfo.color,
    itemCount: dbOrder.items.reduce((sum, item) => sum + item.quantity, 0),
    total: dbOrder.totalAmount,
    itemsList,
    payment: dbOrder.paymentStatus === 'PAID' ? 'Online' : 'Cash on Delivery',
    tracking,
    driver,
    map,
    updates,
    rawId: dbOrder._id
  };
};

const OrdersPage = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('order-history'); // 'order-history', 'live-tracking'
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [toast, setToast] = useState(null);

  const { orders: dbOrders, isLoading } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  // Combine DB orders mapped to UI + mock fallback orders if DB is empty
  const ordersList = React.useMemo(() => {
    const mapped = (dbOrders || []).map(mapDbOrderToUiOrder);
    if (mapped.length === 0) {
      return HIGH_FIDELITY_ORDERS;
    }
    return mapped;
  }, [dbOrders]);

  // Set default selected order ID if not already selected
  useEffect(() => {
    if (ordersList.length > 0 && !selectedOrderId) {
      setSelectedOrderId(ordersList[0].id);
    }
  }, [ordersList, selectedOrderId]);

  // Retrieve the selected order object
  const currentOrder = ordersList.find(o => o.id === selectedOrderId) || ordersList[0] || HIGH_FIDELITY_ORDERS[1];

  const handleOrderClick = (id) => {
    setSelectedOrderId(id);
    setToast(`Showing details for Order #${id}`);
  };

  const handleReorder = () => {
    setToast('Reordering your favorites! Items added to cart.');
  };

  const handleContactSupport = () => {
    setToast('Connecting you with SliceSprint support...');
  };

  const handleCallDriver = (name) => {
    setToast(`Calling delivery partner ${name}...`);
  };

  return (
    <div className="bg-white min-h-screen pb-16 font-sans">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Tabs Header */}
        <div className="flex border-b border-gray-100 mt-4 mb-8">
          <button 
            onClick={() => setActiveTab('order-history')}
            className={`px-6 py-3.5 text-[14.5px] font-black tracking-wide border-b-3 transition-all ${
              activeTab === 'order-history' 
                ? 'border-[#FF6B00] text-[#FF6B00]' 
                : 'border-transparent text-gray-400 hover:text-gray-900'
            }`}
          >
            Order History
          </button>
          <button 
            onClick={() => setActiveTab('live-tracking')}
            className={`px-6 py-3.5 text-[14.5px] font-black tracking-wide border-b-3 transition-all ${
              activeTab === 'live-tracking' 
                ? 'border-[#FF6B00] text-[#FF6B00]' 
                : 'border-transparent text-gray-400 hover:text-gray-900'
            }`}
          >
            Live Tracking
          </button>
        </div>

        {/* Double Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Your Orders sidebar list & promos (5/12 width) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Your Orders box */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-[0_15px_40px_rgba(0,0,0,0.015)]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[18px] sm:text-[20px] font-black text-gray-900 tracking-tight">Your Orders</h2>
                <div className="relative">
                  <select className="appearance-none bg-gray-50 border border-gray-100 text-gray-700 text-[12px] font-extrabold py-1.5 pl-3 pr-8 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 cursor-pointer">
                    <option>All Orders</option>
                    <option>Active</option>
                    <option>Delivered</option>
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none stroke-[2.5]" />
                </div>
              </div>

              {/* Orders flex stack list */}
              <div className="space-y-4">
                {ordersList.map((order) => {
                  const isSelected = selectedOrderId === order.id;
                  return (
                    <div 
                      key={order.id}
                      onClick={() => handleOrderClick(order.id)}
                      className={`cursor-pointer rounded-2xl p-4 border-2 transition-all flex gap-4 ${
                        isSelected 
                          ? 'border-[#FF6B00] bg-orange-50/5 shadow-sm' 
                          : 'border-gray-100 hover:border-gray-200 bg-white'
                      }`}
                    >
                      {/* Left circular/rounded image of the first item in the order */}
                      <div className="h-16 w-16 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0">
                        <img 
                          src={order.itemsList[0]?.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=150&q=80'} 
                          alt={order.id} 
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* Detail details */}
                      <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[14px] font-black text-gray-900 truncate">{order.id}</span>
                          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wide ${order.statusColor}`}>
                            {order.status}
                          </span>
                        </div>
                        <span className="text-[11.5px] font-semibold text-gray-400 block mb-1">{order.date}</span>
                        <div className="flex justify-between items-center mt-2.5">
                          <span className="text-[12px] font-bold text-gray-400">{order.itemCount} {order.itemCount === 1 ? 'Item' : 'Items'}</span>
                          <span className="text-[14px] font-black text-gray-950">₹{order.total}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Load More button */}
              <button className="w-full mt-5 border border-[#FF6B00] text-[#FF6B00] bg-transparent hover:bg-orange-50/15 py-3 rounded-2xl text-[13px] font-black transition-all active:scale-95">
                Load More Orders
              </button>
            </div>

            {/* Promo Reorder card */}
            <div className="bg-[#FAF3E8]/80 border border-[#FAF3E8] rounded-3xl p-6 flex flex-row items-center justify-between gap-4 overflow-hidden relative shadow-[0_8px_30px_rgba(0,0,0,0.01)] group">
              <div className="z-10 w-[60%] flex flex-col justify-center">
                <h3 className="text-[17px] font-black text-gray-900 tracking-tight mb-1">Love our food?</h3>
                <p className="text-[11.5px] font-bold text-gray-500 mb-4 leading-normal">Reorder your favorites in one click!</p>
                <button 
                  onClick={handleReorder}
                  className="bg-[#FF6B00] hover:bg-[#e66000] text-white px-5 py-2.5 rounded-2xl font-black text-[12px] shadow-sm active:scale-95 transition-all self-start"
                >
                  Reorder Now
                </button>
              </div>
              <div className="w-[40%] h-full flex items-center justify-end relative">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png" 
                  alt="Promo food bag" 
                  className="w-24 h-24 object-contain opacity-90 group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
            </div>

            {/* Need Help support card */}
            <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-[0_15px_40px_rgba(0,0,0,0.01)] flex items-center gap-5">
              <div className="h-12 w-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 text-xl font-bold flex-shrink-0 shadow-inner">
                🎧
              </div>
              <div className="flex-grow">
                <h4 className="text-[14px] font-black text-gray-900 tracking-tight">Need Help?</h4>
                <p className="text-[11.5px] font-semibold text-gray-400">We're here for you</p>
              </div>
              <button 
                onClick={handleContactSupport}
                className="border border-gray-200 text-gray-700 hover:border-gray-300 bg-transparent px-5 py-2.5 rounded-2xl text-[12px] font-black transition-all active:scale-95"
              >
                Contact Support
              </button>
            </div>

          </div>

          {/* RIGHT COLUMN: Order Details, Stepped Timeline, Delivery partner, Maps & Socket Feeds (7/12 width) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Order Details box */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-[0_15px_40px_rgba(0,0,0,0.015)]">
              <div className="flex justify-between items-start border-b border-gray-50 pb-4 mb-4">
                <div>
                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">Order ID</span>
                  <span className="text-[18px] font-black text-gray-950 block tracking-tight">{currentOrder.id}</span>
                  <span className="text-[11.5px] font-semibold text-gray-400 block mt-0.5">{currentOrder.date}</span>
                </div>
                <div className="text-right">
                  <span className={`text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wide block ${currentOrder.statusColor} mb-2`}>
                    {currentOrder.status}
                  </span>
                  <span className="text-[12px] font-bold text-gray-400 block">Payment: <strong className="text-gray-900 font-extrabold">{currentOrder.payment}</strong></span>
                  <span className="text-[12px] font-bold text-gray-400 block mt-0.5">Total: <strong className="text-[#FF6B00] font-black text-[14.5px]">₹{currentOrder.total}</strong></span>
                </div>
              </div>

              {/* Items lists */}
              <div className="space-y-3.5">
                {currentOrder.itemsList.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-gray-50/20 rounded-2xl p-3 border border-gray-50/50">
                    <div className="h-12 w-12 rounded-xl overflow-hidden border border-gray-100 bg-white flex-shrink-0">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="text-[13px] font-black text-gray-900 truncate leading-tight mb-0.5">{item.name}</h4>
                      <p className="text-[11px] font-semibold text-gray-400 leading-normal">{item.details}</p>
                    </div>
                    <div className="text-right flex-shrink-0 flex flex-row items-center gap-6">
                      <span className="text-[12px] font-bold text-gray-400">{item.qty}</span>
                      <span className="text-[13.5px] font-black text-gray-900">₹{item.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Tracking Status Timeline */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-[0_15px_40px_rgba(0,0,0,0.015)]">
              <h3 className="text-[16px] sm:text-[17px] font-black text-gray-900 tracking-tight mb-6">Live Tracking</h3>
              
              <div className="relative pl-8 space-y-8">
                {/* Vertical connecting line */}
                <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-gray-100"></div>

                {currentOrder.tracking.map((track, trackIdx) => {
                  let circleColor = 'border-gray-200 bg-white text-gray-300';
                  let textColor = 'text-gray-400';
                  let checkIcon = null;

                  if (track.state === 'completed') {
                    circleColor = 'border-[#22C55E] bg-[#22C55E] text-white shadow-sm';
                    textColor = 'text-gray-800';
                    checkIcon = <CheckIcon className="w-3.5 h-3.5 text-white stroke-[3.5]" />;
                  } else if (track.state === 'active') {
                    circleColor = 'border-[#FF6B00] bg-white text-[#FF6B00] ring-4 ring-orange-50 shadow-sm';
                    textColor = 'text-gray-900';
                    checkIcon = <div className="h-2 w-2 rounded-full bg-[#FF6B00]" />;
                  } else if (track.state === 'cancelled') {
                    circleColor = 'border-red-500 bg-red-500 text-white shadow-sm';
                    textColor = 'text-gray-800';
                    checkIcon = <span className="text-[10px] font-black">X</span>;
                  }

                  return (
                    <div key={trackIdx} className="relative flex flex-col md:flex-row md:items-center justify-between gap-2.5 group">
                      {/* Stepper node circle */}
                      <div className={`absolute -left-10 h-6 w-6 rounded-full border-2 flex items-center justify-center z-10 transition-all ${circleColor}`}>
                        {checkIcon}
                      </div>

                      {/* Details text */}
                      <div className="text-left">
                        <span className={`text-[13px] font-black tracking-wide block ${
                          track.state === 'active' ? 'text-[#FF6B00]' : textColor
                        }`}>
                          {track.status}
                        </span>
                        <span className="text-[11.5px] font-medium text-gray-400 block mt-0.5">{track.desc}</span>
                      </div>

                      {/* Date details */}
                      <div className="md:text-right flex-shrink-0">
                        <span className="text-[11px] font-bold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-md">
                          {track.date}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delivery Partner details card */}
            {currentOrder.driver && (
              <div className="bg-[#FFFDFB] border border-orange-100/50 rounded-3xl p-5 shadow-[0_15px_40px_rgba(0,0,0,0.01)] flex items-center gap-4">
                <div className="h-12 w-12 rounded-full overflow-hidden border border-orange-100 flex-shrink-0 shadow-sm">
                  <img src={currentOrder.driver.avatar} alt={currentOrder.driver.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex-grow min-w-0">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">Delivery Partner</span>
                  <div className="flex items-center gap-2">
                    <h4 className="text-[14px] font-black text-gray-900 truncate leading-none">{currentOrder.driver.name}</h4>
                    <div className="flex items-center gap-0.5 bg-yellow-50 px-1.5 py-0.5 rounded text-[10px] font-black text-yellow-700">
                      <StarIcon className="w-3 h-3 text-yellow-400" />
                      <span>{currentOrder.driver.rating}</span>
                    </div>
                  </div>
                  <span className="text-[11.5px] font-bold text-[#FF6B00] block mt-1">{currentOrder.driver.status}</span>
                </div>
                <button 
                  onClick={() => handleCallDriver(currentOrder.driver.name)}
                  className="h-10 w-10 bg-[#FF6B00] hover:bg-[#e66000] text-white rounded-full flex items-center justify-center shadow-md shadow-orange-500/10 active:scale-90 transition-all flex-shrink-0"
                >
                  <PhoneIcon className="w-4.5 h-4.5 text-white" strokeWidth={3} />
                </button>
              </div>
            )}

            {/* Map / Route Tracking Card */}
            {currentOrder.map && currentOrder.driver && (
              <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.015)] relative h-[220px]">
                {/* Real-looking SVG grid route mockup */}
                <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
                  <svg className="w-full h-[150%] object-cover opacity-80" preserveAspectRatio="none" viewBox="0 0 400 200">
                    {/* Grid Lines */}
                    <path d="M 0,20 L 400,20 M 0,60 L 400,60 M 0,100 L 400,100 M 0,140 L 400,140 M 0,180 L 400,180" fill="none" stroke="#E2E8F0" strokeWidth="1" />
                    <path d="M 40,0 L 40,200 M 120,0 L 120,200 M 200,0 L 200,200 M 280,0 L 280,200 M 360,0 L 360,200" fill="none" stroke="#E2E8F0" strokeWidth="1" />
                    
                    {/* Map roads paths */}
                    <path d="M 50,150 Q 150,170 200,100 T 350,70" fill="none" stroke="#CBD5E1" strokeWidth="8" strokeLinecap="round" />
                    
                    {/* Highlighted Driver route path */}
                    {currentOrder.map.active ? (
                      <path d="M 50,150 Q 150,170 200,100" fill="none" stroke="#FF6B00" strokeWidth="4" strokeLinecap="round" strokeDasharray="6 6" />
                    ) : (
                      <path d="M 50,150 Q 150,170 200,100 T 350,70" fill="none" stroke="#22C55E" strokeWidth="4" strokeLinecap="round" />
                    )}

                    {/* Source Driver Pin (Scooter or Circle) */}
                    {currentOrder.map.active ? (
                      <circle cx="200" cy="100" r="10" fill="#FF6B00" className="animate-ping" />
                    ) : null}
                    <circle cx={currentOrder.map.active ? "200" : "350"} cy={currentOrder.map.active ? "100" : "70"} r="7" fill={currentOrder.map.active ? "#FF6B00" : "#22C55E"} />
                    <circle cx={currentOrder.map.active ? "200" : "350"} cy={currentOrder.map.active ? "100" : "70"} r="3" fill="white" />
                    
                    {/* Destination Pin */}
                    <circle cx="50" cy="150" r="7" fill="#EF4444" />
                    <circle cx="50" cy="150" r="3" fill="white" />
                  </svg>
                </div>

                {/* Scooter Overlay Banner */}
                {currentOrder.map.active && (
                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm border border-gray-100 rounded-2xl px-4 py-3 shadow-lg flex items-center gap-3.5 animate-bounce duration-1000">
                    <span className="text-2xl">🛵</span>
                    <div className="text-left">
                      <span className="text-[13px] font-black text-gray-900 block leading-tight">{currentOrder.map.minutes}</span>
                      <span className="text-[10px] font-bold text-gray-400 block mt-0.5">{currentOrder.map.distance}</span>
                    </div>
                  </div>
                )}

                {/* Destination banner if delivered */}
                {!currentOrder.map.active && (
                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm border border-gray-100 rounded-2xl px-4 py-3 shadow-lg flex items-center gap-3.5">
                    <span className="text-2xl">📍</span>
                    <div className="text-left">
                      <span className="text-[13px] font-black text-gray-900 block leading-tight">{currentOrder.status}</span>
                      <span className="text-[10px] font-bold text-gray-400 block mt-0.5">MG Road, Bengaluru</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Live Updates socket feed logs */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-[0_15px_40px_rgba(0,0,0,0.015)]">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-[15px] sm:text-[16px] font-black text-gray-900 tracking-tight">Live Updates</h3>
                <div className="flex items-center gap-1.5 text-green-500 font-extrabold text-[12px]">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span>Socket connected</span>
                </div>
              </div>

              {/* Feed lists */}
              <div className="space-y-4">
                {currentOrder.updates.map((upd, updIdx) => (
                  <div key={updIdx} className="flex gap-4 items-start bg-gray-50/40 rounded-2xl p-3.5 border border-gray-50/40">
                    <span className="text-[11.5px] font-bold text-gray-400 bg-white border border-gray-100 px-2 py-0.5 rounded shadow-sm flex-shrink-0">
                      {upd.time}
                    </span>
                    <p className="text-[12.5px] font-semibold text-gray-600 text-left leading-normal flex-grow">
                      {upd.text}
                    </p>
                    <span className="h-5 w-5 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckIcon className="w-3 h-3 text-[#22C55E] stroke-[3]" />
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {toast && <Toast message={toast} type="success" onClose={() => setToast(null)} />}
    </div>
  );
};

export default OrdersPage;
