import React, { useState, useEffect } from 'react';
import { 
  Cog6ToothIcon,
  CreditCardIcon,
  ListBulletIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  ServerIcon,
  PencilIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowPathIcon,
  ClockIcon,
  ComputerDesktopIcon,
  LockClosedIcon,
  ShieldExclamationIcon
} from '@heroicons/react/24/outline';

// Pre-seeded low stock alert threshold configurations matching the screenshot
const INITIAL_THRESHOLDS = [
  { id: 'pizza_base', name: 'Pizza Base', icon: '🍕', threshold: 20, unit: 'units', emailNotification: true, notifyEmails: ['admin@slicesprint.com', 'inventory@slicesprint.com'], max: 100, badgeType: 'red' },
  { id: 'sauce', name: 'Sauce', icon: '🥫', threshold: 5, unit: 'kg', emailNotification: true, notifyEmails: ['admin@slicesprint.com', 'kitchen@slicesprint.com'], max: 50, badgeType: 'red' },
  { id: 'cheese', name: 'Cheese', icon: '🧀', threshold: 10, unit: 'kg', emailNotification: true, notifyEmails: ['admin@slicesprint.com', 'kitchen@slicesprint.com'], max: 50, badgeType: 'red' },
  { id: 'veggies', name: 'Veggies', icon: '🥦', threshold: 8, unit: 'kg', emailNotification: true, notifyEmails: ['inventory@slicesprint.com'], max: 50, badgeType: 'orange' },
  { id: 'meat', name: 'Meat', icon: '🥩', threshold: 6, unit: 'kg', emailNotification: false, notifyEmails: ['inventory@slicesprint.com'], max: 50, badgeType: 'orange' },
];

const INITIAL_AUDIT_LOGS = [
  { id: 1, action: 'Updated Pizza Base threshold', user: 'admin@slicesprint.com', ip: '192.168.1.15', time: 'May 23, 2026 04:30 PM' },
  { id: 2, action: 'Cleared application cache', user: 'admin@slicesprint.com', ip: '192.168.1.15', time: 'May 23, 2026 04:15 PM' },
  { id: 3, action: 'Updated GST rate to 18%', user: 'admin@slicesprint.com', ip: '192.168.1.15', time: 'May 23, 2026 03:40 PM' },
  { id: 4, action: 'Enabled UPI payments', user: 'admin@slicesprint.com', ip: '192.168.1.15', time: 'May 23, 2026 03:30 PM' },
  { id: 5, action: 'Enforced administrator 2FA', user: 'system_daemon', ip: 'localhost', time: 'May 22, 2026 10:00 AM' }
];

const AdminSettingsPage = () => {
  // Set default tab to 'thresholds' to display the exact layout from the screenshot on load!
  const [activeSubTab, setActiveSubTab] = useState('thresholds');

  // Interactive configurations states
  const [general, setGeneral] = useState({
    storeName: 'SliceSprint Bengaluru',
    taxRate: '18',
    deliveryCharge: '39',
    isOpen: true,
    storeEmail: 'contact@slicesprint.com',
    storePhone: '+91 98765 43210',
    storeAddress: '12th Main Rd, Indiranagar, Bengaluru, KA 560038'
  });

  const [payments, setPayments] = useState({
    testMode: true,
    upiId: 'slicesprint@okaxis',
    minFreeDelivery: '299',
    currency: 'INR',
    razorpayKey: 'rzp_live_v283kdnf923',
    stripeKey: 'pk_live_51Nv23849ndsf',
    enableUpi: true,
    enableCod: true,
    enableCards: true
  });

  const [thresholds, setThresholds] = useState(INITIAL_THRESHOLDS);

  const [alerts, setAlerts] = useState({
    lowStockAlerts: true,
    dailyDigest: true,
    orderNotifications: true,
    systemAlerts: false
  });

  // Modal Control States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [modalThreshold, setModalThreshold] = useState('');
  const [modalEmailInput, setModalEmailInput] = useState('');
  const [modalNotifyEmails, setModalNotifyEmails] = useState([]);
  const [modalEmailNotification, setModalEmailNotification] = useState(true);

  // Spinner states for cache / saves
  const [loadingAction, setLoadingAction] = useState(null); 

  // Custom Toast Messaging matching the bottom center screenshot toast
  const [toast, setToast] = useState(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Sync range slider and text box input in real time
  const handleSliderChange = (id, val) => {
    const numericVal = parseInt(val, 10) || 0;
    setThresholds(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, threshold: numericVal };
      }
      return item;
    }));
  };

  const handleThresholdInputChange = (id, val) => {
    const numericVal = parseInt(val, 10);
    // Allow empty string temporarily for typing
    if (val === '') {
      setThresholds(prev => prev.map(item => {
        if (item.id === id) return { ...item, threshold: '' };
        return item;
      }));
      return;
    }
    if (isNaN(numericVal) || numericVal < 0) return;
    
    setThresholds(prev => prev.map(item => {
      if (item.id === id) {
        // Clamp to max value
        const clamped = Math.min(numericVal, item.max);
        return { ...item, threshold: clamped };
      }
      return item;
    }));
  };

  // Launch modal for editing threshold
  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setModalThreshold(item.threshold.toString());
    setModalNotifyEmails([...item.notifyEmails]);
    setModalEmailNotification(item.emailNotification);
    setModalEmailInput('');
    setIsModalOpen(true);
  };

  // Add Email Tag in modal on Enter or Comma
  const handleAddEmailTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const cleaned = modalEmailInput.trim().replace(/,/g, '');
      if (cleaned === '') return;

      // Basic email regex verification
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleaned)) {
        alert('Please enter a valid email address.');
        return;
      }

      if (modalNotifyEmails.includes(cleaned)) {
        setModalEmailInput('');
        return;
      }

      setModalNotifyEmails(prev => [...prev, cleaned]);
      setModalEmailInput('');
    }
  };

  // Remove Email Tag in modal
  const handleRemoveEmailTag = (emailToRemove) => {
    setModalNotifyEmails(prev => prev.filter(email => email !== emailToRemove));
  };

  // Submit revised threshold config from modal
  const handleSaveThreshold = (e) => {
    e.preventDefault();
    const newThreshold = parseInt(modalThreshold, 10);
    if (isNaN(newThreshold) || newThreshold < 0) {
      alert('Please enter a valid threshold.');
      return;
    }

    setThresholds(prev => prev.map(item => {
      if (item.id === editingItem.id) {
        return {
          ...item,
          threshold: newThreshold,
          emailNotification: modalEmailNotification,
          notifyEmails: [...modalNotifyEmails]
        };
      }
      return item;
    }));

    setIsModalOpen(false);
    
    // Trigger success toast with screenshot styling
    setToast({
      title: 'Threshold Updated Successfully',
      message: `${editingItem.name} threshold has been updated.`
    });
  };

  // Trigger Mock Cache clear actions
  const handleClearCache = (cacheType, cacheLabel) => {
    setLoadingAction(cacheType);
    setTimeout(() => {
      setLoadingAction(null);
      setToast({
        title: 'Cache Purged Successfully',
        message: `${cacheLabel} cache cleared in 14ms.`
      });
    }, 1000);
  };

  // Switch toggler helper
  const handleToggle = (setter, key, label) => {
    setter(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      setToast({
        title: `${label} Configured`,
        message: `${label} successfully ${updated[key] ? 'enabled' : 'disabled'}.`
      });
      return updated;
    });
  };

  // Save general configurations form
  const handleSaveGeneral = (e) => {
    e.preventDefault();
    setLoadingAction('general');
    setTimeout(() => {
      setLoadingAction(null);
      setToast({
        title: 'Settings Saved Successfully',
        message: 'General store configuration has been updated.'
      });
    }, 800);
  };

  // Save payments configuration form
  const handleSavePayments = (e) => {
    e.preventDefault();
    setLoadingAction('payments');
    setTimeout(() => {
      setLoadingAction(null);
      setToast({
        title: 'Payment Options Saved',
        message: 'Store payment parameters successfully configured.'
      });
    }, 800);
  };

  return (
    <div className="bg-[#FAFBFD] min-h-screen pb-16 font-sans">
      
      {/* Top Banner & Tab Page Title */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <h1 className="text-[28px] font-black text-gray-900 tracking-tight text-left mb-6">Admin Settings</h1>
        
        {/* Main layout container splitting sidebar and contents */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Settings specific side tabs (3/12 width) */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl border border-gray-100 p-4.5 shadow-[0_15px_45px_rgba(0,0,0,0.015)] sticky top-24">
              
              <div className="space-y-3">
                {/* General Settings Tab */}
                <button
                  onClick={() => setActiveSubTab('general')}
                  className={`w-full flex items-center gap-3.5 px-4.5 py-3.5 rounded-2xl text-[14px] font-bold transition-all border text-left ${
                    activeSubTab === 'general'
                      ? 'bg-[#FFF5F0] text-[#FF6B00] border-[#FF6B00] border-l-4 border-l-[#FF6B00] font-extrabold shadow-[0_4px_15px_rgba(255,107,0,0.04)]'
                      : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200 hover:text-gray-800 hover:shadow-sm'
                  }`}
                >
                  <Cog6ToothIcon className={`h-5 w-5 flex-shrink-0 ${activeSubTab === 'general' ? 'text-[#FF6B00]' : 'text-gray-400'}`} />
                  <span>General Settings</span>
                </button>

                {/* Payments Configuration Tab */}
                <button
                  onClick={() => setActiveSubTab('payments')}
                  className={`w-full flex items-center gap-3.5 px-4.5 py-3.5 rounded-2xl text-[14px] font-bold transition-all border text-left ${
                    activeSubTab === 'payments'
                      ? 'bg-[#FFF5F0] text-[#FF6B00] border-[#FF6B00] border-l-4 border-l-[#FF6B00] font-extrabold shadow-[0_4px_15px_rgba(255,107,0,0.04)]'
                      : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200 hover:text-gray-800 hover:shadow-sm'
                  }`}
                >
                  <CreditCardIcon className={`h-5 w-5 flex-shrink-0 ${activeSubTab === 'payments' ? 'text-[#FF6B00]' : 'text-gray-400'}`} />
                  <span>Payment Settings</span>
                </button>

                {/* Inventory Threshold Tab (The highlight from screenshot) */}
                <button
                  onClick={() => setActiveSubTab('thresholds')}
                  className={`w-full flex items-center gap-3.5 px-4.5 py-3.5 rounded-2xl text-[14px] font-bold transition-all border text-left ${
                    activeSubTab === 'thresholds'
                      ? 'bg-[#FFF5F0] text-[#FF6B00] border-[#FF6B00] border-l-4 border-l-[#FF6B00] font-extrabold shadow-[0_4px_15px_rgba(255,107,0,0.04)]'
                      : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200 hover:text-gray-800 hover:shadow-sm'
                  }`}
                >
                  <ListBulletIcon className={`h-5 w-5 flex-shrink-0 ${activeSubTab === 'thresholds' ? 'text-[#FF6B00]' : 'text-gray-400'}`} />
                  <span>Inventory Thresholds</span>
                </button>

                {/* Email Alerts Tab */}
                <button
                  onClick={() => setActiveSubTab('alerts')}
                  className={`w-full flex items-center gap-3.5 px-4.5 py-3.5 rounded-2xl text-[14px] font-bold transition-all border text-left ${
                    activeSubTab === 'alerts'
                      ? 'bg-[#FFF5F0] text-[#FF6B00] border-[#FF6B00] border-l-4 border-l-[#FF6B00] font-extrabold shadow-[0_4px_15px_rgba(255,107,0,0.04)]'
                      : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200 hover:text-gray-800 hover:shadow-sm'
                  }`}
                >
                  <EnvelopeIcon className={`h-5 w-5 flex-shrink-0 ${activeSubTab === 'alerts' ? 'text-[#FF6B00]' : 'text-gray-400'}`} />
                  <span>Email Settings</span>
                </button>

                {/* Security Tab */}
                <button
                  onClick={() => setActiveSubTab('security')}
                  className={`w-full flex items-center gap-3.5 px-4.5 py-3.5 rounded-2xl text-[14px] font-bold transition-all border text-left ${
                    activeSubTab === 'security'
                      ? 'bg-[#FFF5F0] text-[#FF6B00] border-[#FF6B00] border-l-4 border-l-[#FF6B00] font-extrabold shadow-[0_4px_15px_rgba(255,107,0,0.04)]'
                      : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200 hover:text-gray-800 hover:shadow-sm'
                  }`}
                >
                  <ShieldCheckIcon className={`h-5 w-5 flex-shrink-0 ${activeSubTab === 'security' ? 'text-[#FF6B00]' : 'text-gray-400'}`} />
                  <span>Security Settings</span>
                </button>

                {/* System Tab */}
                <button
                  onClick={() => setActiveSubTab('system')}
                  className={`w-full flex items-center gap-3.5 px-4.5 py-3.5 rounded-2xl text-[14px] font-bold transition-all border text-left ${
                    activeSubTab === 'system'
                      ? 'bg-[#FFF5F0] text-[#FF6B00] border-[#FF6B00] border-l-4 border-l-[#FF6B00] font-extrabold shadow-[0_4px_15px_rgba(255,107,0,0.04)]'
                      : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200 hover:text-gray-800 hover:shadow-sm'
                  }`}
                >
                  <ServerIcon className={`h-5 w-5 flex-shrink-0 ${activeSubTab === 'system' ? 'text-[#FF6B00]' : 'text-gray-400'}`} />
                  <span>System Settings</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Tab Panel Rendering (9/12 width) */}
          <div className="lg:col-span-9">
            
            {/* ==========================================
                TAB: Inventory Thresholds (Exact Screenshot Layout)
               ========================================== */}
            {activeSubTab === 'thresholds' && (
              <div className="space-y-6">
                
                {/* 1. Inventory Threshold Configuration Card */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6.5 shadow-[0_12px_40px_rgba(0,0,0,0.01)] text-left">
                  <div className="mb-6">
                    <h2 className="text-[19px] font-extrabold tracking-tight text-gray-900">Inventory Threshold Configuration</h2>
                    <p className="text-sm font-medium text-gray-400 mt-1">Set minimum stock threshold for inventory items. Get alerts when stock goes below threshold.</p>
                  </div>

                  {/* Threshold list table */}
                  <div className="overflow-hidden border border-gray-50 rounded-2xl bg-[#FCFDFE]">
                    <table className="min-w-full divide-y divide-gray-100">
                      <thead className="bg-[#FAFBFD]">
                        <tr>
                          <th className="px-6 py-4.5 text-left text-xs font-black text-gray-400 uppercase tracking-widest w-1/4">Category</th>
                          <th className="px-6 py-4.5 text-left text-xs font-black text-gray-400 uppercase tracking-widest w-5/12">Current Threshold</th>
                          <th className="px-6 py-4.5 text-center text-xs font-black text-gray-400 uppercase tracking-widest w-2/12">Alert Level</th>
                          <th className="px-6 py-4.5 text-center text-xs font-black text-gray-400 uppercase tracking-widest w-1/12">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 bg-white">
                        {thresholds.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50/20 transition-colors">
                            {/* Category Column */}
                            <td className="px-6 py-4.5 flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-orange-50 border border-orange-100/50 flex items-center justify-center text-lg select-none">
                                {item.icon}
                              </div>
                              <span className="font-extrabold text-[15px] text-gray-800">{item.name}</span>
                            </td>

                            {/* Current Threshold & Slider Column */}
                            <td className="px-6 py-4.5">
                              <div className="flex items-center gap-5">
                                {/* Visual slider synced bidirectionally */}
                                <input 
                                  type="range" 
                                  min="0" 
                                  max={item.max} 
                                  value={item.threshold} 
                                  onChange={(e) => handleSliderChange(item.id, e.target.value)}
                                  className="flex-1 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#FF4C00] focus:outline-none"
                                />
                                
                                {/* Compact text input synced bidirectionally */}
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAFBFD] border border-gray-200/80 rounded-xl w-[95px] justify-between focus-within:border-[#FF4C00] focus-within:ring-2 focus-within:ring-[#FF4C00]/10 transition-all">
                                  <input 
                                    type="number" 
                                    min="0"
                                    max={item.max}
                                    value={item.threshold} 
                                    onChange={(e) => handleThresholdInputChange(item.id, e.target.value)}
                                    className="w-10 bg-transparent text-sm font-extrabold text-gray-800 focus:outline-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  />
                                  <span className="text-[11px] font-bold text-gray-400 select-none">{item.unit}</span>
                                </div>
                              </div>
                            </td>

                            {/* Alert Level Column */}
                            <td className="px-6 py-4.5 text-center">
                              <span className={`inline-flex items-center justify-center px-3.5 py-1 text-xs font-black rounded-full select-none tracking-wide ${
                                item.badgeType === 'red'
                                  ? 'bg-[#FFF0EB] text-[#FF4C00]' 
                                  : 'bg-[#FFF5E6] text-[#FF8000]'
                              }`}>
                                Below {item.threshold}
                              </span>
                            </td>

                            {/* Action Pencil Column */}
                            <td className="px-6 py-4.5 text-center">
                              <button
                                onClick={() => handleOpenEditModal(item)}
                                className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#FF4C00] hover:border-[#FF4C00] hover:bg-orange-50/20 transition-all bg-white shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
                              >
                                <PencilIcon className="w-4.5 h-4.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2. Row 2: Email Alerts, System Status & System Information */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Email Alerts Card */}
                  <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.01)] text-left flex flex-col justify-between">
                    <div>
                      <h3 className="text-[17px] font-extrabold tracking-tight text-gray-900 mb-6">Email Alerts</h3>
                      <div className="space-y-5">
                        {/* Low Stock Alerts */}
                        <div className="flex justify-between items-center gap-4">
                          <div>
                            <span className="text-sm font-extrabold text-gray-800 block">Low Stock Alerts</span>
                            <span className="text-xs text-gray-400 block mt-0.5 font-medium">Get notified when stock is low</span>
                          </div>
                          <button 
                            onClick={() => handleToggle(setAlerts, 'lowStockAlerts', 'Low Stock Alerts')}
                            className={`h-6.5 w-11 rounded-full p-0.5 transition-colors duration-200 flex-shrink-0 focus:outline-none ${
                              alerts.lowStockAlerts ? 'bg-[#FF6B00]' : 'bg-gray-200'
                            }`}
                          >
                            <div className={`h-5.5 w-5.5 rounded-full bg-white transition-transform duration-200 shadow-sm ${
                              alerts.lowStockAlerts ? 'translate-x-4.5' : 'translate-x-0'
                            }`} />
                          </button>
                        </div>

                        {/* Daily Sales Summary */}
                        <div className="flex justify-between items-center gap-4 pt-1">
                          <div>
                            <span className="text-sm font-extrabold text-gray-800 block">Daily Sales Summary</span>
                            <span className="text-xs text-gray-400 block mt-0.5 font-medium">Receive daily sales report</span>
                          </div>
                          <button 
                            onClick={() => handleToggle(setAlerts, 'dailyDigest', 'Daily Sales Report')}
                            className={`h-6.5 w-11 rounded-full p-0.5 transition-colors duration-200 flex-shrink-0 focus:outline-none ${
                              alerts.dailyDigest ? 'bg-[#FF6B00]' : 'bg-gray-200'
                            }`}
                          >
                            <div className={`h-5.5 w-5.5 rounded-full bg-white transition-transform duration-200 shadow-sm ${
                              alerts.dailyDigest ? 'translate-x-4.5' : 'translate-x-0'
                            }`} />
                          </button>
                        </div>

                        {/* Order Notifications */}
                        <div className="flex justify-between items-center gap-4 pt-1">
                          <div>
                            <span className="text-sm font-extrabold text-gray-800 block">Order Notifications</span>
                            <span className="text-xs text-gray-400 block mt-0.5 font-medium">Get notified for new orders</span>
                          </div>
                          <button 
                            onClick={() => handleToggle(setAlerts, 'orderNotifications', 'Order Notifications')}
                            className={`h-6.5 w-11 rounded-full p-0.5 transition-colors duration-200 flex-shrink-0 focus:outline-none ${
                              alerts.orderNotifications ? 'bg-[#FF6B00]' : 'bg-gray-200'
                            }`}
                          >
                            <div className={`h-5.5 w-5.5 rounded-full bg-white transition-transform duration-200 shadow-sm ${
                              alerts.orderNotifications ? 'translate-x-4.5' : 'translate-x-0'
                            }`} />
                          </button>
                        </div>

                        {/* System Alerts */}
                        <div className="flex justify-between items-center gap-4 pt-1">
                          <div>
                            <span className="text-sm font-extrabold text-gray-800 block">System Alerts</span>
                            <span className="text-xs text-gray-400 block mt-0.5 font-medium">Important system notifications</span>
                          </div>
                          <button 
                            onClick={() => handleToggle(setAlerts, 'systemAlerts', 'System Alerts')}
                            className={`h-6.5 w-11 rounded-full p-0.5 transition-colors duration-200 flex-shrink-0 focus:outline-none ${
                              alerts.systemAlerts ? 'bg-[#FF6B00]' : 'bg-gray-200'
                            }`}
                          >
                            <div className={`h-5.5 w-5.5 rounded-full bg-white transition-transform duration-200 shadow-sm ${
                              alerts.systemAlerts ? 'translate-x-4.5' : 'translate-x-0'
                            }`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* System Status Card */}
                  <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.01)] text-left flex flex-col justify-between">
                    <div>
                      <h3 className="text-[17px] font-extrabold tracking-tight text-gray-900 mb-6">System Status</h3>
                      <div className="space-y-4">
                        {/* Server Status */}
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-gray-600">Server Status</span>
                          <span className="text-[11px] font-black text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase tracking-wider">Operational</span>
                        </div>

                        {/* Database */}
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-gray-600">Database</span>
                          <span className="text-[11px] font-black text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase tracking-wider">Operational</span>
                        </div>

                        {/* Payment Gateway */}
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-gray-600">Payment Gateway</span>
                          <span className="text-[11px] font-black text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase tracking-wider">Operational</span>
                        </div>

                        {/* Email Service */}
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-gray-600">Email Service</span>
                          <span className="text-[11px] font-black text-[#FF8000] bg-[#FFF5E6] px-3 py-1 rounded-full uppercase tracking-wider">Warning</span>
                        </div>

                        {/* Storage Usage progress bar */}
                        <div className="pt-2">
                          <div className="flex justify-between items-center text-xs font-semibold text-gray-600">
                            <span>Storage Usage</span>
                            <span className="text-[#FF8000] font-black">68% Used</span>
                          </div>
                          <div className="w-full bg-gray-100 h-2.5 rounded-full mt-2.5 overflow-hidden">
                            <div className="bg-gradient-to-r from-[#FF8000] to-[#FF6B00] h-full rounded-full transition-all duration-500" style={{ width: '68%' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* System Information Card */}
                  <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.01)] text-left flex flex-col justify-between">
                    <div>
                      <h3 className="text-[17px] font-extrabold tracking-tight text-gray-900 mb-6">System Information</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-gray-600">Application Version</span>
                          <span className="text-sm font-bold text-gray-800">v2.4.1</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-gray-600">Environment</span>
                          <span className="text-sm font-bold text-gray-800">Production</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-gray-600">PHP Version</span>
                          <span className="text-sm font-bold text-gray-800">8.2.7</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-gray-600">Server Time</span>
                          <span className="text-sm font-bold text-gray-800">May 10, 2024 10:30 AM</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-gray-600">Timezone</span>
                          <span className="text-sm font-bold text-gray-800">(UTC +05:30) Asia/Kolkata</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* 3. Row 3: Stock Notifications, Cache Management & Auto Management */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                  
                  {/* Stock Notifications Card [NEW] */}
                  <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.01)] text-left flex flex-col justify-between h-full">
                    <div>
                      <h3 className="text-[17px] font-extrabold tracking-tight text-gray-900">Stock Notifications</h3>
                      <p className="text-xs font-semibold text-gray-400 mt-1 mb-5">Recent low stock notifications</p>
                      
                      <div className="space-y-4 mb-6">
                        {[
                          { item: 'Tomato is low on stock', time: '2 mins ago' },
                          { item: 'Cheese is low on stock', time: '1 hour ago' },
                          { item: 'Capsicum is low on stock', time: '3 hours ago' }
                        ].map((notif, index) => (
                          <div key={index} className="flex justify-between items-center py-0.5 border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                            <span className="text-sm font-bold text-gray-700">{notif.item}</span>
                            <span className="text-xs text-gray-400 font-semibold">{notif.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => setToast({ title: 'Notifications Opened', message: 'Showing all low stock reports.' })}
                      className="border border-[#FF6B00] text-[#FF6B00] hover:bg-orange-50/20 bg-white w-full py-2.5 rounded-xl text-xs font-black transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer mt-auto"
                    >
                      <svg className="w-3.5 h-3.5 text-[#FF6B00] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                      </svg>
                      View All Notifications
                    </button>
                  </div>

                  {/* Cache Management Card */}
                  <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.01)] text-left flex flex-col justify-between h-full">
                    <div>
                      <h3 className="text-[17px] font-extrabold tracking-tight text-gray-900">Cache Management</h3>
                      <p className="text-xs font-semibold text-gray-400 mt-1 mb-5">Manage system cache</p>
                      
                      <div className="space-y-4 mb-6">
                        {/* Clear Application Cache */}
                        <div className="flex justify-between items-center py-0.5">
                          <span className="text-sm font-semibold text-gray-600">Clear Application Cache</span>
                          <button
                            onClick={() => handleClearCache('app', 'Application')}
                            disabled={loadingAction !== null}
                            className="border border-[#FF6B00] text-[#FF6B00] hover:bg-orange-50/20 bg-transparent px-4.5 py-1.5 rounded-xl text-xs font-black transition-all active:scale-95 flex items-center justify-center gap-1.5 h-8.5 min-w-[72px] cursor-pointer"
                          >
                            {loadingAction === 'app' ? (
                              <div className="h-3.5 w-3.5 border-2 border-[#FF6B00] border-t-transparent rounded-full animate-spin"></div>
                            ) : 'Clear'}
                          </button>
                        </div>

                        {/* Clear Config Cache */}
                        <div className="flex justify-between items-center py-0.5">
                          <span className="text-sm font-semibold text-gray-600">Clear Config Cache</span>
                          <button
                            onClick={() => handleClearCache('config', 'Config')}
                            disabled={loadingAction !== null}
                            className="border border-[#FF6B00] text-[#FF6B00] hover:bg-orange-50/20 bg-transparent px-4.5 py-1.5 rounded-xl text-xs font-black transition-all active:scale-95 flex items-center justify-center gap-1.5 h-8.5 min-w-[72px] cursor-pointer"
                          >
                            {loadingAction === 'config' ? (
                              <div className="h-3.5 w-3.5 border-2 border-[#FF6B00] border-t-transparent rounded-full animate-spin"></div>
                            ) : 'Clear'}
                          </button>
                        </div>

                        {/* Clear Route Cache */}
                        <div className="flex justify-between items-center py-0.5">
                          <span className="text-sm font-semibold text-gray-600">Clear Route Cache</span>
                          <button
                            onClick={() => handleClearCache('route', 'Route')}
                            disabled={loadingAction !== null}
                            className="border border-[#FF6B00] text-[#FF6B00] hover:bg-orange-50/20 bg-transparent px-4.5 py-1.5 rounded-xl text-xs font-black transition-all active:scale-95 flex items-center justify-center gap-1.5 h-8.5 min-w-[72px] cursor-pointer"
                          >
                            {loadingAction === 'route' ? (
                              <div className="h-3.5 w-3.5 border-2 border-[#FF6B00] border-t-transparent rounded-full animate-spin"></div>
                            ) : 'Clear'}
                          </button>
                        </div>

                        {/* Clear View Cache */}
                        <div className="flex justify-between items-center py-0.5">
                          <span className="text-sm font-semibold text-gray-600">Clear View Cache</span>
                          <button
                            onClick={() => handleClearCache('view', 'View')}
                            disabled={loadingAction !== null}
                            className="border border-[#FF6B00] text-[#FF6B00] hover:bg-orange-50/20 bg-transparent px-4.5 py-1.5 rounded-xl text-xs font-black transition-all active:scale-95 flex items-center justify-center gap-1.5 h-8.5 min-w-[72px] cursor-pointer"
                          >
                            {loadingAction === 'view' ? (
                              <div className="h-3.5 w-3.5 border-2 border-[#FF6B00] border-t-transparent rounded-full animate-spin"></div>
                            ) : 'Clear'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Auto Management Card [NEW] */}
                  <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.01)] text-left flex flex-col justify-between h-full">
                    <div>
                      <h3 className="text-[17px] font-extrabold tracking-tight text-gray-900">Auto Management</h3>
                      <p className="text-xs font-semibold text-gray-400 mt-1 mb-5">Configure automatic actions</p>
                      
                      <div className="space-y-4 mb-6">
                        {[
                          { action: 'Auto Email Suppliers' },
                          { action: 'Auto Pause Items' },
                          { action: 'Auto Hide Items' },
                          { action: 'Clear Expired Stock' }
                        ].map((rule, idx) => (
                          <div key={idx} className="flex justify-between items-center py-0.5">
                            <span className="text-sm font-semibold text-gray-600">{rule.action}</span>
                            <button
                              type="button"
                              onClick={() => setToast({ title: `${rule.action} Set Up`, message: 'Rule parameters updated successfully.' })}
                              className="border border-[#FF6B00] text-[#FF6B00] hover:bg-orange-50/20 bg-transparent px-4.5 py-1.5 rounded-xl text-xs font-black transition-all active:scale-95 flex items-center justify-center gap-1.5 h-8.5 min-w-[72px] cursor-pointer"
                            >
                              Set Up
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => setToast({ title: 'Auto Rules Opened', message: 'Showing automation rules dashboard.' })}
                      className="border border-[#FF6B00] text-[#FF6B00] hover:bg-orange-50/20 bg-white w-full py-2.5 rounded-xl text-xs font-black transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer mt-auto"
                    >
                      <svg className="w-3.5 h-3.5 text-[#FF6B00] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                      </svg>
                      Manage Auto Rules
                    </button>
                  </div>

                </div>

              </div>
            )}

            {/* ==========================================
                TAB: General Store Settings Panel
               ========================================== */}
            {activeSubTab === 'general' && (
              <div className="bg-white rounded-3xl border border-gray-100 p-6.5 shadow-[0_15px_45px_rgba(0,0,0,0.015)] text-left">
                <div className="flex justify-between items-center mb-6 border-b border-gray-50 pb-4">
                  <div>
                    <h2 className="text-[19px] font-extrabold tracking-tight text-gray-900">General Settings</h2>
                    <p className="text-sm font-medium text-gray-400 mt-1">Configure global store details, operating hours, and location preferences.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-700">Store Status:</span>
                    <button 
                      onClick={() => handleToggle(setGeneral, 'isOpen', 'Store Status')}
                      className={`h-6.5 w-11 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
                        general.isOpen ? 'bg-[#FF4C00]' : 'bg-gray-200'
                      }`}
                    >
                      <div className={`h-5.5 w-5.5 rounded-full bg-white transition-transform duration-200 shadow-sm ${
                        general.isOpen ? 'translate-x-4.5' : 'translate-x-0'
                      }`} />
                    </button>
                    <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wide ${
                      general.isOpen ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {general.isOpen ? 'Open' : 'Closed'}
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSaveGeneral} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Store Name</label>
                      <input 
                        type="text"
                        value={general.storeName}
                        onChange={(e) => setGeneral({ ...general, storeName: e.target.value })}
                        className="w-full text-[14px] font-bold px-4 py-3 rounded-2xl border border-gray-200/70 focus:border-[#FF4C00] focus:outline-none focus:ring-2 focus:ring-[#FF4C00]/10 transition-all bg-gray-50/30"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Store GST Rate (%)</label>
                      <input 
                        type="text"
                        value={general.taxRate}
                        onChange={(e) => setGeneral({ ...general, taxRate: e.target.value })}
                        className="w-full text-[14px] font-bold px-4 py-3 rounded-2xl border border-gray-200/70 focus:border-[#FF4C00] focus:outline-none focus:ring-2 focus:ring-[#FF4C00]/10 transition-all bg-gray-50/30"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Store Contact Phone</label>
                      <input 
                        type="text"
                        value={general.storePhone}
                        onChange={(e) => setGeneral({ ...general, storePhone: e.target.value })}
                        className="w-full text-[14px] font-bold px-4 py-3 rounded-2xl border border-gray-200/70 focus:border-[#FF4C00] focus:outline-none focus:ring-2 focus:ring-[#FF4C00]/10 transition-all bg-gray-50/30"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Store Base Delivery Charge (₹)</label>
                      <input 
                        type="text"
                        value={general.deliveryCharge}
                        onChange={(e) => setGeneral({ ...general, deliveryCharge: e.target.value })}
                        className="w-full text-[14px] font-bold px-4 py-3 rounded-2xl border border-gray-200/70 focus:border-[#FF4C00] focus:outline-none focus:ring-2 focus:ring-[#FF4C00]/10 transition-all bg-gray-50/30"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Store Address</label>
                      <textarea 
                        rows="3"
                        value={general.storeAddress}
                        onChange={(e) => setGeneral({ ...general, storeAddress: e.target.value })}
                        className="w-full text-[14px] font-bold px-4 py-3 rounded-2xl border border-gray-200/70 focus:border-[#FF4C00] focus:outline-none focus:ring-2 focus:ring-[#FF4C00]/10 transition-all bg-gray-50/30 resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button 
                      type="submit"
                      disabled={loadingAction !== null}
                      className="bg-[#FF4C00] hover:bg-[#e64400] text-white px-8 py-3.5 rounded-2xl text-[13.5px] font-black shadow-md shadow-orange-500/10 active:scale-95 transition-all flex items-center gap-2 h-11.5"
                    >
                      {loadingAction === 'general' && <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                      Save General Settings
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ==========================================
                TAB: Payments Settings Panel
               ========================================== */}
            {activeSubTab === 'payments' && (
              <div className="bg-white rounded-3xl border border-gray-100 p-6.5 shadow-[0_15px_45px_rgba(0,0,0,0.015)] text-left">
                <div className="flex justify-between items-center mb-6 border-b border-gray-50 pb-4">
                  <div>
                    <h2 className="text-[19px] font-extrabold tracking-tight text-gray-900">Payments Settings</h2>
                    <p className="text-sm font-medium text-gray-400 mt-1">Configure active payment methods, merchant credentials, and delivery limits.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-700">Sandbox Test Mode:</span>
                    <button 
                      onClick={() => handleToggle(setPayments, 'testMode', 'Sandbox Payments')}
                      className={`h-6.5 w-11 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
                        payments.testMode ? 'bg-[#FF4C00]' : 'bg-gray-200'
                      }`}
                    >
                      <div className={`h-5.5 w-5.5 rounded-full bg-white transition-transform duration-200 shadow-sm ${
                        payments.testMode ? 'translate-x-4.5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSavePayments} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Merchant UPI ID</label>
                      <input 
                        type="text"
                        value={payments.upiId}
                        onChange={(e) => setPayments({ ...payments, upiId: e.target.value })}
                        className="w-full text-[14px] font-bold px-4 py-3 rounded-2xl border border-gray-200/70 focus:border-[#FF4C00] focus:outline-none focus:ring-2 focus:ring-[#FF4C00]/10 transition-all bg-gray-50/30"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Minimum Free Delivery (₹)</label>
                      <input 
                        type="text"
                        value={payments.minFreeDelivery}
                        onChange={(e) => setPayments({ ...payments, minFreeDelivery: e.target.value })}
                        className="w-full text-[14px] font-bold px-4 py-3 rounded-2xl border border-gray-200/70 focus:border-[#FF4C00] focus:outline-none focus:ring-2 focus:ring-[#FF4C00]/10 transition-all bg-gray-50/30"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Primary Currency</label>
                      <select 
                        value={payments.currency}
                        onChange={(e) => setPayments({ ...payments, currency: e.target.value })}
                        className="w-full text-[14px] font-bold px-4 py-3 rounded-2xl border border-gray-200/70 focus:border-[#FF4C00] focus:outline-none focus:ring-2 focus:ring-[#FF4C00]/10 transition-all bg-[#FAFBFD] appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%234a5568%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25em_1.25em] bg-[right_1rem_center] bg-no-repeat cursor-pointer"
                      >
                        <option value="INR">INR (₹) Rupee</option>
                        <option value="USD">USD ($) Dollar</option>
                        <option value="EUR">EUR (€) Euro</option>
                      </select>
                    </div>

                    <div className="md:col-span-3">
                      <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Payment Methods Configuration</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3 p-4 bg-gray-50/30 border border-gray-100 rounded-2xl">
                          <input 
                            type="checkbox" 
                            id="enableUpi"
                            checked={payments.enableUpi} 
                            onChange={(e) => setPayments({ ...payments, enableUpi: e.target.checked })}
                            className="rounded text-[#FF4C00] focus:ring-[#FF4C00] h-4.5 w-4.5 border-gray-300"
                          />
                          <label htmlFor="enableUpi" className="text-sm font-bold text-gray-700 cursor-pointer">UPI Direct</label>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-gray-50/30 border border-gray-100 rounded-2xl">
                          <input 
                            type="checkbox" 
                            id="enableCards"
                            checked={payments.enableCards} 
                            onChange={(e) => setPayments({ ...payments, enableCards: e.target.checked })}
                            className="rounded text-[#FF4C00] focus:ring-[#FF4C00] h-4.5 w-4.5 border-gray-300"
                          />
                          <label htmlFor="enableCards" className="text-sm font-bold text-gray-700 cursor-pointer">Cards/Stripe</label>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-gray-50/30 border border-gray-100 rounded-2xl">
                          <input 
                            type="checkbox" 
                            id="enableCod"
                            checked={payments.enableCod} 
                            onChange={(e) => setPayments({ ...payments, enableCod: e.target.checked })}
                            className="rounded text-[#FF4C00] focus:ring-[#FF4C00] h-4.5 w-4.5 border-gray-300"
                          />
                          <label htmlFor="enableCod" className="text-sm font-bold text-gray-700 cursor-pointer">Cash on Delivery</label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button 
                      type="submit"
                      disabled={loadingAction !== null}
                      className="bg-[#FF4C00] hover:bg-[#e64400] text-white px-8 py-3.5 rounded-2xl text-[13.5px] font-black shadow-md shadow-orange-500/10 active:scale-95 transition-all flex items-center gap-2 h-11.5"
                    >
                      {loadingAction === 'payments' && <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                      Save Payment Settings
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ==========================================
                TAB: Dedicated Email Alerts Panel
               ========================================== */}
            {activeSubTab === 'alerts' && (
              <div className="bg-white rounded-3xl border border-gray-100 p-6.5 shadow-[0_15px_45px_rgba(0,0,0,0.015)] text-left">
                <div className="mb-6 border-b border-gray-50 pb-4">
                  <h2 className="text-[19px] font-extrabold tracking-tight text-gray-900">Email Alerts & Notifications</h2>
                  <p className="text-sm font-medium text-gray-400 mt-1">Configure automated notifications, recipient routing, and mail frequencies.</p>
                </div>

                <div className="space-y-6">
                  {/* Detailed Recipient setup */}
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Admin Alerts Notification Email List</label>
                    <div className="flex items-center gap-3 max-w-xl">
                      <input 
                        type="email" 
                        placeholder="e.g. notifications@slicesprint.com"
                        className="flex-1 text-[14px] font-bold px-4 py-3 rounded-2xl border border-gray-200/70 focus:border-[#FF4C00] focus:outline-none focus:ring-2 focus:ring-[#FF4C00]/10 transition-all bg-[#FAFBFD]"
                      />
                      <button 
                        onClick={() => {
                          setToast({
                            title: 'Email Address Added',
                            message: 'Verification alert sent to recipient.'
                          });
                        }}
                        className="bg-[#FF4C00] hover:bg-[#e64400] text-white px-5 py-3 rounded-2xl text-[13px] font-black transition-all active:scale-95 shadow-md shadow-orange-500/10"
                      >
                        Add Email
                      </button>
                    </div>
                  </div>

                  {/* Frequency Settings Card */}
                  <div className="border border-gray-100 rounded-2xl p-5 bg-gray-50/20">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Notification Frequency Rules</h4>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                        <span className="text-sm font-bold text-gray-700">Low Stock Re-alert Interval</span>
                        <select className="text-xs font-bold bg-white border px-3 py-1.5 rounded-xl text-gray-700">
                          <option>Every 2 Hours</option>
                          <option>Every 6 Hours</option>
                          <option>Every 12 Hours</option>
                          <option>Once Daily</option>
                        </select>
                      </div>

                      <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                        <span className="text-sm font-bold text-gray-700">Daily Sales Summary Delivery Time</span>
                        <span className="text-xs font-extrabold text-gray-800 bg-white border px-3 py-1.5 rounded-xl">09:00 PM IST</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-700">SMTP Server Status</span>
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-green-500"></span>
                          <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-0.5 rounded-md uppercase">Connected</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* ==========================================
                TAB: Security & Access logs
               ========================================== */}
            {activeSubTab === 'security' && (
              <div className="space-y-6">
                
                {/* 2FA & Session timeout configurations */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6.5 shadow-[0_15px_45px_rgba(0,0,0,0.015)] text-left">
                  <div className="mb-6 border-b border-gray-50 pb-4">
                    <h2 className="text-[19px] font-extrabold tracking-tight text-gray-900">Security Settings</h2>
                    <p className="text-sm font-medium text-gray-400 mt-1">Configure Two-Factor requirements, session constraints, and review admin actions history.</p>
                  </div>

                  <div className="space-y-6">
                    {/* 2FA Enforced */}
                    <div className="flex items-center justify-between gap-4 p-4 border border-orange-100 bg-[#FFF5F0]/50 rounded-2xl">
                      <div className="flex gap-3">
                        <LockClosedIcon className="h-6 w-6 text-[#FF4C00] flex-shrink-0" />
                        <div>
                          <span className="text-sm font-extrabold text-gray-800 block">Two-Factor Authentication (2FA)</span>
                          <span className="text-xs text-gray-400 block mt-0.5 font-medium">Authenticator app validation enforced on all administrator sign-ins.</span>
                        </div>
                      </div>
                      <span className="bg-[#FFF0EB] text-[#FF4C00] text-[10px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider select-none">
                        Enforced
                      </span>
                    </div>

                    {/* Session Timeout */}
                    <div className="flex justify-between items-center gap-4 border-b border-gray-50 pb-4">
                      <div>
                        <span className="text-sm font-extrabold text-gray-800 block">Administrator Session Timeout</span>
                        <span className="text-xs text-gray-400 block mt-0.5 font-medium">Auto log out inactive administrator sessions after a set timeframe.</span>
                      </div>
                      <select className="text-sm font-bold bg-[#FAFBFD] border border-gray-200/80 px-3.5 py-2 rounded-xl text-gray-700">
                        <option>15 Minutes</option>
                        <option>30 Minutes</option>
                        <option selected>60 Minutes</option>
                        <option>120 Minutes</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 2. System Audit Logs */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6.5 shadow-[0_15px_45px_rgba(0,0,0,0.015)] text-left">
                  <div className="mb-5 flex justify-between items-center">
                    <div>
                      <h3 className="text-[17px] font-extrabold tracking-tight text-gray-900">System Audit Logs</h3>
                      <p className="text-xs text-gray-400 mt-0.5 font-medium">Trace history of configurations updates, cache clears, and session logins.</p>
                    </div>
                    <button 
                      onClick={() => {
                        setToast({
                          title: 'Audit Logs Refreshed',
                          message: 'Retrieved latest administrative activities.'
                        });
                      }}
                      className="border border-gray-200 hover:bg-gray-50 text-gray-600 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
                    >
                      Refresh
                    </button>
                  </div>

                  <div className="overflow-hidden border border-gray-100 rounded-2xl">
                    <table className="min-w-full divide-y divide-gray-100">
                      <thead className="bg-[#FAFBFD]">
                        <tr>
                          <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-500">Performed Action</th>
                          <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-500">User Email</th>
                          <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-500">IP Address</th>
                          <th className="px-5 py-3.5 text-right text-xs font-bold text-gray-500">Date & Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 bg-white">
                        {INITIAL_AUDIT_LOGS.map(log => (
                          <tr key={log.id} className="hover:bg-gray-50/20 transition-colors">
                            <td className="px-5 py-3.5 text-sm font-bold text-gray-800">{log.action}</td>
                            <td className="px-5 py-3.5 text-xs font-bold text-gray-500">{log.user}</td>
                            <td className="px-5 py-3.5 text-xs font-mono text-gray-400">{log.ip}</td>
                            <td className="px-5 py-3.5 text-xs font-bold text-gray-500 text-right">{log.time}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* ==========================================
                TAB: System Diagnostics Panel
               ========================================== */}
            {activeSubTab === 'system' && (
              <div className="space-y-6">
                
                {/* 1. Diagnostics Performance Meter Grid */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6.5 shadow-[0_15px_45px_rgba(0,0,0,0.015)] text-left">
                  <div className="mb-6">
                    <h2 className="text-[19px] font-extrabold tracking-tight text-gray-900">System Diagnostics</h2>
                    <p className="text-sm font-medium text-gray-400 mt-1">Real-time telemetry and resource usage statistics of the operational backend.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {/* CPU gauge */}
                    <div className="p-4 bg-[#FAFBFD] border border-gray-50 rounded-2xl">
                      <span className="text-xs text-gray-400 font-bold block mb-1 uppercase tracking-wider">CPU LOAD</span>
                      <span className="text-2xl font-black text-gray-800 block">1.2%</span>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-[10px] font-black text-green-600 uppercase">Operational</span>
                      </div>
                    </div>

                    {/* RAM gauge */}
                    <div className="p-4 bg-[#FAFBFD] border border-gray-50 rounded-2xl">
                      <span className="text-xs text-gray-400 font-bold block mb-1 uppercase tracking-wider">MEMORY USED</span>
                      <span className="text-2xl font-black text-gray-800 block">324 MB</span>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="text-[10px] font-black text-gray-400 uppercase">OF 2048 MB MAX</span>
                      </div>
                    </div>

                    {/* DB status */}
                    <div className="p-4 bg-[#FAFBFD] border border-gray-50 rounded-2xl">
                      <span className="text-xs text-gray-400 font-bold block mb-1 uppercase tracking-wider">PRIMARY DATABASE</span>
                      <span className="text-lg font-black text-gray-800 block">SQLite Server</span>
                      <div className="flex items-center gap-1.5 mt-3">
                        <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded uppercase">Connected</span>
                      </div>
                    </div>

                    {/* Redis Status */}
                    <div className="p-4 bg-[#FAFBFD] border border-gray-50 rounded-2xl">
                      <span className="text-xs text-gray-400 font-bold block mb-1 uppercase tracking-wider">REDIS CACHE</span>
                      <span className="text-lg font-black text-gray-800 block">Active Store</span>
                      <div className="flex items-center gap-1.5 mt-3">
                        <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded uppercase">Active</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. System specs & Cache Actions stacked */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Specifications card */}
                  <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.01)] text-left">
                    <h3 className="text-[17px] font-extrabold tracking-tight text-gray-900 mb-6">Specification Profile</h3>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                        <span className="text-sm font-semibold text-gray-600">Node.js Engine</span>
                        <span className="text-sm font-bold text-gray-800">v18.20.1</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                        <span className="text-sm font-semibold text-gray-600">React framework</span>
                        <span className="text-sm font-bold text-gray-800">v18.3.1</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                        <span className="text-sm font-semibold text-gray-600">Vite bundler</span>
                        <span className="text-sm font-bold text-gray-800">v5.3.1</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-gray-600">Operational Level</span>
                        <span className="text-[10px] font-black text-green-600 bg-green-50 px-2.5 py-0.5 rounded uppercase tracking-wider">Production</span>
                      </div>
                    </div>
                  </div>

                  {/* Cache triggers */}
                  <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.01)] text-left">
                    <h3 className="text-[17px] font-extrabold tracking-tight text-gray-900 mb-6">Pruning Options</h3>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-700">Clear Application Cache</span>
                        <button 
                          onClick={() => handleClearCache('app', 'Application')}
                          className="border border-[#FF4C00] text-[#FF4C00] hover:bg-orange-50/20 bg-transparent px-4.5 py-1.5 rounded-xl text-xs font-black transition-all"
                        >
                          Clear
                        </button>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-700">Clear Config Cache</span>
                        <button 
                          onClick={() => handleClearCache('config', 'Config')}
                          className="border border-[#FF4C00] text-[#FF4C00] hover:bg-orange-50/20 bg-transparent px-4.5 py-1.5 rounded-xl text-xs font-black transition-all"
                        >
                          Clear
                        </button>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-700">Clear Route Cache</span>
                        <button 
                          onClick={() => handleClearCache('route', 'Route')}
                          className="border border-[#FF4C00] text-[#FF4C00] hover:bg-orange-50/20 bg-transparent px-4.5 py-1.5 rounded-xl text-xs font-black transition-all"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            )}

          </div>

        </div>
      </div>

      {/* ========================================================
          EDIT MODAL: Edit Threshold - [Category Name]
         ======================================================== */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-gray-100 shadow-[0_25px_60px_rgba(0,0,0,0.15)] text-left animate-in fade-in zoom-in-95 duration-200 relative">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-[18px] font-black tracking-tight text-gray-900">Edit Threshold - {editingItem.name}</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-[26px] font-light leading-none focus:outline-none transition-colors"
              >
                &times;
              </button>
            </div>
            
            {/* Form */}
            <form onSubmit={handleSaveThreshold} className="space-y-4">
              
              {/* Current Threshold (Read-only styled input) */}
              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-2">Current Threshold</label>
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl select-none">
                  <span className="text-[14px] font-extrabold text-gray-500">{editingItem.threshold}</span>
                  <span className="text-[11px] font-black text-gray-400 uppercase">{editingItem.unit}</span>
                </div>
              </div>
              
              {/* Alert When Stock Below */}
              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-2">Alert When Stock Below</label>
                <div className="flex items-center justify-between px-4 py-3 bg-[#FAFBFD] border border-gray-200/80 rounded-2xl focus-within:border-[#FF4C00] focus-within:ring-2 focus-within:ring-[#FF4C00]/10 transition-all">
                  <input 
                    type="number"
                    required
                    min="0"
                    max={editingItem.max}
                    value={modalThreshold}
                    onChange={(e) => setModalThreshold(e.target.value)}
                    className="w-full bg-transparent text-[14px] font-extrabold text-gray-800 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-[11px] font-black text-gray-400 uppercase select-none">{editingItem.unit}</span>
                </div>
                <p className="text-[11px] font-semibold text-gray-400 mt-1.5 leading-normal">
                  You will be notified when stock quantity falls below this value.
                </p>
              </div>

              {/* Email Notification Toggle Switch */}
              <div className="flex items-center justify-between py-2 border-t border-b border-gray-50 my-3">
                <span className="text-[13px] font-extrabold text-gray-800">Email Notification</span>
                <button 
                  type="button"
                  onClick={() => setModalEmailNotification(!modalEmailNotification)}
                  className={`h-6.5 w-11 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
                    modalEmailNotification ? 'bg-[#FF4C00]' : 'bg-gray-200'
                  }`}
                >
                  <div className={`h-5.5 w-5.5 rounded-full bg-white transition-transform duration-200 shadow-sm ${
                    modalEmailNotification ? 'translate-x-4.5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Notify These Emails Multi-Select tags component */}
              {modalEmailNotification && (
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-2">Notify These Emails</label>
                  
                  {/* Multi-Select Tags Input Box */}
                  <div className="flex flex-wrap gap-2 items-center p-2.5 rounded-2xl border border-gray-200/80 focus-within:border-[#FF4C00] focus-within:ring-2 focus-within:ring-[#FF4C00]/10 transition-all bg-[#FAFBFD] relative pr-9">
                    
                    {/* Render existing Email Tag Pills */}
                    {modalNotifyEmails.map((email) => (
                      <span key={email} className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-gray-600 bg-gray-200/50 rounded-xl select-none">
                        <span>{email}</span>
                        <button 
                          type="button"
                          onClick={() => handleRemoveEmailTag(email)} 
                          className="text-gray-400 hover:text-red-500 font-extrabold text-[13px] transition-colors leading-none"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                    
                    {/* Keydown Text Input to insert tag on Enter/Comma */}
                    <input 
                      type="text"
                      placeholder={modalNotifyEmails.length === 0 ? "Enter email and press Enter..." : ""}
                      value={modalEmailInput}
                      onChange={(e) => setModalEmailInput(e.target.value)}
                      onKeyDown={handleAddEmailTag}
                      className="flex-1 min-w-[120px] text-xs font-bold bg-transparent outline-none border-none py-1 text-gray-700"
                    />

                    {/* Dropdown chevron arrow */}
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 select-none pointer-events-none">
                      <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                    </span>
                  </div>
                </div>
              )}

              {/* Footer Buttons */}
              <div className="flex gap-3 justify-end pt-3 border-t border-gray-50 mt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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
          SUCCESS TOAST ALERTS (Bottom Center Styling matching screenshot)
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

export default AdminSettingsPage;
