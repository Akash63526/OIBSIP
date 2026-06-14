import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, updateQuantity } from '../../features/cart/cartSlice';
import Toast from '../../components/ui/Toast';
import { MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import { getMenu } from '../../api/menuApi';

// Mock combos exactly matching the combos tab layout
const MOCK_COMBOS = [
  {
    _id: 'c1',
    name: 'Ultimate Party Combo',
    description: '2 Medium Signature Pizzas + 1 Garlic Breadsticks + 1 Coca-Cola (1.25L)',
    basePrice: 699,
    rating: 4.9,
    totalReviews: 850,
    image: '/images/Signature_Veg_Pizzas/Farmhouse_Supreme.jpg',
    category: 'pasta', // maps to Pasta & Mains category card
    isVeg: true,
    isBestSeller: true,
    preparationTime: 25
  },
  {
    _id: 'c2',
    name: 'Family Feast Combo',
    description: '1 Large Paneer Supreme Pizza + 1 Stuffed Garlic Bread + 1 Choco Lava Cake + Pepsi (500ml)',
    basePrice: 549,
    rating: 4.8,
    totalReviews: 640,
    image: '/images/Signature_Veg_Pizzas/Tandoori_Paneer.jpg',
    category: 'pasta', // maps to Pasta & Mains category card
    isVeg: true,
    isBestSeller: true,
    preparationTime: 20
  },
  {
    _id: 'c3',
    name: 'Mega Non-Veg Feast',
    description: '1 Large Chicken Dominator Pizza + 1 Chicken Wings (6pcs) + 1 Sprite (1.25L)',
    basePrice: 799,
    rating: 4.9,
    totalReviews: 920,
    image: '/images/Signature_Non-Veg_Pizzas/Chicken_Dominator.jpg',
    category: 'pasta',
    isVeg: false,
    isBestSeller: true,
    preparationTime: 25
  }
];

const MenuPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const [toast, setToast] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Category cards: 'all', 'veg-pizza', 'nonveg-pizza', 'garlic-bread', 'pasta', 'desserts', 'beverages', 'top-rated'
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Filter chips: 'all', 'veg', 'non-veg', 'cheese', 'sides', 'pasta', 'desserts', 'beverages'
  const [activeFilterChip, setActiveFilterChip] = useState('all');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popularity'); // 'popularity', 'price-low', 'price-high', 'rating', 'newest'

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const data = await getMenu();
        if (data && data.length > 0) {
          setMenuItems(data);
        }
      } catch (err) {
        console.error('Failed to load menu items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const handleAddToCart = (item) => {
    dispatch(addToCart({ 
      pizzaId: item._id, 
      name: item.name, 
      price: item.basePrice, 
      quantity: 1, 
      image: item.image,
      isCustom: false
    }));
    setToast(`${item.name} added to cart!`);
  };

  // Redux cart selector
  const getCartItemDetails = (itemId) => {
    const index = cartItems.findIndex(item => item.pizzaId === itemId && !item.isCustom);
    if (index >= 0) {
      return { index, quantity: cartItems[index].quantity };
    }
    return null;
  };

  // Helper to get deterministic rating & review count for items
  const getRatingDetails = (item) => {
    // If database already has a customized rating/reviews, use it; otherwise compute realistic values
    const rating = item.rating && item.rating !== 4.5 
      ? item.rating 
      : (4.3 + (item.name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 6) * 0.1).toFixed(1);
    
    const rawReviews = item.totalReviews && item.totalReviews > 0
      ? item.totalReviews
      : (120 + (item.name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 18) * 110);
    
    const reviewsStr = rawReviews >= 1000 
      ? (rawReviews / 1000).toFixed(1) + 'K' 
      : rawReviews;
      
    return { rating, reviewsStr };
  };

  // Helper to calculate premium price design: current, original (30-40% markup) and discount percent
  const getPriceDetails = (item) => {
    const currentPrice = Math.round(item.basePrice);
    
    // Deterministic discount percentage between 20% and 35% based on product ID/name
    const discountPercent = 20 + (item.name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 4) * 5; 
    
    const originalPrice = Math.round(currentPrice / (1 - discountPercent / 100));
    
    return { currentPrice, originalPrice, discountPercent };
  };

  // 1. Combine backend menu items and mock combos
  const allItems = [...menuItems, ...MOCK_COMBOS];

  // 2. Filter by Category Card selection
  let filtered = allItems;
  if (activeCategory === 'veg-pizza') {
    filtered = filtered.filter(item => item.category === 'veg-pizza');
  } else if (activeCategory === 'nonveg-pizza') {
    filtered = filtered.filter(item => item.category === 'nonveg-pizza');
  } else if (activeCategory === 'garlic-bread') {
    // Sides that are garlic bread or similar sides
    filtered = filtered.filter(item => item.category === 'sides');
  } else if (activeCategory === 'pasta') {
    // Pasta & combos (Mains)
    filtered = filtered.filter(item => item.category === 'pasta' || item.category === 'combos');
  } else if (activeCategory === 'desserts') {
    filtered = filtered.filter(item => item.category === 'desserts');
  } else if (activeCategory === 'beverages') {
    filtered = filtered.filter(item => item.category === 'beverages');
  } else if (activeCategory === 'top-rated') {
    filtered = filtered.filter(item => {
      const { rating } = getRatingDetails(item);
      return parseFloat(rating) >= 4.7 || item.isBestSeller || item.isFeatured;
    });
  }

  // 3. Filter by Filter Chip selection
  if (activeFilterChip === 'veg') {
    filtered = filtered.filter(item => item.isVeg);
  } else if (activeFilterChip === 'non-veg') {
    filtered = filtered.filter(item => !item.isVeg);
  } else if (activeFilterChip === 'cheese') {
    filtered = filtered.filter(item => 
      item.name.toLowerCase().includes('cheese') || 
      item.description?.toLowerCase().includes('cheese') ||
      item.description?.toLowerCase().includes('mozzarella')
    );
  } else if (activeFilterChip === 'sides') {
    filtered = filtered.filter(item => item.category === 'sides');
  } else if (activeFilterChip === 'pasta') {
    filtered = filtered.filter(item => item.category === 'pasta');
  } else if (activeFilterChip === 'desserts') {
    filtered = filtered.filter(item => item.category === 'desserts');
  } else if (activeFilterChip === 'beverages') {
    filtered = filtered.filter(item => item.category === 'beverages');
  }

  // 4. Filter by Search Query
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(item => 
      item.name.toLowerCase().includes(q) || 
      item.description?.toLowerCase().includes(q)
    );
  }

  // 5. Apply Sorting
  const sortedItems = [...filtered];
  if (sortBy === 'price-low') {
    sortedItems.sort((a, b) => a.basePrice - b.basePrice);
  } else if (sortBy === 'price-high') {
    sortedItems.sort((a, b) => b.basePrice - a.basePrice);
  } else if (sortBy === 'rating') {
    sortedItems.sort((a, b) => {
      const rA = parseFloat(getRatingDetails(a).rating);
      const rB = parseFloat(getRatingDetails(b).rating);
      return rB - rA;
    });
  } else if (sortBy === 'popularity') {
    sortedItems.sort((a, b) => {
      if (a.isBestSeller && !b.isBestSeller) return -1;
      if (!a.isBestSeller && b.isBestSeller) return 1;
      const rA = parseFloat(getRatingDetails(a).rating);
      const rB = parseFloat(getRatingDetails(b).rating);
      return rB - rA;
    });
  } else if (sortBy === 'newest') {
    // Show newer items or reverse
    sortedItems.sort((a, b) => b._id.toString().localeCompare(a._id.toString()));
  }

  // Category visual metadata
  const categoryCards = [
    { id: 'all', label: 'All Menu', icon: '🍽️' },
    { id: 'veg-pizza', label: 'Veg Pizza', icon: '🍕' },
    { id: 'nonveg-pizza', label: 'Non-Veg Pizza', icon: '🍗' },
    { id: 'garlic-bread', label: 'Garlic Bread', icon: '🥖' },
    { id: 'pasta', label: 'Pasta & Mains', icon: '🍜' },
    { id: 'desserts', label: 'Desserts', icon: '🍰' },
    { id: 'beverages', label: 'Beverages', icon: '🥤' },
    { id: 'top-rated', label: 'Top Rated', icon: '⭐' }
  ];

  // Filter chips metadata
  const filterChips = [
    { id: 'all', label: 'All' },
    { id: 'veg', label: 'Veg' },
    { id: 'non-veg', label: 'Non-Veg' },
    { id: 'cheese', label: 'Cheese' },
    { id: 'sides', label: 'Sides' },
    { id: 'pasta', label: 'Pasta' },
    { id: 'desserts', label: 'Desserts' },
    { id: 'beverages', label: 'Beverages' }
  ];

  // Helper title for active category
  const getCategoryTitle = () => {
    switch (activeCategory) {
      case 'veg-pizza': return 'Delicious Veggie Pizzas';
      case 'nonveg-pizza': return 'Premium Meat Lovers Pizzas';
      case 'garlic-bread': return 'Warm Garlic Breads & Sides';
      case 'pasta': return 'Pasta Plates & Signature Combos';
      case 'desserts': return 'Heavenly Desserts & Sweets';
      case 'beverages': return 'Ice-Cold Beverages';
      case 'top-rated': return 'Top Rated Fan Favorites';
      default: return 'Explore Our Complete Menu';
    }
  };

  const getCategorySubtitle = () => {
    switch (activeCategory) {
      case 'veg-pizza': return 'Handcrafted with fresh garden vegetables, rich signature sauce, and cheese overload';
      case 'nonveg-pizza': return 'Juicy tandoori chicken, grilled sausages, bacon, and pepperoni on crispy golden crusts';
      case 'garlic-bread': return 'Baked fresh to order with pure garlic butter, melted cheese, and aromatic Italian herbs';
      case 'pasta': return 'Rich cream sauces, tangy tomatoes, and loaded multi-item family saving combos';
      case 'desserts': return 'Molten chocolate lava, fudgy brownies, and creamy cheesecake slices to end your feast';
      case 'beverages': return 'Chilled soft drinks, iced tea, and creamy cold coffees delivered ice cold';
      case 'top-rated': return 'The absolute highest-rated dishes and crowd favorites as voted by our community';
      default: return 'Enjoy amazing discounts, fresh ingredients, and premium oven-baked slices delivered hot';
    }
  };

  return (
    <div className="bg-white min-h-screen pb-16 font-sans">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Brand Premium Hero Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#FFF8F3] via-white to-[#FFF8F3] rounded-[2rem] p-8 md:p-10 border border-orange-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.015)] mb-10 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative z-10 max-w-xl">
            <span className="inline-block bg-[#FF6B00]/10 text-[#FF6B00] text-xs font-black tracking-widest px-3 py-1 rounded-full uppercase mb-3">
              SliceSprint Menu
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-none mb-3">
              Fast. Fresh.<br className="hidden sm:inline" /> Delivered Hot.
            </h1>
            <p className="text-gray-500 font-bold text-sm sm:text-base leading-relaxed">
              Oven-fresh hand-tossed pizzas, baked sides, creamy mains, and refreshing desserts curated with premium local ingredients.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto relative z-10">
            {/* Search Input Box */}
            <div className="flex items-center bg-white rounded-full px-5 h-12 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-100 w-full sm:w-72 hover:border-orange-200 transition-all">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 mr-3" />
              <input 
                type="text" 
                placeholder="Search delicious food..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-sm font-bold text-gray-800 placeholder-gray-400 focus:ring-0"
              />
            </div>
            {/* Sort Dropdown Selector */}
            <div className="relative w-full sm:w-auto">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-52 appearance-none bg-white border border-gray-200 text-gray-700 text-sm font-extrabold py-3.5 pl-5 pr-12 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.02)] focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 cursor-pointer hover:border-orange-200 transition-all"
              >
                <option value="popularity">Sort by: Popularity</option>
                <option value="price-low">Sort by: Price: Low to High</option>
                <option value="price-high">Sort by: Price: High to Low</option>
                <option value="rating">Sort by: Top Rated</option>
                <option value="newest">Sort by: Newest</option>
              </select>
              <ChevronDownIcon className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none stroke-[2.5]" />
            </div>
          </div>
        </div>

        {/* Categories Grid Section */}
        <div className="mb-10">
          <h3 className="text-xs font-black tracking-widest text-gray-400 uppercase mb-4 pl-1">
            Browse Categories
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {categoryCards.map(cat => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setActiveFilterChip('all'); // reset sub-filter on category change
                  }}
                  className={`flex flex-col items-center justify-center p-4 rounded-[20px] border-2 transition-all duration-300 ${
                    isActive
                      ? 'border-[#FF6B00] bg-gradient-to-br from-orange-50/40 to-[#FFF3ED] text-[#FF6B00] shadow-[0_8px_25px_rgba(255,107,0,0.08)] scale-[1.03]'
                      : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 text-gray-700 hover:shadow-[0_8px_20px_rgba(0,0,0,0.02)]'
                  }`}
                >
                  <span className="text-3xl mb-2 transition-transform duration-300 group-hover:scale-110">{cat.icon}</span>
                  <span className={`text-[13px] tracking-tight text-center leading-tight ${isActive ? 'font-black' : 'font-bold'}`}>
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Chips Bar */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-none mb-10 border-b border-gray-100">
          <span className="text-sm font-black text-gray-700 mr-2 flex-shrink-0">Filters:</span>
          {filterChips.map(chip => {
            const isActive = activeFilterChip === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => setActiveFilterChip(chip.id)}
                className={`px-5 py-2 rounded-full text-[13px] font-black transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#FF6B00] text-white shadow-md shadow-orange-500/10'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* Main Grid Header */}
        <div className="mb-8 pl-1">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-none mb-2">
            {getCategoryTitle()}
          </h2>
          <p className="text-gray-400 font-bold text-sm sm:text-base">
            {getCategorySubtitle()}
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-24">
            <div className="inline-block animate-spin h-10 w-10 border-4 border-[#FF6B00] border-t-transparent rounded-full mb-4"></div>
            <p className="text-gray-400 font-extrabold text-sm tracking-wider uppercase">Loading SliceSprint Menu...</p>
          </div>
        ) : sortedItems.length === 0 ? (
          <div className="text-center py-20 bg-gray-50/50 rounded-[2rem] border border-dashed border-gray-200 max-w-xl mx-auto my-12 p-8 shadow-inner">
            <span className="text-5xl mb-4 block">🍽️</span>
            <h4 className="text-gray-900 font-black text-lg mb-1">No items found matching your filters</h4>
            <p className="text-gray-400 font-bold text-sm px-4">
              Try adjusting your search query, selecting another category card, or clearing the active filter chip.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setActiveFilterChip('all');
                setSearchQuery('');
              }}
              className="mt-6 bg-gradient-to-r from-[#FF8A00] to-[#FF6B00] text-white font-black text-xs px-6 py-3 rounded-full shadow-md hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {sortedItems.map(item => {
              const { rating, reviewsStr } = getRatingDetails(item);
              const { currentPrice, originalPrice, discountPercent } = getPriceDetails(item);
              const cartDetails = getCartItemDetails(item._id);

              return (
                <div 
                  key={item._id} 
                  className="bg-white rounded-[20px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.012)] border border-gray-100 hover:shadow-[0_20px_40px_rgba(0,0,0,0.055)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full group p-4 relative"
                >
                  {/* Image Section */}
                  <div className="h-52 overflow-hidden relative rounded-2xl mb-4 bg-gray-50">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    
                    {/* Badge Overlay: Ratings */}
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                      <span className="text-amber-500 text-xs font-black">★</span>
                      <span className="text-[11px] font-black text-gray-900 leading-none">{rating}</span>
                      <span className="text-[9px] font-bold text-gray-400 leading-none">({reviewsStr})</span>
                    </div>

                    {/* Badge Overlay: Veg/Non-Veg indicator */}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md p-1.5 rounded-full shadow-sm">
                      <div className={`w-4 h-4 border-2 rounded flex items-center justify-center ${item.isVeg ? 'border-green-600 bg-green-50/30' : 'border-red-600 bg-red-50/30'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
                      </div>
                    </div>

                    {/* Badge Overlay: Bestseller */}
                    {item.isBestSeller && (
                      <div className="absolute bottom-3 left-3">
                        <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-black tracking-wider px-2.5 py-1 rounded-md uppercase shadow-md">
                          Bestseller
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="flex-grow flex flex-col">
                    <div className="flex justify-between items-start mb-1.5">
                      <h3 className="text-lg font-black text-gray-900 tracking-tight leading-tight group-hover:text-[#FF6B00] transition-colors pr-2">
                        {item.name}
                      </h3>
                    </div>

                    <p className="text-[12.5px] font-semibold text-gray-400 line-clamp-2 h-9 leading-snug mb-4">
                      {item.description || 'Delicious freshly hand-tossed classic pizza.'}
                    </p>

                    {/* Preparation Time */}
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs font-bold mb-4 mt-auto">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                      <span>{item.preparationTime || 15} mins prep</span>
                    </div>

                    {/* Price and Cart Button Box */}
                    <div className="pt-3 border-t border-gray-50 flex flex-col gap-2">
                      {/* Price Section */}
                      <div className="flex items-baseline justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl sm:text-2xl font-black text-[#FF6B00]">
                            ₹{currentPrice}
                          </span>
                          <span className="text-sm font-bold text-gray-400 line-through">
                            ₹{originalPrice}
                          </span>
                        </div>
                        <span className="bg-orange-50 text-[#FF6B00] text-[10px] font-black px-2 py-0.5 rounded-md">
                          {discountPercent}% OFF
                        </span>
                      </div>

                      {/* Add to Cart Section */}
                      <div className="h-10 mt-1 flex items-center">
                        {cartDetails ? (
                          <div className="flex items-center justify-between bg-orange-50 border border-orange-200 rounded-xl p-1 w-full shadow-inner h-full">
                            <button 
                              onClick={() => dispatch(updateQuantity({ index: cartDetails.index, quantity: cartDetails.quantity - 1 }))}
                              className="w-8 h-8 flex items-center justify-center text-[#FF6B00] hover:bg-white rounded-lg font-black text-lg transition-all active:scale-90"
                            >
                              −
                            </button>
                            <span className="text-[#FF6B00] font-black text-sm">{cartDetails.quantity}</span>
                            <button 
                              onClick={() => dispatch(updateQuantity({ index: cartDetails.index, quantity: cartDetails.quantity + 1 }))}
                              className="w-8 h-8 flex items-center justify-center text-[#FF6B00] hover:bg-white rounded-lg font-black text-lg transition-all active:scale-90"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleAddToCart(item)}
                            className="w-full bg-gradient-to-r from-[#FF8A00] to-[#FF6B00] hover:from-[#e67c00] hover:to-[#e66000] text-white h-full rounded-xl font-black text-sm tracking-wide shadow-md shadow-orange-500/10 hover:shadow-orange-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-1"
                          >
                            Add <span className="text-base font-black leading-none mb-0.5">+</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Trust Indicators Support Bar */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-gray-100 pt-10">
          <div className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-orange-100/50 flex items-center justify-center text-[#FF6B00] text-xl flex-shrink-0 shadow-sm">
              🚴
            </div>
            <div>
              <h4 className="text-sm font-black text-gray-900 leading-tight">Fast Delivery</h4>
              <p className="text-[11px] font-bold text-gray-400 mt-0.5">10–20 mins hot & fresh</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-orange-100/50 flex items-center justify-center text-[#FF6B00] text-xl flex-shrink-0 shadow-sm">
              🏷️
            </div>
            <div>
              <h4 className="text-sm font-black text-gray-900 leading-tight">Best Offers</h4>
              <p className="text-[11px] font-bold text-gray-400 mt-0.5">Up to 60% OFF coupon codes</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-orange-100/50 flex items-center justify-center text-[#FF6B00] text-xl flex-shrink-0 shadow-sm">
              🛡️
            </div>
            <div>
              <h4 className="text-sm font-black text-gray-900 leading-tight">Safe & Hygienic</h4>
              <p className="text-[11px] font-bold text-gray-400 mt-0.5">100% quality checked food</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-orange-100/50 flex items-center justify-center text-[#FF6B00] text-xl flex-shrink-0 shadow-sm">
              📞
            </div>
            <div>
              <h4 className="text-sm font-black text-gray-900 leading-tight">24/7 Support</h4>
              <p className="text-[11px] font-bold text-gray-400 mt-0.5">Always here to help you</p>
            </div>
          </div>
        </div>

      </div>
      {toast && <Toast message={toast} type="success" onClose={() => setToast(null)} />}
    </div>
  );
};

export default MenuPage;
