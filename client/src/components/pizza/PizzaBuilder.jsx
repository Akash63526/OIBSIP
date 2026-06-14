import React, { useState } from 'react';
import { ShoppingCartIcon, CheckIcon } from '@heroicons/react/24/solid';

import { getIngredients } from '../../api/ingredientApi';

const BASE_PIZZA_PRICE = 199;

const PizzaBuilder = ({ onAddToCart }) => {
  const [ingredientsData, setIngredientsData] = React.useState(null);
  
  const [selectedBase, setSelectedBase] = useState(null);
  const [selectedSauce, setSelectedSauce] = useState(null);
  const [selectedCheese, setSelectedCheese] = useState(null);
  const [selectedVeggies, setSelectedVeggies] = useState([]);
  const [selectedMeat, setSelectedMeat] = useState(null);

  // Track active steps just for progress display matching reference
  const [activeStep, setActiveStep] = useState(1);

  React.useEffect(() => {
    getIngredients().then(data => {
      const grouped = {
        bases: data.filter(i => i.category === 'crust'),
        sauces: data.filter(i => i.category === 'sauce'),
        cheeses: data.filter(i => i.category === 'cheese'),
        veggies: data.filter(i => i.category === 'veg-topping'),
        meats: data.filter(i => i.category === 'meat-topping')
      };
      setIngredientsData(grouped);
      if(grouped.bases.length) setSelectedBase(grouped.bases[0]);
      if(grouped.sauces.length) setSelectedSauce(grouped.sauces[0]);
      if(grouped.cheeses.length) setSelectedCheese(grouped.cheeses[0]);
      if(grouped.veggies.length > 1) setSelectedVeggies([grouped.veggies[0], grouped.veggies[1]]);
      if(grouped.meats.length) setSelectedMeat(grouped.meats[0]);
    }).catch(err => console.error(err));
  }, []);

  // Toggle Veggies (multi-select)
  const handleVeggieToggle = (veggie) => {
    if (selectedVeggies.some(v => v._id === veggie._id)) {
      setSelectedVeggies(selectedVeggies.filter(v => v._id !== veggie._id));
    } else {
      setSelectedVeggies([...selectedVeggies, veggie]);
    }
  };

  if (!ingredientsData || !selectedBase) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="inline-block animate-spin h-12 w-12 border-4 border-[#FF6B00] border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-400 font-extrabold text-sm tracking-wider uppercase">Loading Ingredients...</p>
        </div>
      </div>
    );
  }

  const INGREDIENTS = ingredientsData;

  // Calculations
  const basePrice = BASE_PIZZA_PRICE;
  const additionsSubtotal = 
    (selectedBase.extraPrice || 0) + 
    (selectedSauce.extraPrice || 0) + 
    (selectedCheese.extraPrice || 0) + 
    selectedVeggies.reduce((sum, v) => sum + (v.extraPrice || 0), 0) + 
    (selectedMeat ? (selectedMeat.extraPrice || 0) : 0);

  const totalPrice = basePrice + additionsSubtotal;

  const handleSubmit = () => {
    onAddToCart({
      base: selectedBase,
      sauce: selectedSauce,
      cheese: selectedCheese,
      veggies: selectedVeggies,
      meat: selectedMeat,
      price: totalPrice
    });
  };

  return (
    <div className="bg-white min-h-screen pb-16 font-sans">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Section */}
        <div className="text-left mt-6 mb-8">
          <h1 className="text-[32px] sm:text-[40px] font-black text-gray-900 leading-tight mb-2 tracking-tight">
            Build Your Pizza
          </h1>
          <p className="text-[#64748B] text-base font-bold">
            Create your perfect pizza in 5 simple steps
          </p>
        </div>

        {/* Step Progress Indicators */}
        <div className="relative flex items-center justify-between max-w-4xl mx-auto mb-16 px-4">
          {/* Dashed Connecting Line */}
          <div className="absolute left-8 right-8 top-6 h-0.5 border-t-2 border-dashed border-gray-200 z-0"></div>

          {/* Steps */}
          {[
            { step: 1, label: 'Base' },
            { step: 2, label: 'Sauce' },
            { step: 3, label: 'Cheese' },
            { step: 4, label: 'Veggies' },
            { step: 5, label: 'Meat' }
          ].map((item) => {
            const isActive = activeStep === item.step;
            return (
              <div 
                key={item.step} 
                onClick={() => setActiveStep(item.step)} 
                className="relative z-10 flex flex-col items-center cursor-pointer group"
              >
                <div className={`h-12 w-12 rounded-full flex items-center justify-center font-black text-[15px] transition-all duration-300 ${
                  isActive 
                    ? 'bg-[#FF6B00] text-white ring-4 ring-orange-100 scale-110 shadow-md shadow-orange-500/20' 
                    : 'bg-white border-2 border-gray-200 text-gray-400 group-hover:border-gray-400 group-hover:text-gray-600'
                }`}>
                  {item.step}
                </div>
                <span className={`text-[13px] font-black mt-2 tracking-wide transition-colors duration-300 ${
                  isActive ? 'text-[#FF6B00]' : 'text-gray-400 group-hover:text-gray-600'
                }`}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Ingredients panels (60% width on large screens) */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* Step 1: Base */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100/80 shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-lg bg-[#FF6B00] text-white flex items-center justify-center font-black text-[11px]">1</span>
                  <h3 className="text-base sm:text-[17px] font-black text-gray-900 tracking-tight">Base</h3>
                  <span className="h-5 w-5 bg-green-50 rounded-full flex items-center justify-center">
                    <CheckIcon className="h-3 w-3 text-green-500 stroke-[3]" />
                  </span>
                </div>
                <button className="text-sm font-black text-blue-500 hover:underline">Change</button>
              </div>
              <p className="text-gray-400 text-xs font-black uppercase tracking-wider mb-4">{selectedBase.name}</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {INGREDIENTS.bases.map((base) => {
                  const isSelected = selectedBase.id === base._id;
                  return (
                    <div 
                      key={base._id}
                      onClick={() => { setSelectedBase(base); setActiveStep(1); }}
                      className={`cursor-pointer rounded-2xl p-3 border-2 transition-all flex flex-col items-center text-center ${
                        isSelected 
                          ? 'border-[#FF6B00] bg-orange-50/20 shadow-md shadow-orange-500/5' 
                          : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50/40'
                      }`}
                    >
                      <div className="h-16 w-16 mb-2 rounded-xl overflow-hidden shadow-inner border border-gray-100">
                        <img src={base.image} alt={base.name} className="h-full w-full object-cover" />
                      </div>
                      <span className="text-[12px] font-black text-gray-800 leading-tight mb-1">{base.name}</span>
                      <span className="text-[11px] font-bold text-[#FF6B00]">{base.extraPrice === 0 ? 'Free' : `+₹${base.extraPrice}`}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Sauce */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100/80 shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-lg bg-[#FF6B00] text-white flex items-center justify-center font-black text-[11px]">2</span>
                  <h3 className="text-base sm:text-[17px] font-black text-gray-900 tracking-tight">Sauce</h3>
                  <span className="h-5 w-5 bg-green-50 rounded-full flex items-center justify-center">
                    <CheckIcon className="h-3 w-3 text-green-500 stroke-[3]" />
                  </span>
                </div>
                <button className="text-sm font-black text-blue-500 hover:underline">Change</button>
              </div>
              <p className="text-gray-400 text-xs font-black uppercase tracking-wider mb-4">{selectedSauce.name}</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {INGREDIENTS.sauces.map((sauce) => {
                  const isSelected = selectedSauce.id === sauce._id;
                  return (
                    <div 
                      key={sauce._id}
                      onClick={() => { setSelectedSauce(sauce); setActiveStep(2); }}
                      className={`cursor-pointer rounded-2xl p-3 border-2 transition-all flex flex-col items-center text-center ${
                        isSelected 
                          ? 'border-[#FF6B00] bg-orange-50/20 shadow-md shadow-orange-500/5' 
                          : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50/40'
                      }`}
                    >
                      <div className="h-16 w-16 mb-2 rounded-xl overflow-hidden shadow-inner border border-gray-100">
                        <img src={sauce.image} alt={sauce.name} className="h-full w-full object-cover" />
                      </div>
                      <span className="text-[12px] font-black text-gray-800 leading-tight mb-1">{sauce.name}</span>
                      <span className="text-[11px] font-bold text-[#FF6B00]">{sauce.extraPrice === 0 ? 'Free' : `+₹${sauce.extraPrice}`}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Cheese */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100/80 shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-lg bg-[#FF6B00] text-white flex items-center justify-center font-black text-[11px]">3</span>
                  <h3 className="text-base sm:text-[17px] font-black text-gray-900 tracking-tight">Cheese</h3>
                  <span className="h-5 w-5 bg-green-50 rounded-full flex items-center justify-center">
                    <CheckIcon className="h-3 w-3 text-green-500 stroke-[3]" />
                  </span>
                </div>
                <button className="text-sm font-black text-blue-500 hover:underline">Change</button>
              </div>
              <p className="text-gray-400 text-xs font-black uppercase tracking-wider mb-4">{selectedCheese.name}</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {INGREDIENTS.cheeses.map((cheese) => {
                  const isSelected = selectedCheese.id === cheese._id;
                  return (
                    <div 
                      key={cheese._id}
                      onClick={() => { setSelectedCheese(cheese); setActiveStep(3); }}
                      className={`cursor-pointer rounded-2xl p-3 border-2 transition-all flex flex-col items-center text-center ${
                        isSelected 
                          ? 'border-[#FF6B00] bg-orange-50/20 shadow-md shadow-orange-500/5' 
                          : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50/40'
                      }`}
                    >
                      <div className="h-16 w-16 mb-2 rounded-xl overflow-hidden shadow-inner border border-gray-100">
                        <img src={cheese.image} alt={cheese.name} className="h-full w-full object-cover" />
                      </div>
                      <span className="text-[12px] font-black text-gray-800 leading-tight mb-1">{cheese.name}</span>
                      <span className="text-[11px] font-bold text-[#FF6B00]">{cheese.extraPrice === 0 ? 'Free' : `+₹${cheese.extraPrice}`}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Veggies */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100/80 shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-lg bg-[#FF6B00] text-white flex items-center justify-center font-black text-[11px]">4</span>
                  <h3 className="text-base sm:text-[17px] font-black text-gray-900 tracking-tight">Veggies</h3>
                  <span className="px-2.5 py-0.5 bg-green-50 text-green-700 rounded-full font-black text-[10px] uppercase tracking-wide">
                    {selectedVeggies.length} Selected
                  </span>
                </div>
                <button className="text-sm font-black text-blue-500 hover:underline">Change</button>
              </div>
              <p className="text-gray-400 text-xs font-black uppercase tracking-wider mb-4">
                {selectedVeggies.length > 0 ? selectedVeggies.map(v => v.name).join(', ') : 'None selected'}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {INGREDIENTS.veggies.map((veg) => {
                  const isSelected = selectedVeggies.some(v => v.id === veg._id);
                  return (
                    <div 
                      key={veg._id}
                      onClick={() => { handleVeggieToggle(veg); setActiveStep(4); }}
                      className={`cursor-pointer rounded-2xl p-3 border-2 transition-all flex flex-col items-center text-center relative ${
                        isSelected 
                          ? 'border-[#FF6B00] bg-orange-50/20 shadow-md shadow-orange-500/5' 
                          : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50/40'
                      }`}
                    >
                      <div className="h-16 w-16 mb-2 rounded-xl overflow-hidden shadow-inner border border-gray-100">
                        <img src={veg.image} alt={veg.name} className="h-full w-full object-cover" />
                      </div>
                      <span className="text-[12px] font-black text-gray-800 leading-tight mb-1">{veg.name}</span>
                      <span className="text-[11px] font-bold text-[#FF6B00]">+₹{veg.extraPrice}</span>
                      {isSelected && (
                        <span className="absolute bottom-2 right-2 h-4 w-4 bg-[#FF6B00] text-white flex items-center justify-center rounded-full shadow-sm">
                          <CheckIcon className="h-2.5 w-2.5 text-white" strokeWidth={5} />
                        </span>
                      )}
                    </div>
                  );
                })}
                {/* Visual placeholder for '+ More' option exactly matching image */}
                <div className="cursor-not-allowed rounded-2xl p-3 border border-dashed border-gray-200 hover:bg-gray-50/20 flex flex-col items-center justify-center text-center opacity-70">
                  <div className="h-12 w-12 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 font-black text-lg mb-1">+</div>
                  <span className="text-[11px] font-black text-gray-400">More</span>
                </div>
              </div>
            </div>

            {/* Step 5: Meat */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100/80 shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-lg bg-[#FF6B00] text-white flex items-center justify-center font-black text-[11px]">5</span>
                  <h3 className="text-base sm:text-[17px] font-black text-gray-900 tracking-tight">Meat</h3>
                  <span className="h-5 w-5 bg-green-50 rounded-full flex items-center justify-center">
                    <CheckIcon className="h-3 w-3 text-green-500 stroke-[3]" />
                  </span>
                </div>
                <button className="text-sm font-black text-blue-500 hover:underline">Change</button>
              </div>
              <p className="text-gray-400 text-xs font-black uppercase tracking-wider mb-4">
                {selectedMeat ? selectedMeat.name : 'None selected'}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {INGREDIENTS.meats.map((meat) => {
                  const isSelected = selectedMeat?.id === meat._id;
                  return (
                    <div 
                      key={meat._id}
                      onClick={() => { setSelectedMeat(selectedMeat?.id === meat._id ? null : meat); setActiveStep(5); }}
                      className={`cursor-pointer rounded-2xl p-3 border-2 transition-all flex flex-col items-center text-center ${
                        isSelected 
                          ? 'border-[#FF6B00] bg-orange-50/20 shadow-md shadow-orange-500/5' 
                          : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50/40'
                      }`}
                    >
                      <div className="h-16 w-16 mb-2 rounded-xl overflow-hidden shadow-inner border border-gray-100">
                        <img src={meat.image} alt={meat.name} className="h-full w-full object-cover" />
                      </div>
                      <span className="text-[12px] font-black text-gray-800 leading-tight mb-1">{meat.name}</span>
                      <span className="text-[11px] font-bold text-[#FF6B00]">+₹{meat.extraPrice}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quality badge indicator */}
            <div className="flex items-center gap-2 text-green-600 font-extrabold text-sm pl-2">
              <span className="h-5 w-5 rounded-full bg-green-50 flex items-center justify-center">✔</span>
              <span>All ingredients are fresh and high quality</span>
            </div>

          </div>

          {/* Right Column: Visualizer & Summary Card (40% width, sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            
            {/* Real-time Interactive Pizza Visualizer */}
            <div className="relative bg-[#FAF5EE] rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.01)] border border-[#FAF3E8] flex flex-col items-center justify-center overflow-hidden min-h-[380px]">
              
              {/* Flying basil leaves and tomatoes for dribbble depth effect */}
              <div className="absolute top-8 left-8 text-2xl opacity-80 animate-bounce duration-1000 select-none">🌿</div>
              <div className="absolute bottom-10 right-8 text-3xl opacity-85 select-none hover:rotate-12 transition-transform duration-300">🍅</div>
              <div className="absolute bottom-6 left-12 text-xl opacity-60 select-none">🫒</div>
              
              {/* Wooden Board Background under pizza */}
              <div className="h-[280px] w-[280px] rounded-full bg-gradient-to-br from-[#A06A42] to-[#714421] shadow-2xl relative flex items-center justify-center scale-95 border-8 border-[#B57C54]/60">
                
                {/* Pizza Base visual crust */}
                <div className="absolute inset-[8px] rounded-full bg-[#E5B581] border-[12px] border-[#C88950] shadow-inner flex items-center justify-center overflow-hidden">
                  
                  {/* Melty Cheese/Tomato sauce background layer */}
                  <div className="absolute inset-[6px] rounded-full bg-gradient-to-tr from-[#FFF3D1] via-[#FACC15]/80 to-[#FFF3D1] shadow-inner flex items-center justify-center">
                    
                    {/* Live overlay toppings */}
                    <div className="absolute inset-0 relative pointer-events-none">
                      
                      {/* Sauciness highlight (Tomato Basil or BBQ or Pesto) */}
                      <div className={`absolute inset-[10px] rounded-full opacity-40 mix-blend-multiply ${
                        selectedSauce.slug === 'bbq-sauce' 
                          ? 'bg-amber-950' 
                          : selectedSauce.slug === 'pesto-sauce' 
                            ? 'bg-green-800' 
                            : 'bg-red-700'
                      }`}></div>

                      {/* Display dynamically placed toppings on the pizza */}
                      {/* Capsicum (🫑) */}
                      {selectedVeggies.some(v => v.slug === 'capsicum') && (
                        <>
                          <span className="absolute top-10 left-12 text-3xl drop-shadow-md rotate-12">🫑</span>
                          <span className="absolute top-16 right-16 text-3.5xl drop-shadow-md -rotate-45">🫑</span>
                          <span className="absolute bottom-12 left-20 text-3xl drop-shadow-md rotate-[110deg]">🫑</span>
                          <span className="absolute bottom-20 right-10 text-3xl drop-shadow-md -rotate-12">🫑</span>
                        </>
                      )}

                      {/* Onion (🧅) */}
                      {selectedVeggies.some(v => v.slug === 'onion') && (
                        <>
                          <span className="absolute top-16 left-20 text-3xl drop-shadow-md rotate-45 opacity-90">🧅</span>
                          <span className="absolute top-12 right-24 text-3.5xl drop-shadow-md rotate-[120deg] opacity-90">🧅</span>
                          <span className="absolute bottom-20 left-12 text-3.5xl drop-shadow-md rotate-[-30deg] opacity-90">🧅</span>
                          <span className="absolute bottom-10 right-20 text-3.5xl drop-shadow-md rotate-12 opacity-90">🧅</span>
                        </>
                      )}

                      {/* Mushrooms (🍄) */}
                      {selectedVeggies.some(v => v.slug === 'mushroom') && (
                        <>
                          <span className="absolute top-20 left-10 text-2.5xl drop-shadow-sm rotate-12">🍄</span>
                          <span className="absolute top-28 right-12 text-2.5xl drop-shadow-sm -rotate-12">🍄</span>
                          <span className="absolute bottom-16 left-24 text-2.5xl drop-shadow-sm rotate-45">🍄</span>
                          <span className="absolute bottom-12 right-24 text-2.5xl drop-shadow-sm -rotate-90">🍄</span>
                        </>
                      )}

                      {/* Olives (🫒) */}
                      {selectedVeggies.some(v => v.slug === 'black-olive') && (
                        <>
                          <span className="absolute top-8 left-24 text-2.5xl drop-shadow-sm">🫒</span>
                          <span className="absolute top-24 right-20 text-2.5xl drop-shadow-sm">🫒</span>
                          <span className="absolute bottom-24 left-14 text-2.5xl drop-shadow-sm">🫒</span>
                          <span className="absolute bottom-16 right-16 text-2.5xl drop-shadow-sm">🫒</span>
                        </>
                      )}

                      {/* Corn (🌽) */}
                      {selectedVeggies.some(v => v.slug === 'sweet-corn') && (
                        <>
                          <span className="absolute top-12 left-16 text-2.5xl drop-shadow-sm">🌽</span>
                          <span className="absolute top-24 right-16 text-2.5xl drop-shadow-sm">🌽</span>
                          <span className="absolute bottom-16 left-16 text-2.5xl drop-shadow-sm">🌽</span>
                          <span className="absolute bottom-20 right-20 text-2.5xl drop-shadow-sm">🌽</span>
                        </>
                      )}

                      {/* Chicken (🍗) */}
                      {selectedMeat?.slug === 'chicken-chunks' && (
                        <>
                          <span className="absolute top-8 left-20 text-3xl drop-shadow-md">🍗</span>
                          <span className="absolute top-24 right-24 text-3.5xl drop-shadow-md">🍗</span>
                          <span className="absolute bottom-16 left-28 text-3xl drop-shadow-md">🍗</span>
                          <span className="absolute bottom-20 right-14 text-3.5xl drop-shadow-md">🍗</span>
                        </>
                      )}

                      {/* Pepperoni (🔴) */}
                      {selectedMeat?.id === 'pepperoni' && (
                        <>
                          <span className="absolute top-10 left-16 text-2.5xl drop-shadow-md">🔴</span>
                          <span className="absolute top-20 right-20 text-2.5xl drop-shadow-md">🔴</span>
                          <span className="absolute bottom-20 left-20 text-2.5xl drop-shadow-md">🔴</span>
                          <span className="absolute bottom-12 right-20 text-2.5xl drop-shadow-md">🔴</span>
                        </>
                      )}

                      {/* Sausage (🥓) */}
                      {selectedMeat?.id === 'sausage' && (
                        <>
                          <span className="absolute top-12 left-24 text-3xl drop-shadow-md rotate-45">🥓</span>
                          <span className="absolute bottom-16 right-24 text-3.5xl drop-shadow-md -rotate-12">🥓</span>
                        </>
                      )}

                      {/* Bacon (🥓) */}
                      {selectedMeat?.id === 'bacon' && (
                        <>
                          <span className="absolute top-20 left-14 text-3.5xl drop-shadow-md rotate-12">🥓</span>
                          <span className="absolute bottom-24 right-12 text-3.5xl drop-shadow-md rotate-[120deg]">🥓</span>
                        </>
                      )}

                      {/* Ground Beef (🥩) */}
                      {selectedMeat?.id === 'ground-beef' && (
                        <>
                          <span className="absolute top-16 left-16 text-3xl drop-shadow-md">🥩</span>
                          <span className="absolute bottom-16 right-20 text-3.5xl drop-shadow-md">🥩</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary Card */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100/80 shadow-[0_15px_40px_rgba(0,0,0,0.025)]">
              <h3 className="text-[17px] font-black text-gray-900 mb-6 tracking-tight">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                {/* Selected Base */}
                <div className="flex justify-between items-center text-sm font-semibold text-gray-500">
                  <span>{selectedBase.name}</span>
                  <span className="text-gray-800 font-extrabold">{selectedBase.price === 0 ? 'Included' : `₹${selectedBase.price}`}</span>
                </div>

                {/* Selected Sauce */}
                <div className="flex justify-between items-center text-sm font-semibold text-gray-500">
                  <span>{selectedSauce.name} Sauce</span>
                  <span className="text-gray-800 font-extrabold">{selectedSauce.price === 0 ? 'Included' : `₹${selectedSauce.price}`}</span>
                </div>

                {/* Selected Cheese */}
                <div className="flex justify-between items-center text-sm font-semibold text-gray-500">
                  <span>{selectedCheese.name} Cheese</span>
                  <span className="text-gray-800 font-extrabold">{selectedCheese.price === 0 ? 'Included' : `₹${selectedCheese.price}`}</span>
                </div>

                {/* Selected Veggies list */}
                {selectedVeggies.length > 0 && (
                  <div className="flex justify-between items-center text-sm font-semibold text-gray-500">
                    <span>Veggies ({selectedVeggies.length})</span>
                    <span className="text-gray-800 font-extrabold">₹{selectedVeggies.reduce((sum, v) => sum + v.price, 0)}</span>
                  </div>
                )}

                {/* Selected Meat */}
                {selectedMeat && (
                  <div className="flex justify-between items-center text-sm font-semibold text-gray-500">
                    <span>Meat ({selectedMeat.name})</span>
                    <span className="text-gray-800 font-extrabold">₹{selectedMeat.price}</span>
                  </div>
                )}

                {/* Divider */}
                <div className="h-px bg-gray-100 w-full pt-1"></div>

                {/* Subtotal */}
                <div className="flex justify-between items-center text-sm font-bold text-gray-500 pt-1">
                  <span>Subtotal</span>
                  <span className="text-gray-900 font-black">₹{additionsSubtotal}</span>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center pt-2">
                  <span className="text-base font-black text-gray-900">Total</span>
                  <span className="text-2xl sm:text-3xl font-black text-[#FF6B00]">₹{totalPrice}</span>
                </div>
              </div>

              {/* Add to Cart Action */}
              <button 
                onClick={handleSubmit}
                className="w-full bg-[#FF6B00] hover:bg-[#e66000] text-white py-3.5 rounded-2xl font-black text-[15px] shadow-md shadow-orange-500/10 hover:shadow-orange-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <ShoppingCartIcon className="h-5 w-5 text-white" strokeWidth={2.5} />
                Add to Cart
              </button>
            </div>

          </div>

        </div>

        {/* Quality Features Trust Strip Banner */}
        <div className="bg-[#FAF3E8]/70 rounded-[2rem] p-6 mt-16 max-w-5xl mx-auto border border-orange-50/50 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            
            {/* Feature 1 */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 py-2 px-4">
              <span className="text-3xl text-[#FF6B00]">🌿</span>
              <span className="text-[15px] font-black text-gray-800 leading-tight">100% Fresh Ingredients</span>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 py-2 px-4 border-y md:border-y-0 md:border-x border-orange-200/40">
              <span className="text-3xl text-[#FF6B00]">🍳</span>
              <span className="text-[15px] font-black text-gray-800 leading-tight">Made Just For You</span>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 py-2 px-4">
              <span className="text-3xl text-[#FF6B00]">🔥</span>
              <span className="text-[15px] font-black text-gray-800 leading-tight">Cooked to Perfection</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default PizzaBuilder;
