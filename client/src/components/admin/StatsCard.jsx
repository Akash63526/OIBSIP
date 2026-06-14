import React from 'react';

const StatsCard = ({ title, value, icon, trend, isPositive }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h4 className="text-2xl font-bold text-gray-900">{value}</h4>
        {trend && (
          <p className={`text-sm mt-2 font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '↑' : '↓'} {trend}
          </p>
        )}
      </div>
      <div className="p-3 bg-red-50 rounded-full text-red-600">
        {icon}
      </div>
    </div>
  );
};

export default StatsCard;
