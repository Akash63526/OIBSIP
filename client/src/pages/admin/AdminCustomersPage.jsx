import React, { useState, useEffect, useMemo } from 'react';
import { 
  UsersIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CheckCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  ShoppingBagIcon,
  CurrencyRupeeIcon
} from '@heroicons/react/24/outline';

// Mock Seed Database matching the provided screenshot exactly!
const INITIAL_CUSTOMERS = [
  { 
    id: 'CUS1001', 
    name: 'Alex Johnson', 
    email: 'alex.johnson@email.com', 
    phone: '+1 987 654 3210', 
    ordersCount: 18, 
    totalSpent: 4250, 
    status: 'Active', 
    joinedOn: '12 May 2025',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&auto=format&fit=crop',
    address: '42, Baker Street, Richmond, London, UK'
  },
  { 
    id: 'CUS1002', 
    name: 'Emma Watson', 
    email: 'emma.watson@email.com', 
    phone: '+1 876 543 2109', 
    ordersCount: 12, 
    totalSpent: 2890, 
    status: 'Active', 
    joinedOn: '10 May 2025',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120&auto=format&fit=crop',
    address: 'Room 501, West End Apartments, Manhattan, NY, USA'
  },
  { 
    id: 'CUS1003', 
    name: 'Michael Brown', 
    email: 'michael.brown@email.com', 
    phone: '+1 765 432 1098', 
    ordersCount: 25, 
    totalSpent: 5760, 
    status: 'Active', 
    joinedOn: '09 May 2025',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop',
    address: '90, Sunset Blvd, West Hollywood, CA, USA'
  },
  { 
    id: 'CUS1004', 
    name: 'Sophia Davis', 
    email: 'sophia.davis@email.com', 
    phone: '+1 654 321 0987', 
    ordersCount: 9, 
    totalSpent: 1980, 
    status: 'Inactive', 
    joinedOn: '05 May 2025',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=120&auto=format&fit=crop',
    address: '101, Central Park Avenue, Sydney, Australia'
  },
  { 
    id: 'CUS1005', 
    name: 'Daniel Taylor', 
    email: 'daniel.taylor@email.com', 
    phone: '+1 543 210 9876', 
    ordersCount: 16, 
    totalSpent: 3450, 
    status: 'Active', 
    joinedOn: '01 May 2025',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=120&auto=format&fit=crop',
    address: '12th Main Road, HSR Layout, Sector 4, Bengaluru, India'
  }
];

// Helper to format currency in Indian Rupees
const formatCurrency = (val) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val);
};

const AdminCustomersPage = () => {
  // Database state persisting in LocalStorage
  const [customers, setCustomers] = useState(() => {
    try {
      const saved = localStorage.getItem('slicesprint_customers');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_CUSTOMERS;
  });

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');

  // Modal Control States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Selected customer for modal activities
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Toast State
  const [toast, setToast] = useState(null);

  // Add Customer form state
  const [addFormData, setAddFormData] = useState({
    name: '',
    email: '',
    phone: '',
    ordersCount: '0',
    totalSpent: '0',
    status: 'Active',
    joinedOn: '',
    address: ''
  });

  // Edit Customer form state
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    ordersCount: '',
    totalSpent: '',
    status: 'Active',
    address: ''
  });

  // Persist DB
  useEffect(() => {
    localStorage.setItem('slicesprint_customers', JSON.stringify(customers));
  }, [customers]);

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
  const filteredCustomers = useMemo(() => {
    return customers.filter(cus => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        cus.name.toLowerCase().includes(query) || 
        cus.email.toLowerCase().includes(query) || 
        cus.phone.toLowerCase().includes(query) ||
        cus.id.toLowerCase().includes(query);

      const matchesStatus = 
        statusFilter === 'All Status' || 
        cus.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [customers, searchQuery, statusFilter]);

  // Handle Add Customer submission
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!addFormData.name || !addFormData.email || !addFormData.phone) {
      alert('Please fill out all required fields.');
      return;
    }

    // Auto generate next Customer ID: CUS1006, CUS1007...
    const numericIds = customers.map(c => parseInt(c.id.replace('CUS', ''), 10)).filter(id => !isNaN(id));
    const nextNumericId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1006;
    const newId = `CUS${nextNumericId}`;

    // Joined Date formatting: e.g. 23 May 2026
    const joinDate = addFormData.joinedOn 
      ? new Date(addFormData.joinedOn).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    // Pick a cute placeholder profile avatar
    const randomAvatarIdx = Math.floor(Math.random() * 8) + 1;
    const avatars = [
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=120&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=120&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=120&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=120&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?q=80&w=120&auto=format&fit=crop'
    ];

    const newCustomer = {
      id: newId,
      name: addFormData.name,
      email: addFormData.email,
      phone: addFormData.phone,
      ordersCount: parseInt(addFormData.ordersCount, 10) || 0,
      totalSpent: parseFloat(addFormData.totalSpent) || 0,
      status: addFormData.status,
      joinedOn: joinDate,
      avatar: avatars[randomAvatarIdx % avatars.length],
      address: addFormData.address || 'Not Provided'
    };

    setCustomers(prev => [...prev, newCustomer]);
    setIsAddModalOpen(false);
    
    // Trigger Success Toast
    setToast({
      title: 'Customer Added Successfully',
      message: `${newCustomer.name} has been added to customer directory.`
    });

    // Reset Form Data
    setAddFormData({
      name: '',
      email: '',
      phone: '',
      ordersCount: '0',
      totalSpent: '0',
      status: 'Active',
      joinedOn: '',
      address: ''
    });
  };

  // Open Edit Modal & Populate Form
  const handleOpenEdit = (customer) => {
    setSelectedCustomer(customer);
    setEditFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      ordersCount: customer.ordersCount.toString(),
      totalSpent: customer.totalSpent.toString(),
      status: customer.status,
      address: customer.address
    });
    setIsEditModalOpen(true);
  };

  // Handle Edit Submit
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editFormData.name || !editFormData.email || !editFormData.phone) {
      alert('Please fill out all required fields.');
      return;
    }

    setCustomers(prev => prev.map(cus => {
      if (cus.id === selectedCustomer.id) {
        return {
          ...cus,
          name: editFormData.name,
          email: editFormData.email,
          phone: editFormData.phone,
          ordersCount: parseInt(editFormData.ordersCount, 10) || 0,
          totalSpent: parseFloat(editFormData.totalSpent) || 0,
          status: editFormData.status,
          address: editFormData.address
        };
      }
      return cus;
    }));

    setIsEditModalOpen(false);

    setToast({
      title: 'Customer Details Updated',
      message: `${selectedCustomer.name}'s customer file has been updated.`
    });
  };

  // Open Delete Confirmation Dialog
  const handleOpenDeleteConfirm = (customer) => {
    setSelectedCustomer(customer);
    setIsDeleteConfirmOpen(true);
  };

  // Execute Deletion
  const handleDeleteExecute = () => {
    setCustomers(prev => prev.filter(cus => cus.id !== selectedCustomer.id));
    setIsDeleteConfirmOpen(false);

    setToast({
      title: 'Customer Removed',
      message: `${selectedCustomer.name} has been deleted from customer list.`
    });
  };

  // Open View Details Dialog
  const handleOpenView = (customer) => {
    setSelectedCustomer(customer);
    setIsViewModalOpen(true);
  };

  return (
    <div className="bg-[#FAFBFD] min-h-screen pb-16 font-sans text-left">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* --- PAGE HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          
          {/* Headline & Breadcrumb */}
          <div className="flex items-center gap-4">
            {/* Orange Users Icon Box */}
            <div className="w-12 h-12 rounded-2xl bg-[#FFF5F0] border border-orange-100 flex items-center justify-center text-orange-500 shadow-md shadow-orange-100/30 flex-shrink-0">
              <UsersIcon className="h-6.5 w-6.5 text-[#FF4C00]" />
            </div>
            <div>
              <h1 className="text-[26px] font-black text-gray-900 tracking-tight leading-tight">Customers</h1>
              <p className="text-sm font-medium text-gray-400 mt-1 leading-none">Manage all registered customers and their details</p>
            </div>
          </div>

          {/* Search, Filter, and Action Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 flex-1 md:flex-initial max-w-2xl">
            
            {/* Search Bar Input */}
            <div className="relative flex-1 sm:w-64 min-w-[200px]">
              <span className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-gray-400">
                <MagnifyingGlassIcon className="h-5 w-5" />
              </span>
              <input
                type="text"
                placeholder="Search customers..."
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
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Add Customer Button */}
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#FF4C00] hover:bg-[#e64400] text-white font-extrabold text-sm px-6 py-2.5 rounded-2xl shadow-lg shadow-orange-500/15 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 h-10.5"
            >
              <PlusIcon className="h-5 w-5 stroke-[2.5]" />
              <span>Add Customer</span>
            </button>

          </div>
        </div>

        {/* --- CUSTOMERS DATA TABLE --- */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_15px_45px_rgba(0,0,0,0.015)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 align-middle">
              <thead className="bg-[#FAFBFD]">
                <tr className="text-left text-xs font-black text-gray-400 uppercase tracking-widest">
                  <th className="px-6 py-5">Customer ID</th>
                  <th className="px-6 py-5">Name</th>
                  <th className="px-6 py-5">Email</th>
                  <th className="px-6 py-5">Phone</th>
                  <th className="px-6 py-5 text-center">Total Orders</th>
                  <th className="px-6 py-5 text-center">Total Spent</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5">Joined On</th>
                  <th className="px-6 py-5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 bg-white">
                {filteredCustomers.map((cus) => (
                  <tr key={cus.id} className="hover:bg-gray-50/30 transition-colors">
                    
                    {/* Customer ID */}
                    <td className="px-6 py-4.5 text-sm font-bold text-gray-400">
                      {cus.id}
                    </td>

                    {/* Name with circular Avatar */}
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-150 shadow-sm bg-gray-50 flex-shrink-0 select-none">
                          <img src={cus.avatar} alt={cus.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="font-extrabold text-[14.5px] text-gray-800">{cus.name}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4.5 text-[13.5px] font-semibold text-gray-500">
                      {cus.email}
                    </td>

                    {/* Phone */}
                    <td className="px-6 py-4.5 text-[13.5px] font-bold text-gray-600">
                      {cus.phone}
                    </td>

                    {/* Total Orders */}
                    <td className="px-6 py-4.5 text-center font-extrabold text-[14px] text-gray-700">
                      {cus.ordersCount}
                    </td>

                    {/* Total Spent */}
                    <td className="px-6 py-4.5 text-center font-black text-[14px] text-gray-800">
                      {formatCurrency(cus.totalSpent)}
                    </td>

                    {/* Status Pill with dot bullet */}
                    <td className="px-6 py-4.5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black select-none tracking-wide ${
                        cus.status === 'Active'
                          ? 'bg-[#EBFDF2] text-[#027A48]'
                          : 'bg-[#FEF3F2] text-[#B42318]'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          cus.status === 'Active' ? 'bg-[#12B76A]' : 'bg-[#F04438]'
                        }`} />
                        <span>{cus.status}</span>
                      </span>
                    </td>

                    {/* Joined On date */}
                    <td className="px-6 py-4.5 text-[13.5px] font-bold text-gray-600">
                      {cus.joinedOn}
                    </td>

                    {/* Action buttons (View, Edit, Delete) matching styling */}
                    <td className="px-6 py-4.5">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* View Button */}
                        <button
                          onClick={() => handleOpenView(cus)}
                          className="w-8 h-8 rounded-full border border-gray-150 flex items-center justify-center text-gray-400 hover:text-[#FF4C00] hover:border-[#FF4C00] hover:bg-orange-50/20 bg-white transition-all shadow-[0_1px_5px_rgba(0,0,0,0.01)]"
                          title="View Profile details"
                        >
                          <EyeIcon className="h-4.5 w-4.5" />
                        </button>
                        
                        {/* Edit Button */}
                        <button
                          onClick={() => handleOpenEdit(cus)}
                          className="w-8 h-8 rounded-full border border-gray-150 flex items-center justify-center text-gray-400 hover:text-[#FF4C00] hover:border-[#FF4C00] hover:bg-orange-50/20 bg-white transition-all shadow-[0_1px_5px_rgba(0,0,0,0.01)]"
                          title="Edit Customer info"
                        >
                          <PencilIcon className="h-4.5 w-4.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleOpenDeleteConfirm(cus)}
                          className="w-8 h-8 rounded-full border border-gray-150 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-400 hover:bg-red-50/20 bg-white transition-all shadow-[0_1px_5px_rgba(0,0,0,0.01)]"
                          title="Remove Customer"
                        >
                          <TrashIcon className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
                {filteredCustomers.length === 0 && (
                  <tr>
                    <td colSpan="9" className="px-6 py-12 text-center text-sm font-bold text-gray-400 uppercase tracking-widest">
                      No matching customers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ========================================================
          ADD CUSTOMER MODAL
         ======================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6.5 border border-gray-100 shadow-[0_25px_60px_rgba(0,0,0,0.15)] animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-5 border-b border-gray-50 pb-3">
              <h3 className="text-[18px] font-black text-gray-900 tracking-tight">Create Customer File</h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none focus:outline-none transition-colors"
              >
                &times;
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Full Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Alex Johnson"
                  value={addFormData.name}
                  onChange={e => setAddFormData({ ...addFormData, name: e.target.value })}
                  className="w-full bg-[#FAFBFD] text-sm px-4 py-2.5 border border-gray-200/80 rounded-2xl focus:border-[#FF4C00] focus:ring-4 focus:ring-[#FF4C00]/5 focus:bg-white transition-all font-bold text-gray-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Email Address *</label>
                  <input 
                    type="email" 
                    required
                    placeholder="name@email.com"
                    value={addFormData.email}
                    onChange={e => setAddFormData({ ...addFormData, email: e.target.value })}
                    className="w-full bg-[#FAFBFD] text-sm px-4 py-2.5 border border-gray-200/80 rounded-2xl focus:border-[#FF4C00] focus:ring-4 focus:ring-[#FF4C00]/5 focus:bg-white transition-all font-bold text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Phone Number *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="+1 987 654 3210"
                    value={addFormData.phone}
                    onChange={e => setAddFormData({ ...addFormData, phone: e.target.value })}
                    className="w-full bg-[#FAFBFD] text-sm px-4 py-2.5 border border-gray-200/80 rounded-2xl focus:border-[#FF4C00] focus:ring-4 focus:ring-[#FF4C00]/5 focus:bg-white transition-all font-bold text-gray-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Total Orders</label>
                  <input 
                    type="number" 
                    min="0"
                    value={addFormData.ordersCount}
                    onChange={e => setAddFormData({ ...addFormData, ordersCount: e.target.value })}
                    className="w-full bg-[#FAFBFD] text-sm px-4 py-2.5 border border-gray-200/80 rounded-2xl focus:border-[#FF4C00] focus:ring-4 focus:ring-[#FF4C00]/5 focus:bg-white transition-all font-bold text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Total Spent (₹)</label>
                  <input 
                    type="number" 
                    min="0"
                    value={addFormData.totalSpent}
                    onChange={e => setAddFormData({ ...addFormData, totalSpent: e.target.value })}
                    className="w-full bg-[#FAFBFD] text-sm px-4 py-2.5 border border-gray-200/80 rounded-2xl focus:border-[#FF4C00] focus:ring-4 focus:ring-[#FF4C00]/5 focus:bg-white transition-all font-bold text-gray-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Joined On</label>
                  <input 
                    type="date" 
                    value={addFormData.joinedOn}
                    onChange={e => setAddFormData({ ...addFormData, joinedOn: e.target.value })}
                    className="w-full bg-[#FAFBFD] text-sm px-4 py-2.5 border border-gray-200/80 rounded-2xl focus:border-[#FF4C00] focus:ring-4 focus:ring-[#FF4C00]/5 focus:bg-white transition-all font-bold text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Physical Address</label>
                <textarea 
                  rows="2"
                  placeholder="Street address, City, Pin code"
                  value={addFormData.address}
                  onChange={e => setAddFormData({ ...addFormData, address: e.target.value })}
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
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          EDIT CUSTOMER MODAL
         ======================================================== */}
      {isEditModalOpen && selectedCustomer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6.5 border border-gray-100 shadow-[0_25px_60px_rgba(0,0,0,0.15)] animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-5 border-b border-gray-50 pb-3">
              <h3 className="text-[18px] font-black text-gray-900 tracking-tight">Edit Customer: {selectedCustomer.id}</h3>
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
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Full Name *</label>
                <input 
                  type="text" 
                  required
                  value={editFormData.name}
                  onChange={e => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full bg-[#FAFBFD] text-sm px-4 py-2.5 border border-gray-200/80 rounded-2xl focus:border-[#FF4C00] focus:ring-4 focus:ring-[#FF4C00]/5 focus:bg-white transition-all font-bold text-gray-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Email Address *</label>
                  <input 
                    type="email" 
                    required
                    value={editFormData.email}
                    onChange={e => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full bg-[#FAFBFD] text-sm px-4 py-2.5 border border-gray-200/80 rounded-2xl focus:border-[#FF4C00] focus:ring-4 focus:ring-[#FF4C00]/5 focus:bg-white transition-all font-bold text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Phone Number *</label>
                  <input 
                    type="text" 
                    required
                    value={editFormData.phone}
                    onChange={e => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full bg-[#FAFBFD] text-sm px-4 py-2.5 border border-gray-200/80 rounded-2xl focus:border-[#FF4C00] focus:ring-4 focus:ring-[#FF4C00]/5 focus:bg-white transition-all font-bold text-gray-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Total Orders</label>
                  <input 
                    type="number" 
                    min="0"
                    value={editFormData.ordersCount}
                    onChange={e => setEditFormData({ ...editFormData, ordersCount: e.target.value })}
                    className="w-full bg-[#FAFBFD] text-sm px-4 py-2.5 border border-gray-200/80 rounded-2xl focus:border-[#FF4C00] focus:ring-4 focus:ring-[#FF4C00]/5 focus:bg-white transition-all font-bold text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Total Spent (₹)</label>
                  <input 
                    type="number" 
                    min="0"
                    value={editFormData.totalSpent}
                    onChange={e => setEditFormData({ ...editFormData, totalSpent: e.target.value })}
                    className="w-full bg-[#FAFBFD] text-sm px-4 py-2.5 border border-gray-200/80 rounded-2xl focus:border-[#FF4C00] focus:ring-4 focus:ring-[#FF4C00]/5 focus:bg-white transition-all font-bold text-gray-800"
                  />
                </div>
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
              </div>

              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Physical Address</label>
                <textarea 
                  rows="2"
                  value={editFormData.address}
                  onChange={e => setEditFormData({ ...editFormData, address: e.target.value })}
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
          VIEW DETAILS MODAL (drawer style profile card)
         ======================================================== */}
      {isViewModalOpen && selectedCustomer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-gray-150 shadow-[0_25px_60px_rgba(0,0,0,0.15)] animate-in fade-in zoom-in-95 duration-200 relative text-left">
            
            {/* Close */}
            <button 
              onClick={() => setIsViewModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 text-[26px] leading-none focus:outline-none transition-colors"
            >
              &times;
            </button>

            {/* Profile Avatar & Title */}
            <div className="flex flex-col items-center text-center mt-3 pb-5 border-b border-gray-100">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white ring-4 ring-orange-50/80 shadow-md bg-gray-50 mb-3 select-none">
                <img src={selectedCustomer.avatar} alt={selectedCustomer.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-[19px] font-black text-gray-800 tracking-tight">{selectedCustomer.name}</h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{selectedCustomer.id}</p>
              
              <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black select-none tracking-wide mt-3 ${
                selectedCustomer.status === 'Active'
                  ? 'bg-[#EBFDF2] text-[#027A48]'
                  : 'bg-[#FEF3F2] text-[#B42318]'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  selectedCustomer.status === 'Active' ? 'bg-[#12B76A]' : 'bg-[#F04438]'
                }`} />
                <span>{selectedCustomer.status}</span>
              </span>
            </div>

            {/* Details Profile list */}
            <div className="py-5 space-y-4 text-sm font-semibold text-gray-700">
              <div className="flex items-center gap-3.5">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Email Address</span>
                  <span className="text-gray-700 font-bold block mt-0.5">{selectedCustomer.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <PhoneIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Phone Number</span>
                  <span className="text-gray-700 font-bold block mt-0.5">{selectedCustomer.phone}</span>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Member Since</span>
                  <span className="text-gray-700 font-bold block mt-0.5">{selectedCustomer.joinedOn}</span>
                </div>
              </div>

              {/* Purchase statistics */}
              <div className="grid grid-cols-2 gap-4 bg-[#FAFBFD] p-3.5 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-2">
                  <ShoppingBagIcon className="h-5 w-5 text-orange-500" />
                  <div>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Orders Placed</span>
                    <span className="text-base font-black text-gray-800 block">{selectedCustomer.ordersCount}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CurrencyRupeeIcon className="h-5 w-5 text-emerald-500" />
                  <div>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Total Spent</span>
                    <span className="text-base font-black text-gray-800 block">{formatCurrency(selectedCustomer.totalSpent)}</span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Active Delivery Address</span>
                <p className="text-xs leading-normal font-medium text-gray-500 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                  {selectedCustomer.address}
                </p>
              </div>
            </div>

            {/* Actions button */}
            <div className="pt-3 border-t border-gray-50 flex gap-3">
              <button 
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleOpenEdit(selectedCustomer);
                }}
                className="flex-1 bg-[#FF4C00] hover:bg-[#e64400] text-white font-extrabold text-xs py-3 rounded-2xl shadow-md shadow-orange-500/10 active:scale-95 transition-all text-center"
              >
                Edit Customer Details
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          DELETE CONFIRMATION DIALOG
         ======================================================== */}
      {isDeleteConfirmOpen && selectedCustomer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-gray-100 shadow-[0_25px_60px_rgba(0,0,0,0.15)] text-center animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-[18px] font-black text-gray-900 tracking-tight mb-2">Delete Customer File?</h3>
            <p className="text-xs font-semibold text-gray-400 leading-relaxed px-2">
              Are you sure you want to permanently delete the customer profile for **{selectedCustomer.name}**? This action cannot be undone.
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
          SUCCESS TOAST ALERTS (Bottom Center Styling matching settings)
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

export default AdminCustomersPage;
