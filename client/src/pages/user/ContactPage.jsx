import React, { useState } from 'react';
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  ClockIcon,
  ChatBubbleLeftRightIcon,
  GlobeAltIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import Toast from '../../components/ui/Toast';

const ContactPage = () => {
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      setToast('Please fill out all contact fields.');
      return;
    }

    setToast('Sending message... thank you for reaching out!');
    setTimeout(() => {
      setToast('Message sent successfully! Our team will get back to you shortly.');
      setForm({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <div className="bg-white min-h-screen pb-20 font-sans">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* 1. Hero Contact Section matching screenshot */}
        <div className="relative bg-gradient-to-br from-[#FFF7F0] via-[#FFF9F6] to-[#FFF5EC] rounded-[2.5rem] p-8 sm:p-12 border border-orange-100/50 flex flex-col lg:flex-row items-center justify-between mb-16 shadow-[0_15px_40px_rgba(255,107,0,0.015)] overflow-hidden min-h-[460px]">
          
          {/* Left Narrative details (45% width) */}
          <div className="w-full lg:w-[45%] text-left space-y-8 z-10">
            <div className="space-y-4">
              <h1 className="text-[34px] sm:text-[46px] font-black text-gray-900 leading-tight tracking-tight">
                We'd Love to <br />
                Hear From You!
              </h1>
              <p className="text-gray-500 font-extrabold text-sm sm:text-base leading-normal">
                Have a question or feedback? <br />
                We are here to help.
              </p>
            </div>
            
            {/* Contact Rows with colored red/orange icons matching screenshot */}
            <div className="space-y-5">
              
              {/* MapPin */}
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-orange-100/80 flex items-center justify-center text-[#FF6B00] flex-shrink-0 mt-0.5">
                  <MapPinIcon className="h-5 w-5 stroke-2" />
                </div>
                <div>
                  <span className="text-[13px] font-bold text-gray-400 block leading-tight">Address</span>
                  <span className="text-[13.5px] font-extrabold text-gray-800 leading-normal">123 Pizza Street, Food City, New York, USA</span>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-orange-100/80 flex items-center justify-center text-[#FF6B00] flex-shrink-0 mt-0.5">
                  <PhoneIcon className="h-5 w-5 stroke-2" />
                </div>
                <div>
                  <span className="text-[13px] font-bold text-gray-400 block leading-tight">Phone</span>
                  <span className="text-[13.5px] font-extrabold text-gray-800 leading-normal">+1 987 654 3210</span>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-orange-100/80 flex items-center justify-center text-[#FF6B00] flex-shrink-0 mt-0.5">
                  <EnvelopeIcon className="h-5 w-5 stroke-2" />
                </div>
                <div>
                  <span className="text-[13px] font-bold text-gray-400 block leading-tight">Email</span>
                  <span className="text-[13.5px] font-extrabold text-gray-800 leading-normal">support@slicesprint.com</span>
                </div>
              </div>

              {/* Clock */}
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-orange-100/80 flex items-center justify-center text-[#FF6B00] flex-shrink-0 mt-0.5">
                  <ClockIcon className="h-5 w-5 stroke-2" />
                </div>
                <div>
                  <span className="text-[13px] font-bold text-gray-400 block leading-tight">Hours</span>
                  <span className="text-[13.5px] font-extrabold text-gray-800 leading-normal">Mon - Sun: 9:00 AM - 11:00 PM</span>
                </div>
              </div>

            </div>
          </div>
          
          {/* Right Floating white Message Card column (50% width) matching screenshot layout */}
          <div className="w-full lg:w-[50%] mt-8 lg:mt-0 z-10 relative">
            
            <form 
              onSubmit={handleSubmit}
              className="bg-white border border-orange-100 rounded-[2rem] p-6 sm:p-8 text-left shadow-2xl relative flex flex-col gap-4 max-w-lg mx-auto"
            >
              <div className="flex items-center justify-between border-b border-gray-50 pb-4 mb-1">
                <h2 className="text-lg font-black text-gray-900 tracking-tight">Send us a Message</h2>
                <span className="text-xl">✍️</span>
              </div>

              {/* Side-by-side Name & Email Row matching screenshot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <input 
                    type="text" 
                    name="name"
                    placeholder="Your Name" 
                    value={form.name}
                    onChange={handleChange}
                    className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-orange-100 focus:border-[#FF6B00] outline-none text-gray-800 font-extrabold placeholder-gray-400 text-[13.5px] transition-all"
                  />
                </div>
                <div className="relative">
                  <input 
                    type="email" 
                    name="email"
                    placeholder="Your Email" 
                    value={form.email}
                    onChange={handleChange}
                    className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-orange-100 focus:border-[#FF6B00] outline-none text-gray-800 font-extrabold placeholder-gray-400 text-[13.5px] transition-all"
                  />
                </div>
              </div>

              {/* Full width Subject input */}
              <div className="relative">
                <input 
                  type="text" 
                  name="subject"
                  placeholder="Subject" 
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-orange-100 focus:border-[#FF6B00] outline-none text-gray-800 font-extrabold placeholder-gray-400 text-[13.5px] transition-all"
                />
              </div>

              {/* Message text area */}
              <div className="relative">
                <textarea 
                  name="message"
                  placeholder="Message" 
                  value={form.message}
                  onChange={handleChange}
                  className="w-full min-h-[120px] bg-gray-50/50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-orange-100 focus:border-[#FF6B00] outline-none text-gray-800 font-extrabold placeholder-gray-400 text-[13.5px] transition-all resize-none"
                />
              </div>

              {/* Submit Orange pill button */}
              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full bg-[#FF6B00] hover:bg-[#e66000] text-white py-4 rounded-2xl font-black text-sm shadow-md shadow-orange-500/10 hover:shadow-orange-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  Send Message &rarr;
                </button>
              </div>

            </form>
          </div>

          {/* Absolute Background sand silhouette/castles drawing decoration matching bottom visual */}
          <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none select-none opacity-10 flex items-end justify-center z-0">
            <svg viewBox="0 0 1440 320" className="w-full h-full fill-current text-orange-950">
              <path d="M0,192L48,181.3C96,171,192,149,288,149.3C384,149,480,171,576,192C672,213,768,235,864,229.3C960,224,1056,192,1152,181.3C1248,171,1344,181,1392,186.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>

        </div>

        {/* 2. Secondary Info strip for visual completeness below */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-100 pt-16 text-left">
          
          {/* Card 1 */}
          <div className="bg-[#FFFDFB] border border-orange-100/40 rounded-3xl p-6 flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center text-[#FF6B00] flex-shrink-0 mt-0.5">
              <ChatBubbleLeftRightIcon className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-black text-gray-900 block leading-tight mb-2">Live Support Chat</span>
              <p className="text-[12.5px] font-bold text-gray-400 leading-normal">
                Want to speak with us instantly? Click the bubble on the bottom right of the screen to chat live with our support team.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#FFFDFB] border border-orange-100/40 rounded-3xl p-6 flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center text-[#FF6B00] flex-shrink-0 mt-0.5">
              <GlobeAltIcon className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-black text-gray-900 block leading-tight mb-2">Corporate Orders</span>
              <p className="text-[12.5px] font-bold text-gray-400 leading-normal">
                Planning a large pizza party or corporate office event? Email corporate@slicesprint.com for dynamic bundle rates.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#FFFDFB] border border-orange-100/40 rounded-3xl p-6 flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center text-[#FF6B00] flex-shrink-0 mt-0.5">
              <SparklesIcon className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-black text-gray-900 block leading-tight mb-2">Franchise Queries</span>
              <p className="text-[12.5px] font-bold text-gray-400 leading-normal">
                Looking to bring SliceSprint's wood-fired perfection to your town? Contact partner@slicesprint.com for details.
              </p>
            </div>
          </div>

        </div>

      </div>
      {toast && <Toast message={toast} type="success" onClose={() => setToast(null)} />}
    </div>
  );
};

export default ContactPage;
