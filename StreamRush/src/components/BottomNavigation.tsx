import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, TrendingUp, Users, PlaySquare, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface BottomNavigationProps {
  className?: string;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ className = '' }) => {
  const location = useLocation();
  const { currentUser, userProfile } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const NavItem: React.FC<{
    to: string;
    icon: React.ReactNode;
    label: string;
    requireAuth?: boolean;
  }> = ({ to, icon, label, requireAuth = false }) => {
    if (requireAuth && !currentUser) return null;

    return (
      <Link
        to={to}
        className={`flex flex-col items-center justify-center px-2 py-2 min-w-0 flex-1 transition-colors duration-200 ${
          isActive(to) ? 'text-red-500' : 'text-youtube-lightgray hover:text-white'
        }`}
      >
        <div className={`${isActive(to) ? 'text-red-500' : ''} mb-1 transition-transform duration-200 ${
          isActive(to) ? 'scale-110' : ''
        }`}>
          {icon}
        </div>
        <span className="text-xs font-medium truncate">{label}</span>
      </Link>
    );
  };

  return (
    <nav className={`fixed bottom-0 left-0 right-0 bg-youtube-dark/95 backdrop-blur-md border-t border-youtube-gray z-50 pb-safe-bottom ${className}`}>
      <div className="flex items-center justify-around max-w-full px-2">
        <NavItem to="/" icon={<Home size={20} />} label="Home" />
        <NavItem to="/trending" icon={<TrendingUp size={20} />} label="Trending" />
        {currentUser && (
          <NavItem to="/subscriptions" icon={<Users size={20} />} label="Subscriptions" />
        )}
        {currentUser && (
          <NavItem to="/playlists" icon={<PlaySquare size={20} />} label="Library" />
        )}
        {currentUser ? (
          <Link
            to="/profile"
            className={`flex flex-col items-center justify-center px-2 py-2 min-w-0 flex-1 transition-colors duration-200 ${
              isActive('/profile') ? 'text-red-500' : 'text-youtube-lightgray hover:text-white'
            }`}
          >
            <div className={`mb-1 transition-transform duration-200 ${
              isActive('/profile') ? 'scale-110' : ''
            }`}>
              {userProfile?.photoURL ? (
                <img
                  src={userProfile.photoURL}
                  alt="Profile"
                  className={`w-6 h-6 rounded-full object-cover ${
                    isActive('/profile') ? 'ring-2 ring-red-500' : ''
                  }`}
                />
              ) : (
                <div className={`w-6 h-6 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center ${
                  isActive('/profile') ? 'ring-2 ring-red-500' : ''
                }`}>
                  <User size={14} className="text-white" />
                </div>
              )}
            </div>
            <span className="text-xs font-medium truncate">You</span>
          </Link>
        ) : (
          <NavItem to="/login" icon={<User size={20} />} label="Sign in" />
        )}
      </div>
    </nav>
  );
};

export default BottomNavigation;