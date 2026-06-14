import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../features/cart/cartSlice';
import PizzaCard from '../../components/pizza/PizzaCard';
import Toast from '../../components/ui/Toast';
import { 
  MagnifyingGlassIcon, 
  AdjustmentsHorizontalIcon, 
  ChevronDownIcon,
  UserGroupIcon,
  SparklesIcon,
  TruckIcon,
  ShieldCheckIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { getMenu } from '../../api/menuApi';

// 8 Premium high-fidelity best-sellers in Indian Rupees
const HIGH_FIDELITY_PIZZAS = [
  {
    _id: 'p1',
    name: 'Margherita Classic',
    description: 'Classic delight with 100% real mozzarella cheese.',
    price: 199,
    rating: 4.6,
    reviewsCount: 210,
    image: '/images/Signature_Veg_Pizzas/Margherita_Classic.jpg',
    category: 'cheese'
  },
  {
    _id: 'p3',
    name: 'Pepperoni Feast Pizza',
    description: 'Loaded with pepperoni and extra cheese overload.',
    price: 249,
    rating: 4.8,
    reviewsCount: 180,
    image: '/images/Signature_Non-Veg_Pizzas/Chicken_Pepperoni_Feast.jpg',
    category: 'non-veg'
  },
  {
    _id: 'p2',
    name: 'Farmhouse Supreme',
    description: 'A delicious combo of onion, capsicum, tomato & mushrooms.',
    price: 299,
    rating: 4.7,
    reviewsCount: 160,
    image: '/images/Signature_Veg_Pizzas/Farmhouse_Supreme.jpg',
    category: 'veggie'
  },
  {
    _id: 'p4',
    name: 'Veggie Supreme Pizza',
    description: 'Loaded with fresh capsicum, corn, jalapenos & olives.',
    price: 229,
    rating: 4.8,
    reviewsCount: 150,
    image: '/images/Signature_Veg_Pizzas/Veg_Extravaganza.jpg',
    category: 'veggie'
  },
  {
    _id: 'p5',
    name: 'Cheese n Corn Delight',
    description: 'Sweet golden corn topped with double cheese layer.',
    price: 249,
    rating: 4.6,
    reviewsCount: 110,
    image: '/images/Signature_Veg_Pizzas/Cheese_n_Corn_Delight.jpg',
    category: 'cheese'
  },
  {
    _id: 'p6',
    name: 'Peppy Paneer Special',
    description: 'Paneer chunks, crisp capsicum and spicy red paprika.',
    price: 329,
    rating: 4.7,
    reviewsCount: 95,
    image: '/images/Signature_Veg_Pizzas/Peppy_Paneer.jpg',
    category: 'cheese'
  },
  {
    _id: 'p7',
    name: 'Mexican Green Wave',
    description: 'Crunchy onions, capsicum, juicy tomatoes & jalapenos.',
    price: 349,
    rating: 4.6,
    reviewsCount: 88,
    image: '/images/Signature_Veg_Pizzas/Mexican_Green_Wave.jpg',
    category: 'veggie'
  },
  {
    _id: 'p8',
    name: 'Pepper Barbecue Chicken',
    description: 'Smoky grilled chicken pieces with red paprika & onion.',
    price: 399,
    rating: 4.8,
    reviewsCount: 140,
    image: '/images/Signature_Non-Veg_Pizzas/Pepper_Barbecue_Chicken.jpg',
    category: 'non-veg'
  }
];

const DashboardPage = () => {
  const dispatch = useDispatch();
  const [toast, setToast] = useState(null);
  const [pizzas, setPizzas] = useState(HIGH_FIDELITY_PIZZAS);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceSort, setPriceSort] = useState('low-to-high');
  const [ratingFilter, setRatingFilter] = useState('all');

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const menuData = await getMenu();
        if (menuData && menuData.length > 0) {
          // Map backend category format to frontend categories
          const mappedMenu = menuData.map(item => ({
            _id: item._id,
            name: item.name,
            description: item.description,
            price: item.basePrice,
            rating: item.rating || 4.5,
            reviewsCount: item.totalReviews || 0,
            image: item.image,
            category: item.category === 'veg-pizza' ? 'veggie' : 
                      item.category === 'nonveg-pizza' ? 'non-veg' : 
                      item.category === 'beverages' ? 'drinks' : item.category
          }));
          setPizzas(mappedMenu);
        }
      } catch (err) {
        console.error('Failed to load menu from server, using fallback', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const handleAddToCart = (pizza) => {
    dispatch(addToCart({ 
      pizzaId: pizza._id, 
      name: pizza.name, 
      price: pizza.price, 
      quantity: 1, 
      image: pizza.image,
      isCustom: false
    }));
    setToast(`${pizza.name} added to cart!`);
  };

  // Filter and Sort logic
  const filteredPizzas = pizzas.filter(pizza => {
    if (activeCategory !== 'all') {
      if (activeCategory === 'top-rated') {
        if (pizza.rating < 4.7) return false;
      } else if (activeCategory === 'cheese') {
        const isCheeseItem = pizza.name.toLowerCase().includes('cheese') || 
                             pizza.name.toLowerCase().includes('paneer') || 
                             pizza.name.toLowerCase().includes('mozzarella') || 
                             pizza.category === 'cheese';
        if (!isCheeseItem) return false;
      } else {
        if (pizza.category !== activeCategory) return false;
      }
    }
    if (searchQuery && !pizza.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (ratingFilter === '4plus' && pizza.rating < 4.7) return false;
    if (ratingFilter === '3plus' && pizza.rating < 3.0) return false;

    return true;
  }).sort((a, b) => {
    if (priceSort === 'low-to-high') return a.price - b.price;
    if (priceSort === 'high-to-low') return b.price - a.price;
    return 0;
  });

  return (
    <div className="bg-white min-h-screen pb-16 font-sans w-full">
      
      {/* 1. Hero Banner Container */}
      <div className="w-full mt-6">
        <div className="relative bg-gradient-to-r from-[#FAF3E8] via-[#FAF3E8] to-[#FFF9F2] rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row items-center justify-between min-h-[380px] md:h-[460px] py-10 md:py-0 shadow-[0_15px_40px_rgba(0,0,0,0.02)] border border-[#FAF3E8] w-full">
          
          {/* Decorative elements */}
          <div className="absolute top-10 right-[35%] opacity-20 pointer-events-none hidden md:block">
            <span className="text-3xl">🌿</span>
          </div>
          <div className="absolute bottom-12 right-[45%] opacity-35 pointer-events-none hidden md:block">
            <span className="text-2xl">🍅</span>
          </div>

          {/* Hero Content (Left) */}
          <div className="w-full md:w-[50%] lg:w-[48%] p-6 md:p-8 md:pl-16 z-10 flex flex-col justify-center text-left">
            <h1 className="text-[2.2rem] sm:text-[3.2rem] md:text-[4rem] lg:text-[4.6rem] xl:text-[5rem] font-black text-gray-900 leading-[1.05] tracking-tight mb-5 drop-shadow-sm">
              Good Food, <br />
              <span className="text-[#FF6B00]">Great Mood!</span>
            </h1>
            <p className="text-[#64748B] text-[15px] md:text-[17px] font-semibold mb-8 max-w-sm leading-relaxed">
              Delicious pizzas, fast delivery <br/>
              and great deals every day!
            </p>
            
            {/* Search Bar */}
            <div className="flex items-center bg-white rounded-full p-2 w-full max-w-[420px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100/80 h-16 relative">
              <div className="pl-4 pr-3 text-gray-400">
                <MagnifyingGlassIcon className="h-5 w-5" strokeWidth={2.5} />
              </div>
              <input 
                type="text" 
                placeholder="Search for pizzas, sides, desserts..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none focus:ring-0 text-gray-800 placeholder-gray-400 font-bold text-[15px] outline-none"
              />
              <button className="bg-[#FF6B00] text-white h-12 w-12 rounded-full hover:bg-[#e66000] transition-colors flex items-center justify-center shadow-md shadow-orange-500/20 active:scale-95 absolute right-2">
                <MagnifyingGlassIcon className="h-5 w-5 text-white" strokeWidth={3} />
              </button>
            </div>
          </div>

          {/* Hero Image & Badge Container (Right) */}
          <div className="w-full md:w-[50%] lg:w-[52%] h-[280px] md:h-full relative flex items-center justify-end z-0 overflow-visible">
            <img 
              src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80" 
              alt="Delicious Hot Pizza" 
              className="absolute right-[-5%] md:right-[-8%] lg:right-[-6%] top-1/2 -translate-y-1/2 h-[95%] sm:h-[110%] md:h-[120%] lg:h-[135%] w-auto object-contain z-0 drop-shadow-[0_25px_60px_rgba(0,0,0,0.18)] transition-all duration-300 pointer-events-none rounded-full"
            />
            {/* Discount Badge */}
            <div className="absolute right-12 md:right-24 bottom-6 md:bottom-12 z-10 w-[140px] bg-gradient-to-b from-[#63180D] to-[#451008] border-[3px] border-[#63180D] rounded-t-full rounded-b-[2rem] shadow-2xl flex flex-col items-center p-1 transform rotate-[8deg] hover:rotate-0 transition-transform duration-300 pointer-events-none">
              <div className="border border-dashed border-[#FFC7A8]/30 rounded-t-full rounded-b-[1.8rem] w-full h-full flex flex-col items-center justify-center py-5 px-2">
                <span className="text-[#F1F5F9]/80 text-[10px] font-black tracking-widest uppercase mb-1">Up To</span>
                <span className="text-white text-[38px] font-black leading-none mb-0.5 drop-shadow-md">40%</span>
                <span className="text-[#FACC15] text-[20px] font-black leading-none mb-2 drop-shadow-md">OFF</span>
                <div className="w-[75%] h-[1px] bg-white/20 mb-2"></div>
                <span className="text-[#F1F5F9] text-[9px] font-black tracking-wide text-center">On All Orders</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Visual Category Cards Strip */}
      <div className="w-full mt-10">
        <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-none justify-start lg:justify-between">
          {[
            { id: 'all', label: 'All Menu', emoji: '🍔', color: 'bg-orange-50 text-orange-500' },
            { id: 'veggie', label: 'Veg Pizza', emoji: '🍕', color: 'bg-green-50 text-green-600' },
            { id: 'non-veg', label: 'Non-Veg Pizza', emoji: '🍗', color: 'bg-red-50 text-red-500' },
            { id: 'sides', label: 'Garlic Bread\n& Sides', emoji: '🥖', color: 'bg-yellow-50 text-yellow-600' },
            { id: 'pasta', label: 'Pasta & Mains', emoji: '🍝', color: 'bg-purple-50 text-purple-500' },
            { id: 'desserts', label: 'Desserts', emoji: '🍰', color: 'bg-pink-50 text-pink-500' },
            { id: 'drinks', label: 'Beverages', emoji: '🥤', color: 'bg-blue-50 text-blue-500' },
            { id: 'top-rated', label: 'Top Rated', emoji: '⭐', color: 'bg-amber-50 text-amber-500' }
          ].map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex flex-col items-center p-5 rounded-[2rem] min-w-[125px] lg:flex-1 border-2 transition-all duration-300 group ${
                  isActive 
                    ? 'border-[#FF6B00] bg-orange-50/10 shadow-lg shadow-orange-500/5 -translate-y-1 scale-105' 
                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50/30 bg-white'
                }`}
              >
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-2xl mb-3 shadow-inner bg-opacity-70 ${cat.color} group-hover:scale-110 transition-transform duration-350`}>
                  {cat.emoji}
                </div>
                <span className="text-[12px] font-black text-gray-900 tracking-tight text-center whitespace-pre-line leading-[1.2]">
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Filters & Sorting Row */}
      <div className="w-full mt-10 mb-8 border-t border-gray-100 pt-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
            <div className="flex items-center gap-1.5 pr-2 font-black text-gray-900 text-[14px] flex-shrink-0">
              Filters <AdjustmentsHorizontalIcon className="w-4.5 h-4.5 text-[#FF6B00]" strokeWidth={2.5} />
            </div>
            {[
              { id: 'all', label: 'All' },
              { id: 'veggie', label: 'Veg' },
              { id: 'non-veg', label: 'Non-Veg' },
              { id: 'cheese', label: 'Cheese' },
              { id: 'sides', label: 'Sides' },
              { id: 'pasta', label: 'Pasta' },
              { id: 'desserts', label: 'Desserts' },
              { id: 'drinks', label: 'Beverages' }
            ].map((pill) => {
              const isActive = activeCategory === pill.id;
              return (
                <button 
                  key={pill.id}
                  onClick={() => setActiveCategory(pill.id)}
                  className={`whitespace-nowrap px-5 py-2 rounded-full text-[13px] font-black transition-all ${
                    isActive 
                      ? 'bg-[#FF6B00] text-white shadow-sm' 
                      : 'bg-gray-100 hover:bg-gray-200/70 text-gray-600 font-bold'
                  }`}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:flex-none">
              <select 
                value={priceSort}
                onChange={(e) => setPriceSort(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-200 text-gray-700 text-[13px] font-extrabold py-2.5 pl-4 pr-10 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 cursor-pointer"
              >
                <option value="low-to-high">Price: Low to High</option>
                <option value="high-to-low">Price: High to Low</option>
              </select>
              <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none stroke-[2.5]" />
            </div>
            <div className="relative flex-1 lg:flex-none">
              <select 
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-200 text-gray-700 text-[13px] font-extrabold py-2.5 pl-4 pr-10 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 cursor-pointer"
              >
                <option value="all">Rating: All Stars</option>
                <option value="4plus">Rating: 4.7+ Stars</option>
                <option value="3plus">Rating: 3.0+ Stars</option>
              </select>
              <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none stroke-[2.5]" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Best Sellers Section */}
      <div className="w-full mt-6">
        <div className="flex justify-between items-end mb-6">
          <div className="text-left">
            <h2 className="text-[22px] font-black text-gray-900 tracking-tight">Best Sellers</h2>
            <p className="text-gray-400 font-bold text-xs mt-1">Enjoy amazing discounts on our favorite pizzas</p>
          </div>
          <a href="/menu" className="text-sm font-black text-[#FF6B00] flex items-center gap-1 hover:underline">
            View All <span className="text-lg leading-none mb-0.5">&rsaquo;</span>
          </a>
        </div>
        
        {filteredPizzas.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredPizzas.map(pizza => (
              <PizzaCard key={pizza._id} pizza={pizza} onAdd={handleAddToCart} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <span className="text-4xl mb-3 block">🍕</span>
            <p className="text-gray-400 font-extrabold">No pizzas found matching your filters.</p>
          </div>
        )}
      </div>

      {/* 5. Promotional Offers Section matching screenshot */}
      <div className="w-full mt-16 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Weekend Sale */}
          <div className="bg-gradient-to-r from-[#63180D] via-[#52130A] to-[#63180D] rounded-3xl p-6 border border-[#63180D] relative flex flex-col justify-between min-h-[200px] shadow-lg text-left overflow-hidden group">
            <div className="z-10">
              <span className="text-[#FFC7A8]/80 text-[10px] font-black tracking-widest uppercase block mb-1">Weekend</span>
              <h3 className="text-2xl font-black text-white leading-tight">SALE</h3>
              <p className="text-[13px] font-extrabold text-white/80 mt-1">Up to 30% OFF</p>
              <p className="text-[11px] font-bold text-white/50 mt-0.5">On Selected Pizzas</p>
            </div>
            <div className="flex justify-between items-center mt-6 z-10">
              <a 
                href="/menu"
                className="bg-[#FF6B00] hover:bg-[#e66000] text-white px-5 py-2.5 rounded-2xl font-black text-[12px] tracking-wide active:scale-95 shadow-md shadow-orange-500/10 transition-all"
              >
                Order Now
              </a>
            </div>
            {/* Visual decoration */}
            <div className="absolute right-[-15%] bottom-[-15%] h-36 w-36 bg-[#FFC7A8]/5 rounded-full z-0 group-hover:scale-110 transition-transform duration-500" />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[100px] opacity-10 select-none pointer-events-none z-0">🍕</span>
          </div>

          {/* Card 2: Combo Offer */}
          <div className="bg-gradient-to-r from-[#FFF5F0] via-[#FFFBF6] to-[#FFF5F0] rounded-3xl p-6 border border-orange-100 relative flex flex-col justify-between min-h-[200px] shadow-lg text-left overflow-hidden group">
            <div className="z-10">
              <span className="text-[#FF6B00] text-[10px] font-black tracking-widest uppercase block mb-1">Combo</span>
              <h3 className="text-2xl font-black text-gray-900 leading-tight">OFFER</h3>
              <p className="text-[13px] font-extrabold text-gray-700 mt-1">Pizza + Garlic Bread <br/>+ Pepsi (500ml)</p>
              <p className="text-xl font-black text-[#FF6B00] mt-2">₹499</p>
            </div>
            <div className="flex justify-between items-center mt-4 z-10">
              <a 
                href="/menu"
                className="bg-[#FF6B00] hover:bg-[#e66000] text-white px-5 py-2.5 rounded-2xl font-black text-[12px] tracking-wide active:scale-95 shadow-md shadow-orange-500/10 transition-all"
              >
                Order Now
              </a>
            </div>
            {/* Visual decoration */}
            <div className="absolute right-[-15%] bottom-[-15%] h-36 w-36 bg-[#FF6B00]/5 rounded-full z-0 group-hover:scale-110 transition-transform duration-500" />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[90px] opacity-10 select-none pointer-events-none z-0">🥤</span>
          </div>

          {/* Card 3: Free Delivery */}
          <div className="bg-gradient-to-r from-[#0C1E36] via-[#091526] to-[#0C1E36] rounded-3xl p-6 border border-[#0C1E36] relative flex flex-col justify-between min-h-[200px] shadow-lg text-left overflow-hidden group">
            <div className="z-10">
              <span className="text-blue-400 text-[10px] font-black tracking-widest uppercase block mb-1">Free</span>
              <h3 className="text-2xl font-black text-white leading-tight">DELIVERY</h3>
              <p className="text-[13px] font-extrabold text-white/80 mt-1 font-bold">On orders above ₹299</p>
            </div>
            <div className="flex justify-between items-center mt-6 z-10">
              <a 
                href="/menu"
                className="bg-[#FF6B00] hover:bg-[#e66000] text-white px-5 py-2.5 rounded-2xl font-black text-[12px] tracking-wide active:scale-95 shadow-md shadow-orange-500/10 transition-all"
              >
                Order Now
              </a>
            </div>
            {/* Visual decoration */}
            <div className="absolute right-[-15%] bottom-[-15%] h-36 w-36 bg-blue-500/5 rounded-full z-0 group-hover:scale-110 transition-transform duration-500" />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[90px] opacity-15 select-none pointer-events-none z-0">🚚</span>
          </div>

        </div>
      </div>

      {/* 6. Why Choose Us Section */}
      <div className="w-full mt-16 mb-16 border-t border-gray-100 pt-16">
        <h2 className="text-[22px] font-black text-gray-900 tracking-tight text-center mb-1">Why Choose SliceSprint?</h2>
        <p className="text-gray-400 font-bold text-xs text-center mb-10">What makes our wood-fired pizzas completely outstanding</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {/* Card 1 */}
          <div className="bg-[#FFFDFB] border border-orange-100/50 rounded-3xl p-5 flex items-start gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.005)] hover:shadow-md transition-all select-none">
            <div className="h-12 w-12 rounded-2xl bg-orange-50 flex items-center justify-center text-[#FF6B00] flex-shrink-0 mt-0.5">
              <TruckIcon className="h-6 w-6" strokeWidth={2} />
            </div>
            <div>
              <span className="text-[14.5px] font-black text-gray-900 block leading-tight mb-1">Fast Delivery</span>
              <p className="text-[12.5px] font-bold text-gray-400 leading-normal">Hot & fresh at your doorstep in under 30 minutes.</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#FFFDFB] border border-orange-100/50 rounded-3xl p-5 flex items-start gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.005)] hover:shadow-md transition-all select-none">
            <div className="h-12 w-12 rounded-2xl bg-orange-50 flex items-center justify-center text-[#FF6B00] flex-shrink-0 mt-0.5">
              <SparklesIcon className="h-6 w-6" strokeWidth={2} />
            </div>
            <div>
              <span className="text-[14.5px] font-black text-gray-900 block leading-tight mb-1">Great Quality</span>
              <p className="text-[12.5px] font-bold text-gray-400 leading-normal">Made with 100% fresh, locally sourced handpicked ingredients.</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#FFFDFB] border border-orange-100/50 rounded-3xl p-5 flex items-start gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.005)] hover:shadow-md transition-all select-none">
            <div className="h-12 w-12 rounded-2xl bg-orange-50 flex items-center justify-center text-[#FF6B00] flex-shrink-0 mt-0.5">
              <UserGroupIcon className="h-6 w-6" strokeWidth={2} />
            </div>
            <div>
              <span className="text-[14.5px] font-black text-gray-900 block leading-tight mb-1">Best Offers</span>
              <p className="text-[12.5px] font-bold text-gray-400 leading-normal">Exciting deals, visual vouchers & discounts every single day.</p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-[#FFFDFB] border border-orange-100/50 rounded-3xl p-5 flex items-start gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.005)] hover:shadow-md transition-all select-none">
            <div className="h-12 w-12 rounded-2xl bg-orange-50 flex items-center justify-center text-[#FF6B00] flex-shrink-0 mt-0.5">
              <ShieldCheckIcon className="h-6 w-6" strokeWidth={2} />
            </div>
            <div>
              <span className="text-[14.5px] font-black text-gray-900 block leading-tight mb-1">Secure Payment</span>
              <p className="text-[12.5px] font-bold text-gray-400 leading-normal">100% safe checkout using credit cards, UPI or cash.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Popular Near You Section */}
      <div className="w-full mt-16 mb-16 border-t border-gray-100 pt-16">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3.5 text-left">
            <h2 className="text-[22px] font-black text-gray-900 tracking-tight">Popular Near You</h2>
            <div className="relative inline-block text-left">
              <button className="flex items-center gap-1 bg-[#FFF5EF] text-[#FF6B00] text-[13px] font-black px-4 py-1.5 rounded-full border border-orange-100 shadow-sm active:scale-95 transition-all">
                <MapPinIcon className="h-4 w-4" />
                Surat <ChevronDownIcon className="h-3.5 w-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>
          <a href="/about" className="text-sm font-black text-[#FF6B00] flex items-center gap-1 hover:underline">
            View All <span className="text-lg leading-none mb-0.5">&rsaquo;</span>
          </a>
        </div>

        {/* 5 Store Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {[
            { name: 'SliceSprint Piplod', time: '20-25 mins', dist: '2.5 km', rate: '4.6', img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80' },
            { name: 'SliceSprint City Light', time: '25-30 mins', dist: '3.2 km', rate: '4.7', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&q=80' },
            { name: 'SliceSprint Vesu', time: '20-25 mins', dist: '2.1 km', rate: '4.5', img: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=300&q=80' },
            { name: 'SliceSprint Adajan', time: '30-35 mins', dist: '4.3 km', rate: '4.5', img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=300&q=80' },
            { name: 'SliceSprint Katargam', time: '25-30 mins', dist: '3.8 km', rate: '4.7', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=300&q=80' }
          ].map((store, i) => (
            <div 
              key={i}
              className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 relative select-none text-left group"
            >
              <div className="h-32 w-full overflow-hidden relative bg-gray-50">
                <img 
                  src={store.img} 
                  alt={store.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-900 font-black text-[11px] px-2.5 py-0.5 rounded-lg shadow-sm border border-gray-100/50 flex items-center gap-0.5">
                  ⭐ {store.rate}
                </span>
              </div>
              <div className="p-4 space-y-1">
                <h4 className="text-[14px] font-black text-gray-900 leading-tight tracking-tight truncate group-hover:text-[#FF6B00] transition-colors">{store.name}</h4>
                <p className="text-[11.5px] font-bold text-gray-400">
                  {store.time} • {store.dist}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {toast && <Toast message={toast} type="success" onClose={() => setToast(null)} />}
    </div>
  );
};

export default DashboardPage;
