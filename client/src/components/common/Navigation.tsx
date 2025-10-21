import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useClickOutside } from '../../hooks/useClickOutside';

export default function Navigation() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Close menus when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  // Click outside handlers
  const userMenuRef = useClickOutside<HTMLDivElement>(() => setIsUserMenuOpen(false));
  const mobileMenuRef = useClickOutside<HTMLDivElement>(() => setIsMenuOpen(false));

  const isAdmin = user?.role === 'admin' ;

  const navigationItems = [
    { name: 'Home', path: '/', icon: '🏠' },
    { name: 'Find Parking', path: '/parkings', icon: '🚗' },
    { name: 'Requests', path: '/requests', icon: '📝' },
    { name: 'Wallet', path: '/wallet', icon: '💰' },
    { name: 'Dashboard', path: '/dashboard', icon: '📜' },
    // Owner-only entries

  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="bg-white/95 backdrop-blur border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-gray-900 font-bold text-xl">ParkSmart</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors ${isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Wallet Balance */}
            <div className="hidden sm:flex items-center space-x-2 bg-green-100 px-3 py-2 rounded-lg">
              <span className="text-green-700">💰</span>
              <span className="text-green-800 font-medium">{user.wallet.coins} coins</span>
            </div>

            {/* User Avatar */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
              >
                <div className="flex justify-around items-center ring-1 ring-gray-300 p-2 rounded-lg">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-extrabold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden sm:block text-gray-900 p-2">{user.name}</span>
                  <span className="text-gray-900">▼</span>
                </div>
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  {isAdmin && (
                    <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      📊 Admin Dashboard
                    </Link>
                  )}
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    👤 Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-900 hover:bg-gray-100 p-2 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200" ref={mobileMenuRef}>
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) => `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </NavLink>
              ))}
              <div className="pt-2 border-t border-white border-opacity-20">
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  👤 Profile
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    📊 Dashboard
                  </Link>
                )}
                <div className="flex items-center space-x-3 px-3 py-2">
                  <span className="text-green-700">💰</span>
                  <span className="text-green-800 font-medium">{user.wallet.coins} coins</span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left flex items-center space-x-3 px-3 py-2 text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <span>🚪</span>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
