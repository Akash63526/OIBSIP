import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HomeIcon, 
  ClipboardDocumentListIcon, 
  ArchiveBoxIcon, 
  UsersIcon,
  BoltIcon,
  TruckIcon,
  TicketIcon,
  DocumentChartBarIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

const AdminSidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <HomeIcon className="w-5 h-5" />, end: true },
    { name: 'Orders', path: '/admin/orders', icon: <ClipboardDocumentListIcon className="w-5 h-5" /> },
    { name: 'Inventory', path: '/admin/inventory', icon: <ArchiveBoxIcon className="w-5 h-5" /> },
    { name: 'Customers', path: '/admin/customers', icon: <UsersIcon className="w-5 h-5" /> },
    { name: 'Menu Management', path: '/admin/menu', icon: <BoltIcon className="w-5 h-5" /> },
    { name: 'Delivery', path: '/admin/delivery', icon: <TruckIcon className="w-5 h-5" /> },
    { name: 'Offers & Coupons', path: '/admin/offers', icon: <TicketIcon className="w-5 h-5" /> },
    { name: 'Reports', path: '/admin/reports', icon: <DocumentChartBarIcon className="w-5 h-5" /> },
    { name: 'Reviews', path: '/admin/reviews', icon: <StarIcon className="w-5 h-5" /> },
    { name: 'Support Tickets', path: '/admin/support', icon: <ChatBubbleLeftRightIcon className="w-5 h-5" /> },
    { name: 'Settings', path: '/admin/settings', icon: <Cog6ToothIcon className="w-5 h-5" /> },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-100 h-screen sticky top-0 flex flex-col z-10">
      {/* Brand Header */}
      <div className="h-16 px-6 border-b border-gray-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF4C00] to-[#FF8000] flex items-center justify-center shadow-md shadow-orange-100 flex-shrink-0">
          <span className="text-base select-none">🍕</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="font-extrabold text-gray-800 text-md tracking-tight">SliceSprint</span>
          <span className="font-semibold text-orange-600 text-[10px] bg-orange-50 px-1.5 py-0.5 rounded-md">Admin</span>
        </div>
      </div>

      {/* Menu List */}
      <div className="flex-1 py-4 flex flex-col gap-1 px-4 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.end}
            className={({ isActive }) => 
              `flex items-center px-4 py-2.5 rounded-xl font-medium transition-all duration-150 gap-3 text-sm ${
                isActive 
                  ? 'bg-[#FFF5F0] text-[#FF4C00] font-semibold' 
                  : 'text-gray-500 hover:bg-[#FAFBFD] hover:text-gray-800'
              }`
            }
          >
            <div className="flex-shrink-0">
              {item.icon}
            </div>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default AdminSidebar;
