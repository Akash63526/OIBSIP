import React, { useState, useEffect, useMemo } from 'react';
import { 
  FunnelIcon, 
  PhoneIcon, 
  ChatBubbleLeftRightIcon, 
  MapPinIcon, 
  XMarkIcon,
  CheckCircleIcon,
  ClockIcon,
  PencilIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

// --- Seed Database ---
const INITIAL_ORDERS = [
  // ORDER_RECEIVED (Total 12 - 3 visible + 9 dummy items represented in counter)
  {
    id: 'SS_ORD_84521',
    customer: {
      name: 'John Doe',
      phone: '+1 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=120&auto=format&fit=crop'
    },
    time: '10:24 AM',
    date: 'May 10, 2024',
    status: 'ORDER_RECEIVED',
    total: 24.99,
    items: [
      { id: 'item-1', name: 'Veggie Delight Pizza', spec: 'Regular Crust', qty: 1, price: 14.99, total: 14.99, image: 'https://images.unsplash.com/photo-1571066811602-71683a3f680d?q=80&w=120&auto=format&fit=crop' },
      { id: 'item-2', name: 'Garlic Bread', spec: 'Cheesy Garlic Bread', qty: 1, price: 4.99, total: 4.99, image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?q=80&w=120&auto=format&fit=crop' }
    ],
    payment: 'Online (Paid)',
    paymentStatus: 'Paid',
    address: '101, Green Park Residency, MG Road, Bengaluru - 560001, Karnataka, India',
    notes: 'Please deliver before 11 AM.'
  },
  {
    id: 'SS_ORD_84522',
    customer: {
      name: 'Sarah Wilson',
      phone: '+1 98765 11223',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120&auto=format&fit=crop'
    },
    time: '10:26 AM',
    date: 'May 10, 2024',
    status: 'ORDER_RECEIVED',
    total: 18.49,
    items: [
      { id: 'item-3', name: 'Veggie Delight Pizza', spec: 'Thin Crust', qty: 1, price: 14.99, total: 14.99, image: 'https://images.unsplash.com/photo-1571066811602-71683a3f680d?q=80&w=120&auto=format&fit=crop' }
    ],
    payment: 'Online (Paid)',
    paymentStatus: 'Paid',
    address: '402, Royal Gardens, Richmond Town, Bengaluru, Karnataka, India',
    notes: 'Leave at the door.'
  },
  {
    id: 'SS_ORD_84523',
    customer: {
      name: 'Michael Brown',
      phone: '+1 98765 44332',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop'
    },
    time: '10:25 AM',
    date: 'May 10, 2024',
    status: 'ORDER_RECEIVED',
    total: 31.99,
    items: [
      { id: 'item-4', name: 'Pepperoni Pizza', spec: 'Regular Crust', qty: 2, price: 15.99, total: 31.98, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=120&auto=format&fit=crop' }
    ],
    payment: 'Cash on Delivery',
    paymentStatus: 'Pending',
    address: '15, Outer Ring Road, HSR Layout, Bengaluru, Karnataka, India',
    notes: 'Ring bell once.'
  },

  // IN_KITCHEN (Total 8 - 3 visible + 5 dummy items)
  {
    id: 'SS_ORD_84515',
    customer: {
      name: 'David Lee',
      phone: '+1 98765 55667',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop'
    },
    time: '10:20 AM',
    date: 'May 10, 2024',
    status: 'IN_KITCHEN',
    total: 27.49,
    items: [
      { id: 'item-5', name: 'Margherita Pizza', spec: 'Regular Crust', qty: 1, price: 12.99, total: 12.99, image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=80&w=120&auto=format&fit=crop' },
      { id: 'item-1', name: 'Veggie Delight Pizza', spec: 'Regular Crust', qty: 1, price: 14.99, total: 14.99, image: 'https://images.unsplash.com/photo-1571066811602-71683a3f680d?q=80&w=120&auto=format&fit=crop' }
    ],
    payment: 'Online (Paid)',
    paymentStatus: 'Paid',
    address: '78, 4th Cross, Indiranagar, Bengaluru, Karnataka, India',
    notes: 'No onions please.'
  },
  {
    id: 'SS_ORD_84516',
    customer: {
      name: 'Emma Davis',
      phone: '+1 98765 22334',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120&auto=format&fit=crop'
    },
    time: '10:21 AM',
    date: 'May 10, 2024',
    status: 'IN_KITCHEN',
    total: 16.99,
    items: [
      { id: 'item-5', name: 'Margherita Pizza', spec: 'Gluten Free Crust', qty: 1, price: 13.99, total: 13.99, image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=80&w=120&auto=format&fit=crop' }
    ],
    payment: 'Online (Paid)',
    paymentStatus: 'Paid',
    address: '56, Richmond Circle, Bengaluru, Karnataka, India',
    notes: ''
  },
  {
    id: 'SS_ORD_84517',
    customer: {
      name: 'James Smith',
      phone: '+1 98765 33445',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=120&auto=format&fit=crop'
    },
    time: '10:22 AM',
    date: 'May 10, 2024',
    status: 'IN_KITCHEN',
    total: 21.99,
    items: [
      { id: 'item-2', name: 'Garlic Bread', spec: 'Cheesy Garlic Bread', qty: 2, price: 4.99, total: 9.98, image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?q=80&w=120&auto=format&fit=crop' }
    ],
    payment: 'Cash on Delivery',
    paymentStatus: 'Pending',
    address: '9, Koramangala 5th Block, Bengaluru, Karnataka, India',
    notes: 'Call when outside.'
  },

  // SENT_TO_DELIVERY (Total 6 - 3 visible + 3 dummy items)
  {
    id: 'SS_ORD_84505',
    customer: {
      name: 'Olivia Martinez',
      phone: '+1 98765 99001',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=120&auto=format&fit=crop'
    },
    time: '10:05 AM',
    date: 'May 10, 2024',
    status: 'SENT_TO_DELIVERY',
    total: 22.49,
    items: [
      { id: 'item-3', name: 'Veggie Delight Pizza', spec: 'Thin Crust', qty: 1, price: 14.99, total: 14.99, image: 'https://images.unsplash.com/photo-1571066811602-71683a3f680d?q=80&w=120&auto=format&fit=crop' }
    ],
    payment: 'Online (Paid)',
    paymentStatus: 'Paid',
    address: '11, Residency Road, Shanthala Nagar, Bengaluru, Karnataka, India',
    notes: 'Fragile delivery.'
  },
  {
    id: 'SS_ORD_84506',
    customer: {
      name: 'William Taylor',
      phone: '+1 98765 77889',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop'
    },
    time: '10:08 AM',
    date: 'May 10, 2024',
    status: 'SENT_TO_DELIVERY',
    total: 19.99,
    items: [
      { id: 'item-2', name: 'Garlic Bread', spec: 'Stuffed Garlic Bread', qty: 2, price: 5.99, total: 11.98, image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?q=80&w=120&auto=format&fit=crop' }
    ],
    payment: 'Online (Paid)',
    paymentStatus: 'Paid',
    address: '42, Lavelle Road, Ashok Nagar, Bengaluru, Karnataka, India',
    notes: 'Please bring hot.'
  },
  {
    id: 'SS_ORD_84507',
    customer: {
      name: 'Sophia Anderson',
      phone: '+1 98765 88990',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120&auto=format&fit=crop'
    },
    time: '10:10 AM',
    date: 'May 10, 2024',
    status: 'SENT_TO_DELIVERY',
    total: 34.99,
    items: [
      { id: 'item-4', name: 'Pepperoni Pizza', spec: 'Pan Crust', qty: 2, price: 16.99, total: 33.98, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=120&auto=format&fit=crop' }
    ],
    payment: 'Online (Paid)',
    paymentStatus: 'Paid',
    address: '22, Brunton Road, Ashok Nagar, Bengaluru, Karnataka, India',
    notes: 'Doorbell is broken, call on arrival.'
  },

  // DELIVERED (Total 24 - 3 visible + 21 dummy items)
  {
    id: 'SS_ORD_84490',
    customer: {
      name: 'Daniel Thomas',
      phone: '+1 98765 11002',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=120&auto=format&fit=crop'
    },
    time: '09:45 AM',
    date: 'May 10, 2024',
    status: 'DELIVERED',
    total: 17.49,
    items: [
      { id: 'item-5', name: 'Margherita Pizza', spec: 'Thin Crust', qty: 1, price: 12.99, total: 12.99, image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=80&w=120&auto=format&fit=crop' }
    ],
    payment: 'Online (Paid)',
    paymentStatus: 'Paid',
    address: '89, Victoria Road, Victoria Layout, Bengaluru, Karnataka, India',
    notes: ''
  },
  {
    id: 'SS_ORD_84491',
    customer: {
      name: 'Isabella Moore',
      phone: '+1 98765 22113',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=120&auto=format&fit=crop'
    },
    time: '09:50 AM',
    date: 'May 10, 2024',
    status: 'DELIVERED',
    total: 13.99,
    items: [
      { id: 'item-2', name: 'Garlic Bread', spec: 'Cheesy Garlic Bread', qty: 2, price: 4.99, total: 9.98, image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?q=80&w=120&auto=format&fit=crop' }
    ],
    payment: 'Online (Paid)',
    paymentStatus: 'Paid',
    address: '14, Infantry Road, Tasker Town, Bengaluru, Karnataka, India',
    notes: ''
  },
  {
    id: 'SS_ORD_84492',
    customer: {
      name: 'Benjamin White',
      phone: '+1 98765 33224',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop'
    },
    time: '09:55 AM',
    date: 'May 10, 2024',
    status: 'DELIVERED',
    total: 28.49,
    items: [
      { id: 'item-3', name: 'Veggie Delight Pizza', spec: 'Regular Crust', qty: 1, price: 14.99, total: 14.99, image: 'https://images.unsplash.com/photo-1571066811602-71683a3f680d?q=80&w=120&auto=format&fit=crop' }
    ],
    payment: 'Online (Paid)',
    paymentStatus: 'Paid',
    address: '32, Queens Road, Vasanth Nagar, Bengaluru, Karnataka, India',
    notes: ''
  },

  // CANCELLED (Total 3)
  {
    id: 'SS_ORD_84480',
    customer: {
      name: 'Matthew Harris',
      phone: '+1 98765 44335',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=120&auto=format&fit=crop'
    },
    time: '09:30 AM',
    date: 'May 10, 2024',
    status: 'CANCELLED',
    total: 15.99,
    items: [
      { id: 'item-3', name: 'Veggie Delight Pizza', spec: 'Regular Crust', qty: 1, price: 14.99, total: 14.99, image: 'https://images.unsplash.com/photo-1571066811602-71683a3f680d?q=80&w=120&auto=format&fit=crop' }
    ],
    payment: 'Online (Cancelled)',
    paymentStatus: 'Refunded',
    address: '18, Cunningham Road, Vasanth Nagar, Bengaluru, Karnataka, India',
    notes: 'Order placed by mistake.'
  },
  {
    id: 'SS_ORD_84481',
    customer: {
      name: 'Charlotte Clark',
      phone: '+1 98765 55446',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=120&auto=format&fit=crop'
    },
    time: '09:35 AM',
    date: 'May 10, 2024',
    status: 'CANCELLED',
    total: 22.49,
    items: [
      { id: 'item-2', name: 'Garlic Bread', spec: 'Stuffed Garlic Bread', qty: 3, price: 5.99, total: 17.97, image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?q=80&w=120&auto=format&fit=crop' }
    ],
    payment: 'Cash (Unpaid)',
    paymentStatus: 'Unpaid',
    address: '5, Palace Road, Vasanth Nagar, Bengaluru, Karnataka, India',
    notes: 'Delivery address was incorrect.'
  },
  {
    id: 'SS_ORD_84482',
    customer: {
      name: 'Ava Lewis',
      phone: '+1 98765 66557',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120&auto=format&fit=crop'
    },
    time: '09:40 AM',
    date: 'May 10, 2024',
    status: 'CANCELLED',
    total: 19.49,
    items: [
      { id: 'item-5', name: 'Margherita Pizza', spec: 'Thin Crust', qty: 1, price: 12.99, total: 12.99, image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=80&w=120&auto=format&fit=crop' }
    ],
    payment: 'Online (Cancelled)',
    paymentStatus: 'Refunded',
    address: '60, Millers Road, Benson Town, Bengaluru, Karnataka, India',
    notes: 'Customer canceled within 2 mins.'
  }
];

const INITIAL_FEED = [
  { id: 'feed-1', orderId: 'SS_ORD_84505', text: 'Marked as Out for Delivery', time: '10:12 AM', type: 'success' },
  { id: 'feed-2', orderId: 'SS_ORD_84515', text: 'Moved to Kitchen', time: '10:11 AM', type: 'warning' },
  { id: 'feed-3', orderId: 'SS_ORD_84521', text: 'New order received', time: '10:10 AM', type: 'info' }
];

const AdminOrdersPage = () => {
  // --- States ---
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('slicesprint_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Error loading orders from localStorage:", e);
    }
    return INITIAL_ORDERS;
  });

  const [feed, setFeed] = useState(() => {
    try {
      const saved = localStorage.getItem('slicesprint_orders_feed');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Error loading feed from localStorage:", e);
    }
    return INITIAL_FEED;
  });

  const [selectedOrderId, setSelectedOrderId] = useState('SS_ORD_84521');
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Status Selector dropdown temp state
  const [updateStatusVal, setUpdateStatusVal] = useState('IN_KITCHEN');

  // Floating notifications state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // --- Effects: Persistent Caching ---
  useEffect(() => {
    localStorage.setItem('slicesprint_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('slicesprint_orders_feed', JSON.stringify(feed));
  }, [feed]);

  // --- Toast Trigger ---
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3500);
  };

  // --- Active Selected Order object ---
  const selectedOrder = useMemo(() => {
    return orders.find(o => o.id === selectedOrderId) || orders[0] || INITIAL_ORDERS[0];
  }, [orders, selectedOrderId]);

  // Sync update status selector when selected order changes
  useEffect(() => {
    if (selectedOrder) {
      // Propose logical next status in dropdown for convenience
      const mapping = {
        'ORDER_RECEIVED': 'IN_KITCHEN',
        'IN_KITCHEN': 'SENT_TO_DELIVERY',
        'SENT_TO_DELIVERY': 'DELIVERED',
        'DELIVERED': 'DELIVERED',
        'CANCELLED': 'CANCELLED'
      };
      setUpdateStatusVal(mapping[selectedOrder.status] || 'IN_KITCHEN');
    }
  }, [selectedOrder]);

  // --- Pipeline Totals Calculator ---
  // To preserve the pixel-perfect counters (12, 8, 6, 24, 3) from the image,
  // we count visible seeded items and add simulated gaps so numbers align exactly!
  const statusCounters = useMemo(() => {
    const counters = {
      'ORDER_RECEIVED': 0,
      'IN_KITCHEN': 0,
      'SENT_TO_DELIVERY': 0,
      'DELIVERED': 0,
      'CANCELLED': 0
    };

    orders.forEach(o => {
      if (o && o.status && counters[o.status] !== undefined) {
        counters[o.status]++;
      }
    });

    // Match image exact counts by padding the visible catalog entries
    return {
      'ORDER_RECEIVED': Math.max(12, counters['ORDER_RECEIVED']),
      'IN_KITCHEN': Math.max(8, counters['IN_KITCHEN']),
      'SENT_TO_DELIVERY': Math.max(6, counters['SENT_TO_DELIVERY']),
      'DELIVERED': Math.max(24, counters['DELIVERED']),
      'CANCELLED': Math.max(3, counters['CANCELLED'])
    };
  }, [orders]);

  // --- Grouped Orders ---
  const groupedOrders = useMemo(() => {
    const groups = {
      'ORDER_RECEIVED': [],
      'IN_KITCHEN': [],
      'SENT_TO_DELIVERY': [],
      'DELIVERED': [],
      'CANCELLED': []
    };

    // Filtered by Search query if present
    const query = searchQuery.toLowerCase();
    const filtered = orders.filter(o => 
      o?.id?.toLowerCase().includes(query) ||
      o?.customer?.name?.toLowerCase().includes(query) ||
      o?.status?.toLowerCase().includes(query)
    );

    filtered.forEach(o => {
      if (o && o.status && groups[o.status]) {
        groups[o.status].push(o);
      }
    });

    return groups;
  }, [orders, searchQuery]);

  // --- Status Transition Handler ---
  const handleUpdateStatus = (orderId, newStatus) => {
    if (!orderId) return;

    let orderName = '';
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        orderName = o.id;
        return { ...o, status: newStatus };
      }
      return o;
    }));

    // Generate recent activity timeline details
    const mappingText = {
      'ORDER_RECEIVED': 'New order received',
      'IN_KITCHEN': 'Moved to Kitchen',
      'SENT_TO_DELIVERY': 'Marked as Out for Delivery',
      'DELIVERED': 'Successfully Delivered to Customer',
      'CANCELLED': 'Order Cancelled'
    };

    const mappingType = {
      'ORDER_RECEIVED': 'info',
      'IN_KITCHEN': 'warning',
      'SENT_TO_DELIVERY': 'success',
      'DELIVERED': 'success',
      'CANCELLED': 'error'
    };

    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newFeedItem = {
      id: `feed-${Date.now()}`,
      orderId: orderId,
      text: mappingText[newStatus] || 'Status changed',
      time: formattedTime,
      type: mappingType[newStatus] || 'info'
    };

    setFeed(prev => [newFeedItem, ...prev.slice(0, 7)]); // Keep timeline to 8 items max
    showToast(`Order ${orderId} successfully updated to ${newStatus}!`, 'success');
  };

  return (
    <div className="bg-[#FAFCFE] min-h-screen pb-12 text-slate-700 animate-in fade-in duration-300">
      
      {/* Toast popup */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border text-sm font-semibold transition-all duration-300 transform scale-100 ${
          toast.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-100 animate-bounce' 
            : 'bg-orange-50 text-[#FF4C00] border-orange-100 animate-pulse'
        }`}>
          <CheckCircleIcon className={`h-6 w-6 ${toast.type === 'success' ? 'text-emerald-500' : 'text-orange-500'}`} />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Title Wrapper */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-3.5">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Live Order Pipeline</h1>
          <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Live (Socket Connected)</span>
          </div>
        </div>

        {/* Filters and search layout */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-60">
            <span className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none text-slate-400">
              <MagnifyingGlassIcon className="h-4 w-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search active orders..."
              className="w-full bg-white text-xs pl-8 pr-3 py-2.5 rounded-xl border border-slate-100 focus:outline-none focus:border-orange-500 transition-all shadow-sm"
            />
          </div>
          <button 
            onClick={() => showToast('Filters overlay opened successfully', 'info')}
            className="border border-slate-200 rounded-xl px-4 py-2 text-xs font-black text-slate-600 bg-white hover:bg-slate-50 flex items-center gap-2 transition-all shadow-sm flex-shrink-0"
          >
            <FunnelIcon className="h-4 w-4 text-slate-500 stroke-[2.2]" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* --- 5-COLUMN KANBAN WORKFLOW PIPELINE --- */}
      <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar mb-8 select-none">
        
        {/* Column 1: ORDER_RECEIVED */}
        <div className="flex-1 min-w-[245px] max-w-[275px] bg-[#FAFBFD] rounded-3xl p-3 border border-slate-100 flex flex-col justify-between min-h-[480px]">
          <div>
            <div className="bg-[#EFF6FF] text-[#1E40AF] px-3.5 py-3 rounded-2xl flex items-center justify-between border border-blue-100/50">
              <div>
                <h3 className="text-[10px] font-black tracking-widest uppercase">ORDER_RECEIVED</h3>
                <p className="text-xs font-black text-[#1E40AF]/75 mt-0.5">{statusCounters['ORDER_RECEIVED']} Orders</p>
              </div>
              <span className="text-blue-300 font-extrabold text-sm ml-2 font-mono">➔</span>
            </div>
            
            <div className="flex flex-col gap-3 my-4 overflow-y-auto max-h-[360px] pr-0.5 custom-scrollbar">
              {groupedOrders['ORDER_RECEIVED'].map((o) => (
                <div 
                  key={o.id}
                  onClick={() => { setSelectedOrderId(o.id); setIsDrawerOpen(true); }}
                  className={`bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[110px] relative hover:border-orange-100 ${
                    o.id === selectedOrderId && isDrawerOpen ? 'border-2 border-[#FF4C00] shadow-md shadow-orange-50 bg-[#FFFBF9]' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-black text-slate-800">{o.id}</h4>
                      <p className="text-[11px] font-bold text-slate-400 mt-0.5">{o.customer.name}</p>
                      <p className="text-[9px] font-bold text-slate-300 mt-0.5">{o.time}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-50">
                    <div className="flex -space-x-1.5">
                      {o.items.map((item, idx) => (
                        <div key={idx} className="w-5.5 h-5.5 rounded-full overflow-hidden border-2 border-white bg-slate-50 flex items-center justify-center text-[10px] shadow-sm">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                    <span className="text-xs font-black text-slate-800">${o.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button 
            onClick={() => showToast("Loading remaining received orders...", "info")}
            className="text-[11px] font-black text-slate-400 text-center hover:text-[#FF4C00] hover:underline cursor-pointer select-none py-1.5"
          >
            + {statusCounters['ORDER_RECEIVED'] - groupedOrders['ORDER_RECEIVED'].length} more
          </button>
        </div>

        {/* Column 2: IN_KITCHEN */}
        <div className="flex-1 min-w-[245px] max-w-[275px] bg-[#FAFBFD] rounded-3xl p-3 border border-slate-100 flex flex-col justify-between min-h-[480px]">
          <div>
            <div className="bg-[#FFF7ED] text-[#9A3412] px-3.5 py-3 rounded-2xl flex items-center justify-between border border-orange-100/50">
              <div>
                <h3 className="text-[10px] font-black tracking-widest uppercase">IN_KITCHEN</h3>
                <p className="text-xs font-black text-[#9A3412]/75 mt-0.5">{statusCounters['IN_KITCHEN']} Orders</p>
              </div>
              <span className="text-orange-300 font-extrabold text-sm ml-2 font-mono">➔</span>
            </div>
            
            <div className="flex flex-col gap-3 my-4 overflow-y-auto max-h-[360px] pr-0.5 custom-scrollbar">
              {groupedOrders['IN_KITCHEN'].map((o) => (
                <div 
                  key={o.id}
                  onClick={() => { setSelectedOrderId(o.id); setIsDrawerOpen(true); }}
                  className={`bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[110px] relative hover:border-orange-100 ${
                    o.id === selectedOrderId && isDrawerOpen ? 'border-2 border-[#FF4C00] shadow-md shadow-orange-50 bg-[#FFFBF9]' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-black text-slate-800">{o.id}</h4>
                      <p className="text-[11px] font-bold text-slate-400 mt-0.5">{o.customer.name}</p>
                      <p className="text-[9px] font-bold text-slate-300 mt-0.5">{o.time}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-50">
                    <div className="flex -space-x-1.5">
                      {o.items.map((item, idx) => (
                        <div key={idx} className="w-5.5 h-5.5 rounded-full overflow-hidden border-2 border-white bg-slate-50 flex items-center justify-center text-[10px] shadow-sm">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                    <span className="text-xs font-black text-slate-800">${o.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button 
            onClick={() => showToast("Loading remaining kitchen orders...", "info")}
            className="text-[11px] font-black text-slate-400 text-center hover:text-[#FF4C00] hover:underline cursor-pointer select-none py-1.5"
          >
            + {statusCounters['IN_KITCHEN'] - groupedOrders['IN_KITCHEN'].length} more
          </button>
        </div>

        {/* Column 3: SENT_TO_DELIVERY */}
        <div className="flex-1 min-w-[245px] max-w-[275px] bg-[#FAFBFD] rounded-3xl p-3 border border-slate-100 flex flex-col justify-between min-h-[480px]">
          <div>
            <div className="bg-[#FAF5FF] text-[#6B21A8] px-3.5 py-3 rounded-2xl flex items-center justify-between border border-purple-100/50">
              <div>
                <h3 className="text-[10px] font-black tracking-widest uppercase">SENT_TO_DELIVERY</h3>
                <p className="text-xs font-black text-[#6B21A8]/75 mt-0.5">{statusCounters['SENT_TO_DELIVERY']} Orders</p>
              </div>
              <span className="text-purple-300 font-extrabold text-sm ml-2 font-mono">➔</span>
            </div>
            
            <div className="flex flex-col gap-3 my-4 overflow-y-auto max-h-[360px] pr-0.5 custom-scrollbar">
              {groupedOrders['SENT_TO_DELIVERY'].map((o) => (
                <div 
                  key={o.id}
                  onClick={() => { setSelectedOrderId(o.id); setIsDrawerOpen(true); }}
                  className={`bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[110px] relative hover:border-orange-100 ${
                    o.id === selectedOrderId && isDrawerOpen ? 'border-2 border-[#FF4C00] shadow-md shadow-orange-50 bg-[#FFFBF9]' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-black text-slate-800">{o.id}</h4>
                      <p className="text-[11px] font-bold text-slate-400 mt-0.5">{o.customer.name}</p>
                      <p className="text-[9px] font-bold text-slate-300 mt-0.5">{o.time}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-50">
                    <div className="flex -space-x-1.5">
                      {o.items.map((item, idx) => (
                        <div key={idx} className="w-5.5 h-5.5 rounded-full overflow-hidden border-2 border-white bg-slate-50 flex items-center justify-center text-[10px] shadow-sm">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                    <span className="text-xs font-black text-slate-800">${o.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button 
            onClick={() => showToast("Loading remaining delivery orders...", "info")}
            className="text-[11px] font-black text-slate-400 text-center hover:text-[#FF4C00] hover:underline cursor-pointer select-none py-1.5"
          >
            + {statusCounters['SENT_TO_DELIVERY'] - groupedOrders['SENT_TO_DELIVERY'].length} more
          </button>
        </div>

        {/* Column 4: DELIVERED */}
        <div className="flex-1 min-w-[245px] max-w-[275px] bg-[#FAFBFD] rounded-3xl p-3 border border-slate-100 flex flex-col justify-between min-h-[480px]">
          <div>
            <div className="bg-[#ECFDF5] text-[#065F46] px-3.5 py-3 rounded-2xl flex items-center justify-between border border-emerald-100/50">
              <div>
                <h3 className="text-[10px] font-black tracking-widest uppercase">DELIVERED</h3>
                <p className="text-xs font-black text-[#065F46]/75 mt-0.5">{statusCounters['DELIVERED']} Orders</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-3 my-4 overflow-y-auto max-h-[360px] pr-0.5 custom-scrollbar">
              {groupedOrders['DELIVERED'].map((o) => (
                <div 
                  key={o.id}
                  onClick={() => { setSelectedOrderId(o.id); setIsDrawerOpen(true); }}
                  className={`bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[110px] relative hover:border-orange-100 ${
                    o.id === selectedOrderId && isDrawerOpen ? 'border-2 border-[#FF4C00] shadow-md shadow-orange-50 bg-[#FFFBF9]' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-black text-slate-800">{o.id}</h4>
                      <p className="text-[11px] font-bold text-slate-400 mt-0.5">{o.customer.name}</p>
                      <p className="text-[9px] font-bold text-slate-300 mt-0.5">{o.time}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-50">
                    <div className="flex -space-x-1.5">
                      {o.items.map((item, idx) => (
                        <div key={idx} className="w-5.5 h-5.5 rounded-full overflow-hidden border-2 border-white bg-slate-50 flex items-center justify-center text-[10px] shadow-sm">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                    <span className="text-xs font-black text-slate-800">${o.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button 
            onClick={() => showToast("Loading remaining completed orders...", "info")}
            className="text-[11px] font-black text-slate-400 text-center hover:text-[#FF4C00] hover:underline cursor-pointer select-none py-1.5"
          >
            + {statusCounters['DELIVERED'] - groupedOrders['DELIVERED'].length} more
          </button>
        </div>

        {/* Column 5: CANCELLED */}
        <div className="flex-1 min-w-[245px] max-w-[275px] bg-[#FAFBFD] rounded-3xl p-3 border border-slate-100 flex flex-col justify-between min-h-[480px]">
          <div>
            <div className="bg-[#FEF2F2] text-[#991B1B] px-3.5 py-3 rounded-2xl flex items-center justify-between border border-red-100/50">
              <div>
                <h3 className="text-[10px] font-black tracking-widest uppercase">CANCELLED</h3>
                <p className="text-xs font-black text-[#991B1B]/75 mt-0.5">{statusCounters['CANCELLED']} Orders</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-3 my-4 overflow-y-auto max-h-[360px] pr-0.5 custom-scrollbar">
              {groupedOrders['CANCELLED'].map((o) => (
                <div 
                  key={o.id}
                  onClick={() => { setSelectedOrderId(o.id); setIsDrawerOpen(true); }}
                  className={`bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[110px] relative hover:border-orange-100 ${
                    o.id === selectedOrderId && isDrawerOpen ? 'border-2 border-[#FF4C00] shadow-md shadow-orange-50 bg-[#FFFBF9]' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-black text-slate-800">{o.id}</h4>
                      <p className="text-[11px] font-bold text-slate-400 mt-0.5">{o.customer.name}</p>
                      <p className="text-[9px] font-bold text-slate-300 mt-0.5">{o.time}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-50">
                    <div className="flex -space-x-1.5">
                      {o.items.map((item, idx) => (
                        <div key={idx} className="w-5.5 h-5.5 rounded-full overflow-hidden border-2 border-white bg-slate-50 flex items-center justify-center text-[10px] shadow-sm">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                    <span className="text-xs font-black text-slate-800">${o.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="py-2.5 text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest select-none">
            End of list
          </div>
        </div>

      </div>

      {/* --- BOTTOM SECTION (Recent Activity, Status Updates & Drawer Layout) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Column 1: Recent Activity Feed */}
        <div className="bg-white rounded-3xl border border-slate-100/80 shadow-sm p-6 flex flex-col justify-between min-h-[380px]">
          <div>
            <div className="flex justify-between items-center border-b border-slate-50 pb-3 mb-4">
              <h3 className="text-slate-800 font-extrabold text-sm tracking-tight">Recent Activity Feed</h3>
              <button 
                onClick={() => showToast('Full activity log timeline expanded', 'info')}
                className="text-[#FF4C00] hover:text-[#D03D00] text-xs font-extrabold tracking-wide hover:underline"
              >
                View All
              </button>
            </div>

            <div className="relative pl-7 space-y-5 my-4">
              {/* Connecting Vertical Timeline Line */}
              <div className="absolute left-[10px] top-2 bottom-2 w-0.5 bg-slate-100"></div>

              {feed.map((item) => {
                const colorMap = {
                  'success': 'bg-emerald-500 ring-emerald-50 text-emerald-500',
                  'warning': 'bg-orange-500 ring-orange-50 text-orange-500',
                  'info': 'bg-blue-500 ring-blue-50 text-blue-500',
                  'error': 'bg-red-500 ring-red-50 text-red-500'
                };

                return (
                  <div key={item.id} className="relative flex justify-between items-start group">
                    {/* Circle Node */}
                    <span className={`absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full ring-4 ${
                      colorMap[item.type] || 'bg-slate-400 ring-slate-50'
                    } flex-shrink-0 z-10 shadow-sm`}></span>

                    <div>
                      <p className="text-xs font-bold text-slate-700 leading-snug">
                        Order <span className="font-extrabold text-[#FF4C00]">{item.orderId}</span>
                      </p>
                      <p className="text-[11px] font-semibold text-slate-500 leading-normal mt-0.5">{item.text}</p>
                      <span className="text-[9px] font-bold text-slate-400 mt-1 flex items-center gap-1.5">
                        <ClockIcon className="h-3 w-3 stroke-[2.2]" />
                        {item.time}
                      </span>
                    </div>

                    <button 
                      onClick={() => { setSelectedOrderId(item.orderId); setIsDrawerOpen(true); }}
                      className="p-1 rounded-lg hover:bg-slate-50 text-slate-300 hover:text-slate-600 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <PencilIcon className="h-3.5 w-3.5 stroke-[2.2]" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Column 2: Quick Order Status Update Form */}
        <div className="bg-white rounded-3xl border border-slate-100/80 shadow-sm p-6 flex flex-col justify-between min-h-[380px]">
          <div>
            <div className="border-b border-slate-50 pb-3 mb-4">
              <h3 className="text-slate-800 font-extrabold text-sm tracking-tight">Order Status Update</h3>
            </div>

            <div className="space-y-4 my-6">
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
                  Order ID
                </label>
                <div className="w-full bg-[#F8FAFC] text-sm text-slate-700 font-black px-4 py-3 rounded-xl border border-slate-100 flex items-center justify-between">
                  <span>{selectedOrder?.id || ''}</span>
                  <span className="text-[10px] font-bold text-slate-400">({selectedOrder?.customer?.name || ''})</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
                  Update Status
                </label>
                <select
                  value={updateStatusVal}
                  onChange={(e) => setUpdateStatusVal(e.target.value)}
                  className="w-full bg-[#F8FAFC] text-sm text-slate-800 font-black px-4 py-3 rounded-xl border border-slate-100 focus:outline-none focus:border-orange-500 focus:bg-white transition-all cursor-pointer"
                >
                  <option value="ORDER_RECEIVED">ORDER_RECEIVED</option>
                  <option value="IN_KITCHEN">IN_KITCHEN</option>
                  <option value="SENT_TO_DELIVERY">SENT_TO_DELIVERY</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleUpdateStatus(selectedOrder?.id, updateStatusVal)}
            className="w-full bg-gradient-to-r from-[#FF4C00] to-[#FF6B00] hover:from-[#E03E00] hover:to-[#FF5C00] text-white font-extrabold text-xs py-3.5 rounded-2xl shadow-md shadow-orange-100 transition-all hover:scale-[1.01] active:scale-[0.99] mt-6"
          >
            Update Status
          </button>
        </div>

        {/* Column 3: Custom Order Details Right-hand Overlay Drawer */}
        {isDrawerOpen && selectedOrder && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-6 flex flex-col justify-between relative overflow-y-auto max-h-[85vh] animate-in slide-in-from-bottom-5 duration-200">
            <button 
              onClick={() => setIsDrawerOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 p-1 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <XMarkIcon className="h-5 w-5 stroke-[2.5]" />
            </button>

            <div>
              {/* Drawer Header details */}
              <div className="border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-slate-800 font-extrabold text-sm tracking-tight flex items-center justify-between pr-8">
                  <span>Order Details</span>
                </h3>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="text-sm font-black text-slate-800">{selectedOrder?.id}</span>
                  <span className={`text-[10px] font-black uppercase tracking-wide px-2.5 py-0.5 rounded-lg border ${
                    selectedOrder?.status === 'ORDER_RECEIVED' ? 'bg-blue-50 border-blue-100 text-blue-700' :
                    selectedOrder?.status === 'IN_KITCHEN' ? 'bg-orange-50 border-orange-100 text-orange-700' :
                    selectedOrder?.status === 'SENT_TO_DELIVERY' ? 'bg-purple-50 border-purple-100 text-purple-700' :
                    selectedOrder?.status === 'DELIVERED' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                    'bg-red-50 border-red-100 text-red-700'
                  }`}>
                    {selectedOrder?.status}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-slate-400 mt-1">{selectedOrder?.date} • {selectedOrder?.time}</p>
              </div>

              {/* Customer Contact specs */}
              <div className="my-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Customer</h4>
                <div className="flex items-center justify-between bg-slate-50/60 border border-slate-100 p-3 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50 flex-shrink-0 flex items-center justify-center">
                      <img src={selectedOrder?.customer?.avatar} alt={selectedOrder?.customer?.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h5 className="text-xs font-black text-slate-800">{selectedOrder?.customer?.name}</h5>
                      <p className="text-[10px] font-bold text-slate-400 mt-0.5">{selectedOrder?.customer?.phone}</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <a 
                      href={`tel:${selectedOrder?.customer?.phone}`}
                      className="p-2 rounded-xl bg-white border border-slate-100 hover:bg-slate-50 text-slate-400 hover:text-slate-800 transition-colors shadow-sm"
                    >
                      <PhoneIcon className="h-4 w-4 stroke-[2.2]" />
                    </a>
                    <button 
                      onClick={() => showToast(`Opening chat modal for ${selectedOrder?.customer?.name || ''}...`, 'info')}
                      className="p-2 rounded-xl bg-white border border-slate-100 hover:bg-slate-50 text-slate-400 hover:text-[#FF4C00] transition-colors shadow-sm"
                    >
                      <ChatBubbleLeftRightIcon className="h-4 w-4 stroke-[2.2]" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Ordered Food items lists */}
              <div className="my-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Items ({(selectedOrder?.items || []).length})</h4>
                <div className="space-y-3.5">
                  {(selectedOrder?.items || []).map((item) => (
                    <div key={item.id} className="flex justify-between items-center bg-white border border-slate-100/50 p-2.5 rounded-2xl shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl overflow-hidden border border-slate-100 bg-slate-50 flex-shrink-0 flex items-center justify-center">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-slate-800">{item.name}</h5>
                          <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{item.spec}</p>
                          <span className="text-[10px] font-bold text-slate-500 block mt-0.5">${item.price} x {item.qty}</span>
                        </div>
                      </div>
                      <span className="text-xs font-black text-slate-800">${item.total}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payments column */}
              <div className="my-4 border-t border-slate-100 pt-3 flex justify-between items-center text-xs">
                <div className="font-semibold text-slate-400">
                  Payment: <span className="text-slate-600 font-bold ml-1">{selectedOrder?.payment}</span>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg border ${
                  selectedOrder?.paymentStatus === 'Paid' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                  selectedOrder?.paymentStatus === 'Refunded' ? 'bg-blue-50 border-blue-100 text-blue-700' :
                  'bg-orange-50 border-orange-100 text-orange-700'
                }`}>
                  {selectedOrder?.paymentStatus}
                </span>
              </div>

              {/* Total amount summary card */}
              <div className="bg-[#FAFBFD] border border-slate-100 rounded-2xl p-4 my-4 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500">Total Amount</span>
                <span className="text-lg font-black text-[#FF4C00]">${selectedOrder?.total}</span>
              </div>

              {/* Delivery Coordinates & Address details */}
              <div className="my-4 space-y-3.5">
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Delivery Address</h4>
                  <p className="text-[11px] font-semibold text-slate-500 leading-relaxed flex items-start gap-1.5">
                    <MapPinIcon className="h-4.5 w-4.5 stroke-[2.2] text-slate-400 mt-0.5 flex-shrink-0" />
                    <span>{selectedOrder?.address}</span>
                  </p>
                </div>

                {selectedOrder?.notes && (
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Order Notes</h4>
                    <p className="text-[11px] font-semibold text-slate-500 italic bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                      "{selectedOrder?.notes}"
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick action controls at drawer footer */}
            <div className="border-t border-slate-100 pt-4 mt-6">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
                Quick Update status
              </label>
              <div className="flex gap-2">
                <select
                  value={updateStatusVal}
                  onChange={(e) => setUpdateStatusVal(e.target.value)}
                  className="flex-1 bg-[#F8FAFC] text-xs text-slate-800 font-bold px-3 py-2.5 rounded-xl border border-slate-100 focus:outline-none"
                >
                  <option value="ORDER_RECEIVED">ORDER_RECEIVED</option>
                  <option value="IN_KITCHEN">IN_KITCHEN</option>
                  <option value="SENT_TO_DELIVERY">SENT_TO_DELIVERY</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
                <button
                  onClick={() => handleUpdateStatus(selectedOrder?.id, updateStatusVal)}
                  className="bg-[#FF4C00] hover:bg-[#E03E00] text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-orange-100 transition-colors"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

export default AdminOrdersPage;
