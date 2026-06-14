import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CheckCircleIcon,
  ClockIcon,
  CalendarIcon,
  ShoppingBagIcon,
  SparklesIcon,
  ArrowRightIcon,
  StarIcon as StarIconOutline
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

// Pre-seeded mock database matching the provided screenshot exactly!
const INITIAL_REVIEWS = [
  {
    id: 'REV1001',
    customer: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    customerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&auto=format&fit=crop',
    orderId: 'ORD00156',
    product: 'Pepperoni Pizza',
    productImage: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=120&auto=format&fit=crop',
    rating: 5,
    text: 'Amazing pizza! Fresh ingredients and super tasty.',
    date: '12 May 2025 10:30 AM',
    status: 'Approved',
    featured: true,
    size: 'Large',
    price: 599,
    reply: 'Thank you so much Alex! We are thrilled that you loved the fresh ingredients on our Pepperoni Pizza. Hope to serve you again soon!'
  },
  {
    id: 'REV1002',
    customer: 'Emma Watson',
    email: 'emma.watson@email.com',
    customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120&auto=format&fit=crop',
    orderId: 'ORD00155',
    product: 'Cheese Burst Pizza',
    productImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=120&auto=format&fit=crop',
    rating: 4.5,
    text: 'Cheese burst crust was awesome! Will order again.',
    date: '12 May 2025 09:15 AM',
    status: 'Approved',
    featured: true,
    size: 'Medium',
    price: 499,
    reply: ''
  },
  {
    id: 'REV1003',
    customer: 'Michael Brown',
    email: 'michael.brown@email.com',
    customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop',
    orderId: 'ORD00154',
    product: 'Veggie Delight',
    productImage: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?q=80&w=120&auto=format&fit=crop',
    rating: 3,
    text: 'Good pizza but delivery was a bit late.',
    date: '11 May 2025 08:45 PM',
    status: 'Pending',
    featured: false,
    size: 'Large',
    price: 549,
    reply: ''
  },
  {
    id: 'REV1004',
    customer: 'Sophia Davis',
    email: 'sophia.davis@email.com',
    customerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=120&auto=format&fit=crop',
    orderId: 'ORD00153',
    product: 'Farmhouse Pizza',
    productImage: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=120&auto=format&fit=crop',
    rating: 5,
    text: 'Best pizza in town! Highly recommended.',
    date: '11 May 2025 07:20 PM',
    status: 'Approved',
    featured: false,
    size: 'Medium',
    price: 449,
    reply: 'We are incredibly happy to hear that Sophia! Thank you for choosing SliceSprint!'
  },
  {
    id: 'REV1005',
    customer: 'Daniel Taylor',
    email: 'daniel.taylor@email.com',
    customerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=120&auto=format&fit=crop',
    orderId: 'ORD00152',
    product: 'BBQ Chicken Pizza',
    productImage: 'https://images.unsplash.com/photo-1571066811602-71683a3f680d?q=80&w=120&auto=format&fit=crop',
    rating: 3,
    text: 'It was ok, could be better.',
    date: '10 May 2025 06:10 PM',
    status: 'Pending',
    featured: false,
    size: 'Small',
    price: 299,
    reply: ''
  }
];

const AdminReviewsPage = () => {
  // DB state persisting in LocalStorage
  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem('slicesprint_reviews');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_REVIEWS;
  });

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('All Ratings');
  const [statusFilter, setStatusFilter] = useState('All Status');

  // Modal Control States
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Selected review details
  const [selectedReview, setSelectedReview] = useState(null);

  // Reply form input state
  const [replyText, setReplyText] = useState('');

  // Toast notifications State
  const [toast, setToast] = useState(null);

  // Persist DB
  useEffect(() => {
    localStorage.setItem('slicesprint_reviews', JSON.stringify(reviews));
  }, [reviews]);

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
  const filteredReviews = useMemo(() => {
    return reviews.filter(rev => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        rev.customer.toLowerCase().includes(query) || 
        rev.product.toLowerCase().includes(query) || 
        rev.text.toLowerCase().includes(query) || 
        rev.orderId.toLowerCase().includes(query);

      const matchesStatus = 
        statusFilter === 'All Status' || 
        rev.status === statusFilter;

      let matchesRating = true;
      if (ratingFilter !== 'All Ratings') {
        const filterVal = parseFloat(ratingFilter.replace(' Stars', '').replace(' Star', ''));
        matchesRating = rev.rating === filterVal;
      }

      return matchesSearch && matchesStatus && matchesRating;
    });
  }, [reviews, searchQuery, statusFilter, ratingFilter]);

  // Toggle Featured Review star (Like/Favorite bestseller toggler)
  const handleToggleFeatured = (id) => {
    const review = reviews.find(r => r.id === id);
    if (!review) return;
    const newFeaturedState = !review.featured;

    setReviews(prev => prev.map(r => {
      if (r.id === id) {
        return { ...r, featured: newFeaturedState };
      }
      return r;
    }));

    setToast({
      title: 'Review Priority Updated',
      message: `${review.customer}'s review is ${newFeaturedState ? 'now featured' : 'no longer featured'} on the storefront.`
    });
  };

  // Toggle approval status directly
  const handleToggleStatus = (id) => {
    const review = reviews.find(r => r.id === id);
    if (!review) return;
    const newStatus = review.status === 'Approved' ? 'Pending' : 'Approved';

    setReviews(prev => prev.map(r => {
      if (r.id === id) {
        return { ...r, status: newStatus };
      }
      return r;
    }));

    setToast({
      title: 'Review Status Updated',
      message: `Review by ${review.customer} status successfully set to ${newStatus}.`
    });
  };

  // Open Reply Modal
  const handleOpenReply = (review) => {
    setSelectedReview(review);
    setReplyText(review.reply || '');
    setIsReplyModalOpen(true);
  };

  // Submit Reply
  const handleReplySubmit = (e) => {
    e.preventDefault();
    setReviews(prev => prev.map(r => {
      if (r.id === selectedReview.id) {
        return {
          ...r,
          reply: replyText,
          status: 'Approved' // Auto approve when replying
        };
      }
      return r;
    }));

    setIsReplyModalOpen(false);

    setToast({
      title: 'Response Posted Successfully',
      message: `Your reply has been logged and published.`
    });
  };

  // Open Delete Confirmation
  const handleOpenDeleteConfirm = (review) => {
    setSelectedReview(review);
    setIsDeleteConfirmOpen(true);
  };

  // Execute Deletion
  const handleDeleteExecute = () => {
    setReviews(prev => prev.filter(r => r.id !== selectedReview.id));
    setIsDeleteConfirmOpen(false);

    setToast({
      title: 'Review Deleted',
      message: `Feedback from ${selectedReview.customer} has been removed.`
    });
  };

  const handleOpenView = (review) => {
    setSelectedReview(review);
    setIsViewModalOpen(true);
  };

  // Star Ratings Render helper (handling full and half stars)
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <StarIconSolid key={i} className="w-4 h-4 text-[#FF9E00]" />
        );
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(
          <div key={i} className="relative inline-block w-4 h-4 text-[#FF9E00]">
            <StarIconOutline className="absolute text-gray-200 w-4 h-4" />
            <div className="absolute overflow-hidden w-[50%] h-4">
              <StarIconSolid className="text-[#FF9E00] w-4 h-4 max-w-none" />
            </div>
          </div>
        );
      } else {
        stars.push(
          <StarIconOutline key={i} className="w-4 h-4 text-gray-200" />
        );
      }
    }
    return <div className="flex items-center gap-0.5">{stars}</div>;
  };

  return (
    <div className="bg-[#FAFBFD] min-h-screen pb-16 font-sans text-left">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* --- PAGE HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          
          {/* Headline & Breadcrumb */}
          <div className="flex items-center gap-4">
            {/* Orange Chat Icon Box */}
            <div className="w-12 h-12 rounded-2xl bg-[#FFF5F0] border border-orange-100 flex items-center justify-center text-orange-500 shadow-md shadow-orange-100/30 flex-shrink-0">
              <ChatBubbleLeftRightIcon className="h-6.5 w-6.5 text-[#FF4C00]" />
            </div>
            <div>
              <h1 className="text-[26px] font-black text-gray-900 tracking-tight leading-tight">Reviews</h1>
              <p className="text-sm font-medium text-gray-400 mt-1 leading-none">Manage customer reviews and ratings</p>
            </div>
          </div>

          {/* Search and Dropdown Filter controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 flex-1 md:flex-initial max-w-2xl">
            
            {/* Search Bar Input */}
            <div className="relative flex-1 sm:w-64 min-w-[200px]">
              <span className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-gray-400">
                <MagnifyingGlassIcon className="h-5 w-5" />
              </span>
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-sm pl-11 pr-4 py-2.5 rounded-2xl border border-gray-150 focus:outline-none focus:border-[#FF4C00] focus:ring-4 focus:ring-[#FF4C00]/5 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.01)] font-medium placeholder:text-gray-400"
              />
            </div>

            {/* Dropdown Ratings Filter */}
            <div className="relative min-w-[120px] flex-shrink-0">
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="w-full bg-white text-sm font-bold pl-4 pr-10 py-2.5 rounded-2xl border border-gray-150 focus:outline-none focus:border-[#FF4C00] transition-all cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.01)] appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%239ca3af%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25em_1.25em] bg-[right_1rem_center] bg-no-repeat text-gray-700"
              >
                <option value="All Ratings">All Ratings</option>
                <option value="5 Stars">5 Stars Only</option>
                <option value="4.5 Stars">4.5 Stars</option>
                <option value="3 Stars">3 Stars Only</option>
              </select>
            </div>

            {/* Dropdown Status Filter */}
            <div className="relative min-w-[120px] flex-shrink-0">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-white text-sm font-bold pl-4 pr-10 py-2.5 rounded-2xl border border-gray-150 focus:outline-none focus:border-[#FF4C00] transition-all cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.01)] appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%239ca3af%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25em_1.25em] bg-[right_1rem_center] bg-no-repeat text-gray-700"
              >
                <option value="All Status">All Status</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

          </div>
        </div>

        {/* --- REVIEWS DATA TABLE --- */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_15px_45px_rgba(0,0,0,0.015)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 align-middle">
              <thead className="bg-[#FAFBFD]">
                <tr className="text-left text-xs font-black text-gray-400 uppercase tracking-widest">
                  <th className="px-6 py-5">Customer</th>
                  <th className="px-6 py-5">Order ID</th>
                  <th className="px-6 py-5">Product</th>
                  <th className="px-6 py-5">Rating</th>
                  <th className="px-6 py-5">Review</th>
                  <th className="px-6 py-5">Date</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 bg-white">
                {filteredReviews.map((rev) => (
                  <tr key={rev.id} className="hover:bg-gray-50/30 transition-colors">
                    
                    {/* Customer Info with Avatar */}
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-150 shadow-sm bg-gray-50 flex-shrink-0 select-none">
                          <img src={rev.customerAvatar} alt={rev.customer} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <span className="font-extrabold text-[14px] text-gray-800 block leading-tight">{rev.customer}</span>
                          <span className="text-[12px] font-semibold text-gray-400 block mt-0.5 leading-none">{rev.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Order ID */}
                    <td className="px-6 py-4.5 text-[13.5px] font-bold text-gray-400">
                      {rev.orderId}
                    </td>

                    {/* Product Name with Avatar (Like Button Star next to it!) */}
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-2.5 justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8.5 h-8.5 rounded-xl overflow-hidden border border-gray-150 shadow-sm bg-gray-50 flex-shrink-0 select-none">
                            <img src={rev.productImage} alt={rev.product} className="w-full h-full object-cover" />
                          </div>
                          <span className="font-extrabold text-[14px] text-gray-800">{rev.product}</span>
                        </div>
                        
                        {/* Preferred Star / Favorite Like Indicator */}
                        <button
                          onClick={() => handleToggleFeatured(rev.id)}
                          className="text-gray-300 hover:text-orange-500 focus:outline-none transition-colors mr-2"
                          title="Feature Review on Homepage"
                        >
                          {rev.featured ? (
                            <StarIconSolid className="w-4 h-4 text-[#FF9E00]" />
                          ) : (
                            <span className="text-sm text-gray-300 hover:text-gray-400 select-none leading-none">☆</span>
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Star Ratings displaying half stars */}
                    <td className="px-6 py-4.5">
                      {renderStars(rev.rating)}
                    </td>

                    {/* Review text snippet */}
                    <td className="px-6 py-4.5 text-[13.5px] font-semibold text-gray-500 max-w-xs truncate">
                      {rev.text}
                    </td>

                    {/* Date and Time */}
                    <td className="px-6 py-4.5 text-[13px] font-bold text-gray-600">
                      {rev.date}
                    </td>

                    {/* Status Pill Badge with toggles */}
                    <td className="px-6 py-4.5">
                      <button
                        onClick={() => handleToggleStatus(rev.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black select-none tracking-wide transition-all border ${
                          rev.status === 'Approved'
                            ? 'bg-[#EBFDF2] text-[#027A48] border-[#ECFDF3] hover:border-[#12B76A]'
                            : 'bg-[#FFF5E6] text-[#FF8000] border-[#FFF5E6] hover:border-[#FF9E00]'
                        }`}
                        title="Toggle Approval status"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          rev.status === 'Approved' ? 'bg-[#12B76A]' : 'bg-[#FF8000]'
                        }`} />
                        <span>{rev.status}</span>
                      </button>
                    </td>

                    {/* Action buttons (View manifest details, Reply, Delete) */}
                    <td className="px-6 py-4.5">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* View Details Button */}
                        <button
                          onClick={() => handleOpenView(rev)}
                          className="w-8 h-8 rounded-full border border-gray-150 flex items-center justify-center text-gray-400 hover:text-[#FF4C00] hover:border-[#FF4C00] hover:bg-orange-50/20 bg-white transition-all shadow-[0_1px_5px_rgba(0,0,0,0.01)]"
                          title="View Review Details"
                        >
                          <EyeIcon className="h-4.5 w-4.5" />
                        </button>
                        
                        {/* Edit/Reply Button */}
                        <button
                          onClick={() => handleOpenReply(rev)}
                          className="w-8 h-8 rounded-full border border-gray-150 flex items-center justify-center text-gray-400 hover:text-[#FF4C00] hover:border-[#FF4C00] hover:bg-orange-50/20 bg-white transition-all shadow-[0_1px_5px_rgba(0,0,0,0.01)]"
                          title="Reply / Edit Review"
                        >
                          <PencilIcon className="h-4.5 w-4.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleOpenDeleteConfirm(rev)}
                          className="w-8 h-8 rounded-full border border-gray-150 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-400 hover:bg-red-50/20 bg-white transition-all shadow-[0_1px_5px_rgba(0,0,0,0.01)]"
                          title="Remove Review"
                        >
                          <TrashIcon className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
                {filteredReviews.length === 0 && (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-sm font-bold text-gray-400 uppercase tracking-widest">
                      No matching reviews found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ========================================================
          VIEW DETAILS DRAWER/MODAL (showing pizza size ordered!)
         ======================================================== */}
      {isViewModalOpen && selectedReview && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-gray-150 shadow-[0_25px_60px_rgba(0,0,0,0.15)] animate-in fade-in zoom-in-95 duration-200 relative text-left">
            
            {/* Close */}
            <button 
              onClick={() => setIsViewModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 text-[26px] leading-none focus:outline-none transition-colors"
            >
              &times;
            </button>

            {/* Profile Review details header */}
            <div className="flex flex-col items-center text-center mt-3 pb-5 border-b border-gray-100">
              <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-150 shadow-md bg-gray-50 mb-3 select-none">
                <img src={selectedReview.customerAvatar} alt={selectedReview.customer} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-[19px] font-black text-gray-800 tracking-tight">{selectedReview.customer}</h3>
              <p className="text-xs font-bold text-gray-400 mt-1">{selectedReview.email}</p>
              
              <div className="flex items-center gap-2 mt-3 select-none">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wide border ${
                  selectedReview.status === 'Approved'
                    ? 'bg-[#EBFDF2] text-[#027A48] border-[#ECFDF3]'
                    : 'bg-[#FFF5E6] text-[#FF8000] border-[#FFF5E6]'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    selectedReview.status === 'Approved' ? 'bg-[#12B76A]' : 'bg-[#FF8000]'
                  }`} />
                  <span>{selectedReview.status}</span>
                </span>
                
                {selectedReview.featured && (
                  <span className="inline-flex items-center gap-1 bg-[#FFF5E6] text-[#FF8000] border border-orange-100 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                    <SparklesIcon className="w-3.5 h-3.5" />
                    <span>Featured</span>
                  </span>
                )}
              </div>
            </div>

            {/* details info list */}
            <div className="py-5 space-y-4 text-sm font-semibold text-gray-700">
              
              {/* Product reviewed (pizza product showing its size) */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-150 shadow-sm bg-gray-50 flex-shrink-0 select-none">
                  <img src={selectedReview.productImage} alt={selectedReview.product} className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Reviewed Pizza & Size</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-gray-700 font-bold">{selectedReview.product}</span>
                    <span className="bg-orange-50 text-[#FF4C00] font-black text-[9px] px-1.5 py-0.5 rounded uppercase select-none tracking-wide border border-orange-100">{selectedReview.size}</span>
                  </div>
                </div>
              </div>

              {/* Order ID */}
              <div className="flex items-center gap-3.5">
                <ShoppingBagIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Associated Order ID</span>
                  <span className="text-gray-700 font-bold block mt-0.5">{selectedReview.orderId}</span>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center gap-3.5">
                <CalendarIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Submitted On</span>
                  <span className="text-gray-700 font-bold block mt-0.5">{selectedReview.date}</span>
                </div>
              </div>

              {/* Stars display */}
              <div className="bg-[#FAFBFD] p-3.5 rounded-2xl border border-gray-100">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Customer Rating</span>
                <div className="flex items-center gap-2 mt-1">
                  {renderStars(selectedReview.rating)}
                  <span className="text-sm font-black text-gray-800">({selectedReview.rating} Stars)</span>
                </div>
              </div>

              {/* Review Text */}
              <div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Review Feedback</span>
                <p className="text-xs leading-relaxed font-medium text-gray-500 bg-gray-50 p-3.5 rounded-2xl border border-gray-100 italic">
                  "{selectedReview.text}"
                </p>
              </div>

              {/* Reply status */}
              {selectedReview.reply && (
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Operator Response</span>
                  <p className="text-xs leading-relaxed font-medium text-orange-600 bg-orange-50/20 p-3.5 rounded-2xl border border-orange-100/50">
                    "{selectedReview.reply}"
                  </p>
                </div>
              )}
            </div>

            {/* Actions button */}
            <div className="pt-3 border-t border-gray-50 flex gap-3">
              <button 
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleOpenReply(selectedReview);
                }}
                className="flex-1 bg-[#FF4C00] hover:bg-[#e64400] text-white font-extrabold text-xs py-3 rounded-2xl shadow-md shadow-orange-500/10 active:scale-95 transition-all text-center flex items-center justify-center gap-2 h-11"
              >
                <span>{selectedReview.reply ? 'Edit Response' : 'Reply to Feedback'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          EDIT / REPLY MODAL
         ======================================================== */}
      {isReplyModalOpen && selectedReview && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6.5 border border-gray-100 shadow-[0_25px_60px_rgba(0,0,0,0.15)] animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-5 border-b border-gray-50 pb-3">
              <h3 className="text-[18px] font-black text-gray-900 tracking-tight">Reply to Review</h3>
              <button 
                onClick={() => setIsReplyModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none focus:outline-none transition-colors"
              >
                &times;
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleReplySubmit} className="space-y-4 text-slate-700">
              
              {/* Feedback Summary Card */}
              <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-4 text-xs font-semibold space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Customer:</span>
                  <span className="text-gray-800 font-extrabold">{selectedReview.customer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Product:</span>
                  <span className="text-gray-800 font-extrabold">{selectedReview.product} ({selectedReview.size})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Rating:</span>
                  <span>{renderStars(selectedReview.rating)}</span>
                </div>
                <div className="border-t border-gray-100 pt-2 text-gray-500 leading-normal italic">
                  "{selectedReview.text}"
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-2">Composed Reply Text *</label>
                <textarea 
                  required
                  rows="4"
                  placeholder="Draft your response here. Publishing will auto-approve this review..."
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
      {isDeleteConfirmOpen && selectedReview && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-gray-100 shadow-[0_25px_60px_rgba(0,0,0,0.15)] text-center animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-[18px] font-black text-gray-900 tracking-tight mb-2">Delete Review?</h3>
            <p className="text-xs font-semibold text-gray-400 leading-relaxed px-2">
              Are you sure you want to permanently delete the feedback submitted by **{selectedReview.customer}**? This action cannot be undone.
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

export default AdminReviewsPage;
