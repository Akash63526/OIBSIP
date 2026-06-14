import React, { useState, useEffect, useMemo } from 'react';
import { 
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CheckCircleIcon,
  BoltIcon,
  CurrencyRupeeIcon,
  ArchiveBoxIcon,
  CalendarIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

// Mock Seed Database matching the provided screenshot exactly!
const INITIAL_MENU_ITEMS = [
  {
    id: 'MENU1001',
    name: 'Margherita Pizza',
    category: 'Pizza',
    price: 249,
    stock: 50,
    status: 'Active',
    bestseller: true,
    createdOn: '10 May 2025',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=150&auto=format&fit=crop',
    description: 'Classic Neapolitan pizza topped with fresh marinara sauce, premium mozzarella cheese, and fresh aromatic basil leaves.',
    sizes: { small: 249, medium: 379, large: 499 }
  },
  {
    id: 'MENU1002',
    name: 'Pepperoni Pizza',
    category: 'Pizza',
    price: 299,
    stock: 35,
    status: 'Active',
    bestseller: true,
    createdOn: '10 May 2025',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=150&auto=format&fit=crop',
    description: 'Crispy hand-tossed crust layered with signature pizza sauce, melted mozzarella, and loaded with spicy pork pepperoni slices.',
    sizes: { small: 299, medium: 449, large: 599 }
  },
  {
    id: 'MENU1003',
    name: 'Cheese Burst Pizza',
    category: 'Pizza',
    price: 329,
    stock: 20,
    status: 'Active',
    bestseller: false,
    createdOn: '09 May 2025',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=150&auto=format&fit=crop',
    description: 'A decadent crust overflowing with rich liquid cheese burst sauce, topped with double mozzarella layers.',
    sizes: { small: 329, medium: 499, large: 649 }
  },
  {
    id: 'MENU1004',
    name: 'Garlic Bread',
    category: 'Sides',
    price: 129,
    stock: 40,
    status: 'Active',
    bestseller: false,
    createdOn: '08 May 2025',
    image: 'https://images.unsplash.com/photo-1544982503-9f984c14501a?q=80&w=150&auto=format&fit=crop',
    description: 'Freshly baked garlic bread sticks infused with garlic butter and herbs, served with standard jalapeño cheese dip.',
    sizes: { regular: 129 }
  },
  {
    id: 'MENU1005',
    name: 'Coke (500ml)',
    category: 'Drinks',
    price: 60,
    stock: 100,
    status: 'Active',
    bestseller: false,
    createdOn: '08 May 2025',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=150&auto=format&fit=crop',
    description: 'Chilled refreshing Coca-Cola plastic bottle (500ml) to wash down your hot delicious pizza slices.',
    sizes: { regular: 60 }
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

const AdminMenuPage = () => {
  // Local Database state persisting in LocalStorage
  const [menuItems, setMenuItems] = useState(() => {
    try {
      const saved = localStorage.getItem('slicesprint_menu');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_MENU_ITEMS;
  });

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');

  // Modal Control States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Selected item for modal activities
  const [selectedItem, setSelectedItem] = useState(null);

  // Toast State
  const [toast, setToast] = useState(null);

  // Add Item form state
  const [addFormData, setAddFormData] = useState({
    name: '',
    category: 'Pizza',
    price: '',
    stock: '',
    status: 'Active',
    bestseller: false,
    description: '',
    smallPrice: '',
    mediumPrice: '',
    largePrice: ''
  });

  // Edit Item form state
  const [editFormData, setEditFormData] = useState({
    name: '',
    category: 'Pizza',
    price: '',
    stock: '',
    status: 'Active',
    bestseller: false,
    description: '',
    smallPrice: '',
    mediumPrice: '',
    largePrice: ''
  });

  // Persist DB
  useEffect(() => {
    localStorage.setItem('slicesprint_menu', JSON.stringify(menuItems));
  }, [menuItems]);

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
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter(item => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        item.name.toLowerCase().includes(query) || 
        item.category.toLowerCase().includes(query) || 
        item.id.toLowerCase().includes(query);

      const matchesCategory = 
        categoryFilter === 'All Categories' || 
        item.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [menuItems, searchQuery, categoryFilter]);

  // Toggle bestseller star (Like/Favorite bestseller toggler)
  const handleToggleBestseller = (id) => {
    const item = menuItems.find(i => i.id === id);
    if (!item) return;
    const newBestsellerState = !item.bestseller;

    setMenuItems(prev => prev.map(i => {
      if (i.id === id) {
        return { ...i, bestseller: newBestsellerState };
      }
      return i;
    }));

    setToast({
      title: 'Bestseller Status Updated',
      message: `${item.name} is ${newBestsellerState ? 'now marked' : 'no longer marked'} as a bestseller.`
    });
  };

  // Handle Add Item submission
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!addFormData.name || !addFormData.stock) {
      alert('Please fill out all required fields.');
      return;
    }

    // Auto generate next Menu Item ID: MENU1006, MENU1007...
    const numericIds = menuItems.map(i => parseInt(i.id.replace('MENU', ''), 10)).filter(id => !isNaN(id));
    const nextNumericId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1006;
    const newId = `MENU${nextNumericId}`;

    const createdDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    // Sizes pricing mapping
    let sizePricingMap = {};
    let itemBasePrice = 0;

    if (addFormData.category === 'Pizza') {
      sizePricingMap = {
        small: parseFloat(addFormData.smallPrice) || 0,
        medium: parseFloat(addFormData.mediumPrice) || 0,
        large: parseFloat(addFormData.largePrice) || 0
      };
      itemBasePrice = sizePricingMap.small; // Base price is Small
    } else {
      itemBasePrice = parseFloat(addFormData.price) || 0;
      sizePricingMap = { regular: itemBasePrice };
    }

    // Unsplash food placeholders
    const imagesByCategory = {
      Pizza: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?q=80&w=150&auto=format&fit=crop',
      Sides: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=150&auto=format&fit=crop',
      Drinks: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=150&auto=format&fit=crop',
      Dessert: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=150&auto=format&fit=crop'
    };

    const newItem = {
      id: newId,
      name: addFormData.name,
      category: addFormData.category,
      price: itemBasePrice,
      stock: parseInt(addFormData.stock, 10) || 0,
      status: addFormData.status,
      bestseller: addFormData.bestseller,
      createdOn: createdDate,
      image: imagesByCategory[addFormData.category] || imagesByCategory.Pizza,
      description: addFormData.description || 'Delightful SliceSprint flavor profile.',
      sizes: sizePricingMap
    };

    setMenuItems(prev => [...prev, newItem]);
    setIsAddModalOpen(false);

    setToast({
      title: 'Item Added Successfully',
      message: `${newItem.name} has been added to the menu.`
    });

    // Reset Form Data
    setAddFormData({
      name: '',
      category: 'Pizza',
      price: '',
      stock: '',
      status: 'Active',
      bestseller: false,
      description: '',
      smallPrice: '',
      mediumPrice: '',
      largePrice: ''
    });
  };

  // Open Edit Modal & Populate Form
  const handleOpenEdit = (item) => {
    setSelectedItem(item);
    setEditFormData({
      name: item.name,
      category: item.category,
      price: item.price.toString(),
      stock: item.stock.toString(),
      status: item.status,
      bestseller: item.bestseller,
      description: item.description,
      smallPrice: item.category === 'Pizza' ? (item.sizes?.small || item.price).toString() : '',
      mediumPrice: item.category === 'Pizza' ? (item.sizes?.medium || '').toString() : '',
      largePrice: item.category === 'Pizza' ? (item.sizes?.large || '').toString() : ''
    });
    setIsEditModalOpen(true);
  };

  // Handle Edit Submit
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editFormData.name || !editFormData.stock) {
      alert('Please fill out all required fields.');
      return;
    }

    setMenuItems(prev => prev.map(item => {
      if (item.id === selectedItem.id) {
        let sizePricingMap = {};
        let itemBasePrice = 0;

        if (editFormData.category === 'Pizza') {
          sizePricingMap = {
            small: parseFloat(editFormData.smallPrice) || 0,
            medium: parseFloat(editFormData.mediumPrice) || 0,
            large: parseFloat(editFormData.largePrice) || 0
          };
          itemBasePrice = sizePricingMap.small;
        } else {
          itemBasePrice = parseFloat(editFormData.price) || 0;
          sizePricingMap = { regular: itemBasePrice };
        }

        return {
          ...item,
          name: editFormData.name,
          category: editFormData.category,
          price: itemBasePrice,
          stock: parseInt(editFormData.stock, 10) || 0,
          status: editFormData.status,
          bestseller: editFormData.bestseller,
          description: editFormData.description,
          sizes: sizePricingMap
        };
      }
      return item;
    }));

    setIsEditModalOpen(false);

    setToast({
      title: 'Item Details Updated',
      message: `${selectedItem.name}'s details have been successfully configured.`
    });
  };

  // Open Delete Confirmation
  const handleOpenDeleteConfirm = (item) => {
    setSelectedItem(item);
    setIsDeleteConfirmOpen(true);
  };

  // Execute Deletion
  const handleDeleteExecute = () => {
    setMenuItems(prev => prev.filter(i => i.id !== selectedItem.id));
    setIsDeleteConfirmOpen(false);

    setToast({
      title: 'Item Deleted',
      message: `${selectedItem.name} has been purged from the active menu.`
    });
  };

  // Open View Details Drawer
  const handleOpenView = (item) => {
    setSelectedItem(item);
    setIsViewModalOpen(true);
  };

  return (
    <div className="bg-[#FAFBFD] min-h-screen pb-16 font-sans text-left">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* --- PAGE HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          
          {/* Brand Headline & Subtitle */}
          <div className="flex items-center gap-4">
            {/* Orange Pizza Icon Box */}
            <div className="w-12 h-12 rounded-2xl bg-[#FFF5F0] border border-orange-100 flex items-center justify-center shadow-md shadow-orange-100/30 flex-shrink-0">
              <span className="text-xl select-none">🍕</span>
            </div>
            <div>
              <h1 className="text-[26px] font-black text-gray-900 tracking-tight leading-tight">Menu Management</h1>
              <p className="text-sm font-medium text-gray-400 mt-1 leading-none">Manage pizzas, sides, drinks and other menu items</p>
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
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-sm pl-11 pr-4 py-2.5 rounded-2xl border border-gray-150 focus:outline-none focus:border-[#FF4C00] focus:ring-4 focus:ring-[#FF4C00]/5 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.01)] font-medium placeholder:text-gray-400"
              />
            </div>

            {/* Dropdown Category Filter */}
            <div className="relative min-w-[140px] flex-shrink-0">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full bg-white text-sm font-bold pl-4 pr-10 py-2.5 rounded-2xl border border-gray-150 focus:outline-none focus:border-[#FF4C00] transition-all cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.01)] appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%239ca3af%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25em_1.25em] bg-[right_1rem_center] bg-no-repeat text-gray-700"
              >
                <option value="All Categories">All Categories</option>
                <option value="Pizza">Pizza</option>
                <option value="Sides">Sides</option>
                <option value="Drinks">Drinks</option>
              </select>
            </div>

            {/* Add New Item Button */}
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#FF4C00] hover:bg-[#e64400] text-white font-extrabold text-sm px-6 py-2.5 rounded-2xl shadow-lg shadow-orange-500/15 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 h-10.5"
            >
              <PlusIcon className="h-5 w-5 stroke-[2.5]" />
              <span>Add New Item</span>
            </button>

          </div>
        </div>

        {/* --- MENU DATA TABLE --- */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_15px_45px_rgba(0,0,0,0.015)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 align-middle">
              <thead className="bg-[#FAFBFD]">
                <tr className="text-left text-xs font-black text-gray-400 uppercase tracking-widest">
                  <th className="px-6 py-5">Image</th>
                  <th className="px-6 py-5">Item Name</th>
                  <th className="px-6 py-5">Category</th>
                  <th className="px-6 py-5">Price</th>
                  <th className="px-6 py-5 text-center">Stock</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-center">Bestseller</th>
                  <th className="px-6 py-5">Created On</th>
                  <th className="px-6 py-5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 bg-white">
                {filteredMenuItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/30 transition-colors">
                    
                    {/* Item Image Thumbnail */}
                    <td className="px-6 py-4.5">
                      <div className="w-11 h-11 rounded-2xl overflow-hidden border border-gray-150 bg-gray-50 shadow-sm flex-shrink-0 select-none">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    </td>

                    {/* Item Name */}
                    <td className="px-6 py-4.5">
                      <span className="font-extrabold text-[14.5px] text-gray-800">{item.name}</span>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4.5 text-[13.5px] font-bold text-gray-400">
                      {item.category}
                    </td>

                    {/* Price (formats Base/Small price) */}
                    <td className="px-6 py-4.5 text-[14px] font-black text-gray-800">
                      {formatCurrency(item.price)}
                    </td>

                    {/* Stock quantity */}
                    <td className="px-6 py-4.5 text-center font-extrabold text-[14px] text-gray-600">
                      {item.stock}
                    </td>

                    {/* Status Pill Badge */}
                    <td className="px-6 py-4.5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black select-none tracking-wide ${
                        item.status === 'Active'
                          ? 'bg-[#EBFDF2] text-[#027A48]'
                          : 'bg-[#FEF3F2] text-[#B42318]'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          item.status === 'Active' ? 'bg-[#12B76A]' : 'bg-[#F04438]'
                        }`} />
                        <span>{item.status}</span>
                      </span>
                    </td>

                    {/* Bestseller Star Button (Like Button Toggler matching screenshot) */}
                    <td className="px-6 py-4.5 text-center">
                      <button
                        onClick={() => handleToggleBestseller(item.id)}
                        className="p-1 rounded-lg hover:bg-gray-150/40 text-gray-300 hover:text-orange-500 transition-all focus:outline-none"
                        title="Toggle Bestseller status"
                      >
                        {item.bestseller ? (
                          <StarIconSolid className="w-5.5 h-5.5 text-[#FF9E00]" />
                        ) : (
                          <span className="text-xl font-light text-gray-300 hover:text-gray-400 select-none block leading-none">☆</span>
                        )}
                      </button>
                    </td>

                    {/* Created On Date */}
                    <td className="px-6 py-4.5 text-[13.5px] font-bold text-gray-600">
                      {item.createdOn}
                    </td>

                    {/* Action buttons (View, Edit, Delete) matching styling */}
                    <td className="px-6 py-4.5">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* View Button */}
                        <button
                          onClick={() => handleOpenView(item)}
                          className="w-8 h-8 rounded-full border border-gray-150 flex items-center justify-center text-gray-400 hover:text-[#FF4C00] hover:border-[#FF4C00] hover:bg-orange-50/20 bg-white transition-all shadow-[0_1px_5px_rgba(0,0,0,0.01)]"
                          title="View Details"
                        >
                          <EyeIcon className="h-4.5 w-4.5" />
                        </button>
                        
                        {/* Edit Button */}
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="w-8 h-8 rounded-full border border-gray-150 flex items-center justify-center text-gray-400 hover:text-[#FF4C00] hover:border-[#FF4C00] hover:bg-orange-50/20 bg-white transition-all shadow-[0_1px_5px_rgba(0,0,0,0.01)]"
                          title="Edit Item"
                        >
                          <PencilIcon className="h-4.5 w-4.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleOpenDeleteConfirm(item)}
                          className="w-8 h-8 rounded-full border border-gray-150 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-400 hover:bg-red-50/20 bg-white transition-all shadow-[0_1px_5px_rgba(0,0,0,0.01)]"
                          title="Remove Item"
                        >
                          <TrashIcon className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
                {filteredMenuItems.length === 0 && (
                  <tr>
                    <td colSpan="9" className="px-6 py-12 text-center text-sm font-bold text-gray-400 uppercase tracking-widest">
                      No matching menu items found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ========================================================
          ADD NEW ITEM MODAL (with Pizza size parameters)
         ======================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6.5 border border-gray-100 shadow-[0_25px_60px_rgba(0,0,0,0.15)] animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-5 border-b border-gray-50 pb-3">
              <h3 className="text-[18px] font-black text-gray-900 tracking-tight">Add New Menu Item</h3>
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
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Item Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Margherita Pizza"
                  value={addFormData.name}
                  onChange={e => setAddFormData({ ...addFormData, name: e.target.value })}
                  className="w-full bg-[#FAFBFD] text-sm px-4 py-2.5 border border-gray-200/80 rounded-2xl focus:border-[#FF4C00] focus:ring-4 focus:ring-[#FF4C00]/5 focus:bg-white transition-all font-bold text-gray-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Category</label>
                  <select 
                    value={addFormData.category}
                    onChange={e => setAddFormData({ ...addFormData, category: e.target.value })}
                    className="w-full bg-[#FAFBFD] text-sm px-4 py-2.5 border border-gray-200/80 rounded-2xl focus:border-[#FF4C00] focus:bg-white transition-all font-bold text-gray-800 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%239ca3af%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25em_1.25em] bg-[right_1rem_center] bg-no-repeat"
                  >
                    <option value="Pizza">Pizza</option>
                    <option value="Sides">Sides</option>
                    <option value="Drinks">Drinks</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Stock Level *</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    placeholder="e.g. 50"
                    value={addFormData.stock}
                    onChange={e => setAddFormData({ ...addFormData, stock: e.target.value })}
                    className="w-full bg-[#FAFBFD] text-sm px-4 py-2.5 border border-gray-200/80 rounded-2xl focus:border-[#FF4C00] focus:ring-4 focus:ring-[#FF4C00]/5 focus:bg-white transition-all font-bold text-gray-800"
                  />
                </div>
              </div>

              {/* DYNAMIC PRICE REGION: Pizza has S, M, L sizes prices, others have base price */}
              {addFormData.category === 'Pizza' ? (
                <div className="border border-gray-150 p-4 rounded-2xl bg-gray-50/20 space-y-3">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Pizza Size Pricing (₹)</span>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 mb-1">Small (S) *</label>
                      <input 
                        type="number"
                        required
                        placeholder="249"
                        value={addFormData.smallPrice}
                        onChange={e => setAddFormData({ ...addFormData, smallPrice: e.target.value })}
                        className="w-full bg-white text-xs px-3 py-2 border border-gray-200 rounded-xl focus:border-[#FF4C00] focus:outline-none font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 mb-1">Medium (M)</label>
                      <input 
                        type="number"
                        placeholder="379"
                        value={addFormData.mediumPrice}
                        onChange={e => setAddFormData({ ...addFormData, mediumPrice: e.target.value })}
                        className="w-full bg-white text-xs px-3 py-2 border border-gray-200 rounded-xl focus:border-[#FF4C00] focus:outline-none font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 mb-1">Large (L)</label>
                      <input 
                        type="number"
                        placeholder="499"
                        value={addFormData.largePrice}
                        onChange={e => setAddFormData({ ...addFormData, largePrice: e.target.value })}
                        className="w-full bg-white text-xs px-3 py-2 border border-gray-200 rounded-xl focus:border-[#FF4C00] focus:outline-none font-bold"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Item Price (₹) *</label>
                  <input 
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 129"
                    value={addFormData.price}
                    onChange={e => setAddFormData({ ...addFormData, price: e.target.value })}
                    className="w-full bg-[#FAFBFD] text-sm px-4 py-2.5 border border-gray-200/80 rounded-2xl focus:border-[#FF4C00] focus:ring-4 focus:ring-[#FF4C00]/5 focus:bg-white transition-all font-bold text-gray-800"
                  />
                </div>
              )}

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
                
                {/* Bestseller Toggle */}
                <div className="flex justify-between items-center px-4.5 border border-gray-200/80 bg-[#FAFBFD] rounded-2xl h-[42px] mt-6.5">
                  <span className="text-xs font-bold text-gray-600">Bestseller</span>
                  <button 
                    type="button"
                    onClick={() => setAddFormData({ ...addFormData, bestseller: !addFormData.bestseller })}
                    className={`h-6 w-10.5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
                      addFormData.bestseller ? 'bg-[#FF4C00]' : 'bg-gray-200'
                    }`}
                  >
                    <div className={`h-5 w-5 rounded-full bg-white transition-transform duration-200 shadow-sm ${
                      addFormData.bestseller ? 'translate-x-4.5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Description</label>
                <textarea 
                  rows="2.5"
                  placeholder="Describe standard ingredients, toppings, and notes..."
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
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          EDIT ITEM MODAL (with size options)
         ======================================================== */}
      {isEditModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6.5 border border-gray-100 shadow-[0_25px_60px_rgba(0,0,0,0.15)] animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-5 border-b border-gray-50 pb-3">
              <h3 className="text-[18px] font-black text-gray-900 tracking-tight">Edit Item: {selectedItem.id}</h3>
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
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Item Name *</label>
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
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Category</label>
                  <select 
                    value={editFormData.category}
                    onChange={e => setEditFormData({ ...editFormData, category: e.target.value })}
                    className="w-full bg-[#FAFBFD] text-sm px-4 py-2.5 border border-gray-200/80 rounded-2xl focus:border-[#FF4C00] focus:bg-white transition-all font-bold text-gray-800 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%239ca3af%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25em_1.25em] bg-[right_1rem_center] bg-no-repeat"
                  >
                    <option value="Pizza">Pizza</option>
                    <option value="Sides">Sides</option>
                    <option value="Drinks">Drinks</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Stock Level *</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    value={editFormData.stock}
                    onChange={e => setEditFormData({ ...editFormData, stock: e.target.value })}
                    className="w-full bg-[#FAFBFD] text-sm px-4 py-2.5 border border-gray-200/80 rounded-2xl focus:border-[#FF4C00] focus:ring-4 focus:ring-[#FF4C00]/5 focus:bg-white transition-all font-bold text-gray-800"
                  />
                </div>
              </div>

              {/* Pizza Sizes Pricing */}
              {editFormData.category === 'Pizza' ? (
                <div className="border border-gray-150 p-4 rounded-2xl bg-gray-50/20 space-y-3">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Pizza Size Pricing (₹)</span>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 mb-1">Small (S) *</label>
                      <input 
                        type="number"
                        required
                        value={editFormData.smallPrice}
                        onChange={e => setEditFormData({ ...editFormData, smallPrice: e.target.value })}
                        className="w-full bg-white text-xs px-3 py-2 border border-gray-200 rounded-xl focus:border-[#FF4C00] focus:outline-none font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 mb-1">Medium (M)</label>
                      <input 
                        type="number"
                        value={editFormData.mediumPrice}
                        onChange={e => setEditFormData({ ...editFormData, mediumPrice: e.target.value })}
                        className="w-full bg-white text-xs px-3 py-2 border border-gray-200 rounded-xl focus:border-[#FF4C00] focus:outline-none font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 mb-1">Large (L)</label>
                      <input 
                        type="number"
                        value={editFormData.largePrice}
                        onChange={e => setEditFormData({ ...editFormData, largePrice: e.target.value })}
                        className="w-full bg-white text-xs px-3 py-2 border border-gray-200 rounded-xl focus:border-[#FF4C00] focus:outline-none font-bold"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Item Price (₹) *</label>
                  <input 
                    type="number"
                    required
                    min="0"
                    value={editFormData.price}
                    onChange={e => setEditFormData({ ...editFormData, price: e.target.value })}
                    className="w-full bg-[#FAFBFD] text-sm px-4 py-2.5 border border-gray-200/80 rounded-2xl focus:border-[#FF4C00] focus:ring-4 focus:ring-[#FF4C00]/5 focus:bg-white transition-all font-bold text-gray-800"
                  />
                </div>
              )}

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
                
                {/* Bestseller Toggle */}
                <div className="flex justify-between items-center px-4.5 border border-gray-200/80 bg-[#FAFBFD] rounded-2xl h-[42px] mt-6.5">
                  <span className="text-xs font-bold text-gray-600">Bestseller</span>
                  <button 
                    type="button"
                    onClick={() => setEditFormData({ ...editFormData, bestseller: !editFormData.bestseller })}
                    className={`h-6 w-10.5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
                      editFormData.bestseller ? 'bg-[#FF4C00]' : 'bg-gray-200'
                    }`}
                  >
                    <div className={`h-5 w-5 rounded-full bg-white transition-transform duration-200 shadow-sm ${
                      editFormData.bestseller ? 'translate-x-4.5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Description</label>
                <textarea 
                  rows="2.5"
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
          VIEW DETAILS DRAWER/MODAL (showing sizes beautifully)
         ======================================================== */}
      {isViewModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-gray-150 shadow-[0_25px_60px_rgba(0,0,0,0.15)] animate-in fade-in zoom-in-95 duration-200 relative text-left">
            
            {/* Close */}
            <button 
              onClick={() => setIsViewModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 text-[26px] leading-none focus:outline-none transition-colors"
            >
              &times;
            </button>

            {/* Profile Avatar Image */}
            <div className="flex flex-col items-center text-center mt-3 pb-5 border-b border-gray-100">
              <div className="w-24 h-24 rounded-3xl overflow-hidden border border-gray-150 shadow-md bg-gray-50 mb-3 select-none">
                <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-[19px] font-black text-gray-800 tracking-tight">{selectedItem.name}</h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{selectedItem.id}</p>
              
              <div className="flex items-center gap-2 mt-3 select-none">
                <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black tracking-wide ${
                  selectedItem.status === 'Active'
                    ? 'bg-[#EBFDF2] text-[#027A48]'
                    : 'bg-[#FEF3F2] text-[#B42318]'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    selectedItem.status === 'Active' ? 'bg-[#12B76A]' : 'bg-[#F04438]'
                  }`} />
                  <span>{selectedItem.status}</span>
                </span>
                
                {selectedItem.bestseller && (
                  <span className="inline-flex items-center gap-1 bg-[#FFF5E6] text-[#FF8000] border border-orange-100 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                    <SparklesIcon className="w-3.5 h-3.5" />
                    <span>Bestseller</span>
                  </span>
                )}
              </div>
            </div>

            {/* Details profile info list */}
            <div className="py-5 space-y-4 text-sm font-semibold text-gray-700">
              <div className="flex items-center gap-3.5">
                <BoltIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Item Category</span>
                  <span className="text-gray-700 font-bold block mt-0.5">{selectedItem.category}</span>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <ArchiveBoxIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Current Stock</span>
                  <span className="text-gray-700 font-bold block mt-0.5">{selectedItem.stock} items remaining</span>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <CalendarIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Created On</span>
                  <span className="text-gray-700 font-bold block mt-0.5">{selectedItem.createdOn}</span>
                </div>
              </div>

              {/* Pizza Sizes capsules display */}
              {selectedItem.category === 'Pizza' && selectedItem.sizes ? (
                <div className="bg-[#FAFBFD] p-4 rounded-2xl border border-gray-100">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Configure Sizes Available</span>
                  <div className="grid grid-cols-3 gap-2.5">
                    {selectedItem.sizes.small && (
                      <div className="bg-white border border-gray-200/60 p-2.5 rounded-xl text-center shadow-[0_1px_5px_rgba(0,0,0,0.01)]">
                        <span className="text-[9px] font-bold text-gray-400 block uppercase">Small</span>
                        <span className="text-sm font-black text-gray-800 block mt-0.5">{formatCurrency(selectedItem.sizes.small)}</span>
                      </div>
                    )}
                    {selectedItem.sizes.medium && (
                      <div className="bg-white border border-gray-200/60 p-2.5 rounded-xl text-center shadow-[0_1px_5px_rgba(0,0,0,0.01)]">
                        <span className="text-[9px] font-bold text-gray-400 block uppercase">Medium</span>
                        <span className="text-sm font-black text-gray-800 block mt-0.5">{formatCurrency(selectedItem.sizes.medium)}</span>
                      </div>
                    )}
                    {selectedItem.sizes.large && (
                      <div className="bg-white border border-gray-200/60 p-2.5 rounded-xl text-center shadow-[0_1px_5px_rgba(0,0,0,0.01)]">
                        <span className="text-[9px] font-bold text-gray-400 block uppercase">Large</span>
                        <span className="text-sm font-black text-gray-800 block mt-0.5">{formatCurrency(selectedItem.sizes.large)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3.5">
                  <CurrencyRupeeIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Standard Base Price</span>
                    <span className="text-base font-black text-gray-800 block mt-0.5">{formatCurrency(selectedItem.price)}</span>
                  </div>
                </div>
              )}

              <div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Item Description</span>
                <p className="text-xs leading-relaxed font-medium text-gray-500 bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                  {selectedItem.description}
                </p>
              </div>
            </div>

            {/* Actions button */}
            <div className="pt-3 border-t border-gray-50 flex gap-3">
              <button 
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleOpenEdit(selectedItem);
                }}
                className="flex-1 bg-[#FF4C00] hover:bg-[#e64400] text-white font-extrabold text-xs py-3 rounded-2xl shadow-md shadow-orange-500/10 active:scale-95 transition-all text-center"
              >
                Edit Item Configurations
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          DELETE CONFIRMATION DIALOG
         ======================================================== */}
      {isDeleteConfirmOpen && selectedItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-gray-100 shadow-[0_25px_60px_rgba(0,0,0,0.15)] text-center animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-[18px] font-black text-gray-900 tracking-tight mb-2">Delete Menu Item?</h3>
            <p className="text-xs font-semibold text-gray-400 leading-relaxed px-2">
              Are you sure you want to permanently delete **{selectedItem.name}**? This action cannot be undone.
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

export default AdminMenuPage;
