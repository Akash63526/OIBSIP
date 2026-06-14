import React, { useState, useEffect, useMemo } from 'react';
import { 
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ArrowUpTrayIcon,
  EyeIcon,
  PhoneIcon,
  XMarkIcon,
  CheckCircleIcon,
  MapPinIcon,
  ClockIcon,
  CalendarIcon,
  ShoppingBagIcon,
  UserIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

// Pre-seeded mock database matching the provided screenshot exactly!
const INITIAL_DELIVERIES = [
  {
    orderId: 'ORD00156',
    customer: 'Alex Johnson',
    customerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&auto=format&fit=crop',
    partner: 'Rahul Kumar',
    partnerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop',
    phone: '+1 987 654 3210',
    status: 'Out for Delivery',
    estTime: '25 mins',
    actTime: '-',
    location: 'Downtown, New York',
    address: '42, Baker Street, Downtown, New York, NY 10001',
    favoritePartner: true,
    items: [
      { name: 'Margherita Pizza', size: 'Medium', qty: 1, price: 379 },
      { name: 'Garlic Bread', size: 'Regular', qty: 1, price: 129 }
    ]
  },
  {
    orderId: 'ORD00155',
    customer: 'Emma Watson',
    customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120&auto=format&fit=crop',
    partner: 'Amit Sharma',
    partnerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=120&auto=format&fit=crop',
    phone: '+1 876 543 2109',
    status: 'In Transit',
    estTime: '30 mins',
    actTime: '15 mins',
    location: 'Brooklyn, New York',
    address: 'Room 501, West End Apartments, Brooklyn, New York, NY 11201',
    favoritePartner: false,
    items: [
      { name: 'Pepperoni Pizza', size: 'Large', qty: 2, price: 599 },
      { name: 'Coke (500ml)', size: 'Regular', qty: 2, price: 60 }
    ]
  },
  {
    orderId: 'ORD00154',
    customer: 'Michael Brown',
    customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop',
    partner: 'Vikram Singh',
    partnerAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=120&auto=format&fit=crop',
    phone: '+1 765 432 1098',
    status: 'Delivered',
    estTime: '20 mins',
    actTime: '18 mins',
    location: 'Manhattan, New York',
    address: '90, Sunset Blvd, Manhattan, New York, NY 10028',
    favoritePartner: true,
    items: [
      { name: 'Cheese Burst Pizza', size: 'Medium', qty: 1, price: 499 }
    ]
  },
  {
    orderId: 'ORD00153',
    customer: 'Sophia Davis',
    customerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=120&auto=format&fit=crop',
    partner: 'Suresh Yadav',
    partnerAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=120&auto=format&fit=crop',
    phone: '+1 654 321 0987',
    status: 'Pending',
    estTime: '35 mins',
    actTime: '-',
    location: 'Queens, New York',
    address: '101, Central Park Avenue, Queens, New York, NY 11101',
    favoritePartner: false,
    items: [
      { name: 'Margherita Pizza', size: 'Small', qty: 1, price: 249 },
      { name: 'Coke (500ml)', size: 'Regular', qty: 1, price: 60 }
    ]
  },
  {
    orderId: 'ORD00152',
    customer: 'Daniel Taylor',
    customerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=120&auto=format&fit=crop',
    partner: 'Rohit Verma',
    partnerAvatar: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?q=80&w=120&auto=format&fit=crop',
    phone: '+1 543 210 9876',
    status: 'Cancelled',
    estTime: '-',
    actTime: '-',
    location: 'Bronx, New York',
    address: 'Block C, Concourse Village, Bronx, New York, NY 10451',
    favoritePartner: false,
    items: [
      { name: 'Pepperoni Pizza', size: 'Small', qty: 1, price: 299 }
    ]
  }
];

const AdminDeliveryPage = () => {
  // DB state persisting in LocalStorage
  const [deliveries, setDeliveries] = useState(() => {
    try {
      const saved = localStorage.getItem('slicesprint_deliveries');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_DELIVERIES;
  });

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [timeframeFilter, setTimeframeFilter] = useState('Today');

  // Modal Control States
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCallingModalOpen, setIsCallingModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Selected delivery details
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  // calling simulator sub-states
  const [callState, setCallState] = useState('dialing'); // dialing, connected, ended
  const [callTimer, setCallTimer] = useState(0);

  // Toast notifications State
  const [toast, setToast] = useState(null);

  // Persist DB
  useEffect(() => {
    localStorage.setItem('slicesprint_deliveries', JSON.stringify(deliveries));
  }, [deliveries]);

  // Toast Auto-dismiss
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Call simulation timer
  useEffect(() => {
    let interval = null;
    if (isCallingModalOpen && callState === 'connected') {
      interval = setInterval(() => {
        setCallTimer(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isCallingModalOpen, callState]);

  // Format call duration MM:SS
  const formatCallDuration = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Search and Filter Logic
  const filteredDeliveries = useMemo(() => {
    return deliveries.filter(del => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        del.customer.toLowerCase().includes(query) || 
        del.partner.toLowerCase().includes(query) || 
        del.orderId.toLowerCase().includes(query) || 
        del.location.toLowerCase().includes(query);

      const matchesStatus = 
        statusFilter === 'All Status' || 
        del.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [deliveries, searchQuery, statusFilter]);

  // Trigger calling simulator
  const handleOpenCall = (delivery) => {
    setSelectedDelivery(delivery);
    setCallState('dialing');
    setCallTimer(0);
    setIsCallingModalOpen(true);

    // Simulate connection after 2 seconds
    setTimeout(() => {
      setCallState('connected');
    }, 2000);
  };

  // End Call
  const handleEndCall = () => {
    setCallState('ended');
    setTimeout(() => {
      setIsCallingModalOpen(false);
      setToast({
        title: 'Call Terminated',
        message: `Call to delivery partner ${selectedDelivery.partner} logged.`
      });
    }, 800);
  };

  // Toggle Favorite Partner star (Bestseller/like button equivalent)
  const handleToggleFavoritePartner = (orderId) => {
    const delivery = deliveries.find(d => d.orderId === orderId);
    if (!delivery) return;
    const newFavoriteState = !delivery.favoritePartner;

    setDeliveries(prev => prev.map(d => {
      if (d.orderId === orderId) {
        return { ...d, favoritePartner: newFavoriteState };
      }
      return d;
    }));

    setToast({
      title: 'Partner Preference Saved',
      message: `${delivery.partner} ${newFavoriteState ? 'is now marked' : 'is no longer marked'} as a preferred delivery partner.`
    });
  };

  // Simulate Export
  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setToast({
        title: 'Report Exported',
        message: `Vite compiled delivery manifest successfully compiled (CSV).`
      });
    }, 1200);
  };

  const handleOpenView = (delivery) => {
    setSelectedDelivery(delivery);
    setIsViewModalOpen(true);
  };

  return (
    <div className="bg-[#FAFBFD] min-h-screen pb-16 font-sans text-left">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* --- PAGE HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          
          {/* Brand Headline & Subtitle */}
          <div className="flex items-center gap-4">
            {/* Orange Scooter Icon Box */}
            <div className="w-12 h-12 rounded-2xl bg-[#FFF5F0] border border-orange-100 flex items-center justify-center shadow-md shadow-orange-100/30 flex-shrink-0">
              <span className="text-xl select-none">🛵</span>
            </div>
            <div>
              <h1 className="text-[26px] font-black text-gray-900 tracking-tight leading-tight">Delivery Management</h1>
              <p className="text-sm font-medium text-gray-400 mt-1 leading-none">Manage delivery partners and track deliveries</p>
            </div>
          </div>

          {/* Search, Filter, and Export controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 flex-1 md:flex-initial max-w-2xl">
            
            {/* Search Bar Input */}
            <div className="relative flex-1 sm:w-64 min-w-[200px]">
              <span className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-gray-400">
                <MagnifyingGlassIcon className="h-5 w-5" />
              </span>
              <input
                type="text"
                placeholder="Search deliveries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-sm pl-11 pr-4 py-2.5 rounded-2xl border border-gray-150 focus:outline-none focus:border-[#FF4C00] focus:ring-4 focus:ring-[#FF4C00]/5 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.01)] font-medium placeholder:text-gray-400"
              />
            </div>

            {/* Dropdown Status Filter */}
            <div className="relative min-w-[130px] flex-shrink-0">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-white text-sm font-bold pl-4 pr-10 py-2.5 rounded-2xl border border-gray-150 focus:outline-none focus:border-[#FF4C00] transition-all cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.01)] appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%239ca3af%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25em_1.25em] bg-[right_1rem_center] bg-no-repeat text-gray-700"
              >
                <option value="All Status">All Status</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="In Transit">In Transit</option>
                <option value="Delivered">Delivered</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Dropdown Timeframe Filter */}
            <div className="relative min-w-[110px] flex-shrink-0">
              <select
                value={timeframeFilter}
                onChange={(e) => setTimeframeFilter(e.target.value)}
                className="w-full bg-white text-sm font-bold pl-4 pr-10 py-2.5 rounded-2xl border border-gray-150 focus:outline-none focus:border-[#FF4C00] transition-all cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.01)] appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%239ca3af%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25em_1.25em] bg-[right_1rem_center] bg-no-repeat text-gray-700"
              >
                <option value="Today">Today</option>
                <option value="Yesterday">Yesterday</option>
                <option value="Last 7 Days">Last 7 Days</option>
              </select>
            </div>

            {/* Export Manifest Button */}
            <button 
              onClick={handleExport}
              disabled={isExporting}
              className="border border-gray-150 hover:bg-gray-50 text-gray-600 bg-white px-5 py-2.5 rounded-2xl text-sm font-extrabold shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2 h-10.5 min-w-[100px]"
            >
              {isExporting ? (
                <div className="h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <ArrowUpTrayIcon className="h-4.5 w-4.5" />
              )}
              <span>Export</span>
            </button>

          </div>
        </div>

        {/* --- DELIVERIES DATA TABLE --- */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_15px_45px_rgba(0,0,0,0.015)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 align-middle">
              <thead className="bg-[#FAFBFD]">
                <tr className="text-left text-xs font-black text-gray-400 uppercase tracking-widest">
                  <th className="px-6 py-5">Order ID</th>
                  <th className="px-6 py-5">Customer</th>
                  <th className="px-6 py-5">Delivery Partner</th>
                  <th className="px-6 py-5">Phone</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5">Estimated Time</th>
                  <th className="px-6 py-5">Actual Time</th>
                  <th className="px-6 py-5">Location</th>
                  <th className="px-6 py-5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 bg-white">
                {filteredDeliveries.map((del) => (
                  <tr key={del.orderId} className="hover:bg-gray-50/30 transition-colors">
                    
                    {/* Order ID */}
                    <td className="px-6 py-4.5 text-sm font-bold text-gray-800">
                      {del.orderId}
                    </td>

                    {/* Customer Name with Avatar */}
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8.5 h-8.5 rounded-full overflow-hidden border border-gray-150 shadow-sm bg-gray-50 flex-shrink-0 select-none">
                          <img src={del.customerAvatar} alt={del.customer} className="w-full h-full object-cover" />
                        </div>
                        <span className="font-extrabold text-[14px] text-gray-700">{del.customer}</span>
                      </div>
                    </td>

                    {/* Delivery Partner Name with Avatar (Like Button star next to it!) */}
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-2.5 justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8.5 h-8.5 rounded-full overflow-hidden border border-gray-150 shadow-sm bg-gray-50 flex-shrink-0 select-none">
                            <img src={del.partnerAvatar} alt={del.partner} className="w-full h-full object-cover" />
                          </div>
                          <span className="font-extrabold text-[14px] text-gray-800">{del.partner}</span>
                        </div>
                        
                        {/* Preferred Star / Favorite Like Indicator */}
                        <button
                          onClick={() => handleToggleFavoritePartner(del.orderId)}
                          className="text-gray-300 hover:text-orange-500 focus:outline-none transition-colors mr-2"
                          title="Favorite Delivery Partner"
                        >
                          {del.favoritePartner ? (
                            <StarIconSolid className="w-4 h-4 text-[#FF9E00]" />
                          ) : (
                            <span className="text-sm text-gray-300 hover:text-gray-400 select-none leading-none">☆</span>
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Phone Number */}
                    <td className="px-6 py-4.5 text-[13px] font-bold text-gray-500">
                      {del.phone}
                    </td>

                    {/* Status Pill Badge with colored bullet dot */}
                    <td className="px-6 py-4.5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black select-none tracking-wide ${
                        del.status === 'Out for Delivery' ? 'bg-[#EBF8FF] text-[#2B6CB0] border border-[#EBF8FF]' :
                        del.status === 'In Transit' ? 'bg-[#FFF5F0] text-[#FF4C00] border border-[#FFF5F0]' :
                        del.status === 'Delivered' ? 'bg-[#EBFDF2] text-[#027A48] border border-[#EBFDF2]' :
                        del.status === 'Pending' ? 'bg-[#F3F0FF] text-[#553C9A] border border-[#F3F0FF]' :
                        'bg-[#FEF3F2] text-[#B42318] border border-[#FEF3F2]'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          del.status === 'Out for Delivery' ? 'bg-[#3182CE]' :
                          del.status === 'In Transit' ? 'bg-[#FF4C00]' :
                          del.status === 'Delivered' ? 'bg-[#12B76A]' :
                          del.status === 'Pending' ? 'bg-[#6B46C1]' :
                          'bg-[#F04438]'
                        }`} />
                        <span>{del.status}</span>
                      </span>
                    </td>

                    {/* Estimated Duration */}
                    <td className="px-6 py-4.5 text-[13.5px] font-bold text-gray-600">
                      {del.estTime}
                    </td>

                    {/* Actual Duration */}
                    <td className="px-6 py-4.5 text-[13.5px] font-bold text-gray-600">
                      {del.actTime}
                    </td>

                    {/* Location */}
                    <td className="px-6 py-4.5 text-[13.5px] font-bold text-gray-600">
                      {del.location}
                    </td>

                    {/* Action buttons (View Details drawer, Call simulator) */}
                    <td className="px-6 py-4.5">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* View Details Button */}
                        <button
                          onClick={() => handleOpenView(del)}
                          className="w-8 h-8 rounded-full border border-gray-150 flex items-center justify-center text-gray-400 hover:text-[#FF4C00] hover:border-[#FF4C00] hover:bg-orange-50/20 bg-white transition-all shadow-[0_1px_5px_rgba(0,0,0,0.01)]"
                          title="View Delivery details"
                        >
                          <EyeIcon className="h-4.5 w-4.5" />
                        </button>
                        
                        {/* Call Partner Button */}
                        <button
                          onClick={() => handleOpenCall(del)}
                          className="w-8 h-8 rounded-full border border-gray-150 flex items-center justify-center text-gray-400 hover:text-[#FF4C00] hover:border-[#FF4C00] hover:bg-orange-50/20 bg-white transition-all shadow-[0_1px_5px_rgba(0,0,0,0.01)]"
                          title="Call Delivery Partner"
                        >
                          <PhoneIcon className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
                {filteredDeliveries.length === 0 && (
                  <tr>
                    <td colSpan="9" className="px-6 py-12 text-center text-sm font-bold text-gray-400 uppercase tracking-widest">
                      No matching deliveries found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ========================================================
          VIEW DETAILS DRAWER/MODAL (listing specific pizza sizes)
         ======================================================== */}
      {isViewModalOpen && selectedDelivery && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-gray-150 shadow-[0_25px_60px_rgba(0,0,0,0.15)] animate-in fade-in zoom-in-95 duration-200 relative text-left">
            
            {/* Close */}
            <button 
              onClick={() => setIsViewModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 text-[26px] leading-none focus:outline-none transition-colors"
            >
              &times;
            </button>

            {/* Profile Delivery Header */}
            <div className="flex flex-col items-center text-center mt-3 pb-5 border-b border-gray-100">
              <div className="w-16 h-16 rounded-full bg-[#FFF5F0] border border-orange-100 flex items-center justify-center text-orange-500 shadow-md shadow-orange-100/30 mb-3 select-none">
                <span className="text-2xl">🛵</span>
              </div>
              <h3 className="text-[19px] font-black text-gray-800 tracking-tight">Delivery Manifest</h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{selectedDelivery.orderId}</p>
              
              <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black select-none tracking-wide mt-3.5 ${
                selectedDelivery.status === 'Out for Delivery' ? 'bg-[#EBF8FF] text-[#2B6CB0] border border-[#EBF8FF]' :
                selectedDelivery.status === 'In Transit' ? 'bg-[#FFF5F0] text-[#FF4C00] border border-[#FFF5F0]' :
                selectedDelivery.status === 'Delivered' ? 'bg-[#EBFDF2] text-[#027A48] border border-[#EBFDF2]' :
                selectedDelivery.status === 'Pending' ? 'bg-[#F3F0FF] text-[#553C9A] border border-[#F3F0FF]' :
                'bg-[#FEF3F2] text-[#B42318] border border-[#FEF3F2]'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  selectedDelivery.status === 'Out for Delivery' ? 'bg-[#3182CE]' :
                  selectedDelivery.status === 'In Transit' ? 'bg-[#FF4C00]' :
                  selectedDelivery.status === 'Delivered' ? 'bg-[#12B76A]' :
                  selectedDelivery.status === 'Pending' ? 'bg-[#6B46C1]' :
                  'bg-[#F04438]'
                }`} />
                <span>{selectedDelivery.status}</span>
              </span>
            </div>

            {/* Profile details list */}
            <div className="py-5 space-y-4 text-sm font-semibold text-gray-700">
              
              {/* Customer */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-150 shadow-sm bg-gray-50 flex-shrink-0 select-none">
                  <img src={selectedDelivery.customerAvatar} alt={selectedDelivery.customer} className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Recipient Customer</span>
                  <span className="text-gray-700 font-bold block mt-0.5">{selectedDelivery.customer}</span>
                </div>
              </div>

              {/* Delivery Partner */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-150 shadow-sm bg-gray-50 flex-shrink-0 select-none">
                    <img src={selectedDelivery.partnerAvatar} alt={selectedDelivery.partner} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Delivery Partner</span>
                    <span className="text-gray-700 font-bold block mt-0.5">{selectedDelivery.partner}</span>
                  </div>
                </div>
                {selectedDelivery.favoritePartner && (
                  <span className="flex items-center gap-1 text-[10px] font-black text-[#FF8000] bg-[#FFF5E6] px-2.5 py-0.5 rounded-full uppercase tracking-wider select-none">
                    <SparklesIcon className="w-3 h-3 text-[#FF8000]" />
                    Preferred
                  </span>
                )}
              </div>

              {/* Duration timelines */}
              <div className="grid grid-cols-2 gap-4 bg-[#FAFBFD] p-3.5 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-2">
                  <ClockIcon className="h-5 w-5 text-orange-500" />
                  <div>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Estimated Time</span>
                    <span className="text-sm font-black text-gray-800 block">{selectedDelivery.estTime}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ClockIcon className="h-5 w-5 text-emerald-500" />
                  <div>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Actual Time</span>
                    <span className="text-sm font-black text-gray-800 block">{selectedDelivery.actTime}</span>
                  </div>
                </div>
              </div>

              {/* Specific Pizza Order details showing pizza sizes S, M, L */}
              <div className="border border-gray-150 p-4 rounded-2xl bg-gray-50/20">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Order Items details & Sizes</span>
                <div className="space-y-2">
                  {selectedDelivery.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-gray-100 shadow-[0_1px_5px_rgba(0,0,0,0.01)] text-xs">
                      <div>
                        <span className="font-extrabold text-gray-800">{item.name}</span>
                        <span className="bg-orange-50 text-[#FF4C00] font-black text-[9px] px-1.5 py-0.5 rounded ml-1.5 uppercase select-none tracking-wide">{item.size}</span>
                      </div>
                      <div className="flex gap-4">
                        <span className="text-gray-400 font-bold">Qty: {item.qty}</span>
                        <span className="text-gray-800 font-black">{formatCurrency(item.price * item.qty)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Location Address */}
              <div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Delivery Address Destination</span>
                <div className="flex gap-2 bg-gray-50 p-3.5 rounded-2xl border border-gray-100 text-xs">
                  <MapPinIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <p className="leading-relaxed font-medium text-gray-500">
                    {selectedDelivery.address}
                  </p>
                </div>
              </div>

            </div>

            {/* Actions button */}
            <div className="pt-3 border-t border-gray-50 flex gap-3">
              <button 
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleOpenCall(selectedDelivery);
                }}
                className="flex-1 bg-[#FF4C00] hover:bg-[#e64400] text-white font-extrabold text-xs py-3 rounded-2xl shadow-md shadow-orange-500/10 active:scale-95 transition-all text-center flex items-center justify-center gap-2 h-11"
              >
                <PhoneIcon className="w-4 h-4" />
                <span>Call Delivery Partner</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          INTERACTIVE CALL SIMULATION DIALOG
         ======================================================== */}
      {isCallingModalOpen && selectedDelivery && (
        <div className="fixed inset-0 bg-[#0F172A]/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 text-white rounded-3xl max-w-sm w-full p-8 shadow-[0_25px_60px_rgba(0,0,0,0.45)] text-center animate-in fade-in zoom-in-95 duration-200">
            
            {/* Calling animation ring */}
            <div className="flex flex-col items-center">
              <div className="relative mb-6 select-none">
                <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping"></div>
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-700 bg-slate-800 flex items-center justify-center">
                  <img src={selectedDelivery.partnerAvatar} alt={selectedDelivery.partner} className="w-full h-full object-cover" />
                </div>
              </div>

              <h3 className="text-xl font-black tracking-tight">{selectedDelivery.partner}</h3>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">Delivery Partner</p>
              
              {/* Call State Message */}
              <div className="my-6">
                {callState === 'dialing' ? (
                  <span className="text-sm font-semibold text-emerald-400 animate-pulse block">Dialing phone connection...</span>
                ) : callState === 'connected' ? (
                  <div className="space-y-1">
                    <span className="text-sm font-black text-emerald-400 block">Connected</span>
                    <span className="text-2xl font-mono font-black text-slate-300 block">{formatCallDuration(callTimer)}</span>
                  </div>
                ) : (
                  <span className="text-sm font-bold text-red-400 block">Call Disconnected</span>
                )}
              </div>

              <p className="text-[11px] text-slate-500 font-bold mb-8">
                Simulating secure telephone bridge routing. Real number is encrypted.
              </p>

              {/* End Call Button */}
              <button 
                onClick={handleEndCall}
                className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-500/20 active:scale-90 transition-all focus:outline-none"
              >
                <PhoneIcon className="w-6 h-6 transform rotate-[135deg]" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          SUCCESS TOAST ALERTS (Bottom Center Styling matching details)
         ======================================================== */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-4 bg-white border border-[#D1F2D9] rounded-3xl px-5.5 py-4 shadow-[0_20px_50px_rgba(0,0,0,0.06)] max-w-sm w-[90%] sm:w-full animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Green Circle Check Badge */}
          <div className="w-8 h-8 rounded-full bg-[#EBFDF0] border border-[#D1F2D9] flex items-center justify-center flex-shrink-0 text-green-500 font-bold select-none">
            <CheckCircleIcon className="w-5.5 h-5.5 text-[#12B76A]" />
          </div>
          
          {/* Text message details */}
          <div className="text-left flex-1 min-w-0">
            <h4 className="text-[13.5px] font-black text-gray-900 leading-tight">{toast.title}</h4>
            <p className="text-[11.5px] font-semibold text-gray-400 mt-0.5 truncate leading-tight">{toast.message}</p>
          </div>
          
          {/* Dismiss close cross */}
          <button 
            onClick={() => setToast(null)}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-full focus:outline-none transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      )}

    </div>
  );
};

export default AdminDeliveryPage;
