import React, { useState, useEffect, useMemo } from 'react';
import { 
  TicketIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CheckCircleIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
  ShoppingBagIcon,
  SparklesIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

// Pre-seeded mock database matching the provided screenshot exactly!
const INITIAL_COUPONS = [
  {
    code: 'WELCOME20',
    name: 'Welcome Offer - 20% OFF',
    description: 'Flat 20% off on your first order',
    type: 'Percentage',
    discount: '20% OFF',
    minOrder: 199,
    usage: '125 / 500',
    validity: '10 May 2025 - 31 May 2025',
    status: 'Active',
    isNew: true,
    priority: true,
    applicableSize: 'All Sizes',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=120&auto=format&fit=crop'
  },
  {
    code: 'PIZZA50',
    name: 'Flat ₹50 OFF',
    description: 'Flat ₹50 off on orders above ₹299',
    type: 'Fixed',
    discount: '₹50 OFF',
    minOrder: 299,
    usage: '230 / 1000',
    validity: '01 May 2025 - 31 May 2025',
    status: 'Active',
    isNew: false,
    priority: true,
    applicableSize: 'Medium',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=120&auto=format&fit=crop'
  },
  {
    code: 'MEGA100',
    name: 'Mega Discount',
    description: 'Flat ₹100 off on orders above ₹699',
    type: 'Fixed',
    discount: '₹100 OFF',
    minOrder: 699,
    usage: '75 / 500',
    validity: '05 May 2025 - 25 May 2025',
    status: 'Active',
    isNew: false,
    priority: false,
    applicableSize: 'Large',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=120&auto=format&fit=crop'
  },
  {
    code: 'FREESHIP',
    name: 'Free Delivery',
    description: 'Free delivery on all orders',
    type: 'Free Shipping',
    discount: 'Free Delivery',
    minOrder: 0,
    usage: '320 / ∞',
    validity: '01 May 2025 - 31 May 2025',
    status: 'Active',
    isNew: false,
    priority: false,
    applicableSize: 'All Sizes',
    image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?q=80&w=120&auto=format&fit=crop'
  },
  {
    code: 'WEEKEND30',
    name: 'Weekend Special',
    description: '30% off on all weekend orders',
    type: 'Percentage',
    discount: '30% OFF',
    minOrder: 249,
    usage: '90 / 300',
    validity: 'Every Sat - Sun',
    status: 'Inactive',
    isNew: false,
    priority: false,
    applicableSize: 'Medium',
    image: 'https://images.unsplash.com/photo-1571066811602-71683a3f680d?q=80&w=120&auto=format&fit=crop'
  }
];

const formatCurrency = (val) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val);
};

const AdminOffersPage = () => {
  // DB state persisting in LocalStorage
  const [coupons, setCoupons] = useState(() => {
    try {
      const saved = localStorage.getItem('slicesprint_coupons');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_COUPONS;
  });

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');

  // Modal Control States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Selected coupon details
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  // Add Coupon form state
  const [addFormData, setAddFormData] = useState({
    code: '',
    name: '',
    description: '',
    type: 'Percentage',
    discount: '',
    minOrder: '',
    usageLimit: '500',
    validityStart: '',
    validityEnd: '',
    status: 'Active',
    priority: false,
    applicableSize: 'All Sizes'
  });

  // Edit Coupon form state
  const [editFormData, setEditFormData] = useState({
    code: '',
    name: '',
    description: '',
    type: 'Percentage',
    discount: '',
    minOrder: '',
    usageLimit: '',
    validityStart: '',
    validityEnd: '',
    status: 'Active',
    priority: false,
    applicableSize: 'All Sizes'
  });

  // Toast notifications state
  const [toast, setToast] = useState(null);

  // Persist DB
  useEffect(() => {
    localStorage.setItem('slicesprint_coupons', JSON.stringify(coupons));
  }, [coupons]);

  // Toast Auto-dismiss
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Search and Filter Logic
  const filteredCoupons = useMemo(() => {
    return coupons.filter(c => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        c.code.toLowerCase().includes(query) || 
        c.name.toLowerCase().includes(query) || 
        c.description.toLowerCase().includes(query);

      const matchesType = 
        typeFilter === 'All Types' || 
        c.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [coupons, searchQuery, typeFilter]);

  // Toggle bestseller priority star (Like button toggler matching requirements)
  const handleTogglePriority = (code) => {
    const coupon = coupons.find(c => c.code === code);
    if (!coupon) return;
    const newPriorityState = !coupon.priority;

    setCoupons(prev => prev.map(c => {
      if (c.code === code) {
        return { ...c, priority: newPriorityState };
      }
      return c;
    }));

    setToast({
      title: 'Promo Priority Updated',
      message: `${coupon.code} is ${newPriorityState ? 'now marked' : 'no longer marked'} as a featured priority offer.`
    });
  };

  // Toggle Status
  const handleToggleStatus = (code) => {
    const coupon = coupons.find(c => c.code === code);
    if (!coupon) return;
    const newStatus = coupon.status === 'Active' ? 'Inactive' : 'Active';

    setCoupons(prev => prev.map(c => {
      if (c.code === code) {
        return { ...c, status: newStatus };
      }
      return c;
    }));

    setToast({
      title: 'Coupon Status Toggled',
      message: `${coupon.code} status successfully updated to ${newStatus}.`
    });
  };

  // Handle Add Submit
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!addFormData.code || !addFormData.name || !addFormData.discount) {
      alert('Please fill out all required fields.');
      return;
    }

    const start = addFormData.validityStart 
      ? new Date(addFormData.validityStart).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      : '10 May 2025';
    const end = addFormData.validityEnd
      ? new Date(addFormData.validityEnd).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      : '31 May 2025';
    const validitySpan = `${start} - ${end}`;

    const promoImages = [
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=120&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=120&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=120&auto=format&fit=crop'
    ];

    const newCoupon = {
      code: addFormData.code.toUpperCase().trim(),
      name: addFormData.name,
      description: addFormData.description || 'Exclusive promotional discount.',
      type: addFormData.type,
      discount: addFormData.discount,
      minOrder: parseFloat(addFormData.minOrder) || 0,
      usage: `0 / ${addFormData.usageLimit || '∞'}`,
      validity: validitySpan,
      status: addFormData.status,
      isNew: true,
      priority: addFormData.priority,
      applicableSize: addFormData.applicableSize,
      image: promoImages[Math.floor(Math.random() * promoImages.length)]
    };

    setCoupons(prev => [...prev, newCoupon]);
    setIsAddModalOpen(false);

    setToast({
      title: 'Coupon Created Successfully',
      message: `${newCoupon.code} has been added to available promotions.`
    });

    // Reset Form
    setAddFormData({
      code: '',
      name: '',
      description: '',
      type: 'Percentage',
      discount: '',
      minOrder: '',
      usageLimit: '500',
      validityStart: '',
      validityEnd: '',
      status: 'Active',
      priority: false,
      applicableSize: 'All Sizes'
    });
  };

  // Open Edit Modal & Populate Form
  const handleOpenEdit = (coupon) => {
    setSelectedCoupon(coupon);
    setEditFormData({
      code: coupon.code,
      name: coupon.name,
      description: coupon.description,
      type: coupon.type,
      discount: coupon.discount,
      minOrder: coupon.minOrder.toString(),
      usageLimit: coupon.usage.split(' / ')[1] || '500',
      validityStart: '',
      validityEnd: '',
      status: coupon.status,
      priority: coupon.priority,
      applicableSize: coupon.applicableSize
    });
    setIsEditModalOpen(true);
  };

  // Handle Edit Submit
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editFormData.name || !editFormData.discount) {
      alert('Please fill out all required fields.');
      return;
    }

    setCoupons(prev => prev.map(c => {
      if (c.code === selectedCoupon.code) {
        return {
          ...c,
          name: editFormData.name,
          description: editFormData.description,
          type: editFormData.type,
          discount: editFormData.discount,
          minOrder: parseFloat(editFormData.minOrder) || 0,
          usage: `0 / ${editFormData.usageLimit || '∞'}`,
          status: editFormData.status,
          priority: editFormData.priority,
          applicableSize: editFormData.applicableSize
        };
      }
      return c;
    }));

    setIsEditModalOpen(false);

    setToast({
      title: 'Coupon Parameters Updated',
      message: `${selectedCoupon.code} discount criteria updated successfully.`
    });
  };

  // Open Delete Confirmation
  const handleOpenDeleteConfirm = (coupon) => {
    setSelectedCoupon(coupon);
    setIsDeleteConfirmOpen(true);
  };

  // Execute Deletion
  const handleDeleteExecute = () => {
    setCoupons(prev => prev.filter(c => c.code !== selectedCoupon.code));
    setIsDeleteConfirmOpen(false);

    setToast({
      title: 'Coupon Deleted',
      message: `${selectedCoupon.code} has been permanently purged.`
    });
  };

  const handleOpenView = (coupon) => {
    setSelectedCoupon(coupon);
    setIsViewModalOpen(true);
  };

  return (
    <div className="bg-[#FAFBFD] min-h-screen pb-16 font-sans text-left">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* --- PAGE HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          
          {/* Brand Headline & Subtitle */}
          <div className="flex items-center gap-4">
            {/* Orange Ticket Icon Box */}
            <div className="w-12 h-12 rounded-2xl bg-[#FFF5F0] border border-orange-100 flex items-center justify-center shadow-md shadow-orange-100/30 flex-shrink-0">
              <TicketIcon className="h-6.5 w-6.5 text-[#FF4C00]" />
            </div>
            <div>
              <h1 className="text-[26px] font-black text-gray-900 tracking-tight leading-tight">Offers & Coupons</h1>
              <p className="text-sm font-medium text-gray-400 mt-1 leading-none">Create and manage offers, discounts and coupons</p>
            </div>
          </div>

          {/* Search, Filter, and Add controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 flex-1 md:flex-initial max-w-2xl">
            
            {/* Search Bar Input */}
            <div className="relative flex-1 sm:w-64 min-w-[200px]">
              <span className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-gray-400">
                <MagnifyingGlassIcon className="h-5 w-5" />
              </span>
              <input
                type="text"
                placeholder="Search offers or coupons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-sm pl-11 pr-4 py-2.5 rounded-2xl border border-gray-150 focus:outline-none focus:border-[#FF4C00] focus:ring-4 focus:ring-[#FF4C00]/5 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.01)] font-medium placeholder:text-gray-400"
              />
            </div>

            {/* Dropdown Type Filter */}
            <div className="relative min-w-[130px] flex-shrink-0">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full bg-white text-sm font-bold pl-4 pr-10 py-2.5 rounded-2xl border border-gray-150 focus:outline-none focus:border-[#FF4C00] transition-all cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.01)] appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%239ca3af%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25em_1.25em] bg-[right_1rem_center] bg-no-repeat text-gray-700"
              >
                <option value="All Types">All Types</option>
                <option value="Percentage">Percentage</option>
                <option value="Fixed">Fixed</option>
                <option value="Free Shipping">Free Shipping</option>
              </select>
            </div>

            {/* Create New Button */}
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#FF4C00] hover:bg-[#e64400] text-white font-extrabold text-sm px-6 py-2.5 rounded-2xl shadow-lg shadow-orange-500/15 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 h-10.5"
            >
              <PlusIcon className="h-5 w-5 stroke-[2.5]" />
              <span>Create New</span>
            </button>

          </div>
        </div>

        {/* --- COUPONS DATA TABLE --- */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_15px_45px_rgba(0,0,0,0.015)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 align-middle">
              <thead className="bg-[#FAFBFD]">
                <tr className="text-left text-xs font-black text-gray-400 uppercase tracking-widest">
                  <th className="px-6 py-5">Code</th>
                  <th className="px-6 py-5">Offer / Coupon</th>
                  <th className="px-6 py-5">Type</th>
                  <th className="px-6 py-5">Discount</th>
                  <th className="px-6 py-5">Min. Order</th>
                  <th className="px-6 py-5">Usage</th>
                  <th className="px-6 py-5">Validity</th>
                  <th className="px-6 py-5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 bg-white">
                {filteredCoupons.map((coupon) => (
                  <tr key={coupon.code} className="hover:bg-gray-50/30 transition-colors">
                    
                    {/* Code Column (with custom image thumbnail and green new badge!) */}
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-3">
                        {/* Food Voucher/Coupon Image next to Code */}
                        <div className="w-9 h-9 rounded-xl overflow-hidden border border-gray-150 bg-gray-50 shadow-sm flex-shrink-0 select-none">
                          <img src={coupon.image} alt={coupon.code} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-[14.5px] text-gray-800 uppercase tracking-tight">{coupon.code}</span>
                          {coupon.isNew && (
                            <span className="bg-[#EBFDF2] text-[#12B76A] font-black text-[9px] px-1.5 py-0.5 rounded select-none uppercase tracking-wide border border-[#D1F2D9]">
                              New
                            </span>
                          )}
                          {/* Priority Bestseller Star next to it! */}
                          <button
                            onClick={() => handleTogglePriority(coupon.code)}
                            className="text-gray-300 hover:text-orange-500 transition-colors ml-1 focus:outline-none"
                            title="Toggle Promo Priority"
                          >
                            {coupon.priority ? (
                              <StarIconSolid className="w-4 h-4 text-[#FF9E00]" />
                            ) : (
                              <span className="text-xs text-gray-300 hover:text-gray-400 select-none block leading-none">☆</span>
                            )}
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Offer/Coupon Name & Subtext */}
                    <td className="px-6 py-4.5">
                      <span className="font-extrabold text-[14.5px] text-gray-800 block leading-snug">{coupon.name}</span>
                      <span className="text-[12px] font-semibold text-gray-400 block mt-0.5 leading-none">{coupon.description}</span>
                    </td>

                    {/* Coupon Type Pill Badge */}
                    <td className="px-6 py-4.5">
                      <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded text-[11px] font-black uppercase select-none tracking-wider ${
                        coupon.type === 'Percentage' ? 'bg-[#F3F0FF] text-[#553C9A] border border-[#F3F0FF]' :
                        coupon.type === 'Fixed' ? 'bg-[#EBF8FF] text-[#2B6CB0] border border-[#EBF8FF]' :
                        'bg-[#FFF5E6] text-[#D47A00] border border-[#FFF5E6]'
                      }`}>
                        {coupon.type}
                      </span>
                    </td>

                    {/* Discount value */}
                    <td className="px-6 py-4.5 text-[14px] font-black text-gray-800">
                      {coupon.discount}
                    </td>

                    {/* Minimum order limit */}
                    <td className="px-6 py-4.5 text-[14px] font-bold text-gray-500">
                      {coupon.minOrder === 0 ? '₹0' : formatCurrency(coupon.minOrder)}
                    </td>

                    {/* Usage counts */}
                    <td className="px-6 py-4.5 text-[13.5px] font-bold text-gray-600">
                      {coupon.usage}
                    </td>

                    {/* Validity range */}
                    <td className="px-6 py-4.5 text-[13.5px] font-bold text-gray-600">
                      {coupon.validity}
                    </td>

                    {/* Action buttons (View, Edit, Delete / Status pill toggles) */}
                    <td className="px-6 py-4.5">
                      <div className="flex items-center justify-center gap-1.5">
                        
                        {/* Status Toggle Pill Badge */}
                        <button
                          onClick={() => handleToggleStatus(coupon.code)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black select-none tracking-wide transition-all border ${
                            coupon.status === 'Active'
                              ? 'bg-[#EBFDF2] text-[#027A48] border-[#ECFDF3] hover:border-[#12B76A]'
                              : 'bg-[#FEF3F2] text-[#B42318] border-[#FEE4E2] hover:border-[#F04438]'
                          }`}
                          title="Toggle Active status"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            coupon.status === 'Active' ? 'bg-[#12B76A]' : 'bg-[#F04438]'
                          }`} />
                          <span>{coupon.status}</span>
                        </button>

                        {/* View Button */}
                        <button
                          onClick={() => handleOpenView(coupon)}
                          className="w-8 h-8 rounded-full border border-gray-150 flex items-center justify-center text-gray-400 hover:text-[#FF4C00] hover:border-[#FF4C00] hover:bg-orange-50/20 bg-white transition-all shadow-[0_1px_5px_rgba(0,0,0,0.01)]"
                          title="View Coupon details"
                        >
                          <EyeIcon className="h-4.5 w-4.5" />
                        </button>
                        
                        {/* Edit Button */}
                        <button
                          onClick={() => handleOpenEdit(coupon)}
                          className="w-8 h-8 rounded-full border border-gray-150 flex items-center justify-center text-gray-400 hover:text-[#FF4C00] hover:border-[#FF4C00] hover:bg-orange-50/20 bg-white transition-all shadow-[0_1px_5px_rgba(0,0,0,0.01)]"
                          title="Edit Coupon criteria"
                        >
                          <PencilIcon className="h-4.5 w-4.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleOpenDeleteConfirm(coupon)}
                          className="w-8 h-8 rounded-full border border-gray-150 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-400 hover:bg-red-50/20 bg-white transition-all shadow-[0_1px_5px_rgba(0,0,0,0.01)]"
                          title="Remove Coupon"
                        >
                          <TrashIcon className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
                {filteredCoupons.length === 0 && (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-sm font-bold text-gray-400 uppercase tracking-widest">
                      No matching coupons found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ========================================================
          CREATE NEW COUPON MODAL (with pizza size limit)
         ======================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6.5 border border-gray-100 shadow-[0_25px_60px_rgba(0,0,0,0.15)] animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-5 border-b border-gray-50 pb-3">
              <h3 className="text-[18px] font-black text-gray-900 tracking-tight">Create Coupon Code</h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none focus:outline-none transition-colors"
              >
                &times;
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Coupon Code *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. SLICESPRINT50"
                    value={addFormData.code}
                    onChange={e => setAddFormData({ ...addFormData, code: e.target.value })}
                    className="w-full bg-[#FAFBFD] text-sm px-4 py-2.5 border border-gray-200/80 rounded-2xl focus:border-[#FF4C00] focus:ring-4 focus:ring-[#FF4C00]/5 focus:bg-white transition-all font-bold text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Discount Criteria *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. 20% OFF or ₹50 OFF"
                    value={addFormData.discount}
                    onChange={e => setAddFormData({ ...addFormData, discount: e.target.value })}
                    className="w-full bg-[#FAFBFD] text-sm px-4 py-2.5 border border-gray-200/80 rounded-2xl focus:border-[#FF4C00] focus:ring-4 focus:ring-[#FF4C00]/5 focus:bg-white transition-all font-bold text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Offer Title *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Welcome Offer - 20% OFF"
                  value={addFormData.name}
                  onChange={e => setAddFormData({ ...addFormData, name: e.target.value })}
                  className="w-full bg-[#FAFBFD] text-sm px-4 py-2.5 border border-gray-200/80 rounded-2xl focus:border-[#FF4C00] focus:ring-4 focus:ring-[#FF4C00]/5 focus:bg-white transition-all font-bold text-gray-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Coupon Type</label>
                  <select 
                    value={addFormData.type}
                    onChange={e => setAddFormData({ ...addFormData, type: e.target.value })}
                    className="w-full bg-[#FAFBFD] text-sm px-4 py-2.5 border border-gray-200/80 rounded-2xl focus:border-[#FF4C00] focus:bg-white transition-all font-bold text-gray-800 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%239ca3af%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25em_1.25em] bg-[right_1rem_center] bg-no-repeat"
                  >
                    <option value="Percentage">Percentage</option>
                    <option value="Fixed">Fixed</option>
                    <option value="Free Shipping">Free Shipping</option>
                  </select>
                </div>

                {/* Applicable Pizza Size restriction dropdown selector! */}
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Pizza Size Restriction</label>
                  <select 
                    value={addFormData.applicableSize}
                    onChange={e => setAddFormData({ ...addFormData, applicableSize: e.target.value })}
                    className="w-full bg-[#FAFBFD] text-sm px-4 py-2.5 border border-gray-200/80 rounded-2xl focus:border-[#FF4C00] focus:bg-white transition-all font-bold text-gray-800 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%239ca3af%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25em_1.25em] bg-[right_1rem_center] bg-no-repeat"
                  >
                    <option value="All Sizes">All Sizes Applicable</option>
                    <option value="Small">Small Size Only</option>
                    <option value="Medium">Medium Size Only</option>
                    <option value="Large">Large Size Only</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Min. Order (₹) *</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    placeholder="e.g. 199"
                    value={addFormData.minOrder}
                    onChange={e => setAddFormData({ ...addFormData, minOrder: e.target.value })}
                    className="w-full bg-[#FAFBFD] text-sm px-4 py-2.5 border border-gray-200/80 rounded-2xl focus:border-[#FF4C00] focus:ring-4 focus:ring-[#FF4C00]/5 focus:bg-white transition-all font-bold text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Usage Limit *</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    placeholder="e.g. 500"
                    value={addFormData.usageLimit}
                    onChange={e => setAddFormData({ ...addFormData, usageLimit: e.target.value })}
                    className="w-full bg-[#FAFBFD] text-sm px-4 py-2.5 border border-gray-200/80 rounded-2xl focus:border-[#FF4C00] focus:ring-4 focus:ring-[#FF4C00]/5 focus:bg-white transition-all font-bold text-gray-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Validity Start</label>
                  <input 
                    type="date" 
                    value={addFormData.validityStart}
                    onChange={e => setAddFormData({ ...addFormData, validityStart: e.target.value })}
                    className="w-full bg-[#FAFBFD] text-sm px-4 py-2.5 border border-gray-200/80 rounded-2xl focus:border-[#FF4C00] focus:ring-4 focus:ring-[#FF4C00]/5 focus:bg-white transition-all font-bold text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Validity End</label>
                  <input 
                    type="date" 
                    value={addFormData.validityEnd}
                    onChange={e => setAddFormData({ ...addFormData, validityEnd: e.target.value })}
                    className="w-full bg-[#FAFBFD] text-sm px-4 py-2.5 border border-gray-200/80 rounded-2xl focus:border-[#FF4C00] focus:ring-4 focus:ring-[#FF4C00]/5 focus:bg-white transition-all font-bold text-gray-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Status</label>
                  <select 
                    value={addFormData.status}
                    onChange={e => setAddFormData({ ...addFormData, status: e.target.value })}
                    className="w-full bg-[#FAFBFD] text-sm px-4 py-2.5 border border-gray-200/80 rounded-2xl focus:border-[#FF4C00] focus:bg-white transition-all font-bold text-gray-800 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%239ca3af%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25em_1.25em] bg-[right_1rem_center] bg-no-repeat"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                
                {/* Priority star Toggle */}
                <div className="flex justify-between items-center px-4.5 border border-gray-200/80 bg-[#FAFBFD] rounded-2xl h-[42px] mt-6.5">
                  <span className="text-xs font-bold text-gray-600">Featured Offer</span>
                  <button 
                    type="button"
                    onClick={() => setAddFormData({ ...addFormData, priority: !addFormData.priority })}
                    className={`h-6 w-10.5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
                      addFormData.priority ? 'bg-[#FF4C00]' : 'bg-gray-200'
                    }`}
                  >
                    <div className={`h-5 w-5 rounded-full bg-white transition-transform duration-200 shadow-sm ${
                      addFormData.priority ? 'translate-x-4.5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Offer description *</label>
                <textarea 
                  rows="2"
                  required
                  placeholder="Describe standard terms and criteria..."
                  value={addFormData.description}
                  onChange={e => setAddFormData({ ...addFormData, description: e.target.value })}
                  className="w-full bg-[#FAFBFD] text-sm px-4 py-2.5 border border-gray-200/80 rounded-2xl focus:border-[#FF4C00] focus:ring-4 focus:ring-[#FF4C00]/5 focus:bg-white transition-all font-bold text-gray-800 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-3 border-t border-gray-50 mt-4">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="border border-[#FF4C00] text-[#FF4C00] hover:bg-orange-50/20 px-5.5 py-2.5 rounded-2xl text-[13px] font-black transition-all active:scale-95 h-11"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-[#FF4C00] hover:bg-[#e64400] text-white px-5.5 py-2.5 rounded-2xl text-[13px] font-black shadow-md shadow-orange-500/10 active:scale-95 transition-all h-11"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          EDIT COUPON MODAL (with size criteria)
         ======================================================== */}
      {isEditModalOpen && selectedCoupon && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6.5 border border-gray-100 shadow-[0_25px_60px_rgba(0,0,0,0.15)] animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-5 border-b border-gray-50 pb-3">
              <h3 className="text-[18px] font-black text-gray-900 tracking-tight">Edit Coupon: {selectedCoupon.code}</h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none focus:outline-none transition-colors"
              >
                &times;
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Offer Title *</label>
                <input 
                  type="text" 
                  required
                  value={editFormData.name}
                  onChange={e => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full bg-[#FAFBFD] text-sm px-4 py-2.5 border border-gray-200/80 rounded-2xl focus:border-[#FF4C00] focus:ring-4 focus:ring-[#FF4C00]/5 focus:bg-white transition-all font-bold text-gray-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Discount Value *</label>
                  <input 
                    type="text" 
                    required
                    value={editFormData.discount}
                    onChange={e => setEditFormData({ ...editFormData, discount: e.target.value })}
                    className="w-full bg-[#FAFBFD] text-sm px-4 py-2.5 border border-gray-200/80 rounded-2xl focus:border-[#FF4C00] focus:ring-4 focus:ring-[#FF4C00]/5 focus:bg-white transition-all font-bold text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Pizza Size Restriction</label>
                  <select 
                    value={editFormData.applicableSize}
                    onChange={e => setEditFormData({ ...editFormData, applicableSize: e.target.value })}
                    className="w-full bg-[#FAFBFD] text-sm px-4 py-2.5 border border-gray-200/80 rounded-2xl focus:border-[#FF4C00] focus:bg-white transition-all font-bold text-gray-800 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%239ca3af%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25em_1.25em] bg-[right_1rem_center] bg-no-repeat"
                  >
                    <option value="All Sizes">All Sizes Applicable</option>
                    <option value="Small">Small Size Only</option>
                    <option value="Medium">Medium Size Only</option>
                    <option value="Large">Large Size Only</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Min. Order (₹) *</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    value={editFormData.minOrder}
                    onChange={e => setEditFormData({ ...editFormData, minOrder: e.target.value })}
                    className="w-full bg-[#FAFBFD] text-sm px-4 py-2.5 border border-gray-200/80 rounded-2xl focus:border-[#FF4C00] focus:ring-4 focus:ring-[#FF4C00]/5 focus:bg-white transition-all font-bold text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Usage Limit *</label>
                  <input 
                    type="text" 
                    required
                    value={editFormData.usageLimit}
                    onChange={e => setEditFormData({ ...editFormData, usageLimit: e.target.value })}
                    className="w-full bg-[#FAFBFD] text-sm px-4 py-2.5 border border-gray-200/80 rounded-2xl focus:border-[#FF4C00] focus:ring-4 focus:ring-[#FF4C00]/5 focus:bg-white transition-all font-bold text-gray-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Status</label>
                  <select 
                    value={editFormData.status}
                    onChange={e => setEditFormData({ ...editFormData, status: e.target.value })}
                    className="w-full bg-[#FAFBFD] text-sm px-4 py-2.5 border border-gray-200/80 rounded-2xl focus:border-[#FF4C00] focus:bg-white transition-all font-bold text-gray-800 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%239ca3af%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25em_1.25em] bg-[right_1rem_center] bg-no-repeat"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                
                {/* Priority star Toggle */}
                <div className="flex justify-between items-center px-4.5 border border-gray-200/80 bg-[#FAFBFD] rounded-2xl h-[42px] mt-6.5">
                  <span className="text-xs font-bold text-gray-600">Featured Offer</span>
                  <button 
                    type="button"
                    onClick={() => setEditFormData({ ...editFormData, priority: !editFormData.priority })}
                    className={`h-6 w-10.5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
                      editFormData.priority ? 'bg-[#FF4C00]' : 'bg-gray-200'
                    }`}
                  >
                    <div className={`h-5 w-5 rounded-full bg-white transition-transform duration-200 shadow-sm ${
                      editFormData.priority ? 'translate-x-4.5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Offer description *</label>
                <textarea 
                  rows="2"
                  required
                  value={editFormData.description}
                  onChange={e => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full bg-[#FAFBFD] text-sm px-4 py-2.5 border border-gray-200/80 rounded-2xl focus:border-[#FF4C00] focus:ring-4 focus:ring-[#FF4C00]/5 focus:bg-white transition-all font-bold text-gray-800 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-3 border-t border-gray-50 mt-4">
                <button 
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="border border-[#FF4C00] text-[#FF4C00] hover:bg-orange-50/20 px-5.5 py-2.5 rounded-2xl text-[13px] font-black transition-all active:scale-95 h-11"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-[#FF4C00] hover:bg-[#e64400] text-white px-5.5 py-2.5 rounded-2xl text-[13px] font-black shadow-md shadow-orange-500/10 active:scale-95 transition-all h-11"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          VIEW DETAILS DRAWER/MODAL (showing pizza size eligibility)
         ======================================================== */}
      {isViewModalOpen && selectedCoupon && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-gray-150 shadow-[0_25px_60px_rgba(0,0,0,0.15)] animate-in fade-in zoom-in-95 duration-200 relative text-left">
            
            {/* Close */}
            <button 
              onClick={() => setIsViewModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 text-[26px] leading-none focus:outline-none transition-colors"
            >
              &times;
            </button>

            {/* Profile Coupon details header */}
            <div className="flex flex-col items-center text-center mt-3 pb-5 border-b border-gray-100">
              <div className="w-16 h-16 rounded-3xl overflow-hidden border border-gray-150 shadow-md bg-gray-50 mb-3 select-none">
                <img src={selectedCoupon.image} alt={selectedCoupon.code} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-[19px] font-black text-gray-800 tracking-tight">{selectedCoupon.name}</h3>
              <p className="text-xs font-bold text-[#FF4C00] bg-orange-50 px-2 py-0.5 rounded-md mt-1 font-black select-none tracking-wider uppercase border border-orange-100">{selectedCoupon.code}</p>
              
              <div className="flex items-center gap-2 mt-3 select-none">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wide border ${
                  selectedCoupon.status === 'Active'
                    ? 'bg-[#EBFDF2] text-[#027A48] border-[#ECFDF3]'
                    : 'bg-[#FEF3F2] text-[#B42318] border-[#FEE4E2]'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    selectedCoupon.status === 'Active' ? 'bg-[#12B76A]' : 'bg-[#F04438]'
                  }`} />
                  <span>{selectedCoupon.status}</span>
                </span>
                
                {selectedCoupon.priority && (
                  <span className="inline-flex items-center gap-1 bg-[#FFF5E6] text-[#FF8000] border border-orange-100 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                    <SparklesIcon className="w-3.5 h-3.5" />
                    <span>Featured Priority</span>
                  </span>
                )}
              </div>
            </div>

            {/* details info list */}
            <div className="py-5 space-y-4 text-sm font-semibold text-gray-700">
              
              {/* Type */}
              <div className="flex items-center gap-3.5">
                <TicketIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Discount Type</span>
                  <span className="text-gray-700 font-bold block mt-0.5">{selectedCoupon.type}</span>
                </div>
              </div>

              {/* Usage */}
              <div className="flex items-center gap-3.5">
                <ShoppingBagIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Usage Limit Progress</span>
                  <span className="text-gray-700 font-bold block mt-0.5">{selectedCoupon.usage} uses</span>
                </div>
              </div>

              {/* Validity timeline */}
              <div className="flex items-center gap-3.5">
                <CalendarIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Date Validity Span</span>
                  <span className="text-gray-700 font-bold block mt-0.5">{selectedCoupon.validity}</span>
                </div>
              </div>

              {/* Minimum spend */}
              <div className="grid grid-cols-2 gap-4 bg-[#FAFBFD] p-3.5 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-2">
                  <CurrencyRupeeIcon className="h-5 w-5 text-orange-500" />
                  <div>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Minimum Spend</span>
                    <span className="text-sm font-black text-gray-800 block">{selectedCoupon.minOrder === 0 ? 'No Limit' : formatCurrency(selectedCoupon.minOrder)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <SparklesIcon className="h-5 w-5 text-emerald-500" />
                  <div>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Discount Rate</span>
                    <span className="text-sm font-black text-gray-800 block">{selectedCoupon.discount}</span>
                  </div>
                </div>
              </div>

              {/* Size restrictions capsule ("all the size are also same to same set it") */}
              <div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Applicable Pizza Sizes</span>
                <div className="flex gap-2 bg-[#FFF5F0]/30 p-3 rounded-2xl border border-orange-100/50 text-xs">
                  <span className="text-gray-800 font-bold">
                    This coupon applies only to orders containing: 
                    <span className="bg-[#FFF5F0] text-[#FF4C00] font-black text-[10px] px-2 py-0.5 rounded-md uppercase ml-1.5 select-none border border-orange-100">{selectedCoupon.applicableSize}</span>
                  </span>
                </div>
              </div>

              {/* Terms */}
              <div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Promotion Terms & Notes</span>
                <p className="text-xs leading-relaxed font-medium text-gray-500 bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                  {selectedCoupon.description}. Coupon must be applied at checkout before selecting payment gateway options. Not stackable with other promo codes.
                </p>
              </div>

            </div>

            {/* Actions button */}
            <div className="pt-3 border-t border-gray-50 flex gap-3">
              <button 
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleOpenEdit(selectedCoupon);
                }}
                className="flex-1 bg-[#FF4C00] hover:bg-[#e64400] text-white font-extrabold text-xs py-3 rounded-2xl shadow-md shadow-orange-500/10 active:scale-95 transition-all text-center flex items-center justify-center gap-2 h-11"
              >
                <span>Edit Coupon Criteria</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          DELETE CONFIRMATION DIALOG
         ======================================================== */}
      {isDeleteConfirmOpen && selectedCoupon && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-gray-100 shadow-[0_25px_60px_rgba(0,0,0,0.15)] text-center animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-[18px] font-black text-gray-900 tracking-tight mb-2">Delete Coupon?</h3>
            <p className="text-xs font-semibold text-gray-400 leading-relaxed px-2">
              Are you sure you want to permanently delete **{selectedCoupon.code}**? This action cannot be undone.
            </p>
            
            <div className="flex gap-3 justify-center pt-5 border-t border-gray-50 mt-5">
              <button 
                type="button"
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 py-2.5 rounded-2xl text-xs font-black transition-all active:scale-95"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleDeleteExecute}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-2xl text-xs font-black active:scale-95 shadow-md shadow-red-500/10 transition-all"
              >
                Yes, Delete
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

export default AdminOffersPage;
