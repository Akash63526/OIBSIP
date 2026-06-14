import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  UserCircleIcon, 
  ClipboardDocumentListIcon,
  CogIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const navItems = [
    { name: 'Profile Overview', path: '/profile', icon: <UserCircleIcon className="w-5 h-5 mr-3" /> },
    { name: 'Order History', path: '/profile/orders', icon: <ClipboardDocumentListIcon className="w-5 h-5 mr-3" /> },
    { name: 'Account Settings', path: '/profile/settings', icon: <CogIcon className="w-5 h-5 mr-3" /> },
  ];

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 h-full hidden md:block">
      <div className="py-6 flex flex-col gap-2 px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end
            className={({ isActive }) => 
              `flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${
                isActive 
                  ? 'bg-red-50 text-red-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
