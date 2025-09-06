import { useSocket } from '../../context/SocketContext';

interface RealTimeStatusProps {
  className?: string;
}

export default function RealTimeStatus({ className = '' }: RealTimeStatusProps) {
  const { isConnected } = useSocket();

  return (
    <div className={`flex items-center gap-2 bg-white bg-opacity-10 backdrop-blur-lg px-3 py-2 rounded-lg border border-white border-opacity-20 ${className}`}>
      <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
      <span className={`text-xs font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
        {isConnected ? 'Live Updates' : 'Offline'}
      </span>
    </div>
  );
}
