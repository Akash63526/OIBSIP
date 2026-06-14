import React from 'react';
import { 
  UserGroupIcon, 
  SparklesIcon, 
  TruckIcon, 
  HeartIcon,
  ShieldCheckIcon,
  ClockIcon,
  FireIcon
} from '@heroicons/react/24/outline';

const AboutPage = () => {        
  return (
    <div className="bg-white min-h-screen pb-20 font-sans">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* 1. Hero About Banner matching screenshot */}
        <div className="relative bg-gradient-to-r from-[#FFF5F0] via-[#FFF9F6] to-[#FFF5F0] rounded-[2.5rem] p-8 sm:p-12 border border-orange-100/50 flex flex-col lg:flex-row items-center justify-between mb-8 shadow-[0_15px_40px_rgba(255,107,0,0.015)] overflow-hidden min-h-[380px]">
          
          {/* Left Content column (55% width) */}
          <div className="w-full lg:w-[55%] text-left space-y-6 z-10">
            <h1 className="text-[36px] sm:text-[48px] font-black text-gray-900 leading-none tracking-tight">
              About <br />
              <span className="text-[#FF6B00]">SliceSprint</span>
            </h1>
            
            <p className="text-gray-500 font-bold text-sm sm:text-base max-w-lg leading-relaxed">
              SliceSprint is more than just pizza. We deliver happiness with every slice! 
              Made with fresh ingredients, baked to perfection and delivered to your door 
              in no time.
            </p>
            
            <div className="pt-2">
              <a 
                href="#our-story"
                className="inline-flex bg-[#FF6B00] hover:bg-[#e66000] text-white px-8 py-3.5 rounded-full font-black text-sm shadow-md shadow-orange-500/10 hover:shadow-orange-500/20 active:scale-95 transition-all"
              >
                Our Story
              </a>
            </div>
          </div>
          
          {/* Right visual Column (45% width) matching visual layout */}
          <div className="w-full lg:w-[45%] flex items-center justify-center lg:justify-end relative mt-8 lg:mt-0">
            <div className="relative h-64 sm:h-80 w-full max-w-md overflow-visible flex items-center justify-end">
              
              {/* Fresh tomatoes/leaves background decor */}
              <div className="absolute top-4 left-6 text-4xl animate-pulse delay-75 pointer-events-none select-none">🍅</div>
              <div className="absolute bottom-8 left-12 text-3xl animate-bounce delay-200 pointer-events-none select-none">🌿</div>
              <div className="absolute top-12 right-24 text-2xl pointer-events-none select-none">🍅</div>

              {/* Pizza image peel */}
              <img 
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80" 
                alt="Perfect SliceSprint Woodfired Pizza" 
                className="h-[105%] w-auto object-contain rounded-3xl shadow-2xl border-4 border-white rotate-2 hover:rotate-0 transition-transform duration-500"
              />
            </div>
          </div>

        </div>

        {/* 2. Row of 4 Visual Statistics Cards matching screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          
          {/* Card 1: 10K+ Happy Customers */}
          <div className="bg-[#FFFDFB] border border-orange-100/50 rounded-3xl p-5 flex items-center gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.005)] hover:shadow-md hover:border-orange-100 transition-all select-none">
            <div className="h-14 w-14 rounded-2xl bg-orange-50 flex items-center justify-center text-[#FF6B00] flex-shrink-0">
              <UserGroupIcon className="h-7 w-7" strokeWidth={2} />
            </div>
            <div>
              <span className="text-2xl font-black text-gray-900 block leading-tight">10K+</span>
              <span className="text-[12.5px] font-bold text-gray-400">Happy Customers</span>
            </div>
          </div>

          {/* Card 2: 250+ Delicious Items */}
          <div className="bg-[#FFFDFB] border border-orange-100/50 rounded-3xl p-5 flex items-center gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.005)] hover:shadow-md hover:border-orange-100 transition-all select-none">
            <div className="h-14 w-14 rounded-2xl bg-orange-50 flex items-center justify-center text-[#FF6B00] flex-shrink-0">
              <SparklesIcon className="h-7 w-7" strokeWidth={2} />
            </div>
            <div>
              <span className="text-2xl font-black text-gray-900 block leading-tight">250+</span>
              <span className="text-[12.5px] font-bold text-gray-400">Delicious Items</span>
            </div>
          </div>

          {/* Card 3: 50+ Delivery Partners */}
          <div className="bg-[#FFFDFB] border border-orange-100/50 rounded-3xl p-5 flex items-center gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.005)] hover:shadow-md hover:border-orange-100 transition-all select-none">
            <div className="h-14 w-14 rounded-2xl bg-orange-50 flex items-center justify-center text-[#FF6B00] flex-shrink-0">
              <TruckIcon className="h-7 w-7" strokeWidth={2} />
            </div>
            <div>
              <span className="text-2xl font-black text-gray-900 block leading-tight">50+</span>
              <span className="text-[12.5px] font-bold text-gray-400">Delivery Partners</span>
            </div>
          </div>

          {/* Card 4: 99% Customer Satisfaction */}
          <div className="bg-[#FFFDFB] border border-orange-100/50 rounded-3xl p-5 flex items-center gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.005)] hover:shadow-md hover:border-orange-100 transition-all select-none">
            <div className="h-14 w-14 rounded-2xl bg-orange-50 flex items-center justify-center text-[#FF6B00] flex-shrink-0">
              <HeartIcon className="h-7 w-7" strokeWidth={2} />
            </div>
            <div>
              <span className="text-2xl font-black text-gray-900 block leading-tight">99%</span>
              <span className="text-[12.5px] font-bold text-gray-400">Customer Satisfaction</span>
            </div>
          </div>

        </div>

        {/* 3. Our Journey / Story Section below */}
        <div id="our-story" className="border-t border-gray-100 pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <span className="text-xs font-black text-[#FF6B00] uppercase tracking-wider bg-orange-50 px-4 py-1.5 rounded-full">
                Our Story
              </span>
              <h2 className="text-[28px] sm:text-[36px] font-black text-gray-900 tracking-tight leading-tight">
                Crafting Joy, One Perfect Crust At A Time
              </h2>
              <p className="text-gray-500 font-bold text-[14px] leading-relaxed">
                Founded in Bengaluru in 2023, SliceSprint was born out of a simple craving: 
                to merge the sublime, artisanal flavor of real Italian wood-fired pizza with 
                the blistering-fast speed of modern food delivery. No more soggy crusts. 
                No more cold toppings. 
              </p>
              <p className="text-gray-500 font-bold text-[14px] leading-relaxed">
                Our master pizzaiolos prepare our secret sourdough blend, hand-stretching each base 
                and proofing it for 48 full hours to guarantee the lightest, airiest, and crispiest 
                leopard-spotted finish. From there, we bake it at 450°C under oak wood flames, 
                locking in robust smoky notes that make every single bite an absolute masterpiece.
              </p>

              {/* Pillars list grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
                
                {/* Pillar 1 */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-900 font-black text-sm">
                    <FireIcon className="h-5 w-5 text-[#FF6B00]" strokeWidth={2.5} />
                    <span>450°C Woodfired</span>
                  </div>
                  <p className="text-gray-400 text-xs font-semibold">Baked under direct wood flames to lock in smokiness.</p>
                </div>

                {/* Pillar 2 */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-900 font-black text-sm">
                    <ClockIcon className="h-5 w-5 text-[#FF6B00]" strokeWidth={2.5} />
                    <span>48h Dough Proofing</span>
                  </div>
                  <p className="text-gray-400 text-xs font-semibold">Cold fermented dough to ensure peak digestibility.</p>
                </div>

                {/* Pillar 3 */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-900 font-black text-sm">
                    <ShieldCheckIcon className="h-5 w-5 text-[#FF6B00]" strokeWidth={2.5} />
                    <span>100% Organic Prep</span>
                  </div>
                  <p className="text-gray-400 text-xs font-semibold">Fresh handpicked farm ingredients daily.</p>
                </div>

              </div>

            </div>

            {/* Right Side Visual Block */}
            <div className="lg:col-span-5 relative">
              <div className="h-80 w-full rounded-[2rem] overflow-hidden shadow-xl border border-gray-100">
                <img 
                  src="https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=600&q=80" 
                  alt="SliceSprint Kitchen and Fresh Prep" 
                  className="h-full w-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              
              {/* Premium Overlay stamp */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-3xl p-4 border border-orange-100 shadow-lg flex items-center gap-3 select-none">
                <span className="text-3xl">🍕</span>
                <div className="text-left">
                  <span className="text-[13px] font-black text-gray-900 block leading-tight">Artisanal Quality</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Made with Love</span>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
