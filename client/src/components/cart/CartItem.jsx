import React from 'react';
import { TrashIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import { useDispatch } from 'react-redux';
import { updateQuantity, removeFromCart } from '../../features/cart/cartSlice';

const CartItem = ({ item, index }) => {
  const dispatch = useDispatch();

  const handleQuantity = (newQty) => {
    dispatch(updateQuantity({ index, quantity: newQty }));
  };

  const handleRemove = () => {
    dispatch(removeFromCart(index));
  };

  // Compile detailed description matching reference screenshot
  let description = '';
  if (item.isCustom && item.pizzaConfig) {
    const config = item.pizzaConfig;
    const parts = [];
    if (config.base) parts.push(config.base.name);
    if (config.sauce) parts.push(config.sauce.name);
    if (config.cheese) parts.push(`${config.cheese.name}`);
    if (config.veggies && config.veggies.length > 0) {
      parts.push(config.veggies.map(v => v.name).join(', '));
    }
    if (config.meat) parts.push(config.meat.name);
    description = parts.join(', ');
  } else {
    // Normal pizza details e.g. Pepperoni Feast has "Regular Crust", Garlic Bread has "Cheesy Garlic Bread"
    description = item.pizzaConfig?.base?.name || item.pizzaConfig?.description || 'Classic Crust';
  }

  return (
    <div className="flex flex-col sm:flex-row items-center py-6 border-b border-gray-100 last:border-b-0 gap-5 relative group w-full">
      
      {/* Item Image */}
      <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100/60 shadow-inner">
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl bg-orange-50/30">🍕</div>
        )}
      </div>
      
      {/* Details & Action */}
      <div className="flex-1 w-full text-center sm:text-left flex flex-col justify-between py-1 min-h-[96px]">
        <div>
          <h3 className="text-base sm:text-[17px] font-black text-gray-900 tracking-tight mb-1">
            {item.name || 'Custom Pizza'}
          </h3>
          <p className="text-[13px] font-semibold text-gray-400 leading-normal max-w-md">
            {description}
          </p>
        </div>
        
        {/* Price and Counter Row */}
        <div className="flex flex-row items-center justify-between mt-4">
          <div className="text-base sm:text-lg font-black text-[#FF6B00]">
            ₹{typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
          </div>
          
          {/* Stepper counter */}
          <div className="flex items-center bg-gray-50 border border-gray-100/80 rounded-full h-9 p-1.5 shadow-sm">
            <button 
              onClick={() => handleQuantity(item.quantity - 1)}
              className="h-6 w-6 rounded-full hover:bg-white text-gray-400 hover:text-gray-900 transition-colors flex items-center justify-center focus:outline-none"
            >
              <MinusIcon className="h-3.5 w-3.5 stroke-[3]" />
            </button>
            <span className="px-3 text-sm text-gray-950 font-black">{item.quantity}</span>
            <button 
              onClick={() => handleQuantity(item.quantity + 1)}
              className="h-6 w-6 rounded-full hover:bg-white text-gray-400 hover:text-gray-900 transition-colors flex items-center justify-center focus:outline-none"
            >
              <PlusIcon className="h-3.5 w-3.5 stroke-[3]" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete absolute button (top right) */}
      <button 
        onClick={handleRemove}
        className="absolute top-6 right-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50/50 rounded-full transition-colors self-start"
      >
        <TrashIcon className="h-5 w-5 stroke-2" />
      </button>

    </div>
  );
};

export default CartItem;
