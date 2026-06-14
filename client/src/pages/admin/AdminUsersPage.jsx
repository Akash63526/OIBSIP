import React, { useState, useEffect, useMemo } from 'react';
import { 
  UserPlusIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  CheckCircleIcon, 
  XMarkIcon,
  EyeIcon, 
  EllipsisVerticalIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  MapPinIcon, 
  ClockIcon, 
  CalendarIcon, 
  PhoneIcon, 
  ChatBubbleLeftRightIcon, 
  NoSymbolIcon,
  ShieldCheckIcon,
  UserIcon,
  LockClosedIcon,
  ShoppingBagIcon,
  ArrowPathIcon,
  CheckIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

// --- Seed Mock Database ---
const INITIAL_USERS = [
  {
    id: 'SS_USR_001',
    name: 'John Doe',
    email: 'john.doe@email.com',
    role: 'Customer',
    isVerified: true,
    lastLogin: 'May 10, 2024 10:25 AM',
    ordersCount: 28,
    status: 'Active',
    phone: '+91 98765 43210',
    memberSince: 'Apr 12, 2024',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&auto=format&fit=crop',
    addresses: [
      { id: 'addr-1', type: 'Home', text: '101, Green Park Residency, MG Road, Bengaluru - 560001' },
      { id: 'addr-2', type: 'Work', text: 'Room 405, Tech Center Building, Electronic City, Bengaluru - 560100' }
    ],
    activityLog: [
      { id: 'act-1', time: 'May 10, 2024 10:25 AM', event: 'Logged in via Chrome on Web App' },
      { id: 'act-2', time: 'May 10, 2024 10:24 AM', event: 'Placed order #SS_ORD_84521' },
      { id: 'act-3', time: 'May 08, 2024 07:45 PM', event: 'Placed order #SS_ORD_82410' },
      { id: 'act-4', time: 'May 06, 2024 11:20 AM', event: 'Added new delivery address (Work)' }
    ],
    recentOrders: [
      { id: '#SS_ORD_84521', time: 'May 10, 2024 • 10:24 AM', price: 24.99, status: 'Delivered', image: 'https://images.unsplash.com/photo-1571066811602-71683a3f680d?q=80&w=120&auto=format&fit=crop' },
      { id: '#SS_ORD_82410', time: 'May 08, 2024 • 07:45 PM', price: 18.49, status: 'Delivered', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=120&auto=format&fit=crop' },
      { id: '#SS_ORD_81239', time: 'May 05, 2024 • 06:30 PM', price: 27.99, status: 'Delivered', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=120&auto=format&fit=crop' }
    ]
  },
  {
    id: 'SS_USR_002',
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    role: 'Customer',
    isVerified: true,
    lastLogin: 'May 10, 2024 09:15 AM',
    ordersCount: 15,
    status: 'Active',
    phone: '+91 98765 11111',
    memberSince: 'Mar 10, 2024',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120&auto=format&fit=crop',
    addresses: [
      { id: 'addr-3', type: 'Home', text: '45, Sunrise Layout, Indiranagar, Bengaluru - 560038' }
    ],
    activityLog: [
      { id: 'act-5', time: 'May 10, 2024 09:15 AM', event: 'Logged in via Safari on iOS App' },
      { id: 'act-6', time: 'May 09, 2024 08:30 PM', event: 'Updated notification preferences' }
    ],
    recentOrders: [
      { id: '#SS_ORD_84311', time: 'May 09, 2024 • 08:20 PM', price: 15.99, status: 'Delivered', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=120&auto=format&fit=crop' }
    ]
  },
  {
    id: 'SS_USR_003',
    name: 'Rahul Verma',
    email: 'rahul.verma@email.com',
    role: 'Delivery Partner',
    isVerified: true,
    lastLogin: 'May 10, 2024 08:45 AM',
    ordersCount: 56,
    status: 'Active',
    phone: '+91 98765 22222',
    memberSince: 'Jan 15, 2024',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop',
    addresses: [
      { id: 'addr-4', type: 'Work', text: 'Delivery Hub East, Outer Ring Road, Bengaluru' }
    ],
    activityLog: [
      { id: 'act-7', time: 'May 10, 2024 08:45 AM', event: 'Shift Started (Active Status)' }
    ],
    recentOrders: [
      { id: '#SS_ORD_84501', time: 'May 10, 2024 • 08:30 AM', price: 19.49, status: 'Delivered', image: 'https://images.unsplash.com/photo-1571066811602-71683a3f680d?q=80&w=120&auto=format&fit=crop' }
    ]
  },
  {
    id: 'SS_USR_004',
    name: 'Neha Patel',
    email: 'neha.patel@email.com',
    role: 'Customer',
    isVerified: false,
    lastLogin: 'May 09, 2024 07:30 PM',
    ordersCount: 6,
    status: 'Active',
    phone: '+91 98765 33333',
    memberSince: 'May 01, 2024',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=120&auto=format&fit=crop',
    addresses: [
      { id: 'addr-5', type: 'Home', text: '88, Royal Palms Residency, HSR Layout, Bengaluru' }
    ],
    activityLog: [
      { id: 'act-8', time: 'May 09, 2024 07:30 PM', event: 'Failed login attempt (Wrong password)' }
    ],
    recentOrders: [
      { id: '#SS_ORD_81092', time: 'May 05, 2024 • 02:15 PM', price: 34.49, status: 'Delivered', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=120&auto=format&fit=crop' }
    ]
  },
  {
    id: 'SS_USR_005',
    name: 'Amit Kumar',
    email: 'amit.kumar@email.com',
    role: 'Vendor',
    isVerified: true,
    lastLogin: 'May 09, 2024 06:10 PM',
    ordersCount: '-',
    status: 'Active',
    phone: '+91 98765 44444',
    memberSince: 'Feb 20, 2024',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=120&auto=format&fit=crop',
    addresses: [
      { id: 'addr-6', type: 'Store', text: 'SliceSprint Kitchen #22, Koramangala, Bengaluru' }
    ],
    activityLog: [
      { id: 'act-9', time: 'May 09, 2024 06:10 PM', event: 'Inventory count updated' }
    ],
    recentOrders: []
  },
  {
    id: 'SS_USR_006',
    name: 'Suresh Yadav',
    email: 'suresh.yadav@email.com',
    role: 'Delivery Partner',
    isVerified: true,
    lastLogin: 'May 09, 2024 05:05 PM',
    ordersCount: 32,
    status: 'Active',
    phone: '+91 98765 55555',
    memberSince: 'Dec 01, 2023',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=120&auto=format&fit=crop',
    addresses: [
      { id: 'addr-7', type: 'Home', text: '12, Village Road, Whitefield, Bengaluru' }
    ],
    activityLog: [
      { id: 'act-10', time: 'May 09, 2024 05:05 PM', event: 'Cash collection verified ($120.50)' }
    ],
    recentOrders: [
      { id: '#SS_ORD_81992', time: 'May 09, 2024 • 04:30 PM', price: 21.00, status: 'Delivered', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=120&auto=format&fit=crop' }
    ]
  },
  {
    id: 'SS_USR_007',
    name: 'Pooja Singh',
    email: 'pooja.singh@email.com',
    role: 'Customer',
    isVerified: true,
    lastLogin: 'May 09, 2024 03:45 PM',
    ordersCount: 12,
    status: 'Active',
    phone: '+91 98765 66666',
    memberSince: 'Mar 25, 2024',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop',
    addresses: [
      { id: 'addr-8', type: 'Home', text: 'Room 902, Tower B, Prestige Green, Bengaluru' }
    ],
    activityLog: [
      { id: 'act-11', time: 'May 09, 2024 03:45 PM', event: 'Logged in via Android App' }
    ],
    recentOrders: [
      { id: '#SS_ORD_81523', time: 'May 07, 2024 • 01:24 PM', price: 29.99, status: 'Delivered', image: 'https://images.unsplash.com/photo-1571066811602-71683a3f680d?q=80&w=120&auto=format&fit=crop' }
    ]
  },
  {
    id: 'SS_USR_008',
    name: 'Vikram Reddy',
    email: 'vikram.reddy@email.com',
    role: 'Admin',
    isVerified: true,
    lastLogin: 'May 09, 2024 02:20 PM',
    ordersCount: '-',
    status: 'Active',
    phone: '+91 98765 77777',
    memberSince: 'Nov 10, 2023',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=120&auto=format&fit=crop',
    addresses: [
      { id: 'addr-9', type: 'Office', text: 'SliceSprint Corporate Headquarters, Richmond Town, Bengaluru' }
    ],
    activityLog: [
      { id: 'act-12', time: 'May 09, 2024 02:20 PM', event: 'Accessed Admin Settings Dashboard' }
    ],
    recentOrders: []
  }
];

const AdminUsersPage = () => {
  // --- States ---
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('slicesprint_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading users from local storage:', e);
    }
    return INITIAL_USERS;
  });

  const [selectedUserId, setSelectedUserId] = useState('SS_USR_001');
  const [isDetailOpen, setIsDetailOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [activeTab, setActiveTab] = useState('Profile Overview');

  // Floating notifications state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Add User simple mock state modal
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserData, setNewUserData] = useState({ name: '', email: '', role: 'Customer', phone: '' });

  // Action Menu dropdown state (open per user row)
  const [openActionMenuId, setOpenActionMenuId] = useState(null);

  // --- Effects: Persistent Caching ---
  useEffect(() => {
    localStorage.setItem('slicesprint_users', JSON.stringify(users));
  }, [users]);

  // --- Toast Trigger ---
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3500);
  };

  // --- Selected Active User object ---
  const selectedUser = useMemo(() => {
    return users.find(u => u.id === selectedUserId) || users[0] || INITIAL_USERS[0];
  }, [users, selectedUserId]);

  // --- Filtering Logic ---
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        user.name.toLowerCase().includes(query) || 
        user.email.toLowerCase().includes(query);

      const matchesRole = 
        roleFilter === 'All Roles' || 
        user.role === roleFilter;

      const matchesStatus = 
        statusFilter === 'All Status' || 
        user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  // --- Handlers ---
  const handleRoleChange = (userId, newRole) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    showToast(`Role for ${users.find(u => u.id === userId)?.name} updated to ${newRole}!`, 'success');
  };

  const handleStatusChange = (userId, newStatus) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    showToast(`Account status for ${users.find(u => u.id === userId)?.name} set to ${newStatus}!`, 'success');
  };

  const handleToggleSuspend = (userId) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    const isCurrentlyActive = user.status === 'Active';
    const newStatus = isCurrentlyActive ? 'Suspended' : 'Active';
    
    // Add action to timeline feed
    const now = new Date();
    const formattedTime = now.toLocaleString([], { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const newEvent = {
      id: `act-${Date.now()}`,
      time: formattedTime,
      event: isCurrentlyActive ? 'Account Suspended by Admin' : 'Account Re-activated by Admin'
    };

    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { 
          ...u, 
          status: newStatus,
          activityLog: [newEvent, ...u.activityLog]
        };
      }
      return u;
    }));

    showToast(
      isCurrentlyActive 
        ? `Account for ${user.name} has been suspended.` 
        : `Account for ${user.name} is now active.`, 
      isCurrentlyActive ? 'warning' : 'success'
    );
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserData.name || !newUserData.email) {
      showToast('Please enter both name and email.', 'warning');
      return;
    }

    const now = new Date();
    const formattedTime = now.toLocaleString([], { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    const newUser = {
      id: `SS_USR_00${users.length + 1}`,
      name: newUserData.name,
      email: newUserData.email,
      role: newUserData.role,
      isVerified: true,
      lastLogin: formattedTime,
      ordersCount: 0,
      status: 'Active',
      phone: newUserData.phone || '+91 98765 00000',
      memberSince: now.toLocaleString([], { month: 'short', day: '2-digit', year: 'numeric' }),
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000)}?q=80&w=120&auto=format&fit=crop`,
      addresses: [],
      activityLog: [{ id: `act-${Date.now()}`, time: formattedTime, event: 'Account created' }],
      recentOrders: []
    };

    setUsers(prev => [...prev, newUser]);
    setShowAddUserModal(false);
    setNewUserData({ name: '', email: '', role: 'Customer', phone: '' });
    setSelectedUserId(newUser.id);
    setIsDetailOpen(true);
    showToast(`User ${newUser.name} created successfully!`, 'success');
  };

  return (
    <div className="bg-[#FAFCFE] min-h-screen pb-12 text-slate-700 animate-in fade-in duration-300">
      
      {/* Toast Alert */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border text-sm font-semibold transition-all duration-300 transform scale-100 ${
          toast.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-100 animate-bounce' 
            : 'bg-orange-50 text-[#FF4C00] border-orange-100 animate-pulse'
        }`}>
          {toast.type === 'success' ? (
            <CheckCircleIcon className="h-6 w-6 text-emerald-500" />
          ) : (
            <NoSymbolIcon className="h-6 w-6 text-orange-500" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* --- ADD USER MODAL --- */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 w-full max-w-md shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3.5 mb-5">
              <h3 className="text-slate-800 font-extrabold text-base tracking-tight">Create User Account</h3>
              <button 
                onClick={() => setShowAddUserModal(false)}
                className="text-slate-400 hover:text-slate-800 p-1 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <XMarkIcon className="h-5 w-5 stroke-[2.5]" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
                <input 
                  type="text" 
                  value={newUserData.name}
                  onChange={e => setNewUserData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. John Doe"
                  className="w-full bg-[#F8FAFC] text-sm px-4 py-2.5 rounded-xl border border-slate-100 focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                <input 
                  type="email" 
                  value={newUserData.email}
                  onChange={e => setNewUserData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="e.g. name@email.com"
                  className="w-full bg-[#F8FAFC] text-sm px-4 py-2.5 rounded-xl border border-slate-100 focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Phone Number</label>
                <input 
                  type="text" 
                  value={newUserData.phone}
                  onChange={e => setNewUserData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full bg-[#F8FAFC] text-sm px-4 py-2.5 rounded-xl border border-slate-100 focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1.5">User Role</label>
                <select 
                  value={newUserData.role}
                  onChange={e => setNewUserData(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full bg-[#F8FAFC] text-sm px-4 py-2.5 rounded-xl border border-slate-100 focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-bold cursor-pointer"
                >
                  <option value="Customer">Customer</option>
                  <option value="Delivery Partner">Delivery Partner</option>
                  <option value="Vendor">Vendor</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="flex-1 border border-slate-200 rounded-xl py-2.5 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 transition-all shadow-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#FF4C00] to-[#FF6B00] hover:from-[#E03E00] hover:to-[#FF5C00] text-white font-extrabold text-xs py-2.5 rounded-xl shadow-md shadow-orange-100 transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">User Management</h1>
        </div>

        <button 
          onClick={() => setShowAddUserModal(true)}
          className="bg-gradient-to-r from-[#FF4C00] to-[#FF6B00] hover:from-[#E03E00] hover:to-[#FF5C00] text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow-md shadow-orange-100 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 flex-shrink-0"
        >
          <UserPlusIcon className="h-4.5 w-4.5 stroke-[2.2]" />
          <span>Add User</span>
        </button>
      </div>

      {/* --- MAIN CATALOG FILTER CARD --- */}
      <div className="bg-white rounded-3xl border border-slate-100/80 shadow-sm p-4 sm:p-6 mb-6">
        
        {/* Search & Filters Row */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
              <MagnifyingGlassIcon className="h-4.5 w-4.5 stroke-[2.2]" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Users by name or email..."
              className="w-full bg-[#F8FAFC]/60 text-xs pl-10 pr-4 py-3 rounded-2xl border border-slate-100 focus:outline-none focus:border-orange-500 focus:bg-white transition-all shadow-inner font-semibold placeholder-slate-400"
            />
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            {/* Role Filter */}
            <div className="flex-1 sm:flex-initial min-w-[130px]">
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 pl-1">Role</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full bg-white text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 transition-all cursor-pointer shadow-sm"
              >
                <option value="All Roles">All Roles</option>
                <option value="Customer">Customer</option>
                <option value="Delivery Partner">Delivery Partner</option>
                <option value="Vendor">Vendor</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex-1 sm:flex-initial min-w-[130px]">
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 pl-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-white text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 transition-all cursor-pointer shadow-sm"
              >
                <option value="All Status">All Status</option>
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>

            {/* Filters Button */}
            <button 
              onClick={() => showToast('Advanced custom filter overlay loaded', 'success')}
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-black text-slate-600 bg-white hover:bg-slate-50 flex items-center gap-2 transition-all shadow-sm self-end h-[38px] flex-shrink-0"
            >
              <FunnelIcon className="h-4.5 w-4.5 text-slate-500 stroke-[2.2]" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="min-w-full text-sm align-middle select-none">
            <thead>
              <tr className="border-b border-slate-100 text-left text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3.5 pl-2 font-black">Name</th>
                <th className="pb-3.5 font-black">Email</th>
                <th className="pb-3.5 font-black">Role</th>
                <th className="pb-3.5 font-black text-center">Verified</th>
                <th className="pb-3.5 font-black">Last Login</th>
                <th className="pb-3.5 font-black text-center">Orders</th>
                <th className="pb-3.5 font-black text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map((user) => (
                <tr 
                  key={user.id}
                  onClick={() => { setSelectedUserId(user.id); setIsDetailOpen(true); }}
                  className={`hover:bg-[#FFFBF9]/40 transition-colors duration-150 cursor-pointer ${
                    selectedUserId === user.id && isDetailOpen ? 'bg-orange-50/20' : ''
                  }`}
                >
                  {/* Name Column with Avatar */}
                  <td className="py-3.5 pl-2 font-semibold">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-100 bg-slate-50 flex-shrink-0 shadow-sm">
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 text-xs block">{user.name}</span>
                        {user.status === 'Suspended' && (
                          <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 text-[8px] font-black uppercase px-2 py-0.5 rounded-full mt-0.5 border border-red-100">
                            Suspended
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="py-3.5 text-xs text-slate-500 font-medium">{user.email}</td>

                  {/* Role */}
                  <td className="py-3.5 text-xs text-slate-600 font-bold">{user.role}</td>

                  {/* Verified Checkbox Icon */}
                  <td className="py-3.5 text-center">
                    <div className="flex items-center justify-center">
                      {user.isVerified ? (
                        <CheckCircleIcon className="h-5 w-5 text-emerald-500 stroke-[2.2]" />
                      ) : (
                        <XCircleIcon className="h-5 w-5 text-red-400 stroke-[2.2]" />
                      )}
                    </div>
                  </td>

                  {/* Last Login */}
                  <td className="py-3.5 text-xs text-slate-500 font-semibold">{user.lastLogin}</td>

                  {/* Orders */}
                  <td className="py-3.5 text-center text-xs text-slate-700 font-extrabold">{user.ordersCount}</td>

                  {/* Actions Column */}
                  <td className="py-3.5 text-right pr-4 relative" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button 
                        onClick={() => { setSelectedUserId(user.id); setIsDetailOpen(true); }}
                        className="p-1.5 rounded-lg border border-slate-100 hover:border-orange-200 bg-white text-slate-400 hover:text-[#FF4C00] transition-colors shadow-sm"
                        title="View Profile Details"
                      >
                        <EyeIcon className="h-4 w-4 stroke-[2.2]" />
                      </button>

                      <div className="relative">
                        <button 
                          onClick={() => setOpenActionMenuId(openActionMenuId === user.id ? null : user.id)}
                          className="p-1.5 rounded-lg border border-slate-100 hover:bg-slate-50 bg-white text-slate-400 hover:text-slate-700 transition-colors shadow-sm"
                        >
                          <EllipsisVerticalIcon className="h-4 w-4 stroke-[2.2]" />
                        </button>

                        {/* Inline Actions Context Menu */}
                        {openActionMenuId === user.id && (
                          <div className="absolute right-0 top-9 bg-white border border-slate-100 rounded-2xl py-1.5 w-40 shadow-xl z-30 animate-in fade-in duration-100">
                            <button 
                              onClick={() => { handleToggleSuspend(user.id); setOpenActionMenuId(null); }}
                              className="w-full text-left text-xs font-semibold px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2"
                            >
                              <NoSymbolIcon className="h-4 w-4 text-red-400 stroke-[2.2]" />
                              <span>{user.status === 'Active' ? 'Suspend Account' : 'Activate Account'}</span>
                            </button>
                            <button 
                              onClick={() => { 
                                setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isVerified: !u.isVerified } : u));
                                setOpenActionMenuId(null);
                                showToast(`Verification toggled for ${user.name}`, 'success');
                              }}
                              className="w-full text-left text-xs font-semibold px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                            >
                              <ShieldCheckIcon className="h-4 w-4 text-slate-400 stroke-[2.2]" />
                              <span>Toggle Verified</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                    No users match current search filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Row with Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-4 border-t border-slate-100">
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
            Showing 1 to {filteredUsers.length} of {users.length} users
          </span>

          {/* Pagination Bubbles */}
          <div className="flex items-center gap-1.5 select-none">
            <button className="p-2 rounded-xl border border-slate-100 text-slate-400 hover:text-slate-800 bg-white hover:bg-slate-50 transition-colors shadow-sm">
              <ChevronLeftIcon className="h-3.5 w-3.5 stroke-[2.5]" />
            </button>
            <button className="w-8 h-8 rounded-xl bg-[#FF4C00] text-white text-xs font-extrabold shadow-md shadow-orange-100 flex items-center justify-center">
              1
            </button>
            <button className="w-8 h-8 rounded-xl border border-slate-100 text-slate-600 hover:text-[#FF4C00] bg-white hover:bg-slate-50 text-xs font-extrabold transition-colors shadow-sm flex items-center justify-center">
              2
            </button>
            <button className="w-8 h-8 rounded-xl border border-slate-100 text-slate-600 hover:text-[#FF4C00] bg-white hover:bg-slate-50 text-xs font-extrabold transition-colors shadow-sm flex items-center justify-center">
              3
            </button>
            <button className="w-8 h-8 rounded-xl border border-slate-100 text-slate-600 hover:text-[#FF4C00] bg-white hover:bg-slate-50 text-xs font-extrabold transition-colors shadow-sm flex items-center justify-center">
              4
            </button>
            <span className="text-slate-400 text-xs font-bold px-1">...</span>
            <button className="w-8 h-8 rounded-xl border border-slate-100 text-slate-600 hover:text-[#FF4C00] bg-white hover:bg-slate-50 text-xs font-extrabold transition-colors shadow-sm flex items-center justify-center">
              20
            </button>
            <button className="p-2 rounded-xl border border-slate-100 text-slate-400 hover:text-slate-800 bg-white hover:bg-slate-50 transition-colors shadow-sm">
              <ChevronRightIcon className="h-3.5 w-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>

      </div>

      {/* --- SELECTED USER PROFILE PANEL CABINET --- */}
      {isDetailOpen && selectedUser && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-lg p-5 sm:p-6 animate-in slide-in-from-bottom-6 duration-300 relative">
          
          {/* Close Panel Button */}
          <button 
            onClick={() => setIsDetailOpen(false)}
            className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-50 transition-colors shadow-sm z-10"
            title="Close details cabinet"
          >
            <XMarkIcon className="h-5.5 w-5.5 stroke-[2.5]" />
          </button>

          {/* Panel Top Row Card header */}
          <div className="flex flex-col sm:flex-row items-center gap-5 border-b border-slate-100 pb-5 mb-6">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white ring-4 ring-orange-50/60 shadow-md bg-slate-50 flex-shrink-0">
              <img src={selectedUser.avatar} alt={selectedUser.name} className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center gap-2.5">
                <h2 className="text-lg font-black text-slate-800 tracking-tight">{selectedUser.name}</h2>
                <div className="flex items-center gap-1.5 flex-wrap justify-center">
                  <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                    selectedUser.isVerified 
                      ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                      : 'bg-red-50 border-red-100 text-red-700'
                  }`}>
                    {selectedUser.isVerified ? 'Verified' : 'Unverified'}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md">
                    <span className={`h-1.5 w-1.5 rounded-full inline-block ${
                      selectedUser.status === 'Active' ? 'bg-emerald-500 animate-ping' : 'bg-red-500'
                    }`}></span>
                    <span>{selectedUser.status}</span>
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-4 text-xs font-bold text-slate-400 mt-2">
                <span>{selectedUser.email}</span>
                <span className="hidden sm:inline text-slate-200">•</span>
                <span>{selectedUser.phone}</span>
              </div>
            </div>
          </div>

          {/* Cabinet 3-Column main layout grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Column 1: Vertical Tabs Panel Selector */}
            <div className="lg:col-span-3 flex flex-col gap-1.5 select-none">
              <button 
                onClick={() => setActiveTab('Profile Overview')}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-black tracking-wide text-left transition-all ${
                  activeTab === 'Profile Overview' 
                    ? 'bg-orange-50/60 border border-orange-100 text-[#FF4C00] shadow-sm' 
                    : 'bg-white border border-transparent hover:bg-slate-50/50 text-slate-400 hover:text-slate-700'
                }`}
              >
                <UserIcon className="h-4.5 w-4.5 stroke-[2.2]" />
                <span>Profile Overview</span>
              </button>

              <button 
                onClick={() => setActiveTab('Account Details')}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-black tracking-wide text-left transition-all ${
                  activeTab === 'Account Details' 
                    ? 'bg-orange-50/60 border border-orange-100 text-[#FF4C00] shadow-sm' 
                    : 'bg-white border border-transparent hover:bg-slate-50/50 text-slate-400 hover:text-slate-700'
                }`}
              >
                <LockClosedIcon className="h-4.5 w-4.5 stroke-[2.2]" />
                <span>Account Details</span>
              </button>

              <button 
                onClick={() => setActiveTab('Addresses')}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-black tracking-wide text-left transition-all ${
                  activeTab === 'Addresses' 
                    ? 'bg-orange-50/60 border border-orange-100 text-[#FF4C00] shadow-sm' 
                    : 'bg-white border border-transparent hover:bg-slate-50/50 text-slate-400 hover:text-slate-700'
                }`}
              >
                <MapPinIcon className="h-4.5 w-4.5 stroke-[2.2]" />
                <span>Addresses ({(selectedUser.addresses || []).length})</span>
              </button>

              <button 
                onClick={() => setActiveTab('Activity Log')}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-black tracking-wide text-left transition-all ${
                  activeTab === 'Activity Log' 
                    ? 'bg-orange-50/60 border border-orange-100 text-[#FF4C00] shadow-sm' 
                    : 'bg-white border border-transparent hover:bg-slate-50/50 text-slate-400 hover:text-slate-700'
                }`}
              >
                <ClockIcon className="h-4.5 w-4.5 stroke-[2.2]" />
                <span>Activity Log</span>
              </button>

              <button 
                onClick={() => setActiveTab('Recent Orders')}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-black tracking-wide text-left transition-all ${
                  activeTab === 'Recent Orders' 
                    ? 'bg-orange-50/60 border border-orange-100 text-[#FF4C00] shadow-sm' 
                    : 'bg-white border border-transparent hover:bg-slate-50/50 text-slate-400 hover:text-slate-700'
                }`}
              >
                <ShoppingBagIcon className="h-4.5 w-4.5 stroke-[2.2]" />
                <span>Recent Orders ({selectedUser.ordersCount})</span>
              </button>
            </div>

            {/* Column 2: Tab Config Body Content Panel */}
            <div className="lg:col-span-5 bg-[#FAFBFD]/60 border border-slate-100 p-5 rounded-3xl min-h-[340px] flex flex-col justify-between">
              
              {activeTab === 'Profile Overview' && (
                <div className="flex flex-col justify-between h-full flex-grow">
                  <div>
                    {/* Role & Status Dropdowns */}
                    <div className="grid grid-cols-2 gap-4 mb-5 select-none">
                      <div>
                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1.5 pl-0.5">Role</label>
                        <select
                          value={selectedUser.role}
                          onChange={(e) => handleRoleChange(selectedUser.id, e.target.value)}
                          className="w-full bg-white text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FF4C00] cursor-pointer"
                        >
                          <option value="Customer">Customer</option>
                          <option value="Delivery Partner">Delivery Partner</option>
                          <option value="Vendor">Vendor</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1.5 pl-0.5">Status</label>
                        <select
                          value={selectedUser.status}
                          onChange={(e) => handleStatusChange(selectedUser.id, e.target.value)}
                          className={`w-full text-xs font-bold px-3 py-2.5 rounded-xl border focus:outline-none cursor-pointer ${
                            selectedUser.status === 'Active' 
                              ? 'bg-emerald-50/40 border-emerald-100 text-emerald-800 focus:border-emerald-500' 
                              : 'bg-red-50/40 border-red-100 text-red-800 focus:border-red-500'
                          }`}
                        >
                          <option value="Active">Active</option>
                          <option value="Suspended">Suspended</option>
                        </select>
                      </div>
                    </div>

                    {/* Verification Status Details Block */}
                    <div className="space-y-3.5 mb-6">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-0.5 border-b border-slate-100/60 pb-1.5">Verification Status</h4>
                      
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-500">Email Verification</span>
                        <span className="flex items-center gap-1.5 font-bold text-emerald-600">
                          {selectedUser.isVerified ? (
                            <>
                              <CheckCircleIcon className="h-4.5 w-4.5 text-emerald-500 stroke-[2.2]" />
                              <span>Verified</span>
                            </>
                          ) : (
                            <>
                              <XCircleIcon className="h-4.5 w-4.5 text-red-400 stroke-[2.2]" />
                              <span className="text-red-500">Unverified</span>
                            </>
                          )}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-500">Phone Verification</span>
                        <span className="flex items-center gap-1.5 font-bold text-emerald-600">
                          {selectedUser.isVerified ? (
                            <>
                              <CheckCircleIcon className="h-4.5 w-4.5 text-emerald-500 stroke-[2.2]" />
                              <span>Verified</span>
                            </>
                          ) : (
                            <>
                              <XCircleIcon className="h-4.5 w-4.5 text-red-400 stroke-[2.2]" />
                              <span className="text-red-500">Unverified</span>
                            </>
                          )}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-xs pt-1">
                        <span className="font-semibold text-slate-500">Member Since</span>
                        <span className="font-extrabold text-slate-700">{selectedUser.memberSince}</span>
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-500">Last Login</span>
                        <span className="font-bold text-slate-600">{selectedUser.lastLogin}</span>
                      </div>
                    </div>
                  </div>

                  {/* Suspend Hollow Alert button */}
                  <button
                    onClick={() => handleToggleSuspend(selectedUser.id)}
                    className={`w-full flex items-center justify-center gap-2 border rounded-2xl py-3 text-xs font-black transition-all ${
                      selectedUser.status === 'Active'
                        ? 'border-red-200 hover:border-red-300 text-red-600 hover:bg-red-50/30'
                        : 'border-emerald-200 hover:border-emerald-300 text-emerald-700 hover:bg-emerald-50/30'
                    }`}
                  >
                    <NoSymbolIcon className="h-4.5 w-4.5 stroke-[2.2]" />
                    <span>{selectedUser.status === 'Active' ? 'Suspend Account' : 'Activate Account'}</span>
                  </button>
                </div>
              )}

              {activeTab === 'Account Details' && (
                <div className="flex flex-col justify-between h-full flex-grow">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-100/60 pl-0.5">Account Specifications</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white border border-slate-100 p-3 rounded-2xl shadow-sm">
                        <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">User ID</span>
                        <span className="text-xs font-black text-slate-700 block mt-0.5">{selectedUser.id}</span>
                      </div>
                      <div className="bg-white border border-slate-100 p-3 rounded-2xl shadow-sm">
                        <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Device OS</span>
                        <span className="text-xs font-black text-slate-700 block mt-0.5">iOS App Client</span>
                      </div>
                      <div className="bg-white border border-slate-100 p-3 rounded-2xl shadow-sm">
                        <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Total Value spent</span>
                        <span className="text-xs font-black text-[#FF4C00] block mt-0.5">$384.50</span>
                      </div>
                      <div className="bg-white border border-slate-100 p-3 rounded-2xl shadow-sm">
                        <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Average Order</span>
                        <span className="text-xs font-black text-slate-700 block mt-0.5">$18.99</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => showToast('User metadata specifications synchronized', 'success')}
                    className="w-full text-center border border-slate-200 hover:bg-slate-50 font-black text-xs py-3 rounded-2xl text-slate-600 transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <ArrowPathIcon className="h-4.5 w-4.5 text-slate-500" />
                    <span>Synchronize Metadata</span>
                  </button>
                </div>
              )}

              {activeTab === 'Addresses' && (
                <div className="flex flex-col justify-between h-full flex-grow">
                  <div className="space-y-3.5">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-100/60 pl-0.5">Saved Addresses ({(selectedUser.addresses || []).length})</h4>
                    
                    <div className="space-y-2.5 overflow-y-auto max-h-[220px] custom-scrollbar pr-0.5">
                      {(selectedUser.addresses || []).map((addr) => (
                        <div key={addr.id} className="bg-white border border-slate-100/80 p-3 rounded-2xl shadow-sm flex items-start gap-2.5">
                          <MapPinIcon className="h-5 w-5 text-orange-500 stroke-[2.2] flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[9px] font-black uppercase text-[#FF4C00] bg-orange-50 px-2 py-0.5 rounded border border-orange-100">{addr.type}</span>
                            <p className="text-xs font-semibold text-slate-500 leading-relaxed mt-1.5">{addr.text}</p>
                          </div>
                        </div>
                      ))}
                      {(selectedUser.addresses || []).length === 0 && (
                        <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest py-8">No saved addresses</p>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      const updated = users.map(u => {
                        if (u.id === selectedUser.id) {
                          return {
                            ...u,
                            addresses: [...u.addresses, { id: `addr-${Date.now()}`, type: 'New', text: '506, Richmond Block, Bengaluru - 560025' }]
                          };
                        }
                        return u;
                      });
                      setUsers(updated);
                      showToast('New mock address appended', 'success');
                    }}
                    className="w-full text-center border border-slate-200 hover:bg-slate-50 font-black text-xs py-3 rounded-2xl text-slate-600 transition-all shadow-sm"
                  >
                    + Add New Address
                  </button>
                </div>
              )}

              {activeTab === 'Activity Log' && (
                <div className="flex flex-col justify-between h-full flex-grow">
                  <div className="space-y-3.5">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-100/60 pl-0.5">Timeline Action Logs</h4>
                    
                    <div className="relative pl-6 space-y-4 max-h-[220px] overflow-y-auto custom-scrollbar pr-0.5">
                      <div className="absolute left-[7px] top-1.5 bottom-1.5 w-0.5 bg-slate-100"></div>
                      
                      {(selectedUser.activityLog || []).map((log) => (
                        <div key={log.id} className="relative text-xs leading-snug">
                          <span className="absolute -left-[22px] top-1 h-2.5 w-2.5 rounded-full bg-[#FF4C00] ring-4 ring-orange-50"></span>
                          <span className="text-[9px] font-bold text-slate-400 block">{log.time}</span>
                          <p className="font-bold text-slate-700 mt-0.5">{log.event}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      const updated = users.map(u => {
                        if (u.id === selectedUser.id) {
                          return {
                            ...u,
                            activityLog: [{ id: `act-${Date.now()}`, time: new Date().toLocaleString(), event: 'Admin refreshed logs' }, ...u.activityLog]
                          };
                        }
                        return u;
                      });
                      setUsers(updated);
                      showToast('Activity log audit trail synced', 'success');
                    }}
                    className="w-full text-center border border-slate-200 hover:bg-slate-50 font-black text-xs py-3 rounded-2xl text-slate-600 transition-all shadow-sm"
                  >
                    Sync Audit Trail Logs
                  </button>
                </div>
              )}

              {activeTab === 'Recent Orders' && (
                <div className="flex flex-col justify-between h-full flex-grow">
                  <div className="space-y-3.5">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-100/60 pl-0.5">Order Histories</h4>
                    
                    <div className="space-y-2 max-h-[220px] overflow-y-auto custom-scrollbar pr-0.5">
                      {(selectedUser.recentOrders || []).map((ord) => (
                        <div key={ord.id} className="bg-white border border-slate-100/80 p-2.5 rounded-2xl shadow-sm flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-100 shadow-sm flex-shrink-0 bg-slate-50 flex items-center justify-center">
                              <img src={ord.image} alt={ord.id} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <span className="text-xs font-black text-slate-800 block">{ord.id}</span>
                              <span className="text-[9px] font-bold text-slate-400 block mt-0.5">{ord.time}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-extrabold text-[#FF4C00] block">${ord.price}</span>
                            <span className="inline-flex text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 mt-0.5">
                              {ord.status}
                            </span>
                          </div>
                        </div>
                      ))}
                      {(selectedUser.recentOrders || []).length === 0 && (
                        <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest py-8">No order record history</p>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => showToast('Redirecting to order dashboard filters...', 'info')}
                    className="w-full text-center border border-slate-200 hover:bg-slate-50 font-black text-xs py-3 rounded-2xl text-slate-600 transition-all shadow-sm"
                  >
                    View in Order Dashboard
                  </button>
                </div>
              )}

            </div>

            {/* Column 3: Recent Orders Sidebar Widget */}
            <div className="lg:col-span-4 bg-white border border-slate-100 p-5 rounded-3xl min-h-[340px] flex flex-col justify-between shadow-inner">
              <div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4 select-none">
                  <h3 className="text-slate-800 font-extrabold text-xs tracking-tight">Recent Orders</h3>
                  <button 
                    onClick={() => showToast('Redirecting to order history logs...', 'info')}
                    className="text-[#FF4C00] hover:text-[#D03D00] text-[10px] font-black uppercase tracking-wider hover:underline"
                  >
                    View All
                  </button>
                </div>

                {/* Orders mapping List */}
                <div className="space-y-3">
                  {(selectedUser.recentOrders || []).slice(0, 3).map((order) => (
                    <div key={order.id} className="bg-[#FAFBFD]/50 border border-slate-100/60 p-2.5 rounded-2xl shadow-sm flex items-center gap-3 relative hover:scale-[1.01] transition-transform duration-100 cursor-pointer">
                      <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-100 shadow-sm flex-shrink-0 bg-slate-50 flex items-center justify-center">
                        <img src={order.image} alt={order.id} className="w-full h-full object-cover" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-black text-slate-800 block truncate">{order.id}</span>
                        <span className="text-[9px] font-bold text-slate-400 block mt-0.5 truncate">{order.time}</span>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className="text-xs font-black text-[#FF4C00] block">${order.price}</span>
                        <span className="inline-flex items-center text-[8px] font-black uppercase tracking-wide text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md mt-1">
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {(selectedUser.recentOrders || []).length === 0 && (
                    <div className="py-8 text-center">
                      <ShoppingBagIcon className="h-8 w-8 text-slate-300 mx-auto stroke-[1.5]" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mt-2">
                        No Recent Orders
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => showToast('Redirecting to live orders catalog pipeline...', 'info')}
                className="w-full border border-slate-200 hover:bg-slate-50 text-slate-600 font-extrabold text-xs py-3 rounded-2xl shadow-sm transition-all text-center mt-4"
              >
                View All Orders
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default AdminUsersPage;
