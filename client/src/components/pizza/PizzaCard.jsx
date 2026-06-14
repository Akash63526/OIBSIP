import React from 'react';
import { StarIcon } from '@heroicons/react/20/solid';

const PizzaCard = ({ pizza, onAdd }) => {
  // Respect properties if present on the pizza object, otherwise fall back gracefully
  const rating = pizza.rating || 4.5;
  const price = pizza.price ?? pizza.basePrice ?? 0;
  const reviews = pizza.reviewsCount ?? pizza.totalReviews ?? pizza.reviews ?? (Math.floor(((price || 150) * 7.5) % 1200) + 120);

  // Format reviews nicely (e.g., 1.2K+ or 645+)
  const formatReviews = (count) => {
    if (isNaN(count)) return '120+';
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K+`;
    }
    return `${count}+`;
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100/60 hover:shadow-[0_15px_35px_rgba(0,0,0,0.06)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full group">
      
      {/* Pizza Image container with overlay rating badge */}
      <div className="h-44 overflow-hidden relative p-3 pb-0">
        <img 
          src={pizza.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80'} 
          alt={pizza.name} 
          className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Rating overlay badge matching screenshot */}
        <div className="absolute top-5 left-5 z-10 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-lg flex items-center gap-0.5 shadow-sm border border-gray-100/10">
          <StarIcon className="h-3 w-3 text-yellow-400" />
          <span className="text-[10px] font-black text-gray-800 leading-none">{rating}</span>
          <span className="text-[9px] text-gray-400 font-extrabold leading-none">({formatReviews(reviews)})</span>
        </div>
      </div>
      
      {/* Pizza Card details */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-[15px] sm:text-base font-black text-gray-900 truncate tracking-tight mb-1">
          {pizza.name}
        </h3>
        
        {/* Card description details */}
        <p className="text-[12px] font-semibold text-gray-400 leading-normal mb-4 line-clamp-2 h-9 flex-grow">
          {pizza.description || 'Delicious freshly made ingredients baked to perfection.'}
        </p>
        
        {/* Price and Add action row */}
        <div className="pt-3.5 flex justify-between items-center border-t border-gray-50">
          <span className="text-base sm:text-lg font-black text-gray-950 tracking-tight">
            ₹{Math.round(price)}
          </span>
          <button 
            onClick={() => onAdd({ ...pizza, quantity: 1 })} 
            className="bg-[#FF6B00] hover:bg-[#e66000] text-white px-4 py-1.5 rounded-xl font-black text-[12px] tracking-wide shadow-sm hover:shadow-md hover:shadow-orange-500/10 active:scale-95 transition-all flex items-center gap-0.5"
          >
            Add <span className="text-sm font-black leading-none mb-0.5">+</span>
          </button>
        </div>
      </div>

    </div>
  );
};

export default PizzaCard;
