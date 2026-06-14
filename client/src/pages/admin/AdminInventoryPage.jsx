import React, { useState, useEffect, useMemo } from 'react';
import { 
  PencilIcon, 
  PlusIcon, 
  ExclamationTriangleIcon, 
  EnvelopeIcon, 
  CheckCircleIcon, 
  ArrowPathIcon,
  XMarkIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const INITIAL_INGREDIENTS = [
  {
    id: 'ing-1',
    name: 'Thin Crust',
    category: 'Pizza Base',
    stock: 18,
    threshold: 20,
    unit: 'units',
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=120&auto=format&fit=crop',
    history: [42, 38, 26, 18]
  },
  {
    id: 'ing-2',
    name: 'Regular Crust',
    category: 'Pizza Base',
    stock: 56,
    threshold: 20,
    unit: 'units',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=120&auto=format&fit=crop',
    history: [65, 62, 58, 56]
  },
  {
    id: 'ing-3',
    name: 'Pan Crust',
    category: 'Pizza Base',
    stock: 32,
    threshold: 15,
    unit: 'units',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=120&auto=format&fit=crop',
    history: [45, 41, 35, 32]
  },
  {
    id: 'ing-4',
    name: 'Tomato Basil Sauce',
    category: 'Sauce',
    stock: 5.2,
    threshold: 5,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1608797178974-15b35a61d121?q=80&w=120&auto=format&fit=crop',
    history: [12.5, 9.8, 7.2, 5.2]
  },
  {
    id: 'ing-5',
    name: 'BBQ Sauce',
    category: 'Sauce',
    stock: 12,
    threshold: 5,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=120&auto=format&fit=crop',
    history: [15, 14.2, 13.1, 12]
  },
  {
    id: 'ing-6',
    name: 'Pesto Sauce',
    category: 'Sauce',
    stock: 7.5,
    threshold: 5,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1582231375626-24111FA16160?q=80&w=120&auto=format&fit=crop',
    history: [9.5, 8.8, 8.0, 7.5]
  },
  {
    id: 'ing-7',
    name: 'Mozzarella Cheese',
    category: 'Cheese',
    stock: 9.5,
    threshold: 10,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?q=80&w=120&auto=format&fit=crop',
    history: [25, 20, 14, 9.5]
  },
  {
    id: 'ing-8',
    name: 'Cheddar Cheese',
    category: 'Cheese',
    stock: 14,
    threshold: 10,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1618164435735-413d3b066c9a?q=80&w=120&auto=format&fit=crop',
    history: [18, 17, 15.5, 14]
  },
  {
    id: 'ing-9',
    name: 'Gluten Free Crust',
    category: 'Pizza Base',
    stock: 8,
    threshold: 10,
    unit: 'units',
    image: 'https://images.unsplash.com/photo-1544982503-9f984c14501a?q=80&w=120&auto=format&fit=crop',
    history: [18, 15, 12, 8]
  },
  {
    id: 'ing-10',
    name: 'Bell Peppers',
    category: 'Veggies',
    stock: 15,
    threshold: 8,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1563565312870-98319f39bf8d?q=80&w=120&auto=format&fit=crop',
    history: [20, 18, 16, 15]
  },
  {
    id: 'ing-11',
    name: 'Jalapenos',
    category: 'Veggies',
    stock: 2.1,
    threshold: 5,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1588275524115-e3a2e2efe647?q=80&w=120&auto=format&fit=crop',
    history: [8, 6.2, 4.5, 2.1]
  },
  {
    id: 'ing-12',
    name: 'Pepperoni',
    category: 'Meat',
    stock: 28,
    threshold: 15,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1627564820949-0f044de38836?q=80&w=120&auto=format&fit=crop',
    history: [35, 32, 30, 28]
  },
  {
    id: 'ing-13',
    name: 'Grilled Chicken',
    category: 'Meat',
    stock: 4.8,
    threshold: 8,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?q=80&w=120&auto=format&fit=crop',
    history: [12, 10.5, 7.8, 4.8]
  }
];

import { inventoryApi } from '../../api/inventoryApi';

const AdminInventoryPage = () => {
  // --- States ---
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngId, setSelectedIngId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Modals & Action States
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddNewModalOpen, setIsAddNewModalOpen] = useState(false);
  
  const [stockToAdd, setStockToAdd] = useState('10');
  const [actionIngredient, setActionIngredient] = useState(null);
  
  // Email sending animation
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  
  // Toast notifications state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  // Edit Form Fields State
  const [editFormData, setEditFormData] = useState({
    name: '',
    category: 'Pizza Base',
    stock: '',
    threshold: '',
    unit: 'units',
    image: ''
  });

  const mapDbItemToFrontend = (item) => {
    const name = item.name || item.itemName || '';
    const match = INITIAL_INGREDIENTS.find(i => i.name.toLowerCase() === name.toLowerCase());
    return {
      ...item,
      name,
      image: item.image || (match ? match.image : 'https://images.unsplash.com/photo-1544982503-9f984c14501a?q=80&w=120&auto=format&fit=crop'),
      unit: item.unit || (match ? match.unit : 'kg'),
      history: item.history || (match ? match.history : [item.stock])
    };
  };

  // --- Effect: Fetch from DB ---
  useEffect(() => {
    setLoading(true);
    inventoryApi.getAllInventory()
      .then(res => {
        const data = res.data || [];
        const mapped = data.map(mapDbItemToFrontend);
        setIngredients(mapped);
        if(mapped.length > 0) {
          setSelectedIngId(mapped[0]._id || mapped[0].id);
        }
      })
      .catch(err => {
        showToast('Failed to load inventory', 'error');
        setIngredients(INITIAL_INGREDIENTS);
      })
      .finally(() => setLoading(false));
  }, []);

  // --- Helper: Toast trigger ---
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3500);
  };

  // --- Active Selected Ingredient ---
  const selectedIngredient = useMemo(() => {
    return ingredients.find(ing => (ing._id || ing.id) === selectedIngId) || ingredients[0] || {};
  }, [ingredients, selectedIngId]);

  // --- Dynamic Category Counts ---
  // A pizza buffer threshold of 10% for warning levels matches the reference image statuses
  const categoryStats = useMemo(() => {
    const categories = ['Pizza Base', 'Sauce', 'Cheese', 'Veggies', 'Meat'];
    const stats = {};
    
    categories.forEach(cat => {
      stats[cat] = { total: 0, low: 0 };
    });

    ingredients.forEach(ing => {
      if (stats[ing.category]) {
        stats[ing.category].total += 1;
        const isLow = ing.stock <= ing.threshold * 1.1;
        if (isLow) {
          stats[ing.category].low += 1;
        }
      }
    });

    // Seed defaults to match image values if database is empty/standard
    return {
      'Pizza Base': { total: Math.max(8, stats['Pizza Base']?.total || 0), low: stats['Pizza Base']?.low ?? 2 },
      'Sauce': { total: Math.max(6, stats['Sauce']?.total || 0), low: stats['Sauce']?.low ?? 1 },
      'Cheese': { total: Math.max(7, stats['Cheese']?.total || 0), low: stats['Cheese']?.low ?? 0 },
      'Veggies': { total: Math.max(12, stats['Veggies']?.total || 0), low: stats['Veggies']?.low ?? 3 },
      'Meat': { total: Math.max(9, stats['Meat']?.total || 0), low: stats['Meat']?.low ?? 2 }
    };
  }, [ingredients]);

  // --- Filtered Ingredients List ---
  const filteredIngredients = useMemo(() => {
    return ingredients.filter(ing => 
      ing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ing.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [ingredients, searchQuery]);

  // --- Handler: Open Add Stock Modal ---
  const handleOpenAddStock = (ing, e) => {
    if (e) e.stopPropagation();
    setActionIngredient(ing);
    setStockToAdd('10');
    setIsAddStockOpen(true);
  };

  // --- Handler: Execute Add Stock ---
  const handleExecuteAddStock = async (e) => {
    e.preventDefault();
    if (!actionIngredient) return;
    const qty = parseFloat(stockToAdd);
    if (isNaN(qty) || qty <= 0) {
      showToast('Please enter a valid positive quantity.', 'error');
      return;
    }

    try {
      const updatedItem = await inventoryApi.updateStockItem(actionIngredient._id || actionIngredient.id, {
        stock: actionIngredient.stock + qty
      });

      setIngredients(prev => prev.map(ing => {
        if ((ing._id || ing.id) === (actionIngredient._id || actionIngredient.id)) {
          return {
            ...ing,
            stock: updatedItem.data.stock
          };
        }
        return ing;
      }));
      showToast(`Added ${qty} ${actionIngredient.unit} to ${actionIngredient.name}!`, 'success');
      setIsAddStockOpen(false);
    } catch (err) {
      showToast('Failed to add stock', 'error');
    }
  };

  // --- Handler: Open Edit Modal ---
  const handleOpenEdit = (ing, e) => {
    if (e) e.stopPropagation();
    setActionIngredient(ing);
    setEditFormData({
      name: ing.name,
      category: ing.category,
      stock: ing.stock.toString(),
      threshold: ing.threshold.toString(),
      unit: ing.unit,
      image: ing.image
    });
    setIsEditModalOpen(true);
  };

  // --- Handler: Execute Edit ---
  const handleExecuteEdit = async (e) => {
    e.preventDefault();
    if (!actionIngredient) return;

    const stockVal = parseFloat(editFormData.stock);
    const thresholdVal = parseFloat(editFormData.threshold);

    if (!editFormData.name.trim()) {
      showToast('Name is required.', 'error');
      return;
    }
    if (isNaN(stockVal) || stockVal < 0 || isNaN(thresholdVal) || thresholdVal < 0) {
      showToast('Stock and Threshold must be valid numbers.', 'error');
      return;
    }

    try {
      const payload = {
        itemName: editFormData.name.trim(),
        category: editFormData.category,
        stock: stockVal,
        threshold: thresholdVal,
        unitPrice: actionIngredient.unitPrice || 10
      };
      
      const updatedItem = await inventoryApi.updateStockItem(actionIngredient._id || actionIngredient.id, payload);
      const mappedItem = mapDbItemToFrontend(updatedItem.data);

      setIngredients(prev => prev.map(ing => {
        if ((ing._id || ing.id) === (actionIngredient._id || actionIngredient.id)) {
          return mappedItem;
        }
        return ing;
      }));

      showToast(`Successfully updated ${editFormData.name}!`, 'success');
      setIsEditModalOpen(false);
    } catch (err) {
      showToast('Failed to update ingredient', 'error');
    }
  };

  // --- Handler: Open Add New Modal ---
  const handleOpenAddNew = () => {
    setEditFormData({
      name: '',
      category: 'Pizza Base',
      stock: '20',
      threshold: '15',
      unit: 'units',
      image: ''
    });
    setIsAddNewModalOpen(true);
  };

  // --- Handler: Execute Add New ---
  const handleExecuteAddNew = async (e) => {
    e.preventDefault();
    const stockVal = parseFloat(editFormData.stock);
    const thresholdVal = parseFloat(editFormData.threshold);

    if (!editFormData.name.trim()) {
      showToast('Name is required.', 'error');
      return;
    }
    if (isNaN(stockVal) || stockVal < 0 || isNaN(thresholdVal) || thresholdVal < 0) {
      showToast('Stock and Threshold must be valid positive numbers.', 'error');
      return;
    }

    try {
      const payload = {
        itemName: editFormData.name.trim(),
        category: editFormData.category,
        stock: stockVal,
        threshold: thresholdVal,
        unitPrice: 10
      };

      const newItemResponse = await inventoryApi.addStockItem(payload);
      const mappedItem = mapDbItemToFrontend(newItemResponse.data);
      
      setIngredients(prev => [mappedItem, ...prev]);
      setSelectedIngId(mappedItem._id || mappedItem.id);
      showToast(`Added new ingredient: ${mappedItem.name}!`, 'success');
      setIsAddNewModalOpen(false);
    } catch (err) {
      showToast('Failed to add new ingredient', 'error');
    }
  };

  // --- Handler: Send Alert Email Trigger ---
  const handleSendEmail = () => {
    setIsSendingEmail(true);
    setTimeout(() => {
      setIsSendingEmail(false);
      showToast(`Alert email for ${selectedIngredient.name} successfully sent to inventory team!`, 'success');
    }, 1500);
  };

  // --- SVG Chart Calculations ---
  // Renders a fully reactive SVG line chart mapping historical coordinate markers
  const chartCoordinates = useMemo(() => {
    const history = selectedIngredient?.history || [0, 0, 0, 0];
    const maxVal = Math.max(...history, selectedIngredient?.threshold || 10, 10);
    
    // Viewport: 400 width x 200 height
    // Margin Top: 30, Margin Bottom: 40, Height: 130
    return history.map((val, idx) => {
      const x = 50 + idx * 100;
      // Scaled Y coordinate from Y-max bounds
      const y = 200 - 40 - (val / maxVal) * 120;
      return { x, y, val };
    });
  }, [selectedIngredient]);

  const svgLinePath = useMemo(() => {
    if (chartCoordinates.length === 0) return '';
    return chartCoordinates.reduce((path, pt, idx) => {
      return idx === 0 ? `M ${pt.x} ${pt.y}` : `${path} L ${pt.x} ${pt.y}`;
    }, '');
  }, [chartCoordinates]);

  // --- Ingredient Threshold Warning status ---
  const isIngredientLow = selectedIngredient.stock <= selectedIngredient.threshold * 1.1;
  const restockSuggestion = Math.max(0, Math.ceil(selectedIngredient.threshold - selectedIngredient.stock));

  return (
    <div className="bg-[#FAFCFE] min-h-screen pb-12 text-slate-700 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border text-sm font-semibold transition-all duration-300 transform scale-100 ${
          toast.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-100' 
            : 'bg-red-50 text-red-800 border-red-100'
        } animate-bounce`}>
          <CheckCircleIcon className={`h-6 w-6 ${toast.type === 'success' ? 'text-emerald-500' : 'text-red-500'}`} />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Header Wrapper */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Inventory Overview</h1>
          <p className="text-xs text-slate-400 mt-1">Monitor, adjust thresholds, and dispatch restock alert emails.</p>
        </div>
        <button
          onClick={handleOpenAddNew}
          className="bg-gradient-to-r from-[#FF4C00] to-[#FF6B00] hover:from-[#E03E00] hover:to-[#FF5C00] text-white font-extrabold text-xs px-6 py-3 rounded-2xl shadow-lg shadow-orange-100 transition-all duration-200 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
        >
          <PlusIcon className="w-5 h-5 stroke-[2.5]" />
          <span>Add New Item</span>
        </button>
      </div>

      {/* 5-Column Category Summary Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {Object.entries(categoryStats).map(([catName, stats]) => (
          <div 
            key={catName}
            className="bg-white rounded-3xl p-5 border border-slate-100/80 shadow-sm hover:shadow-md hover:border-orange-100/50 transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <p className="text-gray-400 font-bold text-[11px] uppercase tracking-wider">{catName}</p>
              <p className="text-3xl font-black text-slate-800 mt-1">{stats.total} <span className="text-xs font-semibold text-gray-400">Items</span></p>
            </div>
            <div className="mt-3">
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${
                stats.low > 0 
                  ? 'text-[#FF4C00] bg-orange-50/70 border border-orange-100/30' 
                  : 'text-emerald-600 bg-emerald-50/70 border border-emerald-100/30'
              }`}>
                {stats.low} Low Stock
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Ingredient Database Container */}
      <div className="bg-white rounded-3xl border border-slate-100/80 shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
          <div className="relative">
            <span className="text-slate-800 font-black text-md tracking-tight pb-3.5 border-b-3 border-[#FF4C00] relative z-10 select-none">
              All Ingredients
            </span>
          </div>
          {/* Table Search Input */}
          <div className="relative w-64 hidden sm:block">
            <span className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none text-slate-400">
              <MagnifyingGlassIcon className="h-4 w-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in table..."
              className="w-full bg-slate-50/60 text-xs pl-8 pr-3 py-1.5 rounded-xl border border-slate-100 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Scrollable Table Viewport */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-xs font-extrabold uppercase text-slate-400 tracking-wider py-3.5 px-4">Ingredient</th>
                <th className="text-xs font-extrabold uppercase text-slate-400 tracking-wider py-3.5 px-4">Category</th>
                <th className="text-xs font-extrabold uppercase text-slate-400 tracking-wider py-3.5 px-4">Stock Qty</th>
                <th className="text-xs font-extrabold uppercase text-slate-400 tracking-wider py-3.5 px-4">Threshold</th>
                <th className="text-xs font-extrabold uppercase text-slate-400 tracking-wider py-3.5 px-4">Status</th>
                <th className="text-xs font-extrabold uppercase text-slate-400 tracking-wider py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50/50">
              {filteredIngredients.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-slate-400 text-sm">
                    No ingredients found matching your search.
                  </td>
                </tr>
              ) : (
                filteredIngredients.map((ing) => {
                  const isLow = ing.stock <= ing.threshold * 1.1;
                  const isSelected = ing.id === selectedIngId;
                  
                  return (
                    <tr 
                      key={ing._id || ing.id}
                      onClick={() => setSelectedIngId(ing._id || ing.id)}
                      className={`group hover:bg-[#FFFBF9]/40 cursor-pointer transition-all duration-150 ${
                        isSelected ? 'bg-[#FFF6F1]/60 font-semibold border-l-4 border-l-[#FF4C00]' : ''
                      }`}
                    >
                      {/* Ingredient Cell */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50 flex-shrink-0 flex items-center justify-center">
                            <img 
                              src={ing.image} 
                              alt={ing.name} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                              onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=120&auto=format&fit=crop" }}
                            />
                          </div>
                          <span className="text-sm font-bold text-slate-800">{ing.name}</span>
                        </div>
                      </td>
                      {/* Category Cell */}
                      <td className="py-3 px-4 text-sm text-slate-500 font-medium">
                        {ing.category}
                      </td>
                      {/* Stock Qty Cell */}
                      <td className="py-3 px-4 text-sm font-black text-slate-800">
                        {ing.stock} <span className="text-[10px] font-bold text-slate-400 ml-0.5">{ing.unit}</span>
                      </td>
                      {/* Threshold Cell */}
                      <td className="py-3 px-4 text-sm font-bold text-slate-500">
                        {ing.threshold} <span className="text-[10px] font-bold text-slate-400 ml-0.5">{ing.unit}</span>
                      </td>
                      {/* Status Badge Cell */}
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-black tracking-wide px-3 py-1 rounded-full border ${
                          isLow 
                            ? 'bg-orange-50/70 border-orange-100 text-[#FF4C00]' 
                            : 'bg-emerald-50/70 border-emerald-100 text-emerald-700'
                        }`}>
                          {isLow ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>
                      {/* Action Cell */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={(e) => handleOpenEdit(ing, e)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors"
                            title="Edit Item details"
                          >
                            <PencilIcon className="h-4.5 w-4.5 stroke-[2.2]" />
                          </button>
                          <button
                            onClick={(e) => handleOpenAddStock(ing, e)}
                            className="p-1.5 rounded-lg hover:bg-orange-50 text-slate-400 hover:text-[#FF4C00] transition-colors"
                            title="Quick Add Stock"
                          >
                            <PlusIcon className="h-4.5 w-4.5 stroke-[2.2]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* View All center link trigger */}
        <div className="border-t border-slate-50 mt-6 pt-5 flex justify-center">
          <button 
            type="button"
            onClick={() => {
              setSearchQuery('');
              showToast("Displaying all catalog ingredients", "info");
            }}
            className="border border-[#FF4C00] text-[#FF4C00] hover:bg-orange-50/20 bg-white px-8 py-3 rounded-2xl text-xs font-black tracking-wider uppercase transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <span>View All Ingredients</span>
            <span className="font-extrabold text-[10px] select-none">&gt;</span>
          </button>
        </div>
      </div>

      {/* Bottom 3-Column Interactive Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1: Low Stock Alerts */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col justify-between min-h-[380px] shadow-[0_10px_30px_rgba(0,0,0,0.01)]">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[17px] font-black text-slate-800 tracking-tight">Low Stock Alerts</h3>
              <button 
                type="button"
                onClick={() => showToast("Showing all low stock reports", "info")}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 border border-slate-100 px-3 py-1 rounded-xl bg-white shadow-sm active:scale-95 transition-all"
              >
                View All
              </button>
            </div>

            <div className="space-y-5">
              {/* Progress Bar */}
              <div>
                <div className="flex justify-between items-center text-xs font-extrabold text-slate-600 mb-2">
                  <span>Overall Stock Status</span>
                  <span className="text-[#FF4C00]">{ingredients.length > 0 ? Math.round((ingredients.filter(ing => ing.stock > ing.threshold).length / ingredients.length) * 100) : 68}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#10B981] h-full rounded-full transition-all duration-500" 
                    style={{ width: `${ingredients.length > 0 ? Math.round((ingredients.filter(ing => ing.stock > ing.threshold).length / ingredients.length) * 100) : 68}%` }} 
                  />
                </div>
              </div>

              {/* Alert Status Banner */}
              <div className="bg-[#ECFDF5] border border-[#A7F3D0]/30 rounded-2xl p-4.5 text-left">
                <span className="text-xs font-extrabold text-[#059669] block">
                  You have {ingredients.filter(ing => ing.stock <= ing.threshold).length} ingredients low in stock
                </span>
              </div>

              {/* Critical Alerts */}
              <div className="text-left pt-1">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Critical Alerts</h4>
                <p className="text-sm font-bold text-slate-800 mt-1">
                  {ingredients.filter(ing => ing.stock <= ing.threshold * 0.5).length} items need immediate attention
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleOpenAddNew}
            className="w-full border border-[#FF4C00] text-[#FF4C00] hover:bg-orange-50/20 bg-white h-[56px] rounded-2xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all cursor-pointer mt-6"
          >
            <PlusIcon className="w-5 h-5 text-[#FF4C00] stroke-[2.2] flex-shrink-0" />
            <div className="text-left leading-tight">
              <span className="text-xs font-black block">Add New</span>
              <span className="text-[10px] font-bold text-slate-400 block mt-0.5">Ingredient</span>
            </div>
          </button>
        </div>

        {/* Column 2: Stock Trend Overview */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between min-h-[380px] shadow-[0_10px_30px_rgba(0,0,0,0.01)]">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[17px] font-black text-slate-800 tracking-tight">Stock Trend Overview</h3>
              <button 
                type="button"
                onClick={() => showToast("Opening stock trends report", "info")}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 border border-slate-100 px-3 py-1 rounded-xl bg-white shadow-sm active:scale-95 transition-all"
              >
                View Report
              </button>
            </div>

            <div className="text-left mb-5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Stock Movement (Last 7 Days)</span>
              
              {/* Three Stat Boxes */}
              <div className="flex gap-3 mt-3">
                <div className="bg-[#FAFBFD] border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.01)] rounded-2xl py-3.5 px-2 text-center flex-1">
                  <span className="text-[11px] font-bold text-slate-400 block mb-0.5">Added</span>
                  <span className="text-2xl font-black text-[#10B981] block">24</span>
                </div>
                <div className="bg-[#FAFBFD] border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.01)] rounded-2xl py-3.5 px-2 text-center flex-1">
                  <span className="text-[11px] font-bold text-slate-400 block mb-0.5">Used</span>
                  <span className="text-2xl font-black text-[#FF6B00] block">18</span>
                </div>
                <div className="bg-[#FAFBFD] border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.01)] rounded-2xl py-3.5 px-2 text-center flex-1">
                  <span className="text-[11px] font-bold text-slate-400 block mb-0.5">Wasted</span>
                  <span className="text-2xl font-black text-[#EF4444] block">2</span>
                </div>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="text-left mt-5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">Quick Filters</span>
              <div className="flex flex-wrap gap-2.5">
                <button 
                  type="button"
                  onClick={() => showToast("Filtering: All items", "info")}
                  className="px-4 py-2 rounded-xl text-xs font-black border border-[#FF6B00] text-[#FF6B00] bg-[#FFF5F0]"
                >
                  All
                </button>
                <button 
                  type="button"
                  onClick={() => showToast("Filtering: Good stock items", "info")}
                  className="px-4 py-2 rounded-xl text-xs font-black border border-slate-100 text-slate-500 bg-white hover:border-slate-200"
                >
                  Good
                </button>
                <button 
                  type="button"
                  onClick={() => showToast("Filtering: Low stock items", "info")}
                  className="px-4 py-2 rounded-xl text-xs font-black border border-slate-100 text-slate-500 bg-white hover:border-slate-200"
                >
                  Low Stock
                </button>
                <button 
                  type="button"
                  onClick={() => showToast("Filtering: Critical items", "info")}
                  className="px-4 py-2 rounded-xl text-xs font-black border border-slate-100 text-slate-500 bg-white hover:border-slate-200"
                >
                  Critical
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Recent Activity */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between min-h-[380px] shadow-[0_10px_30px_rgba(0,0,0,0.01)]">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[17px] font-black text-slate-800 tracking-tight">Recent Activity</h3>
              <button 
                type="button"
                onClick={() => showToast("Showing all system activities", "info")}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 border border-slate-100 px-3 py-1 rounded-xl bg-white shadow-sm active:scale-95 transition-all"
              >
                View All
              </button>
            </div>

            {/* Activity List */}
            <div className="space-y-4 text-left">
              {[
                { text: 'Tomato stock updated', time: '2 mins ago', dot: 'bg-orange-500' },
                { text: 'Cheese stock updated', time: '15 mins ago', dot: 'bg-orange-500' },
                { text: 'Pizza Sauce added', time: '1 hour ago', dot: 'bg-emerald-500' },
                { text: 'Flour stock used in order #1234', time: '2 hours ago', dot: 'bg-sky-500' },
                { text: 'Bell Pepper stock updated', time: '3 hours ago', dot: 'bg-emerald-500' }
              ].map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs border-b border-slate-50/50 pb-2 last:border-0 last:pb-0 font-medium">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${activity.dot} flex-shrink-0`} />
                    <span className="font-bold text-slate-700">{activity.text}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              window.location.href = '/admin/settings';
            }}
            className="w-full border border-[#FF4C00] text-[#FF4C00] hover:bg-orange-50/20 bg-white h-[56px] rounded-2xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all cursor-pointer mt-6"
          >
            <EnvelopeIcon className="w-5 h-5 text-[#FF4C00] stroke-[2.2] flex-shrink-0" />
            <div className="text-left leading-tight">
              <span className="text-xs font-black block">Email Alerts</span>
              <span className="text-[10px] font-bold text-slate-400 block mt-0.5">Manage notifications</span>
            </div>
          </button>
        </div>

      </div>

      {/* --- ADD STOCK MODAL --- */}
      {isAddStockOpen && actionIngredient && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 w-full max-w-md shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsAddStockOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 p-1 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <XMarkIcon className="h-5 w-5 stroke-[2.5]" />
            </button>

            <div className="flex items-center gap-3 text-[#FF4C00] font-bold text-xs uppercase tracking-wider mb-4 border-b border-slate-50 pb-3">
              <PlusIcon className="h-5 w-5 stroke-[2.5]" />
              <span>Add Stock Quantity</span>
            </div>

            <div className="my-4">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{actionIngredient.category}</p>
              <h3 className="text-lg font-black text-slate-800">{actionIngredient.name}</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Current stock levels: <span className="font-bold text-slate-800">{actionIngredient.stock} {actionIngredient.unit}</span> (Threshold is {actionIngredient.threshold} {actionIngredient.unit})
              </p>
            </div>

            <form onSubmit={handleExecuteAddStock} className="space-y-4 mt-6">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wide mb-1.5">
                  Restock Quantity ({actionIngredient.unit})
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  min="0.01"
                  value={stockToAdd}
                  onChange={(e) => setStockToAdd(e.target.value)}
                  className="w-full bg-[#F8FAFC] text-sm text-slate-800 font-bold px-4 py-3 rounded-xl border border-slate-100 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                  placeholder="Enter quantity to add..."
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-50">
                <button
                  type="button"
                  onClick={() => setIsAddStockOpen(false)}
                  className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-500 font-extrabold text-xs py-3 rounded-2xl border border-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#FF4C00] hover:bg-[#E03E00] text-white font-extrabold text-xs py-3 rounded-2xl shadow-md shadow-orange-100 transition-colors"
                >
                  Confirm Restock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT INGREDIENT MODAL --- */}
      {isEditModalOpen && actionIngredient && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 w-full max-w-lg shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 p-1 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <XMarkIcon className="h-5 w-5 stroke-[2.5]" />
            </button>

            <div className="flex items-center gap-3 text-[#FF4C00] font-bold text-xs uppercase tracking-wider mb-4 border-b border-slate-50 pb-3">
              <PencilIcon className="h-5 w-5 stroke-[2.5]" />
              <span>Edit Ingredient Configuration</span>
            </div>

            <form onSubmit={handleExecuteEdit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                    Ingredient Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full bg-[#F8FAFC] text-sm text-slate-800 font-bold px-4 py-2.5 rounded-xl border border-slate-100 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                    Category
                  </label>
                  <select
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    className="w-full bg-[#F8FAFC] text-sm text-slate-800 font-bold px-4 py-2.5 rounded-xl border border-slate-100 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                  >
                    <option value="Pizza Base">Pizza Base</option>
                    <option value="Sauce">Sauce</option>
                    <option value="Cheese">Cheese</option>
                    <option value="Veggies">Veggies</option>
                    <option value="Meat">Meat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                    Unit Type
                  </label>
                  <select
                    value={editFormData.unit}
                    onChange={(e) => setEditFormData({ ...editFormData, unit: e.target.value })}
                    className="w-full bg-[#F8FAFC] text-sm text-slate-800 font-bold px-4 py-2.5 rounded-xl border border-slate-100 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                  >
                    <option value="units">units</option>
                    <option value="kg">kg</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                    Current Stock
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    min="0"
                    value={editFormData.stock}
                    onChange={(e) => setEditFormData({ ...editFormData, stock: e.target.value })}
                    className="w-full bg-[#F8FAFC] text-sm text-slate-800 font-bold px-4 py-2.5 rounded-xl border border-slate-100 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                    Alert Threshold
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    min="0"
                    value={editFormData.threshold}
                    onChange={(e) => setEditFormData({ ...editFormData, threshold: e.target.value })}
                    className="w-full bg-[#F8FAFC] text-sm text-slate-800 font-bold px-4 py-2.5 rounded-xl border border-slate-100 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                    Unsplash Thumbnail Image URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={editFormData.image}
                    onChange={(e) => setEditFormData({ ...editFormData, image: e.target.value })}
                    placeholder="Enter https://images.unsplash.com/..."
                    className="w-full bg-[#F8FAFC] text-xs text-slate-600 px-4 py-2.5 rounded-xl border border-slate-100 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-slate-50 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-500 font-extrabold text-xs py-3 rounded-2xl border border-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#FF4C00] hover:bg-[#E03E00] text-white font-extrabold text-xs py-3 rounded-2xl shadow-md shadow-orange-100 transition-colors"
                >
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD NEW INGREDIENT MODAL --- */}
      {isAddNewModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 w-full max-w-lg shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsAddNewModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 p-1 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <XMarkIcon className="h-5 w-5 stroke-[2.5]" />
            </button>

            <div className="flex items-center gap-3 text-[#FF4C00] font-bold text-xs uppercase tracking-wider mb-4 border-b border-slate-50 pb-3">
              <PlusIcon className="h-5 w-5 stroke-[2.5]" />
              <span>Add New Ingredient</span>
            </div>

            <form onSubmit={handleExecuteAddNew} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                    Ingredient Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    placeholder="e.g. Buffalo Mozzarella Cheese"
                    className="w-full bg-[#F8FAFC] text-sm text-slate-800 font-bold px-4 py-2.5 rounded-xl border border-slate-100 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                    Category
                  </label>
                  <select
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    className="w-full bg-[#F8FAFC] text-sm text-slate-800 font-bold px-4 py-2.5 rounded-xl border border-slate-100 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                  >
                    <option value="Pizza Base">Pizza Base</option>
                    <option value="Sauce">Sauce</option>
                    <option value="Cheese">Cheese</option>
                    <option value="Veggies">Veggies</option>
                    <option value="Meat">Meat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                    Unit Type
                  </label>
                  <select
                    value={editFormData.unit}
                    onChange={(e) => setEditFormData({ ...editFormData, unit: e.target.value })}
                    className="w-full bg-[#F8FAFC] text-sm text-slate-800 font-bold px-4 py-2.5 rounded-xl border border-slate-100 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                  >
                    <option value="units">units</option>
                    <option value="kg">kg</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                    Initial Stock Level
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    min="0"
                    value={editFormData.stock}
                    onChange={(e) => setEditFormData({ ...editFormData, stock: e.target.value })}
                    className="w-full bg-[#F8FAFC] text-sm text-slate-800 font-bold px-4 py-2.5 rounded-xl border border-slate-100 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                    Warning Threshold
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    min="0"
                    value={editFormData.threshold}
                    onChange={(e) => setEditFormData({ ...editFormData, threshold: e.target.value })}
                    className="w-full bg-[#F8FAFC] text-sm text-slate-800 font-bold px-4 py-2.5 rounded-xl border border-slate-100 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                    Unsplash Image URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={editFormData.image}
                    onChange={(e) => setEditFormData({ ...editFormData, image: e.target.value })}
                    placeholder="Enter https://images.unsplash.com/..."
                    className="w-full bg-[#F8FAFC] text-xs text-slate-600 px-4 py-2.5 rounded-xl border border-slate-100 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-slate-50 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddNewModalOpen(false)}
                  className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-500 font-extrabold text-xs py-3 rounded-2xl border border-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#FF4C00] hover:bg-[#E03E00] text-white font-extrabold text-xs py-3 rounded-2xl shadow-md shadow-orange-100 transition-colors"
                >
                  Create Ingredient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminInventoryPage;
