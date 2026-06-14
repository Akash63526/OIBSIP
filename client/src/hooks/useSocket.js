import { useEffect, useRef } from 'react';
import { connectSocket, disconnectSocket } from '../services/socketService';
import { useSelector } from 'react-redux';

export const useSocket = () => {
  const socketRef = useRef(null);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      socketRef.current = connectSocket();

      if (user?._id) {
        socketRef.current.emit('join_user_room', user._id);
      }
      
      if (user?.role === 'admin') {
        socketRef.current.emit('join_admin_room');
      }
    }

    return () => {
      disconnectSocket();
    };
  }, [isAuthenticated, user]);

  return socketRef.current;
};

export default useSocket;
