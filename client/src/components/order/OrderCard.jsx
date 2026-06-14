import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const OrderCard = ({ order }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'ORDER_RECEIVED': return 'bg-blue-100 text-blue-800';
      case 'IN_KITCHEN': return 'bg-yellow-100 text-yellow-800';
      case 'SENT_TO_DELIVERY': return 'bg-purple-100 text-purple-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-sm font-semibold text-gray-500">Order #{order._id.slice(-8).toUpperCase()}</span>
          <span className={`px-2 py-1 inline-flex text-xs font-bold rounded-md ${getStatusColor(order.status)}`}>
            {order.status.replace(/_/g, ' ')}
          </span>
        </div>
        <p className="text-gray-600 text-sm">
          Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
        </p>
        <p className="font-bold text-gray-900 mt-2">Total: ₹{order.totalAmount}</p>
        <div className="text-sm text-gray-500 mt-1">
          {order.items?.length || 0} items
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Link to={`/orders/${order._id}`}>
          <Button variant="outline">Details</Button>
        </Link>
        <Link to={`/orders/track/${order._id}`}>
          <Button>Track Order</Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderCard;
