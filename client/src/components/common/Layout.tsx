import type { ReactNode } from 'react';
import Navigation from './Navigation';
import RealTimeStatus from './RealTimeStatus';
import RouteTransition from './RouteTransition';

interface LayoutProps {
  children: ReactNode;
  showNavigation?: boolean;
}

export default function Layout({ children, showNavigation = true }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700">
      {showNavigation && <Navigation />}
      <main className="flex-1 relative">
        <RouteTransition>
          {children}
        </RouteTransition>
      </main>
      {/* Real-time status indicator */}
      <div className="fixed bottom-4 right-4 z-40">
        <RealTimeStatus />
      </div>
    </div>
  );
}
