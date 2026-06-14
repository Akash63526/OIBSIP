import React, { useState } from 'react';
import { 
  CheckIcon, 
  MapPinIcon, 
  ClockIcon, 
  ShieldCheckIcon,
  ChevronDownIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import Toast from '../../components/ui/Toast';

const DeliveryPage = () => {
  const [toast, setToast] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);

  const handleTrackOrder = () => {
    setToast('Checking active orders... redirecting to orders page.');
    setTimeout(() => {
      window.location.href = '/orders';
    }, 1500);
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const FAQS = [
    {
      q: "What is your standard delivery time?",
      a: "Our standard delivery takes between 30 to 40 minutes under normal circumstances. We bake under intense 450°C oak wood flames which takes only 90 seconds, and our riders immediately dispatch it hot in insulated thermal bags."
    },
    {
      q: "Do you offer free delivery?",
      a: "Yes! Delivery is completely FREE on all orders above ₹500. For orders below ₹500, a flat delivery surcharge of ₹50 is applied to cover routing and partner handling."
    },
    {
      q: "How do you ensure safe & hygienic packaging?",
      a: "All boxes are double-sealed in the kitchen using hot food-safe sanitization strips. Our delivery partners undergo temperature monitoring checks daily and wear double-filtration face coverings and nitrile gloves."
    },
    {
      q: "Can I opt for contactless delivery?",
      a: "Absolutely. During checkout, you can select 'Contactless Delivery' in the instructions box. Your rider will place your pizza box on a clean surface at your doorstep, ring the bell, and step back 2 meters to verify drop-off safely."
    }
  ];

  return (
    <div className="bg-white min-h-screen pb-20 font-sans">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* 1. Hero Delivery Banner matching screenshot */}
        <div className="relative bg-gradient-to-r from-[#FFF5F0] via-[#FFF9F6] to-[#FFF5F0] rounded-[2.5rem] p-8 sm:p-12 border border-orange-100/50 flex flex-col lg:flex-row items-center justify-between mb-12 shadow-[0_15px_40px_rgba(255,107,0,0.015)] overflow-hidden min-h-[380px]">
          
          {/* Left Content column (55% width) */}
          <div className="w-full lg:w-[55%] text-left space-y-6 z-10">
            <h1 className="text-[34px] sm:text-[46px] font-black text-gray-900 leading-tight tracking-tight">
              Fast Delivery, <br />
              Right to Your Door!
            </h1>
            
            {/* 4 Bullet Points with orange checkmarks */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-orange-100 flex items-center justify-center text-[#FF6B00]">
                  <CheckIcon className="h-3.5 w-3.5 stroke-[3]" />
                </div>
                <span className="text-gray-700 font-extrabold text-[13.5px] sm:text-sm tracking-wide">Quick delivery in 30-40 mins</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-orange-100 flex items-center justify-center text-[#FF6B00]">
                  <CheckIcon className="h-3.5 w-3.5 stroke-[3]" />
                </div>
                <span className="text-gray-700 font-extrabold text-[13.5px] sm:text-sm tracking-wide">Live order tracking</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-orange-100 flex items-center justify-center text-[#FF6B00]">
                  <CheckIcon className="h-3.5 w-3.5 stroke-[3]" />
                </div>
                <span className="text-gray-700 font-extrabold text-[13.5px] sm:text-sm tracking-wide">Safe & hygienic packaging</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-orange-100 flex items-center justify-center text-[#FF6B00]">
                  <CheckIcon className="h-3.5 w-3.5 stroke-[3]" />
                </div>
                <span className="text-gray-700 font-extrabold text-[13.5px] sm:text-sm tracking-wide">Real-time updates</span>
              </div>
            </div>
            
            {/* Orange Button pill */}
            <div className="pt-4">
              <button 
                onClick={handleTrackOrder}
                className="bg-[#FF6B00] hover:bg-[#e66000] text-white px-8 py-3.5 rounded-full font-black text-sm shadow-md shadow-orange-500/10 hover:shadow-orange-500/20 active:scale-95 transition-all flex items-center gap-2"
              >
                Track Your Order &rarr;
              </button>
            </div>
          </div>
          
          {/* Right visual Column (45% width) matching visual layout */}
          <div className="w-full lg:w-[45%] flex items-center justify-center lg:justify-end relative mt-8 lg:mt-0">
            <div className="relative h-72 sm:h-80 w-full max-w-md overflow-visible flex items-center justify-end">
              
              {/* Phone overlay representing routing map */}
              <div className="absolute right-0 top-0 h-full w-[45%] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white rotate-6 bg-white z-0 hidden sm:block">
                <img 
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=400&q=80" 
                  alt="GPS Tracking Route" 
                  className="h-full w-full object-cover grayscale opacity-45"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-orange-500/30 flex items-center justify-center">
                  <div className="h-10 w-10 bg-[#FF6B00] rounded-full flex items-center justify-center text-white border-2 border-white shadow-lg animate-ping">
                    <MapPinIcon className="h-5 w-5" />
                  </div>
                </div>
              </div>

              {/* 3D Scooter Rider illustration */}
              <div className="h-full w-[85%] relative z-10 flex items-center justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?auto=format&fit=crop&w=600&q=80" 
                  alt="SliceSprint Fast Scooter Delivery Rider" 
                  className="h-[95%] w-auto object-contain rounded-[2.5rem] shadow-xl border-4 border-white hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Bouncing Map Pin visual */}
              <div className="absolute top-4 right-12 h-14 w-14 bg-[#EF4444] rounded-full flex items-center justify-center text-white border-2 border-white shadow-lg animate-bounce select-none z-20">
                <MapPinIcon className="h-7 w-7" />
              </div>

            </div>
          </div>

        </div>

        {/* 2. "How It Works" Section matching screenshot layout */}
        <div className="mb-16">
          <h2 className="text-[20px] font-black text-gray-900 tracking-tight text-left mb-8">
            How It Works
          </h2>
          
          {/* Horizontal Step Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Step 1: Place Order */}
            <div className="bg-[#FFFDFB] border border-orange-100/40 rounded-3xl p-5 flex items-center gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.005)] hover:border-orange-100 transition-all select-none min-h-[96px]">
              <div className="h-10 w-10 rounded-full bg-[#FF6B00] text-white flex items-center justify-center font-black text-[15px] flex-shrink-0">
                1
              </div>
              <div className="text-left">
                <span className="text-[14px] font-black text-gray-900 block leading-tight">Place Order</span>
                <span className="text-[12.5px] font-bold text-gray-400">Choose your favorite pizzas</span>
              </div>
            </div>

            {/* Step 2: We Prepare */}
            <div className="bg-[#FFFDFB] border border-orange-100/40 rounded-3xl p-5 flex items-center gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.005)] hover:border-orange-100 transition-all select-none min-h-[96px]">
              <div className="h-10 w-10 rounded-full bg-[#FF6B00] text-white flex items-center justify-center font-black text-[15px] flex-shrink-0">
                2
              </div>
              <div className="text-left">
                <span className="text-[14px] font-black text-gray-900 block leading-tight">We Prepare</span>
                <span className="text-[12.5px] font-bold text-gray-400">Fresh & hot pizzas prepared</span>
              </div>
            </div>

            {/* Step 3: On The Way */}
            <div className="bg-[#FFFDFB] border border-orange-100/40 rounded-3xl p-5 flex items-center gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.005)] hover:border-orange-100 transition-all select-none min-h-[96px]">
              <div className="h-10 w-10 rounded-full bg-[#FF6B00] text-white flex items-center justify-center font-black text-[15px] flex-shrink-0">
                3
              </div>
              <div className="text-left">
                <span className="text-[14px] font-black text-gray-900 block leading-tight">On The Way</span>
                <span className="text-[12.5px] font-bold text-gray-400">Rider picks up your order</span>
              </div>
            </div>

            {/* Step 4: Delivered */}
            <div className="bg-[#FFFDFB] border border-orange-100/40 rounded-3xl p-5 flex items-center gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.005)] hover:border-orange-100 transition-all select-none min-h-[96px]">
              <div className="h-10 w-10 rounded-full bg-[#FF6B00] text-white flex items-center justify-center font-black text-[15px] flex-shrink-0">
                4
              </div>
              <div className="text-left">
                <span className="text-[14px] font-black text-gray-900 block leading-tight">Delivered</span>
                <span className="text-[12.5px] font-bold text-gray-400">At your door in 30-40 mins</span>
              </div>
            </div>

          </div>
        </div>

        {/* 3. Secondary Coverage & FAQ section for a premium complete layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-gray-100 pt-16 items-start">
          
          {/* FAQ Accordion column */}
          <div className="lg:col-span-7 text-left space-y-6">
            <span className="text-xs font-black text-[#FF6B00] uppercase tracking-wider bg-orange-50 px-4 py-1.5 rounded-full">
              Delivery Support
            </span>
            <h2 className="text-[28px] sm:text-[34px] font-black text-gray-900 tracking-tight leading-none mb-6">
              Frequently Asked Questions
            </h2>
            
            <div className="divide-y divide-gray-100 border-b border-gray-100">
              {FAQS.map((faq, index) => {
                const isOpen = activeFaq === index;
                return (
                  <div key={index} className="py-4">
                    <button 
                      onClick={() => toggleFaq(index)}
                      className="w-full flex justify-between items-center py-2 text-left focus:outline-none"
                    >
                      <span className="text-[14px] sm:text-base font-black text-gray-800">{faq.q}</span>
                      <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#FF6B00]' : ''}`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 mt-2 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <p className="text-[13px] font-semibold text-gray-500 leading-relaxed bg-orange-50/10 rounded-2xl p-4 border border-orange-100/10">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Policy coverage card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#FFFDFB] to-[#FFF9F5] border border-orange-100 rounded-3xl p-6 sm:p-8 text-left shadow-inner">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">🚚</span>
              <div>
                <span className="text-base font-black text-gray-900 block leading-tight">Hot Guarantee</span>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">SliceSprint Policy</span>
              </div>
            </div>

            <p className="text-[13px] font-bold text-gray-500 leading-relaxed mb-6">
              We operate a strict **30-minute hot delivery guarantee** within our local standard delivery circles. 
              Our riders use custom-designed, multi-layered thermal bags that maintain a piping hot 70°C chamber 
              during transport.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <ClockIcon className="h-5 w-5 text-[#FF6B00] flex-shrink-0" />
                <span className="text-xs font-black text-gray-800">Bubbling Hot Oven-to-Door Service</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheckIcon className="h-5 w-5 text-[#FF6B00] flex-shrink-0" />
                <span className="text-xs font-black text-gray-800">Double-Sealed Tamper-Proof Packaging</span>
              </div>
              <div className="flex items-center gap-3">
                <SparklesIcon className="h-5 w-5 text-[#FF6B00] flex-shrink-0" />
                <span className="text-xs font-black text-gray-800">Free Delivery Surcharge Waiver above ₹500</span>
              </div>
            </div>
          </div>

        </div>

      </div>
      {toast && <Toast message={toast} type="success" onClose={() => setToast(null)} />}
    </div>
  );
};

export default DeliveryPage;
