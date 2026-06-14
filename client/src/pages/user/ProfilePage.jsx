import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import Toast from '../../components/ui/Toast';

// High-fidelity preloaded addresses
const INITIAL_ADDRESSES = [
  {
    id: 'home',
    label: 'Home',
    default: true,
    selected: true,
    text: 'Apt 101, Green Park Residency\nMG Road, Bengaluru - 560001\nKarnataka, India',
    phone: '+91 98765 43210'
  },
  {
    id: 'work',
    label: 'Work',
    default: false,
    selected: false,
    text: 'Office #502, Tech Tower\nOuter Ring Road, Bengaluru - 560037\nKarnataka, India',
    phone: '+91 91234 56789'
  }
];

const ProfilePage = () => {
  const dispatch = useDispatch();
  // Core user states
  const [profile, setProfile] = useState({
    name: 'Alex Kumar',
    email: 'alex.kumar@email.com',
    phone: '+91 98765 43210',
    dob: '15 / 08 / 1992'
  });

  // Sidebar navigation highlight
  const [activeTab, setActiveTab] = useState('profile-overview');

  // Address selection state
  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES);
  
  // Toggles state
  const [toggles, setToggles] = useState({
    emailNotif: true,
    smsNotif: true,
    marketing: false,
    darkMode: false
  });

  // Modal control states
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null); // null means "Add New Address"
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Address form fields
  const [addressForm, setAddressForm] = useState({
    label: '',
    text: '',
    phone: '',
    isDefault: false
  });

  // Profile form modal fields
  const [profileForm, setProfileForm] = useState({ ...profile });

  // Update Profile Form (Direct Page Card inputs)
  const [directProfileForm, setDirectProfileForm] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    dob: '1992-08-15' // Format for date input
  });

  // Password fields state
  const [passwords, setPasswords] = useState({
    current: 'supersecretpwd',
    new: '',
    confirm: ''
  });

  // Password obscuring eye toggles
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Toast alert messaging
  const [toast, setToast] = useState(null);

  // Sync profile details to direct inputs when profile updates
  useEffect(() => {
    setDirectProfileForm({
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      dob: '1992-08-15'
    });
  }, [profile]);

  // Handle address card click selection
  const handleSelectAddress = (id) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      selected: addr.id === id
    })));
    setToast(`Selected ${id === 'home' ? 'Home' : 'Work'} address`);
  };

  // Launch address modal for creating a new card
  const handleOpenAddAddress = () => {
    setEditingAddress(null);
    setAddressForm({
      label: '',
      text: '',
      phone: '',
      isDefault: false
    });
    setIsAddressModalOpen(true);
  };

  // Launch address modal for editing an existing card
  const handleOpenEditAddress = (addr, e) => {
    e.stopPropagation(); // Avoid choosing the address when clicking edit link
    setEditingAddress(addr);
    setAddressForm({
      label: addr.label,
      text: addr.text,
      phone: addr.phone,
      isDefault: addr.default
    });
    setIsAddressModalOpen(true);
  };

  // Submit address edits or additions
  const handleSubmitAddress = (e) => {
    e.preventDefault();
    if (!addressForm.label || !addressForm.text || !addressForm.phone) {
      setToast('Please fill out all address fields.');
      return;
    }

    if (editingAddress) {
      // Edit mode
      setAddresses(addresses.map(addr => {
        if (addr.id === editingAddress.id) {
          return {
            ...addr,
            label: addressForm.label,
            text: addressForm.text,
            phone: addressForm.phone,
            default: addressForm.isDefault
          };
        }
        // If the edited address becomes default, make other addresses non-default
        if (addressForm.isDefault && addr.id !== editingAddress.id) {
          return { ...addr, default: false };
        }
        return addr;
      }));
      setToast('Address details updated successfully!');
    } else {
      // Add mode
      const newId = `addr_${Date.now()}`;
      const newAddress = {
        id: newId,
        label: addressForm.label,
        default: addressForm.isDefault,
        selected: false,
        text: addressForm.text,
        phone: addressForm.phone
      };

      let updatedAddresses = [...addresses];
      if (addressForm.isDefault) {
        updatedAddresses = updatedAddresses.map(addr => ({ ...addr, default: false }));
      }
      setAddresses([...updatedAddresses, newAddress]);
      setToast('New address saved to profile!');
    }
    setIsAddressModalOpen(false);
  };

  // Profile modal edit launcher
  const handleOpenEditProfile = () => {
    setProfileForm({ ...profile });
    setIsProfileModalOpen(true);
  };

  // Save profile edits from modal
  const handleSaveProfileModal = (e) => {
    e.preventDefault();
    setProfile({ ...profileForm });
    setIsProfileModalOpen(false);
    setToast('Profile overview updated!');
  };

  // Save profile edits directly from the page form
  const handleSaveDirectProfile = (e) => {
    e.preventDefault();
    // Parse Date back to screenshot format (e.g. 15 / 08 / 1992)
    let formattedDob = profile.dob;
    if (directProfileForm.dob) {
      const parts = directProfileForm.dob.split('-');
      if (parts.length === 3) {
        formattedDob = `${parts[2]} / ${parts[1]} / ${parts[0]}`;
      }
    }

    setProfile({
      name: directProfileForm.name,
      email: directProfileForm.email,
      phone: directProfileForm.phone,
      dob: formattedDob
    });
    setToast('Profile settings saved successfully!');
  };

  // Toggle handlers
  const handleToggle = (key) => {
    setToggles(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      if (key === 'darkMode') {
        setToast(`Dark Mode ${updated.darkMode ? 'enabled' : 'disabled'}! (Demo mode)`);
      } else {
        setToast(`Preference updated successfully`);
      }
      return updated;
    });
  };

  // Handle password submission
  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!passwords.new || !passwords.confirm) {
      setToast('Please enter your new password.');
      return;
    }
    if (passwords.new !== passwords.confirm) {
      setToast('Passwords do not match! Please check details.');
      return;
    }
    setToast('Password updated securely!');
    setPasswords({ current: passwords.new, new: '', confirm: '' });
  };

  // Resend email trigger
  const handleResendEmail = () => {
    setToast(`Verification email re-sent to ${profile.email}!`);
  };

  // Logout all sessions
  const handleLogoutAll = () => {
    setToast('Successfully logged out from all other active devices.');
  };

  // Core navigation tab click smooth scrolling
  const handleTabClick = (tabId, elementId) => {
    setActiveTab(tabId);
    if (tabId === 'logout') {
      setIsLogoutModalOpen(true);
      return;
    }
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Confirm logout actions
  const handleConfirmLogout = async () => {
    setToast('Logging out from SliceSprint...');
    setIsLogoutModalOpen(false);
    await dispatch(logout());
    window.location.href = '/';
  };

  return (
    <div className={`min-h-screen pb-16 font-sans transition-all duration-300 ${
      toggles.darkMode ? 'bg-[#121214] text-gray-100' : 'bg-white text-gray-800'
    }`}>
      
      {/* Maximum Container wrapper */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Profile Sidebar layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDEBAR: Nav tabs panel (3/12 width) */}
          <div className="lg:col-span-3 space-y-4">
            <div className={`rounded-3xl border p-5 shadow-[0_15px_40px_rgba(0,0,0,0.015)] sticky top-24 transition-colors duration-300 ${
              toggles.darkMode ? 'bg-[#1e1e24] border-[#2e2e38]' : 'bg-white border-gray-100'
            }`}>
              
              <div className="space-y-1">
                {/* Profile Overview Tab */}
                <button
                  onClick={() => handleTabClick('profile-overview', 'profile-overview-sec')}
                  className={`w-full flex items-center gap-3.5 px-5 py-4 rounded-2xl text-[14.5px] font-black transition-all ${
                    activeTab === 'profile-overview'
                      ? 'bg-orange-50/70 text-[#FF6B00]'
                      : 'text-gray-400 hover:text-gray-800'
                  }`}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile Overview
                </button>

                {/* Addresses Tab */}
                <button
                  onClick={() => handleTabClick('addresses', 'saved-addresses-sec')}
                  className={`w-full flex items-center gap-3.5 px-5 py-4 rounded-2xl text-[14.5px] font-black transition-all ${
                    activeTab === 'addresses'
                      ? 'bg-orange-50/70 text-[#FF6B00]'
                      : 'text-gray-400 hover:text-gray-800'
                  }`}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Addresses
                </button>

                {/* Order History Tab */}
                <button
                  onClick={() => {
                    setActiveTab('order-history');
                    setToast('Loading Order History Page...');
                    setTimeout(() => window.location.href = '/orders', 800);
                  }}
                  className={`w-full flex items-center gap-3.5 px-5 py-4 rounded-2xl text-[14.5px] font-black transition-all ${
                    activeTab === 'order-history'
                      ? 'bg-orange-50/70 text-[#FF6B00]'
                      : 'text-gray-400 hover:text-gray-800'
                  }`}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Order History
                </button>

                {/* Payment Methods Tab */}
                <button
                  onClick={() => {
                    setActiveTab('payment-methods');
                    setToast('Payment Methods configuration secured.');
                  }}
                  className={`w-full flex items-center gap-3.5 px-5 py-4 rounded-2xl text-[14.5px] font-black transition-all ${
                    activeTab === 'payment-methods'
                      ? 'bg-orange-50/70 text-[#FF6B00]'
                      : 'text-gray-400 hover:text-gray-800'
                  }`}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Payment Methods
                </button>

                {/* Preferences Tab */}
                <button
                  onClick={() => handleTabClick('preferences', 'account-preferences-sec')}
                  className={`w-full flex items-center gap-3.5 px-5 py-4 rounded-2xl text-[14.5px] font-black transition-all ${
                    activeTab === 'preferences'
                      ? 'bg-orange-50/70 text-[#FF6B00]'
                      : 'text-gray-400 hover:text-gray-800'
                  }`}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Preferences
                </button>

                {/* Security Tab */}
                <button
                  onClick={() => handleTabClick('security', 'security-credentials-sec')}
                  className={`w-full flex items-center gap-3.5 px-5 py-4 rounded-2xl text-[14.5px] font-black transition-all ${
                    activeTab === 'security'
                      ? 'bg-orange-50/70 text-[#FF6B00]'
                      : 'text-gray-400 hover:text-gray-800'
                  }`}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Security
                </button>

                {/* Divider Line */}
                <div className="h-px bg-gray-100 my-2"></div>

                {/* Logout Tab */}
                <button
                  onClick={() => handleTabClick('logout')}
                  className="w-full flex items-center gap-3.5 px-5 py-4 rounded-2xl text-[14.5px] font-black text-red-500 hover:bg-red-50/40 transition-all"
                >
                  <svg className="h-5 w-5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>

            </div>
          </div>

          {/* RIGHT SIDEBAR: Dashboard sections list (9/12 width) */}
          <div className="lg:col-span-9 space-y-8">
            
            {/* SECTION 1: Profile Overview */}
            <div 
              id="profile-overview-sec" 
              className={`rounded-3xl border p-6 transition-all duration-300 shadow-[0_15px_40px_rgba(0,0,0,0.015)] ${
                toggles.darkMode ? 'bg-[#1e1e24] border-[#2e2e38]' : 'bg-white border-gray-100'
              }`}
            >
              <h2 className="text-[20px] font-black tracking-tight mb-6">Profile Overview</h2>
              
              <div className="flex flex-col sm:flex-row items-center gap-6 justify-between">
                <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                  {/* 3D Animated Boy Avatar Profile */}
                  <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-orange-100 bg-[#FFFDFB] shadow-md flex-shrink-0">
                    <img 
                      src="https://img.freepik.com/premium-vector/vector-3d-boy-icon-cute-3d-cartoon-boy-design_984027-313.jpg" 
                      alt="Alex Kumar" 
                      className="h-full w-full object-cover scale-110"
                      onError={(e) => {
                        e.target.src = "https://i.pravatar.cc/300?img=11";
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="text-[21px] font-black leading-tight mb-1">{profile.name}</h3>
                    <p className="text-[14px] font-bold text-gray-400 block mb-1">{profile.email}</p>
                    <p className="text-[14.5px] font-extrabold text-gray-500">{profile.phone}</p>
                  </div>
                </div>

                <button 
                  onClick={handleOpenEditProfile}
                  className="border border-[#FF6B00] hover:bg-orange-50/20 text-[#FF6B00] px-8 py-2.5 rounded-2xl text-[13.5px] font-black transition-all active:scale-95 flex-shrink-0"
                >
                  Edit
                </button>
              </div>
            </div>

            {/* SECTION 2: Saved Addresses */}
            <div 
              id="saved-addresses-sec" 
              className={`rounded-3xl border p-6 transition-all duration-300 shadow-[0_15px_40px_rgba(0,0,0,0.015)] ${
                toggles.darkMode ? 'bg-[#1e1e24] border-[#2e2e38]' : 'bg-white border-gray-100'
              }`}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[20px] font-black tracking-tight">Saved Addresses</h2>
                <button 
                  onClick={handleOpenAddAddress}
                  className="text-[#FF6B00] hover:text-[#e66000] text-[13.5px] font-black transition-colors"
                >
                  + Add New Address
                </button>
              </div>

              {/* Address card grids (2 columns responsive) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {addresses.map((addr) => {
                  return (
                    <div 
                      key={addr.id}
                      onClick={() => handleSelectAddress(addr.id)}
                      className={`cursor-pointer rounded-3xl p-5 border-2 transition-all relative flex flex-col justify-between min-h-[170px] ${
                        addr.selected 
                          ? 'border-[#FF6B00] bg-orange-50/5 shadow-sm' 
                          : toggles.darkMode ? 'border-[#2e2e38] hover:border-gray-600 bg-[#25252d]/40' : 'border-gray-100 hover:border-gray-200 bg-white'
                      }`}
                    >
                      <div>
                        {/* Radio selection circle & tag */}
                        <div className="flex items-center gap-2.5 mb-3.5">
                          <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                            addr.selected ? 'border-[#FF6B00]' : 'border-gray-300'
                          }`}>
                            {addr.selected && <div className="h-2.5 w-2.5 rounded-full bg-[#FF6B00]" />}
                          </div>
                          <span className="text-[14.5px] font-black tracking-tight">{addr.label}</span>
                          
                          {/* Default tag */}
                          {addr.default && (
                            <span className="bg-[#22C55E]/10 text-[#22C55E] text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wide">
                              Default
                            </span>
                          )}
                        </div>

                        {/* Address detail strings */}
                        <p className={`text-[12.5px] font-semibold leading-relaxed mb-4 whitespace-pre-line ${
                          toggles.darkMode ? 'text-gray-300' : 'text-gray-500'
                        }`}>
                          {addr.text}
                        </p>
                      </div>

                      {/* Phone & Edit footer */}
                      <div className="flex justify-between items-center border-t pt-3.5 transition-colors border-gray-100/50">
                        <span className={`text-[12px] font-extrabold ${toggles.darkMode ? 'text-gray-400' : 'text-gray-400'}`}>{addr.phone}</span>
                        <button 
                          onClick={(e) => handleOpenEditAddress(addr, e)}
                          className="text-[#FF6B00] hover:text-[#e66000] text-[12px] font-black"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SECTION 3: Update Profile & Account Preferences side by side grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card A: Update Profile Form */}
              <div 
                id="update-profile-sec"
                className={`rounded-3xl border p-6 transition-all duration-300 shadow-[0_15px_40px_rgba(0,0,0,0.015)] ${
                  toggles.darkMode ? 'bg-[#1e1e24] border-[#2e2e38]' : 'bg-white border-gray-100'
                }`}
              >
                <h2 className="text-[19px] font-black tracking-tight mb-5">Update Profile</h2>
                
                <form onSubmit={handleSaveDirectProfile} className="space-y-4.5">
                  <div>
                    <label className="block text-[11.5px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Full Name</label>
                    <input 
                      type="text"
                      value={directProfileForm.name}
                      onChange={(e) => setDirectProfileForm({ ...directProfileForm, name: e.target.value })}
                      className={`w-full text-[13.5px] font-bold px-4 py-3 rounded-2xl border transition-all focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 ${
                        toggles.darkMode ? 'bg-[#25252d] border-[#2e2e38] text-white focus:border-[#FF6B00]' : 'bg-white border-gray-100 focus:border-[#FF6B00]'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-[11.5px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Email Address</label>
                    <input 
                      type="email"
                      value={directProfileForm.email}
                      onChange={(e) => setDirectProfileForm({ ...directProfileForm, email: e.target.value })}
                      className={`w-full text-[13.5px] font-bold px-4 py-3 rounded-2xl border transition-all focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 ${
                        toggles.darkMode ? 'bg-[#25252d] border-[#2e2e38] text-white focus:border-[#FF6B00]' : 'bg-white border-gray-100 focus:border-[#FF6B00]'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-[11.5px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Phone Number</label>
                    <input 
                      type="text"
                      value={directProfileForm.phone}
                      onChange={(e) => setDirectProfileForm({ ...directProfileForm, phone: e.target.value })}
                      className={`w-full text-[13.5px] font-bold px-4 py-3 rounded-2xl border transition-all focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 ${
                        toggles.darkMode ? 'bg-[#25252d] border-[#2e2e38] text-white focus:border-[#FF6B00]' : 'bg-white border-gray-100 focus:border-[#FF6B00]'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-[11.5px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Date of Birth</label>
                    <div className="relative">
                      <input 
                        type="date"
                        value={directProfileForm.dob}
                        onChange={(e) => setDirectProfileForm({ ...directProfileForm, dob: e.target.value })}
                        className={`w-full text-[13.5px] font-bold pl-4 pr-11 py-3 rounded-2xl border transition-all focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 ${
                          toggles.darkMode ? 'bg-[#25252d] border-[#2e2e38] text-white focus:border-[#FF6B00]' : 'bg-white border-gray-100 focus:border-[#FF6B00]'
                        }`}
                      />
                      <svg className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full mt-2 bg-[#FF6B00] hover:bg-[#e66000] text-white py-3.5 rounded-2xl text-[14px] font-black shadow-md shadow-orange-500/10 active:scale-95 transition-all"
                  >
                    Update Profile
                  </button>
                </form>
              </div>

              {/* Card B: Account Preferences */}
              <div 
                id="account-preferences-sec"
                className={`rounded-3xl border p-6 transition-all duration-300 shadow-[0_15px_40px_rgba(0,0,0,0.015)] ${
                  toggles.darkMode ? 'bg-[#1e1e24] border-[#2e2e38]' : 'bg-white border-gray-100'
                }`}
              >
                <h2 className="text-[19px] font-black tracking-tight mb-6">Account Preferences</h2>
                
                <div className="space-y-6">
                  {/* Email Toggle Row */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-left">
                      <span className="text-[13.5px] font-black tracking-tight block">Email Notifications</span>
                      <span className="text-[11.5px] font-semibold text-gray-400 block mt-0.5">Receive order updates via email</span>
                    </div>
                    <button 
                      onClick={() => handleToggle('emailNotif')}
                      className={`h-7 w-12 rounded-full p-1 transition-colors duration-300 flex-shrink-0 ${
                        toggles.emailNotif ? 'bg-[#FF6B00]' : 'bg-gray-200'
                      }`}
                    >
                      <div className={`h-5 w-5 rounded-full bg-white transition-transform duration-300 shadow-sm ${
                        toggles.emailNotif ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  {/* SMS Toggle Row */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-left">
                      <span className="text-[13.5px] font-black tracking-tight block">SMS Notifications</span>
                      <span className="text-[11.5px] font-semibold text-gray-400 block mt-0.5">Receive order updates via SMS</span>
                    </div>
                    <button 
                      onClick={() => handleToggle('smsNotif')}
                      className={`h-7 w-12 rounded-full p-1 transition-colors duration-300 flex-shrink-0 ${
                        toggles.smsNotif ? 'bg-[#FF6B00]' : 'bg-gray-200'
                      }`}
                    >
                      <div className={`h-5 w-5 rounded-full bg-white transition-transform duration-300 shadow-sm ${
                        toggles.smsNotif ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  {/* Marketing Toggle Row */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-left">
                      <span className="text-[13.5px] font-black tracking-tight block">Marketing Emails</span>
                      <span className="text-[11.5px] font-semibold text-gray-400 block mt-0.5">Receive offers and promotions</span>
                    </div>
                    <button 
                      onClick={() => handleToggle('marketing')}
                      className={`h-7 w-12 rounded-full p-1 transition-colors duration-300 flex-shrink-0 ${
                        toggles.marketing ? 'bg-[#FF6B00]' : 'bg-gray-200'
                      }`}
                    >
                      <div className={`h-5 w-5 rounded-full bg-white transition-transform duration-300 shadow-sm ${
                        toggles.marketing ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  {/* Dark Mode Toggle Row */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-left">
                      <span className="text-[13.5px] font-black tracking-tight block">Dark Mode</span>
                      <span className="text-[11.5px] font-semibold text-gray-400 block mt-0.5">Enable dark theme</span>
                    </div>
                    <button 
                      onClick={() => handleToggle('darkMode')}
                      className={`h-7 w-12 rounded-full p-1 transition-colors duration-300 flex-shrink-0 ${
                        toggles.darkMode ? 'bg-[#FF6B00]' : 'bg-gray-200'
                      }`}
                    >
                      <div className={`h-5 w-5 rounded-full bg-white transition-transform duration-300 shadow-sm ${
                        toggles.darkMode ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* SECTION 4: Security & Credentials (3 columns layout) */}
            <div 
              id="security-credentials-sec"
              className={`rounded-3xl border p-6 transition-all duration-300 shadow-[0_15px_40px_rgba(0,0,0,0.015)] ${
                toggles.darkMode ? 'bg-[#1e1e24] border-[#2e2e38]' : 'bg-white border-gray-100'
              }`}
            >
              <h2 className="text-[20px] font-black tracking-tight mb-6">Security & Credentials</h2>

              {/* 3 columns wrapper */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                
                {/* Column 1: Change Password */}
                <div className={`rounded-2xl p-5 border flex flex-col justify-between transition-colors ${
                  toggles.darkMode ? 'bg-[#25252d]/40 border-[#2e2e38]' : 'bg-gray-50/20 border-gray-100'
                }`}>
                  <div>
                    <h3 className="text-[14.5px] font-black text-gray-900 tracking-tight mb-4 flex items-center gap-2">
                      <span>Change Password</span>
                    </h3>
                    
                    <form onSubmit={handleUpdatePassword} className="space-y-3.5">
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Current Password</label>
                        <div className="relative">
                          <input 
                            type={showPassword.current ? 'text' : 'password'}
                            value={passwords.current}
                            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                            className={`w-full text-[13px] font-bold pl-3 pr-10 py-2.5 rounded-xl border transition-all ${
                              toggles.darkMode ? 'bg-[#1e1e24] border-[#2e2e38] text-white' : 'bg-white border-gray-100'
                            }`}
                          />
                          <button 
                            type="button"
                            onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword.current ? '🙈' : '👁️'}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">New Password</label>
                        <div className="relative">
                          <input 
                            type={showPassword.new ? 'text' : 'password'}
                            value={passwords.new}
                            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                            className={`w-full text-[13px] font-bold pl-3 pr-10 py-2.5 rounded-xl border transition-all ${
                              toggles.darkMode ? 'bg-[#1e1e24] border-[#2e2e38] text-white' : 'bg-white border-gray-100'
                            }`}
                          />
                          <button 
                            type="button"
                            onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword.new ? '🙈' : '👁️'}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Confirm New Password</label>
                        <div className="relative">
                          <input 
                            type={showPassword.confirm ? 'text' : 'password'}
                            value={passwords.confirm}
                            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                            className={`w-full text-[13px] font-bold pl-3 pr-10 py-2.5 rounded-xl border transition-all ${
                              toggles.darkMode ? 'bg-[#1e1e24] border-[#2e2e38] text-white' : 'bg-white border-gray-100'
                            }`}
                          />
                          <button 
                            type="button"
                            onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword.confirm ? '🙈' : '👁️'}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>

                  <button 
                    onClick={handleUpdatePassword}
                    className="w-full mt-5 bg-[#FF6B00] hover:bg-[#e66000] text-white py-3 rounded-xl text-[12.5px] font-black transition-all active:scale-95"
                  >
                    Update Password
                  </button>
                </div>

                {/* Column 2: Email Verification */}
                <div className={`rounded-2xl p-5 border flex flex-col justify-between transition-colors ${
                  toggles.darkMode ? 'bg-[#25252d]/40 border-[#2e2e38]' : 'bg-gray-50/20 border-gray-100'
                }`}>
                  <div className="text-left">
                    <h3 className="text-[14.5px] font-black text-gray-900 tracking-tight mb-5">
                      Email Verification
                    </h3>
                    
                    {/* Verification Status Header */}
                    <div className="flex items-center gap-3 mb-4 bg-green-50/40 border border-green-100 p-3 rounded-2xl">
                      <div className="h-7 w-7 rounded-full bg-[#22C55E] flex items-center justify-center flex-shrink-0 text-white font-black text-xs">
                        ✓
                      </div>
                      <div>
                        <span className="text-[13px] font-black text-[#22C55E] block leading-none">Verified Email</span>
                        <span className="text-[11.5px] font-bold text-gray-400 block mt-1">{profile.email}</span>
                      </div>
                    </div>

                    <p className={`text-[12px] font-semibold leading-normal ${toggles.darkMode ? 'text-gray-400' : 'text-gray-400'}`}>
                      Your primary email address is verified and active for updates, reports, and payments details.
                    </p>
                  </div>

                  <button 
                    onClick={handleResendEmail}
                    className="w-full border border-[#FF6B00] text-[#FF6B00] hover:bg-orange-50/15 py-3 rounded-xl text-[12.5px] font-black transition-all active:scale-95"
                  >
                    Resend Verification Email
                  </button>
                </div>

                {/* Column 3: Active Sessions */}
                <div className={`rounded-2xl p-5 border flex flex-col justify-between transition-colors ${
                  toggles.darkMode ? 'bg-[#25252d]/40 border-[#2e2e38]' : 'bg-gray-50/20 border-gray-100'
                }`}>
                  <div className="text-left">
                    <h3 className="text-[14.5px] font-black text-gray-900 tracking-tight mb-3">
                      Active Sessions
                    </h3>
                    <p className="text-[11.5px] font-semibold text-gray-400 leading-normal mb-4">
                      You are currently logged in on these devices.
                    </p>

                    {/* Session Lists */}
                    <div className="space-y-4">
                      {/* Session 1 */}
                      <div className="text-left border-b pb-3 transition-colors border-gray-100/50">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[12px] font-black">Chrome on Windows</span>
                          <span className="bg-[#22C55E]/10 text-[#22C55E] text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
                            Active
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 block">Bengaluru, India • This Device</span>
                      </div>

                      {/* Session 2 */}
                      <div className="text-left">
                        <span className="text-[12px] font-black block">Mobile App on Android</span>
                        <span className="text-[10px] font-bold text-gray-400 block mt-1">Bengaluru, India • 2 days ago</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleLogoutAll}
                    className="w-full border border-[#FF6B00] text-[#FF6B00] hover:bg-orange-50/15 py-3 rounded-xl text-[12.5px] font-black transition-all active:scale-95"
                  >
                    Logout All
                  </button>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ========================================================
          MODAL 1: Edit Profile Overview Details 
         ======================================================== */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`rounded-3xl max-w-md w-full p-6 border shadow-2xl text-left animate-in fade-in zoom-in duration-200 ${
            toggles.darkMode ? 'bg-[#1e1e24] border-[#2e2e38] text-white' : 'bg-white border-gray-100 text-gray-800'
          }`}>
            <h3 className="text-[18px] font-black tracking-tight mb-4">Edit Profile Overview</h3>
            
            <form onSubmit={handleSaveProfileModal} className="space-y-4">
              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Full Name</label>
                <input 
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className={`w-full text-[13.5px] font-bold px-4 py-2.5 rounded-2xl border transition-all ${
                    toggles.darkMode ? 'bg-[#25252d] border-[#2e2e38] text-white' : 'bg-white border-gray-100'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Email Address</label>
                <input 
                  type="email"
                  required
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className={`w-full text-[13.5px] font-bold px-4 py-2.5 rounded-2xl border transition-all ${
                    toggles.darkMode ? 'bg-[#25252d] border-[#2e2e38] text-white' : 'bg-white border-gray-100'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Phone Number</label>
                <input 
                  type="text"
                  required
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className={`w-full text-[13.5px] font-bold px-4 py-2.5 rounded-2xl border transition-all ${
                    toggles.darkMode ? 'bg-[#25252d] border-[#2e2e38] text-white' : 'bg-white border-gray-100'
                  }`}
                />
              </div>

              <div className="flex gap-3 justify-end pt-3">
                <button 
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className={`px-5 py-2.5 rounded-2xl text-[13px] font-black transition-all ${
                    toggles.darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-[#FF6B00] hover:bg-[#e66000] text-white px-5 py-2.5 rounded-2xl text-[13px] font-black shadow-sm transition-all"
                >
                  Save Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: Add or Edit Saved Addresses 
         ======================================================== */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`rounded-3xl max-w-md w-full p-6 border shadow-2xl text-left animate-in fade-in zoom-in duration-200 ${
            toggles.darkMode ? 'bg-[#1e1e24] border-[#2e2e38] text-white' : 'bg-white border-gray-100 text-gray-800'
          }`}>
            <h3 className="text-[18px] font-black tracking-tight mb-4">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h3>
            
            <form onSubmit={handleSubmitAddress} className="space-y-4">
              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Label (e.g. Home, Work)</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Home, Work, Parents"
                  value={addressForm.label}
                  onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                  className={`w-full text-[13.5px] font-bold px-4 py-2.5 rounded-2xl border transition-all ${
                    toggles.darkMode ? 'bg-[#25252d] border-[#2e2e38] text-white' : 'bg-white border-gray-100'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Street Address</label>
                <textarea 
                  required
                  rows="3"
                  placeholder="Street name, suite, city, state, pincode"
                  value={addressForm.text}
                  onChange={(e) => setAddressForm({ ...addressForm, text: e.target.value })}
                  className={`w-full text-[13.5px] font-semibold px-4 py-2.5 rounded-2xl border transition-all ${
                    toggles.darkMode ? 'bg-[#25252d] border-[#2e2e38] text-white' : 'bg-white border-gray-100'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Phone Number</label>
                <input 
                  type="text"
                  required
                  placeholder="+91 XXXXX XXXXX"
                  value={addressForm.phone}
                  onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                  className={`w-full text-[13.5px] font-bold px-4 py-2.5 rounded-2xl border transition-all ${
                    toggles.darkMode ? 'bg-[#25252d] border-[#2e2e38] text-white' : 'bg-white border-gray-100'
                  }`}
                />
              </div>

              <div className="flex items-center gap-3">
                <input 
                  type="checkbox"
                  id="defaultAddressCheckbox"
                  checked={addressForm.isDefault}
                  onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                  className="accent-[#FF6B00] h-4 w-4"
                />
                <label htmlFor="defaultAddressCheckbox" className="text-[12.5px] font-bold cursor-pointer select-none">
                  Set as Default Address
                </label>
              </div>

              <div className="flex gap-3 justify-end pt-3">
                <button 
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className={`px-5 py-2.5 rounded-2xl text-[13px] font-black transition-all ${
                    toggles.darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-[#FF6B00] hover:bg-[#e66000] text-white px-5 py-2.5 rounded-2xl text-[13px] font-black shadow-sm transition-all"
                >
                  {editingAddress ? 'Save Changes' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 3: Logout Confirmation Alert
         ======================================================== */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`rounded-3xl max-w-sm w-full p-6 border shadow-2xl text-center animate-in fade-in zoom-in duration-200 ${
            toggles.darkMode ? 'bg-[#1e1e24] border-[#2e2e38] text-white' : 'bg-white border-gray-100 text-gray-800'
          }`}>
            <div className="h-12 w-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-2xl mx-auto mb-4">
              🚪
            </div>
            <h3 className="text-[17px] font-black tracking-tight mb-2">Confirm Logout</h3>
            <p className={`text-[12.5px] font-semibold mb-6 ${toggles.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Are you sure you want to log out of your SliceSprint account? You will need to sign back in.
            </p>
            
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => setIsLogoutModalOpen(false)}
                className={`px-5 py-2.5 rounded-2xl text-[12.5px] font-black transition-all ${
                  toggles.darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                }`}
              >
                No, Stay
              </button>
              <button 
                onClick={handleConfirmLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-2xl text-[12.5px] font-black shadow-sm transition-all active:scale-95"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Toast component */}
      {toast && <Toast message={toast} type="success" onClose={() => setToast(null)} />}
    </div>
  );
};

export default ProfilePage;
