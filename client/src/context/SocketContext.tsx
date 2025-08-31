import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  joinParkingRoom: (parkingId: string) => void;
  leaveParkingRoom: (parkingId: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  const connect = () => {
    if (!user) return;

    const newSocket = io(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000', {
      auth: {
        userId: user._id,
        role: user.role
      }
    });

    newSocket.on('connect', () => {
      console.log('Connected to socket server');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from socket server');
      setIsConnected(false);
    });

    newSocket.on('authenticated', (data) => {
      console.log('Socket authenticated:', data);
    });

    newSocket.on('joined_parking_room', (data) => {
      console.log('Joined parking room:', data);
    });

    newSocket.on('parking_count_updated', (data) => {
      console.log('Parking count updated:', data);
      // You can emit a custom event here to notify components
      window.dispatchEvent(new CustomEvent('parkingCountUpdated', { detail: data }));
    });

    setSocket(newSocket);
  };

  const disconnect = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
    }
  };

  const joinParkingRoom = (parkingId: string) => {
    if (socket && isConnected) {
      socket.emit('join_parking_room', parkingId);
    }
  };

  const leaveParkingRoom = (parkingId: string) => {
    if (socket && isConnected) {
      socket.emit('leave_parking_room', parkingId);
    }
  };

  useEffect(() => {
    if (user) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [user]);

  const value: SocketContextType = {
    socket,
    isConnected,
    connect,
    disconnect,
    joinParkingRoom,
    leaveParkingRoom,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}