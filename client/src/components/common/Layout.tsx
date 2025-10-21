import type { ReactNode } from 'react';
import Navigation from './Navigation';
import RouteTransition from './RouteTransition';

interface LayoutProps {
  children: ReactNode;
  showNavigation?: boolean;
}

export default function Layout({ children, showNavigation = true }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {showNavigation && <Navigation />}
      <main className="flex-1 relative">
        {children}
      </main>
    </div>
  );
}
