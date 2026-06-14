import React, { useState, useMemo, useEffect } from 'react';
import { 
  CalendarIcon, 
  ArrowDownTrayIcon, 
  CreditCardIcon, 
  BanknotesIcon, 
  WalletIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowUpRightIcon,
  ArrowDownRightIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

// --- Seed Mock Transactions Database ---
const TRANSACTION_MOCK_DATA = [
  {
    id: 'TXN_100245',
    orderId: 'SS_ORD_84521',
    customer: 'John Doe',
    method: 'UPI',
    amount: 24.99,
    status: 'Success',
    dateTime: 'May 10, 2024 10:24 AM',
    paymentId: 'pay_test_1Qaz2WSX3edc',
    currency: 'USD',
    signatureVerified: true
  },
  {
    id: 'TXN_100244',
    orderId: 'SS_ORD_84520',
    customer: 'Priya Sharma',
    method: 'Card',
    amount: 18.49,
    status: 'Success',
    dateTime: 'May 10, 2024 09:45 AM',
    paymentId: 'pay_test_7Ytr8Uio9plk',
    currency: 'USD',
    signatureVerified: true
  },
  {
    id: 'TXN_100243',
    orderId: 'SS_ORD_84519',
    customer: 'Rahul Verma',
    method: 'Net Banking',
    amount: 27.99,
    status: 'Success',
    dateTime: 'May 10, 2024 09:12 AM',
    paymentId: 'pay_test_3Wsd4Erf5tgb',
    currency: 'USD',
    signatureVerified: true
  },
  {
    id: 'TXN_100242',
    orderId: 'SS_ORD_84518',
    customer: 'Neha Patel',
    method: 'Wallet',
    amount: 15.99,
    status: 'Refunded',
    dateTime: 'May 09, 2024 08:05 PM',
    paymentId: 'pay_test_9Mnb8Vcx7Zlk',
    currency: 'USD',
    signatureVerified: true
  },
  {
    id: 'TXN_100241',
    orderId: 'SS_ORD_84517',
    customer: 'Amit Kumar',
    method: 'UPI',
    amount: 21.49,
    status: 'Failed',
    dateTime: 'May 09, 2024 07:32 PM',
    paymentId: 'pay_test_4Piu5Ytr2Qwe',
    currency: 'USD',
    signatureVerified: false
  },
  {
    id: 'TXN_100240',
    orderId: 'SS_ORD_84516',
    customer: 'Suresh Yadav',
    method: 'Card',
    amount: 31.99,
    status: 'Success',
    dateTime: 'May 09, 2024 06:18 PM',
    paymentId: 'pay_test_2Kjh4Hgf6Dsa',
    currency: 'USD',
    signatureVerified: true
  },
  {
    id: 'TXN_100239',
    orderId: 'SS_ORD_84515',
    customer: 'Pooja Singh',
    method: 'COD',
    amount: 14.99,
    status: 'Success',
    dateTime: 'May 09, 2024 05:09 PM',
    paymentId: 'pay_cash_collected_100a',
    currency: 'USD',
    signatureVerified: true
  }
];

// --- Revenue Curve Historical Data points ---
const REVENUE_TIMELINE = [
  { date: 'May 01', revenue: 850 },
  { date: 'May 02', revenue: 1200 },
  { date: 'May 03', revenue: 2500 },
  { date: 'May 04', revenue: 4100 },
  { date: 'May 05', revenue: 3600 },
  { date: 'May 06', revenue: 2100 },
  { date: 'May 07', revenue: 2845.60, fullDate: 'May 07, 2024' }, // Highlighted target
  { date: 'May 08', revenue: 1900 },
  { date: 'May 09', revenue: 4000 },
  { date: 'May 10', revenue: 6500 }
];

// --- Donut Chart breakdown specifications ---
const PAYMENT_METHODS_SUMMARY = [
  { name: 'UPI', count: 512, percent: 38.6, color: '#2563EB' },
  { name: 'Card', count: 482, percent: 36.4, color: '#3B82F6' },
  { name: 'Net Banking', count: 198, percent: 14.9, color: '#FF4C00' },
  { name: 'Wallet', count: 86, percent: 6.5, color: '#F59E0B' },
  { name: 'COD', count: 48, percent: 3.6, color: '#10B981' }
];

const AdminReportsPage = () => {
  // --- States ---
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('slicesprint_transactions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse cached transactions', e);
    }
    return TRANSACTION_MOCK_DATA;
  });

  const [dateRangePreset, setDateRangePreset] = useState('May 01, 2024 - May 10, 2024');
  const [showDatePickerDropdown, setShowDatePickerDropdown] = useState(false);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('All Status');
  
  // Selected row for details panel
  const [selectedTxnId, setSelectedTxnId] = useState('TXN_100245');
  const [isPopupOpen, setIsPopupOpen] = useState(true);

  // Line chart interactive hover state
  const [hoveredPointIndex, setHoveredPointIndex] = useState(6); // Default highlight index 6 (May 07)
  const [selectedDonutSegment, setSelectedDonutSegment] = useState(null);

  // Floating user toast notifications
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // --- Effects: Persistent Caching ---
  useEffect(() => {
    localStorage.setItem('slicesprint_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3500);
  };

  // --- Date preset configurations ---
  const datePresets = [
    { label: 'May 01, 2024 - May 10, 2024', tag: 'Custom Range' },
    { label: 'May 10, 2024 - May 10, 2024', tag: 'Today' },
    { label: 'May 03, 2024 - May 10, 2024', tag: 'Last 7 Days' },
    { label: 'Apr 10, 2024 - May 10, 2024', tag: 'Last 30 Days' }
  ];

  // --- Filter Logic ---
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesStatus = 
        paymentStatusFilter === 'All Status' || 
        t.status === paymentStatusFilter;
      return matchesStatus;
    });
  }, [transactions, paymentStatusFilter]);

  // Selected active transaction object
  const activeTransaction = useMemo(() => {
    return transactions.find(t => t.id === selectedTxnId) || transactions[0];
  }, [transactions, selectedTxnId]);

  // --- Handlers ---
  const handleExportReport = () => {
    try {
      const headers = ['Transaction ID', 'Order ID', 'Customer', 'Method', 'Amount', 'Status', 'Date & Time'];
      const csvRows = [
        headers.join(','),
        ...filteredTransactions.map(t => [
          t.id,
          t.orderId,
          t.customer,
          t.method,
          `$${t.amount}`,
          t.status,
          `"${t.dateTime}"`
        ].join(','))
      ];
      
      const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `slicesprint_financial_report_export.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast("Financial report successfully downloaded as CSV!", "success");
    } catch (e) {
      showToast("Failed to compile CSV document", "warning");
    }
  };

  // --- SVG Dimensions Calculations for Line Graph ---
  const svgWidth = 520;
  const svgHeight = 160;
  const paddingX = 40;
  const paddingY = 20;

  // Max value of timeline for scaling (let's assume $8,000 max coordinate bound)
  const maxVal = 8000;

  const pointsString = useMemo(() => {
    return REVENUE_TIMELINE.map((item, index) => {
      const x = paddingX + (index * (svgWidth - paddingX * 2) / (REVENUE_TIMELINE.length - 1));
      const y = svgHeight - paddingY - (item.revenue * (svgHeight - paddingY * 2) / maxVal);
      return `${x},${y}`;
    }).join(' ');
  }, []);

  const closedPathString = useMemo(() => {
    if (REVENUE_TIMELINE.length === 0) return '';
    const startX = paddingX;
    const startY = svgHeight - paddingY;
    const endX = paddingX + ((REVENUE_TIMELINE.length - 1) * (svgWidth - paddingX * 2) / (REVENUE_TIMELINE.length - 1));
    const endY = svgHeight - paddingY;
    return `M ${startX},${startY} L ${pointsString} L ${endX},${endY} Z`;
  }, [pointsString]);

  // Calculate specific tooltip popover center based on index
  const hoveredPointCoords = useMemo(() => {
    if (hoveredPointIndex === null) return null;
    const x = paddingX + (hoveredPointIndex * (svgWidth - paddingX * 2) / (REVENUE_TIMELINE.length - 1));
    const y = svgHeight - paddingY - (REVENUE_TIMELINE.revenue ? REVENUE_TIMELINE[hoveredPointIndex].revenue : REVENUE_TIMELINE[hoveredPointIndex].revenue * (svgHeight - paddingY * 2) / maxVal);
    return { x, y, ...REVENUE_TIMELINE[hoveredPointIndex] };
  }, [hoveredPointIndex]);

  // --- Donut Slices Angles Computation ---
  const donutRadius = 40;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * donutRadius; // ~251.32

  const donutSlices = useMemo(() => {
    let accumulatedPercent = 0;
    return PAYMENT_METHODS_SUMMARY.map(item => {
      const strokeDashoffset = circumference - (circumference * item.percent / 100);
      const strokeRotation = (accumulatedPercent / 100) * 360;
      accumulatedPercent += item.percent;
      return {
        ...item,
        strokeDasharray: `${circumference} ${circumference}`,
        strokeDashoffset,
        transform: `rotate(${strokeRotation - 90} 50 50)`
      };
    });
  }, [circumference]);

  return (
    <div className="bg-[#FAFCFE] min-h-screen pb-20 text-slate-700 animate-in fade-in duration-300">
      
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
            <XCircleIcon className="h-6 w-6 text-orange-500" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Financial Reports</h1>
        </div>

        <button 
          onClick={handleExportReport}
          className="bg-[#FF4C00] hover:bg-[#E03E00] text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow-md shadow-orange-100 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 flex-shrink-0"
        >
          <ArrowDownTrayIcon className="h-4.5 w-4.5 stroke-[2.2]" />
          <span>Export Report</span>
        </button>
      </div>

      {/* --- FILTER CONTROL PANEL BAR --- */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 mb-6 relative select-none">
        
        {/* Date Presets Picker Custom Selector */}
        <div className="relative flex-1 md:flex-initial min-w-[260px]">
          <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 pl-1">Date Range</label>
          
          <div 
            onClick={() => setShowDatePickerDropdown(!showDatePickerDropdown)}
            className="w-full bg-white text-xs font-bold px-4 py-3 rounded-2xl border border-slate-100/80 shadow-sm flex items-center justify-between cursor-pointer hover:border-orange-100 transition-all"
          >
            <div className="flex items-center gap-2 text-slate-600">
              <CalendarIcon className="h-4.5 w-4.5 text-slate-400" />
              <span>{dateRangePreset}</span>
            </div>
            <span className="text-[10px] text-slate-400">▼</span>
          </div>

          {/* Presets dropdown overlay cabinet */}
          {showDatePickerDropdown && (
            <div className="absolute left-0 right-0 top-[65px] bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-30 animate-in fade-in slide-in-from-top-2 duration-150">
              {datePresets.map((preset, index) => (
                <div 
                  key={index}
                  onClick={() => {
                    setDateRangePreset(preset.label);
                    setShowDatePickerDropdown(false);
                    showToast(`Financial query filtered to: ${preset.tag}`, 'success');
                  }}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-[#FFFBF9] hover:text-[#FF4C00] cursor-pointer flex justify-between items-center"
                >
                  <span>{preset.label}</span>
                  <span className="text-[9px] uppercase tracking-wider bg-slate-50 border border-slate-100 text-slate-400 px-1.5 py-0.5 rounded font-black">{preset.tag}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment status filter selector */}
        <div className="flex-1 md:flex-initial min-w-[170px]">
          <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 pl-1">Payment Status</label>
          <select
            value={paymentStatusFilter}
            onChange={(e) => {
              setPaymentStatusFilter(e.target.value);
              showToast(`Status filter updated: ${e.target.value}`, 'success');
            }}
            className="w-full bg-white text-xs font-bold px-4 py-3 rounded-2xl border border-slate-100/80 focus:outline-none focus:border-orange-500 cursor-pointer shadow-sm"
          >
            <option value="All Status">All Status</option>
            <option value="Success">Success</option>
            <option value="Refunded">Refunded</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

      </div>

      {/* --- KPI SUMMARY GRID CARDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        
        {/* Revenue KPI */}
        <div className="bg-white rounded-3xl border border-slate-100/80 shadow-sm p-5 hover:shadow-md transition-shadow">
          <span className="text-slate-400 font-black text-[10px] uppercase tracking-wider pl-0.5">Revenue</span>
          <h2 className="text-slate-800 font-black text-2xl tracking-tight mt-2">$18,765.40</h2>
          <div className="flex items-center gap-1.5 mt-2.5">
            <span className="inline-flex items-center gap-0.5 text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 border border-emerald-100/60 px-1.5 py-0.5 rounded-md">
              <ArrowUpRightIcon className="h-3 w-3 stroke-[3]" />
              <span>15.3%</span>
            </span>
            <span className="text-[10px] font-bold text-slate-400">vs Apr 21 - Apr 30</span>
          </div>
        </div>

        {/* Successful payments KPI */}
        <div className="bg-white rounded-3xl border border-slate-100/80 shadow-sm p-5 hover:shadow-md transition-shadow">
          <span className="text-slate-400 font-black text-[10px] uppercase tracking-wider pl-0.5">Successful Payments</span>
          <h2 className="text-slate-800 font-black text-2xl tracking-tight mt-2">1,284</h2>
          <div className="flex items-center gap-1.5 mt-2.5">
            <span className="inline-flex items-center gap-0.5 text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 border border-emerald-100/60 px-1.5 py-0.5 rounded-md">
              <ArrowUpRightIcon className="h-3 w-3 stroke-[3]" />
              <span>12.7%</span>
            </span>
            <span className="text-[10px] font-bold text-slate-400">vs Apr 21 - Apr 30</span>
          </div>
        </div>

        {/* Refunds KPI */}
        <div className="bg-white rounded-3xl border border-slate-100/80 shadow-sm p-5 hover:shadow-md transition-shadow">
          <span className="text-slate-400 font-black text-[10px] uppercase tracking-wider pl-0.5">Refunds</span>
          <h2 className="text-slate-800 font-black text-2xl tracking-tight mt-2">$345.20</h2>
          <div className="flex items-center gap-1.5 mt-2.5">
            <span className="inline-flex items-center gap-0.5 text-[9px] font-black uppercase text-red-600 bg-red-50 border border-red-100/60 px-1.5 py-0.5 rounded-md">
              <ArrowDownRightIcon className="h-3 w-3 stroke-[3]" />
              <span>8.1%</span>
            </span>
            <span className="text-[10px] font-bold text-slate-400">vs Apr 21 - Apr 30</span>
          </div>
        </div>

        {/* Failed payments KPI */}
        <div className="bg-white rounded-3xl border border-slate-100/80 shadow-sm p-5 hover:shadow-md transition-shadow">
          <span className="text-slate-400 font-black text-[10px] uppercase tracking-wider pl-0.5">Failed Payments</span>
          <h2 className="text-slate-800 font-black text-2xl tracking-tight mt-2">42</h2>
          <div className="flex items-center gap-1.5 mt-2.5">
            <span className="inline-flex items-center gap-0.5 text-[9px] font-black uppercase text-red-600 bg-red-50 border border-red-100/60 px-1.5 py-0.5 rounded-md">
              <ArrowDownRightIcon className="h-3 w-3 stroke-[3]" />
              <span>5.2%</span>
            </span>
            <span className="text-[10px] font-bold text-slate-400">vs Apr 21 - Apr 30</span>
          </div>
        </div>

      </div>

      {/* --- GRAPH ANALTICS ROW PANEL --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        
        {/* Revenue Over Time Line Graph */}
        <div className="bg-white rounded-3xl border border-slate-100/80 shadow-sm p-6 relative">
          <div className="flex justify-between items-center border-b border-slate-50 pb-3 mb-4 select-none">
            <h3 className="text-slate-800 font-black text-sm tracking-tight flex items-center gap-1.5">
              <ChartBarIcon className="h-4.5 w-4.5 text-slate-500" />
              <span>Revenue Over Time</span>
            </h3>
            <select
              className="text-xs font-black text-slate-500 bg-[#F8FAFC] border border-slate-100 rounded-xl px-2.5 py-1.5 focus:outline-none cursor-pointer"
              onChange={(e) => showToast(`Timeline aggregate changed to: ${e.target.value}`, 'success')}
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>

          {/* SVG Custom Graph Frame */}
          <div className="relative pt-4">
            <svg 
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-[220px] overflow-visible"
            >
              {/* Definitions for Linear Gradients */}
              <defs>
                <linearGradient id="revenueAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF4C00" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#FF4C00" stopOpacity="0.00" />
                </linearGradient>
              </defs>

              {/* Y Axis Gridlines */}
              {[0, 2000, 4000, 6000, 8000].map((yVal, i) => {
                const yPos = svgHeight - paddingY - (yVal * (svgHeight - paddingY * 2) / maxVal);
                return (
                  <g key={i}>
                    {/* Dashed gridline */}
                    <line 
                      x1={paddingX} 
                      y1={yPos} 
                      x2={svgWidth - paddingX} 
                      y2={yPos} 
                      stroke="#F1F5F9" 
                      strokeWidth="1.2" 
                      strokeDasharray="4 4"
                    />
                    {/* Y Axis Labels */}
                    <text 
                      x={paddingX - 10} 
                      y={yPos + 3.5} 
                      textAnchor="end" 
                      className="text-[9px] fill-slate-400 font-extrabold"
                    >
                      {yVal === 0 ? '$0' : `$${yVal / 1000}K`}
                    </text>
                  </g>
                );
              })}

              {/* Render Fill Area under curve */}
              <path 
                d={closedPathString} 
                fill="url(#revenueAreaGrad)"
              />

              {/* Render main curve line */}
              <path 
                d={`M ${paddingX},${svgHeight - paddingY - (REVENUE_TIMELINE[0].revenue * (svgHeight - paddingY * 2) / maxVal)} L ${pointsString}`} 
                fill="none" 
                stroke="#FF4C00" 
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Render Circular points */}
              {REVENUE_TIMELINE.map((item, index) => {
                const x = paddingX + (index * (svgWidth - paddingX * 2) / (REVENUE_TIMELINE.length - 1));
                const y = svgHeight - paddingY - (item.revenue * (svgHeight - paddingY * 2) / maxVal);
                const isActive = index === hoveredPointIndex;

                return (
                  <g key={index}>
                    {/* Large hidden circle for hover trigger ease */}
                    <circle 
                      cx={x} 
                      cy={y} 
                      r="12" 
                      fill="transparent" 
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredPointIndex(index)}
                    />
                    {/* Small visible circle */}
                    <circle 
                      cx={x} 
                      cy={y} 
                      r={isActive ? "5" : "3.5"} 
                      fill={isActive ? "#FF4C00" : "white"} 
                      stroke="#FF4C00" 
                      strokeWidth="2" 
                      className="transition-all duration-150"
                    />
                  </g>
                );
              })}

              {/* X Axis Labels */}
              {REVENUE_TIMELINE.map((item, index) => {
                // Show alternate to avoid overlap cluttering
                if (index % 2 !== 0 && index !== REVENUE_TIMELINE.length - 1) return null;
                const x = paddingX + (index * (svgWidth - paddingX * 2) / (REVENUE_TIMELINE.length - 1));
                return (
                  <text 
                    key={index}
                    x={x} 
                    y={svgHeight - 2} 
                    textAnchor="middle" 
                    className="text-[9px] fill-slate-400 font-extrabold"
                  >
                    {item.date}
                  </text>
                );
              })}
            </svg>

            {/* Custom Interactive Tooltip HTML Overlay floating near point */}
            {hoveredPointCoords && (
              <div 
                style={{
                  position: 'absolute',
                  left: `${(hoveredPointCoords.x / svgWidth) * 100}%`,
                  top: `${(hoveredPointCoords.y / svgHeight) * 100 - 32}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="bg-white rounded-2xl border border-slate-100 px-3.5 py-2.5 shadow-xl shadow-slate-100/80 pointer-events-none select-none z-10 w-28 animate-in scale-in duration-100"
              >
                <span className="text-[9px] font-black text-slate-400 block uppercase tracking-wider leading-none">
                  {hoveredPointCoords.fullDate || `${hoveredPointCoords.date}, 2024`}
                </span>
                <span className="text-[10px] font-bold text-slate-400 block mt-1 leading-none">
                  Revenue
                </span>
                <span className="text-xs font-black text-slate-800 block mt-0.5 leading-none">
                  ${hoveredPointCoords.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Razorpay Test Payment Summary Donut Chart */}
        <div className="bg-white rounded-3xl border border-slate-100/80 shadow-sm p-6">
          <div className="border-b border-slate-50 pb-3 mb-4 select-none">
            <h3 className="text-slate-800 font-black text-sm tracking-tight">Razorpay Test Payment Summary</h3>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
            
            {/* SVG Donut frame */}
            <div className="relative w-36 h-36 flex-shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {donutSlices.map((slice, index) => {
                  const isHovered = selectedDonutSegment === index;
                  return (
                    <circle 
                      key={index}
                      cx="50"
                      cy="50"
                      r={donutRadius}
                      fill="transparent"
                      stroke={slice.color}
                      strokeWidth={isHovered ? strokeWidth + 2 : strokeWidth}
                      strokeDasharray={slice.strokeDasharray}
                      strokeDashoffset={slice.strokeDashoffset}
                      transform={slice.transform}
                      className="cursor-pointer transition-all duration-150 stroke-round"
                      onMouseEnter={() => setSelectedDonutSegment(index)}
                      onMouseLeave={() => setSelectedDonutSegment(null)}
                    />
                  );
                })}
              </svg>

              {/* Center Metrics block */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Total</span>
                <span className="text-xl font-black text-slate-800 text-center my-0.5 leading-none">1,326</span>
                <span className="text-[7.5px] font-black text-slate-400 uppercase tracking-widest leading-none">Transactions</span>
              </div>
            </div>

            {/* Legend checklist metrics */}
            <div className="flex-1 w-full space-y-2 select-none">
              {PAYMENT_METHODS_SUMMARY.map((item, index) => {
                const isHovered = selectedDonutSegment === index;
                return (
                  <div 
                    key={index}
                    className={`flex items-center justify-between px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                      isHovered ? 'bg-[#FFFBF9]/70 border-orange-100 scale-[1.01]' : 'bg-transparent border-transparent'
                    }`}
                    onMouseEnter={() => setSelectedDonutSegment(index)}
                    onMouseLeave={() => setSelectedDonutSegment(null)}
                  >
                    <div className="flex items-center gap-2">
                      <span 
                        style={{ backgroundColor: item.color }}
                        className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0"
                      ></span>
                      <span className="text-xs font-black text-slate-700">{item.name}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-800">{item.count}</span>
                      <span className="text-[10px] font-bold text-slate-400 ml-1">({item.percent}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

      </div>

      {/* --- TRANSACTIONS LOGS TABLE --- */}
      <div className="bg-white rounded-3xl border border-slate-100/80 shadow-sm p-4 sm:p-6 mb-6">
        <div className="border-b border-slate-50 pb-3 mb-4 select-none">
          <h3 className="text-slate-800 font-black text-sm tracking-tight">Transactions</h3>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="min-w-full text-sm align-middle select-none">
            <thead>
              <tr className="border-b border-slate-100 text-left text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3.5 pl-2 font-black">Txn ID</th>
                <th className="pb-3.5 font-black">Order ID</th>
                <th className="pb-3.5 font-black">Customer</th>
                <th className="pb-3.5 font-black">Method</th>
                <th className="pb-3.5 font-black">Amount</th>
                <th className="pb-3.5 font-black text-center">Status</th>
                <th className="pb-3.5 font-black text-right pr-4">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredTransactions.map((txn) => {
                const isSelected = txn.id === selectedTxnId && isPopupOpen;
                return (
                  <tr 
                    key={txn.id}
                    onClick={() => { setSelectedTxnId(txn.id); setIsPopupOpen(true); }}
                    className={`hover:bg-[#FFFBF9]/40 transition-colors duration-150 cursor-pointer ${
                      isSelected ? 'bg-orange-50/20' : ''
                    }`}
                  >
                    <td className="py-3.5 pl-2 font-bold text-xs text-slate-800">{txn.id}</td>
                    <td className="py-3.5 text-xs text-slate-500 font-semibold">{txn.orderId}</td>
                    <td className="py-3.5 text-xs text-slate-800 font-bold">{txn.customer}</td>
                    
                    {/* Method with specific visual logos/icons */}
                    <td className="py-3.5 text-xs text-slate-600 font-bold">
                      <div className="flex items-center gap-2">
                        {txn.method === 'UPI' && (
                          <div className="w-5 h-5 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center text-[9px] font-black text-blue-600">
                            Ⓤ
                          </div>
                        )}
                        {txn.method === 'Card' && (
                          <CreditCardIcon className="h-4.5 w-4.5 text-slate-400" />
                        )}
                        {txn.method === 'Net Banking' && (
                          <BanknotesIcon className="h-4.5 w-4.5 text-slate-400" />
                        )}
                        {txn.method === 'Wallet' && (
                          <WalletIcon className="h-4.5 w-4.5 text-slate-400" />
                        )}
                        {txn.method === 'COD' && (
                          <div className="w-5 h-5 rounded-md bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[9px] font-black text-emerald-600">
                            💵
                          </div>
                        )}
                        <span>{txn.method}</span>
                      </div>
                    </td>

                    <td className="py-3.5 text-xs text-slate-800 font-extrabold">${txn.amount.toFixed(2)}</td>

                    {/* Status Badge */}
                    <td className="py-3.5 text-center">
                      <span className={`inline-flex items-center justify-center text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        txn.status === 'Success' 
                          ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                          : txn.status === 'Refunded' 
                            ? 'bg-orange-50 border-orange-100 text-[#FF4C00]' 
                            : 'bg-red-50 border-red-100 text-red-700'
                      }`}>
                        {txn.status}
                      </span>
                    </td>

                    <td className="py-3.5 text-right pr-4 text-xs text-slate-500 font-semibold">{txn.dateTime}</td>
                  </tr>
                );
              })}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                    No transactions match current filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Row with Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-4 border-t border-slate-100">
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
            Showing 1 to {filteredTransactions.length} of 1326 transactions
          </span>

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
              190
            </button>
            <button className="p-2 rounded-xl border border-slate-100 text-slate-400 hover:text-slate-800 bg-white hover:bg-slate-50 transition-colors shadow-sm">
              <ChevronRightIcon className="h-3.5 w-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>

      </div>

      {/* --- FLOATING TRANSACTION DETAILS DRAWER POPUP OVERLAY --- */}
      {isPopupOpen && activeTransaction && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 bg-white rounded-3xl border border-slate-100 w-full max-w-sm shadow-2xl p-5 animate-in slide-in-from-bottom-6 duration-300">
          
          {/* Header */}
          <div className="flex justify-between items-center border-b border-slate-50 pb-3 mb-4 select-none">
            <h4 className="text-slate-800 font-black text-sm tracking-tight">Transaction Details</h4>
            <button 
              onClick={() => setIsPopupOpen(false)}
              className="text-slate-400 hover:text-slate-800 p-1 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <XMarkIcon className="h-4.5 w-4.5 stroke-[2.5]" />
            </button>
          </div>

          {/* Details specs */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-400">Transaction ID</span>
              <span className="font-bold text-slate-700">{activeTransaction.id}</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-400">Order ID</span>
              <span className="font-bold text-slate-700">{activeTransaction.orderId}</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-400">Payment ID</span>
              <span className="font-mono text-[10px] text-slate-500 font-semibold">{activeTransaction.paymentId}</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-400">Amount</span>
              <span className="font-black text-slate-800">${activeTransaction.amount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-400">Currency</span>
              <span className="font-bold text-slate-700">{activeTransaction.currency}</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-400">Payment Method</span>
              <span className="font-bold text-slate-700">{activeTransaction.method}</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-400">Payment Status</span>
              <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                <CheckCircleIcon className="h-3.5 w-3.5 text-emerald-500" />
                <span>{activeTransaction.status}</span>
              </span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-400">Signature Verified</span>
              <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${
                activeTransaction.signatureVerified 
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                  : 'bg-red-50 border-red-100 text-red-700'
              }`}>
                {activeTransaction.signatureVerified ? (
                  <>
                    <CheckCircleIcon className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Yes</span>
                  </>
                ) : (
                  <>
                    <XCircleIcon className="h-3.5 w-3.5 text-red-500" />
                    <span>No</span>
                  </>
                )}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs pt-1.5 border-t border-slate-50">
              <span className="font-semibold text-slate-400">Paid On</span>
              <span className="font-bold text-slate-600">{activeTransaction.dateTime}</span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default AdminReportsPage;
