import React, { useState, useEffect, useMemo } from 'react';
import { 
  MagnifyingGlassIcon,
  ChevronDownIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CheckCircleIcon,
  CalendarIcon,
  ShoppingBagIcon,
  SparklesIcon,
  PlusIcon,
  ArrowUturnLeftIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';

// Pre-seeded support ticket mock database matching the screenshot exactly!
const INITIAL_TICKETS = [
  {
    id: 'TKT-000125',
    customer: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    customerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&auto=format&fit=crop',
    subject: 'Order not delivered',
    description: "I haven't received my order yet. It has been over an hour and the status is still showing out for delivery.",
    priority: 'High',
    status: 'Open',
    date: '12 May 2025',
    time: '10:45 AM',
    product: 'Pepperoni Pizza',
    productImage: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=120&auto=format&fit=crop',
    size: 'Large',
    price: 599,
    starred: true,
    reply: ''
  },
  {
    id: 'TKT-000124',
    customer: 'Emma Watson',
    email: 'emma.watson@email.com',
    customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120&auto=format&fit=crop',
    subject: 'Refund not received',
    description: 'I requested a refund for my cancelled order on 10th May, but I haven\'t received it in my bank account yet.',
    priority: 'Medium',
    status: 'In Progress',
    date: '12 May 2025',
    time: '09:30 AM',
    product: 'Cheese Burst Pizza',
    productImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=120&auto=format&fit=crop',
    size: 'Medium',
    price: 499,
    starred: false,
    reply: 'Hello Emma, we have processed the refund from our end on 11th May. It usually takes 2-3 business days to reflect in your account.'
  },
  {
    id: 'TKT-000123',
    customer: 'Michael Brown',
    email: 'michael.brown@email.com',
    customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop',
    subject: 'Wrong item delivered',
    description: 'I ordered a Veggie Delight pizza but received a chicken pepperoni instead. I am vegetarian and cannot consume this.',
    priority: 'High',
    status: 'Open',
    date: '11 May 2025',
    time: '08:20 PM',
    product: 'Veggie Delight',
    productImage: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?q=80&w=120&auto=format&fit=crop',
    size: 'Large',
    price: 549,
    starred: true,
    reply: ''
  },
  {
    id: 'TKT-000122',
    customer: 'Sophia Davis',
    email: 'sophia.davis@email.com',
    customerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=120&auto=format&fit=crop',
    subject: 'Payment failed',
    description: 'My payment was deducted twice during checkout, but the order failed. Please refund the duplicate transaction.',
    priority: 'Medium',
    status: 'Resolved',
    date: '11 May 2025',
    time: '06:40 PM',
    product: 'Farmhouse Pizza',
    productImage: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=120&auto=format&fit=crop',
    size: 'Medium',
    price: 449,
    starred: false,
    reply: 'Hi Sophia, we have identified the duplicate charge and reversed it. The funds should show in your account within 24 hours.'
  },
  {
    id: 'TKT-000121',
    customer: 'Daniel Taylor',
    email: 'daniel.taylor@email.com',
    customerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=120&auto=format&fit=crop',
    subject: 'Coupon not working',
    description: 'I was trying to apply the coupon code PIZZA50 on my small pizza order but the system is showing invalid coupon.',
    priority: 'Low',
    status: 'Closed',
    date: '10 May 2025',
    time: '05:15 PM',
    product: 'BBQ Chicken Pizza',
    productImage: 'https://images.unsplash.com/photo-1571066811602-71683a3f680d?q=80&w=120&auto=format&fit=crop',
    size: 'Small',
    price: 299,
    starred: false,
    reply: 'Hello Daniel, the coupon PIZZA50 is only valid for medium and large sizes on orders above ₹299. That is why it did not apply.'
  }
];

const AdminTicketsPage = () => {
  // DB state persisting in LocalStorage
  const [tickets, setTickets] = useState(() => {
    try {
      const saved = localStorage.getItem('slicesprint_tickets');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_TICKETS;
  });

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [priorityFilter, setPriorityFilter] = useState('All Priority');

  // Modal Control States
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Selected ticket details
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Reply form input states
  const [replyText, setReplyText] = useState('');
  const [replyStatus, setReplyStatus] = useState('Resolved');

  // Create Ticket form input states
  const [createFormData, setCreateFormData] = useState({
    customer: '',
    email: '',
    subject: '',
    description: '',
    priority: 'High',
    status: 'Open',
    product: 'Pepperoni Pizza',
    size: 'Large'
  });

  // Toast notifications State
  const [toast, setToast] = useState(null);

  // Persist DB
  useEffect(() => {
    localStorage.setItem('slicesprint_tickets', JSON.stringify(tickets));
  }, [tickets]);

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
  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        ticket.id.toLowerCase().includes(query) ||
        ticket.customer.toLowerCase().includes(query) || 
        ticket.email.toLowerCase().includes(query) || 
        ticket.subject.toLowerCase().includes(query) || 
        ticket.description.toLowerCase().includes(query) ||
        ticket.product.toLowerCase().includes(query);

      const matchesStatus = 
        statusFilter === 'All Status' || 
        ticket.status === statusFilter;

      const matchesPriority =
        priorityFilter === 'All Priority' ||
        ticket.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tickets, searchQuery, statusFilter, priorityFilter]);

  // Toggle Star Priority (Like button toggle next to pizza image)
  const handleToggleStar = (id) => {
    const ticket = tickets.find(t => t.id === id);
    if (!ticket) return;
    const newStarredState = !ticket.starred;

    setTickets(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, starred: newStarredState };
      }
      return t;
    }));

    setToast({
      title: 'Ticket Priority Star Toggled',
      message: `Ticket ${id} has been ${newStarredState ? 'starred as featured' : 'unstarred'}.`
    });
  };

  // Toggle approval/status directly from pills
  const handleToggleStatus = (id) => {
    const ticket = tickets.find(t => t.id === id);
    if (!ticket) return;
    
    // Rotate status: Open -> In Progress -> Resolved -> Closed -> Open
    const statusCycle = ['Open', 'In Progress', 'Resolved', 'Closed'];
    const currentIndex = statusCycle.indexOf(ticket.status);
    const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length];

    setTickets(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, status: nextStatus };
      }
      return t;
    }));

    setToast({
      title: 'Status Updated',
      message: `Ticket ${id} status successfully set to ${nextStatus}.`
    });
  };

  // Open Reply Modal
  const handleOpenReply = (ticket) => {
    setSelectedTicket(ticket);
    setReplyText(ticket.reply || '');
    setReplyStatus(ticket.status === 'Closed' ? 'Closed' : ticket.status === 'Resolved' ? 'Resolved' : 'Resolved');
    setIsReplyModalOpen(true);
  };

  // Submit Reply
  const handleReplySubmit = (e) => {
    e.preventDefault();
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    setTickets(prev => prev.map(t => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          reply: replyText,
          status: replyStatus,
          date: formattedDate,
          time: formattedTime
        };
      }
      return t;
    }));

    setIsReplyModalOpen(false);

    setToast({
      title: 'Operator Response Logged',
      message: `Reply posted successfully and status set to ${replyStatus}.`
    });
  };

  // Open Delete Confirmation
  const handleOpenDeleteConfirm = (ticket) => {
    setSelectedTicket(ticket);
    setIsDeleteConfirmOpen(true);
  };

  // Execute Deletion
  const handleDeleteExecute = () => {
    setTickets(prev => prev.filter(t => t.id !== selectedTicket.id));
    setIsDeleteConfirmOpen(false);
    if (isViewModalOpen) setIsViewModalOpen(false);

    setToast({
      title: 'Ticket Purged',
      message: `Support ticket ${selectedTicket.id} has been permanently deleted.`
    });
  };

  const handleOpenView = (ticket) => {
    setSelectedTicket(ticket);
    setIsViewModalOpen(true);
  };

  // Handle Create Ticket Submit
  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!createFormData.customer || !createFormData.email || !createFormData.subject || !createFormData.description) {
      alert('Please fill out all required fields.');
      return;
    }

    // Generate next ticket ID
    let nextId = 'TKT-000126';
    if (tickets.length > 0) {
      const ids = tickets.map(t => parseInt(t.id.replace('TKT-', '')));
      const maxId = Math.max(...ids);
      nextId = `TKT-${String(maxId + 1).padStart(6, '0')}`;
    }

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // Map selected pizza to image
    const pizzaImages = {
      'Pepperoni Pizza': 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=120&auto=format&fit=crop',
      'Cheese Burst Pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=120&auto=format&fit=crop',
      'Veggie Delight': 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?q=80&w=120&auto=format&fit=crop',
      'Farmhouse Pizza': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=120&auto=format&fit=crop',
      'BBQ Chicken Pizza': 'https://images.unsplash.com/photo-1571066811602-71683a3f680d?q=80&w=120&auto=format&fit=crop'
    };

    const prices = {
      'Small': 299,
      'Medium': 449,
      'Large': 599
    };

    // Customer avatar generator
    const customerAvatars = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=120&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=120&auto=format&fit=crop'
    ];

    const newTicket = {
      id: nextId,
      customer: createFormData.customer,
      email: createFormData.email,
      customerAvatar: customerAvatars[Math.floor(Math.random() * customerAvatars.length)],
      subject: createFormData.subject,
      description: createFormData.description,
      priority: createFormData.priority,
      status: createFormData.status,
      date: formattedDate,
      time: formattedTime,
      product: createFormData.product,
      productImage: pizzaImages[createFormData.product] || pizzaImages['Pepperoni Pizza'],
      size: createFormData.size,
      price: prices[createFormData.size] || 449,
      starred: false,
      reply: ''
    };

    setTickets(prev => [newTicket, ...prev]);
    setIsCreateModalOpen(false);

    setToast({
      title: 'Ticket Created Successfully',
      message: `Logged ${newTicket.id} for ${newTicket.customer}.`
    });

    // Reset Form Data
    setCreateFormData({
      customer: '',
      email: '',
      subject: '',
      description: '',
      priority: 'High',
      status: 'Open',
      product: 'Pepperoni Pizza',
      size: 'Large'
    });
  };

  return (
    <div className="bg-[#FAFBFD] min-h-screen pb-16 font-sans text-left">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* --- PAGE HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          
          {/* Headline & Breadcrumb */}
          <div className="flex items-center gap-4">
            {/* Orange Support headphones Icon Box */}
            <div className="w-12 h-12 rounded-2xl bg-[#FFF5F0] border border-orange-100 flex items-center justify-center text-orange-500 shadow-md shadow-orange-100/30 flex-shrink-0">
              <svg className="h-6.5 w-6.5 text-[#FF4C00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 18v-6a9 9 0 0118 0v6M4 14h3a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1v-4a1 1 0 011-1zm13 0h3a1 1 0 011 1v4a1 1 0 01-1 1h-3a1 1 0 01-1-1v-4a1 1 0 011-1z" />
              </svg>
            </div>
            <div>
              <h1 className="text-[26px] font-black text-gray-900 tracking-tight leading-tight">Support Tickets</h1>
              <p className="text-sm font-medium text-gray-400 mt-1 leading-none">View and manage customer support tickets</p>
            </div>
          </div>

          {/* Search, Filter, and Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 flex-1 md:flex-initial max-w-3xl">
            
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64 min-w-[200px]">
              <span className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-gray-400">
                <MagnifyingGlassIcon className="h-5 w-5" />
              </span>
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-sm pl-11 pr-4 py-2.5 rounded-2xl border border-gray-150 focus:outline-none focus:border-[#FF4C00] focus:ring-4 focus:ring-[#FF4C00]/5 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.01)] font-medium placeholder:text-gray-400"
              />
            </div>

            {/* Dropdown Status Filter */}
            <div className="relative min-w-[120px] flex-shrink-0">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-white text-sm font-bold pl-4 pr-10 py-2.5 rounded-2xl border border-gray-150 focus:outline-none focus:border-[#FF4C00] transition-all cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.01)] appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%239ca3af%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25em_1.25em] bg-[right_1rem_center] bg-no-repeat text-gray-700"
              >
                <option value="All Status">All Status</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            {/* Dropdown Priority Filter */}
            <div className="relative min-w-[120px] flex-shrink-0">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full bg-white text-sm font-bold pl-4 pr-10 py-2.5 rounded-2xl border border-gray-150 focus:outline-none focus:border-[#FF4C00] transition-all cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.01)] appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%239ca3af%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25em_1.25em] bg-[right_1rem_center] bg-no-repeat text-gray-700"
              >
                <option value="All Priority">All Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* "+ New Ticket" Button */}
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-[#FF4C00] hover:bg-[#e64400] text-white font-extrabold text-sm px-6 py-2.5 rounded-2xl shadow-lg shadow-orange-500/15 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 h-10.5"
            >
              <PlusIcon className="h-5 w-5 stroke-[2.5]" />
              <span>New Ticket</span>
            </button>

          </div>
        </div>

        {/* --- TICKETS DATA TABLE --- */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_15px_45px_rgba(0,0,0,0.015)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 align-middle">
              <thead className="bg-[#FAFBFD]">
                <tr className="text-left text-xs font-black text-gray-400 uppercase tracking-widest">
                  <th className="px-6 py-5">Ticket ID</th>
                  <th className="px-6 py-5">Customer</th>
                  <th className="px-6 py-5">Subject</th>
                  <th className="px-6 py-5">Pizza Item</th>
                  <th className="px-6 py-5 text-center">Priority</th>
                  <th className="px-6 py-5 text-center">Status</th>
                  <th className="px-6 py-5">Last Update</th>
                  <th className="px-6 py-5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 bg-white">
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50/30 transition-colors">
                    
                    {/* Ticket ID */}
                    <td className="px-6 py-4.5 text-[14px] font-black text-gray-800 tracking-tight">
                      {ticket.id}
                    </td>

                    {/* Customer Name & Email with Avatar */}
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-150 shadow-sm bg-gray-50 flex-shrink-0 select-none">
                          <img src={ticket.customerAvatar} alt={ticket.customer} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <span className="font-extrabold text-[14px] text-gray-800 block leading-tight">{ticket.customer}</span>
                          <span className="text-[12px] font-semibold text-gray-400 block mt-0.5 leading-none">{ticket.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Subject & Brief Description Preview */}
                    <td className="px-6 py-4.5">
                      <span className="font-extrabold text-[14px] text-gray-800 block leading-snug">{ticket.subject}</span>
                      <span className="text-[12.5px] font-semibold text-gray-400 block mt-0.5 leading-normal max-w-sm truncate">
                        {ticket.description}
                      </span>
                    </td>

                    {/* Pizza Item & Sizing with "Like/Star Toggle" next to image! */}
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-2.5 justify-between max-w-[200px]">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8.5 h-8.5 rounded-xl overflow-hidden border border-gray-150 shadow-sm bg-gray-50 flex-shrink-0 select-none">
                            <img src={ticket.productImage} alt={ticket.product} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <span className="font-extrabold text-[13.5px] text-gray-800 block leading-none">{ticket.product}</span>
                            <span className="inline-block bg-orange-50 text-[#FF4C00] font-black text-[9px] px-1 py-0.2 rounded uppercase select-none tracking-wide border border-orange-100/50 mt-1">
                              {ticket.size}
                            </span>
                          </div>
                        </div>

                        {/* Preferred Star / Priority Like Indicator */}
                        <button
                          onClick={() => handleToggleStar(ticket.id)}
                          className="text-gray-300 hover:text-orange-500 focus:outline-none transition-colors mr-2 flex-shrink-0"
                          title="Feature / Flag Ticket"
                        >
                          {ticket.starred ? (
                            <StarIconSolid className="w-4.5 h-4.5 text-[#FF9E00]" />
                          ) : (
                            <StarIconOutline className="w-4.5 h-4.5 text-gray-300 hover:text-gray-400" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Priority Pill Badge */}
                    <td className="px-6 py-4.5 text-center">
                      <span className={`inline-flex items-center justify-center px-2.5 py-0.8 rounded-lg text-[11px] font-black uppercase select-none tracking-wider border ${
                        ticket.priority === 'High' ? 'bg-[#FEF3F2] text-[#B42318] border-[#FEE4E2]' :
                        ticket.priority === 'Medium' ? 'bg-[#FFF9EB] text-[#B45309] border-[#FEF0C7]' :
                        'bg-[#EBFDF2] text-[#027A48] border-[#ECFDF3]'
                      }`}>
                        {ticket.priority}
                      </span>
                    </td>

                    {/* Status Pill Badge with toggles on click */}
                    <td className="px-6 py-4.5 text-center">
                      <button
                        onClick={() => handleToggleStatus(ticket.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black select-none tracking-wide transition-all border ${
                          ticket.status === 'Open' ? 'bg-[#EFF8FF] text-[#175CD3] border-[#EFF8FF] hover:border-[#175CD3]' :
                          ticket.status === 'In Progress' ? 'bg-[#FFF5E6] text-[#FF8000] border-[#FFF5E6] hover:border-[#FF9E00]' :
                          ticket.status === 'Resolved' ? 'bg-[#EBFDF2] text-[#027A48] border-[#EBFDF3] hover:border-[#12B76A]' :
                          'bg-[#F2F4F7] text-[#344054] border-[#F2F4F7] hover:border-[#475467]'
                        }`}
                        title="Toggle Ticket Status"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          ticket.status === 'Open' ? 'bg-[#175CD3]' :
                          ticket.status === 'In Progress' ? 'bg-[#FF8000]' :
                          ticket.status === 'Resolved' ? 'bg-[#12B76A]' :
                          'bg-[#475467]'
                        }`} />
                        <span>{ticket.status}</span>
                      </button>
                    </td>

                    {/* Last Update */}
                    <td className="px-6 py-4.5">
                      <span className="text-[13px] font-extrabold text-gray-700 block leading-tight">{ticket.date}</span>
                      <span className="text-[11px] font-semibold text-gray-400 block mt-0.5 leading-none">{ticket.time}</span>
                    </td>

                    {/* Action buttons (View Detail, Reply, Delete) */}
                    <td className="px-6 py-4.5">
                      <div className="flex items-center justify-center gap-1.5">
                        
                        {/* View details */}
                        <button
                          onClick={() => handleOpenView(ticket)}
                          className="w-8 h-8 rounded-full border border-gray-150 flex items-center justify-center text-gray-400 hover:text-[#FF4C00] hover:border-[#FF4C00] hover:bg-orange-50/20 bg-white transition-all shadow-[0_1px_5px_rgba(0,0,0,0.01)]"
                          title="View Ticket Details"
                        >
                          <EyeIcon className="h-4.5 w-4.5" />
                        </button>
                        
                        {/* Reply / Update */}
                        <button
                          onClick={() => handleOpenReply(ticket)}
                          className="w-8 h-8 rounded-full border border-gray-150 flex items-center justify-center text-gray-400 hover:text-[#FF4C00] hover:border-[#FF4C00] hover:bg-orange-50/20 bg-white transition-all shadow-[0_1px_5px_rgba(0,0,0,0.01)]"
                          title="Reply / Update Ticket"
                        >
                          <ArrowUturnLeftIcon className="h-4.5 w-4.5" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleOpenDeleteConfirm(ticket)}
                          className="w-8 h-8 rounded-full border border-gray-150 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-400 hover:bg-red-50/20 bg-white transition-all shadow-[0_1px_5px_rgba(0,0,0,0.01)]"
                          title="Purge Ticket"
                        >
                          <TrashIcon className="h-4.5 w-4.5" />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}
                {filteredTickets.length === 0 && (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-sm font-bold text-gray-400 uppercase tracking-widest">
                      No matching support tickets found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ========================================================
          CREATE NEW TICKET MODAL (with size criteria select)
         ======================================================== */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-gray-100 shadow-[0_25px_60px_rgba(0,0,0,0.15)] animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-5 border-b border-gray-50 pb-3">
              <h3 className="text-[18px] font-black text-gray-900 tracking-tight">Create Support Ticket</h3>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none focus:outline-none transition-colors"
              >
                &times;
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Customer Name *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Alex Johnson"
                    value={createFormData.customer}
                    onChange={e => setCreateFormData({ ...createFormData, customer: e.target.value })}
                    className="w-full bg-[#FAFBFD] text-sm px-4 py-2.5 border border-gray-200/80 rounded-2xl focus:border-[#FF4C00] focus:ring-4 focus:ring-[#FF4C00]/5 focus:bg-white transition-all font-bold text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Customer Email *</label>
                  <input 
                    type="email" 
                    required
                    placeholder="alex@email.com"
                    value={createFormData.email}
                    onChange={e => setCreateFormData({ ...createFormData, email: e.target.value })}
                    className="w-full bg-[#FAFBFD] text-sm px-4 py-2.5 border border-gray-200/80 rounded-2xl focus:border-[#FF4C00] focus:ring-4 focus:ring-[#FF4C00]/5 focus:bg-white transition-all font-bold text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Ticket Subject *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Order not delivered"
                  value={createFormData.subject}
                  onChange={e => setCreateFormData({ ...createFormData, subject: e.target.value })}
                  className="w-full bg-[#FAFBFD] text-sm px-4 py-2.5 border border-gray-200/80 rounded-2xl focus:border-[#FF4C00] focus:ring-4 focus:ring-[#FF4C00]/5 focus:bg-white transition-all font-bold text-gray-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Priority</label>
                  <select 
                    value={createFormData.priority}
                    onChange={e => setCreateFormData({ ...createFormData, priority: e.target.value })}
                    className="w-full bg-[#FAFBFD] text-sm px-4 py-2.5 border border-gray-200/80 rounded-2xl focus:border-[#FF4C00] focus:bg-white transition-all font-bold text-gray-800 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%239ca3af%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25em_1.25em] bg-[right_1rem_center] bg-no-repeat"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Status</label>
                  <select 
                    value={createFormData.status}
                    onChange={e => setCreateFormData({ ...createFormData, status: e.target.value })}
                    className="w-full bg-[#FAFBFD] text-sm px-4 py-2.5 border border-gray-200/80 rounded-2xl focus:border-[#FF4C00] focus:bg-white transition-all font-bold text-gray-800 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%239ca3af%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25em_1.25em] bg-[right_1rem_center] bg-no-repeat"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* Pizza Sizing Linkage */}
              <div className="grid grid-cols-2 gap-4 bg-orange-50/20 border border-orange-100/50 p-3 rounded-2xl">
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Concerned Pizza</label>
                  <select 
                    value={createFormData.product}
                    onChange={e => setCreateFormData({ ...createFormData, product: e.target.value })}
                    className="w-full bg-white text-sm px-3 py-2 border border-gray-200/80 rounded-xl focus:border-[#FF4C00] font-bold text-gray-800 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%239ca3af%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25em_1.25em] bg-[right_0.8rem_center] bg-no-repeat"
                  >
                    <option value="Pepperoni Pizza">Pepperoni Pizza</option>
                    <option value="Cheese Burst Pizza">Cheese Burst Pizza</option>
                    <option value="Veggie Delight">Veggie Delight</option>
                    <option value="Farmhouse Pizza">Farmhouse Pizza</option>
                    <option value="BBQ Chicken Pizza">BBQ Chicken Pizza</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Pizza Size</label>
                  <select 
                    value={createFormData.size}
                    onChange={e => setCreateFormData({ ...createFormData, size: e.target.value })}
                    className="w-full bg-white text-sm px-3 py-2 border border-gray-200/80 rounded-xl focus:border-[#FF4C00] font-bold text-gray-800 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%239ca3af%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25em_1.25em] bg-[right_0.8rem_center] bg-no-repeat"
                  >
                    <option value="Small">Small Size</option>
                    <option value="Medium">Medium Size</option>
                    <option value="Large">Large Size</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Support Request Description *</label>
                <textarea 
                  rows="3"
                  required
                  placeholder="Describe the customer's issue in detail..."
                  value={createFormData.description}
                  onChange={e => setCreateFormData({ ...createFormData, description: e.target.value })}
                  className="w-full bg-[#FAFBFD] text-sm px-4 py-2.5 border border-gray-200/80 rounded-2xl focus:border-[#FF4C00] focus:ring-4 focus:ring-[#FF4C00]/5 focus:bg-white transition-all font-bold text-gray-800 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-3 border-t border-gray-50 mt-4">
                <button 
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="border border-[#FF4C00] text-[#FF4C00] hover:bg-orange-50/20 px-5.5 py-2.5 rounded-2xl text-[13px] font-black transition-all active:scale-95 h-11"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-[#FF4C00] hover:bg-[#e64400] text-white px-5.5 py-2.5 rounded-2xl text-[13px] font-black shadow-md shadow-orange-500/10 active:scale-95 transition-all h-11"
                >
                  Log Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          VIEW DETAILS DRAWER / MODAL
         ======================================================== */}
      {isViewModalOpen && selectedTicket && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-gray-150 shadow-[0_25px_60px_rgba(0,0,0,0.15)] animate-in fade-in zoom-in-95 duration-200 relative text-left">
            
            {/* Close */}
            <button 
              onClick={() => setIsViewModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 text-[26px] leading-none focus:outline-none transition-colors"
            >
              &times;
            </button>

            {/* Profile support details header */}
            <div className="flex flex-col items-center text-center mt-3 pb-5 border-b border-gray-100">
              <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-150 shadow-md bg-gray-50 mb-3 select-none">
                <img src={selectedTicket.customerAvatar} alt={selectedTicket.customer} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-[19px] font-black text-gray-800 tracking-tight">{selectedTicket.customer}</h3>
              <p className="text-xs font-bold text-gray-400 mt-1">{selectedTicket.email}</p>
              
              <div className="flex items-center gap-2 mt-3 select-none">
                <span className={`inline-flex items-center justify-center px-2.5 py-0.8 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                  selectedTicket.priority === 'High' ? 'bg-[#FEF3F2] text-[#B42318] border-[#FEE4E2]' :
                  selectedTicket.priority === 'Medium' ? 'bg-[#FFF9EB] text-[#B45309] border-[#FEF0C7]' :
                  'bg-[#EBFDF2] text-[#027A48] border-[#ECFDF3]'
                }`}>
                  {selectedTicket.priority} Priority
                </span>

                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wide border ${
                  selectedTicket.status === 'Open' ? 'bg-[#EFF8FF] text-[#175CD3] border-[#EFF8FF]' :
                  selectedTicket.status === 'In Progress' ? 'bg-[#FFF5E6] text-[#FF8000] border-[#FFF5E6]' :
                  selectedTicket.status === 'Resolved' ? 'bg-[#EBFDF2] text-[#027A48] border-[#EBFDF3]' :
                  'bg-[#F2F4F7] text-[#344054] border-[#F2F4F7]'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    selectedTicket.status === 'Open' ? 'bg-[#175CD3]' :
                    selectedTicket.status === 'In Progress' ? 'bg-[#FF8000]' :
                    selectedTicket.status === 'Resolved' ? 'bg-[#12B76A]' :
                    'bg-[#475467]'
                  }`} />
                  <span>{selectedTicket.status}</span>
                </span>
                
                {selectedTicket.starred && (
                  <span className="inline-flex items-center gap-1 bg-[#FFF5E6] text-[#FF8000] border border-orange-100 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                    <SparklesIcon className="w-3.5 h-3.5" />
                    <span>Starred</span>
                  </span>
                )}
              </div>
            </div>

            {/* details info list */}
            <div className="py-5 space-y-4 text-sm font-semibold text-gray-700 max-h-[350px] overflow-y-auto custom-scrollbar">
              
              {/* Product concerned and size badge */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-150 shadow-sm bg-gray-50 flex-shrink-0 select-none">
                  <img src={selectedTicket.productImage} alt={selectedTicket.product} className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Concerned Pizza Item</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-gray-700 font-bold">{selectedTicket.product}</span>
                    <span className="bg-orange-50 text-[#FF4C00] font-black text-[9px] px-1.5 py-0.5 rounded uppercase select-none tracking-wide border border-orange-100">{selectedTicket.size}</span>
                  </div>
                </div>
              </div>

              {/* Ticket ID */}
              <div className="flex items-center gap-3.5">
                <ShoppingBagIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Ticket Serial ID</span>
                  <span className="text-gray-700 font-bold block mt-0.5">{selectedTicket.id}</span>
                </div>
              </div>

              {/* Date / Time */}
              <div className="flex items-center gap-3.5">
                <CalendarIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Last Updated Timestamp</span>
                  <span className="text-gray-700 font-bold block mt-0.5">{selectedTicket.date} at {selectedTicket.time}</span>
                </div>
              </div>

              {/* Ticket Subject */}
              <div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Issue Subject</span>
                <span className="text-gray-800 font-extrabold text-sm block bg-slate-50 p-2.5 rounded-xl border border-slate-100/50">{selectedTicket.subject}</span>
              </div>

              {/* Detailed narrative */}
              <div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Detailed Description</span>
                <p className="text-xs leading-relaxed font-medium text-gray-500 bg-gray-50 p-3.5 rounded-2xl border border-gray-100 italic">
                  "{selectedTicket.description}"
                </p>
              </div>

              {/* Operator reply response details */}
              {selectedTicket.reply && (
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Support Resolution Response</span>
                  <p className="text-xs leading-relaxed font-medium text-orange-600 bg-orange-50/20 p-3.5 rounded-2xl border border-orange-100/50">
                    "{selectedTicket.reply}"
                  </p>
                </div>
              )}
            </div>

            {/* Actions button */}
            <div className="pt-3 border-t border-gray-50 flex gap-3">
              <button 
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleOpenReply(selectedTicket);
                }}
                className="flex-1 bg-[#FF4C00] hover:bg-[#e64400] text-white font-extrabold text-xs py-3 rounded-2xl shadow-md shadow-orange-500/10 active:scale-95 transition-all text-center flex items-center justify-center gap-2 h-11"
              >
                <span>{selectedTicket.reply ? 'Edit Response' : 'Reply & Resolve'}</span>
              </button>
              
              <button 
                onClick={() => handleOpenDeleteConfirm(selectedTicket)}
                className="bg-red-50 hover:bg-red-100 text-red-500 font-extrabold text-xs px-4 rounded-2xl transition-all flex items-center justify-center border border-red-100 active:scale-95"
                title="Delete Ticket"
              >
                <TrashIcon className="w-4.5 h-4.5" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          REPLY / UPDATE RESOLUTION MODAL
         ======================================================== */}
      {isReplyModalOpen && selectedTicket && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-gray-150 shadow-[0_25px_60px_rgba(0,0,0,0.15)] animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-5 border-b border-gray-50 pb-3">
              <h3 className="text-[18px] font-black text-gray-900 tracking-tight">Respond to Ticket</h3>
              <button 
                onClick={() => setIsReplyModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none focus:outline-none transition-colors"
              >
                &times;
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleReplySubmit} className="space-y-4 text-slate-700">
              
              {/* Ticket Details summary */}
              <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-4 text-xs font-semibold space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Ticket ID:</span>
                  <span className="text-gray-800 font-extrabold">{selectedTicket.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Customer:</span>
                  <span className="text-gray-800 font-extrabold">{selectedTicket.customer} ({selectedTicket.email})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Subject:</span>
                  <span className="text-gray-800 font-extrabold">{selectedTicket.subject}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Concerned Item:</span>
                  <span className="text-gray-800 font-extrabold">{selectedTicket.product} ({selectedTicket.size})</span>
                </div>
                <div className="border-t border-gray-100 pt-2 text-gray-500 leading-normal italic">
                  "{selectedTicket.description}"
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-2">Update Ticket Status</label>
                <select 
                  value={replyStatus}
                  onChange={e => setReplyStatus(e.target.value)}
                  className="w-full bg-[#FAFBFD] text-sm px-4 py-2.5 border border-gray-200/80 rounded-2xl focus:border-[#FF4C00] focus:bg-white transition-all font-bold text-gray-800 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%239ca3af%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25em_1.25em] bg-[right_1rem_center] bg-no-repeat"
                >
                  <option value="Open">Keep Open</option>
                  <option value="In Progress">Mark In Progress</option>
                  <option value="Resolved">Mark Resolved</option>
                  <option value="Closed">Mark Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-2">Resolution Reply Text *</label>
                <textarea 
                  required
                  rows="4"
                  placeholder="Draft your solution reply here..."
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  className="w-full bg-[#FAFBFD] text-sm px-4 py-2.5 border border-gray-200/80 rounded-2xl focus:border-[#FF4C00] focus:ring-4 focus:ring-[#FF4C00]/5 focus:bg-white transition-all font-bold text-gray-800 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-3 border-t border-gray-50 mt-4">
                <button 
                  type="button"
                  onClick={() => setIsReplyModalOpen(false)}
                  className="border border-[#FF4C00] text-[#FF4C00] hover:bg-orange-50/20 px-5.5 py-2.5 rounded-2xl text-[13px] font-black transition-all active:scale-95 h-11"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-[#FF4C00] hover:bg-[#e64400] text-white px-5.5 py-2.5 rounded-2xl text-[13px] font-black shadow-md shadow-orange-500/10 active:scale-95 transition-all h-11"
                >
                  Publish Response
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          DELETE CONFIRMATION DIALOG
         ======================================================== */}
      {isDeleteConfirmOpen && selectedTicket && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-gray-100 shadow-[0_25px_60px_rgba(0,0,0,0.15)] text-center animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-[18px] font-black text-gray-900 tracking-tight mb-2">Delete Ticket?</h3>
            <p className="text-xs font-semibold text-gray-400 leading-relaxed px-2">
              Are you sure you want to permanently delete support ticket **{selectedTicket.id}** submitted by {selectedTicket.customer}? This action cannot be undone.
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
          SUCCESS TOAST ALERTS (Bottom Center Animated Styling)
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

export default AdminTicketsPage;
