import React from 'react';
import StatsCard from '../../components/admin/StatsCard';
import { UsersIcon, CurrencyDollarIcon, ShoppingBagIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline';

const AdminDashboardPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Revenue" value="₹45,231" icon={<CurrencyDollarIcon className="w-6 h-6" />} trend="12%" isPositive={true} />
        <StatsCard title="Total Orders" value="156" icon={<ShoppingBagIcon className="w-6 h-6" />} trend="5%" isPositive={true} />
        <StatsCard title="Total Users" value="2,845" icon={<UsersIcon className="w-6 h-6" />} trend="2%" isPositive={true} />
        <StatsCard title="Low Stock Items" value="3" icon={<ArchiveBoxIcon className="w-6 h-6" />} trend="Action Required" isPositive={false} />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
