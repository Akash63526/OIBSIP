import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const OrderTracker = ({ currentStatus }) => {
  const statuses = [
    { key: 'ORDER_RECEIVED', label: 'Order Received' },
    { key: 'IN_KITCHEN', label: 'In Kitchen' },
    { key: 'SENT_TO_DELIVERY', label: 'Out for Delivery' },
    { key: 'DELIVERED', label: 'Delivered' }
  ];

  const getCurrentIndex = () => {
    const index = statuses.findIndex(s => s.key === currentStatus);
    return index >= 0 ? index : 0;
  };

  const currentIndex = getCurrentIndex();

  if (currentStatus === 'CANCELLED') {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg text-center font-bold">
        This order has been cancelled.
      </div>
    );
  }

  return (
    <div className="py-8 w-full">
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="h-1 w-full bg-gray-200"></div>
          <div 
            className="absolute h-1 bg-red-600 transition-all duration-500 ease-in-out" 
            style={{ width: `${(currentIndex / (statuses.length - 1)) * 100}%` }}
          ></div>
        </div>
        
        <ul className="relative flex justify-between w-full">
          {statuses.map((status, index) => {
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <li key={status.key} className="flex flex-col items-center">
                <div 
                  className={`flex items-center justify-center w-10 h-10 rounded-full z-10 transition-colors duration-300 ${
                    isCompleted ? 'bg-red-600' : 'bg-gray-200 border-4 border-white'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircleIcon className="w-6 h-6 text-white" />
                  ) : (
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  )}
                </div>
                <div className={`mt-3 text-xs sm:text-sm font-medium text-center ${
                  isCurrent ? 'text-red-600 font-bold' : isCompleted ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {status.label}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default OrderTracker;
