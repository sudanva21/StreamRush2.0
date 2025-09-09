import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, Video, Bell, User, LogOut, Play } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import NotificationDropdown from './NotificationDropdown';

interface HeaderProps {
  onToggleSidebar: () => void;
  isMobile?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, isMobile = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-youtube-dark/95 backdrop-blur-md border-b border-youtube-gray/50 z-50 pt-safe-top">
      {/* Mobile Search Overlay */}
      {showMobileSearch && isMobile && (
        <div className="absolute inset-0 bg-youtube-dark z-60 flex items-center px-3 py-3">
          <button
            onClick={() => setShowMobileSearch(false)}
            className="p-2 hover:bg-youtube-gray rounded-full transition-all duration-200 mr-2"
          >
            <Search size={20} className="rotate-45" />
          </button>
          <form onSubmit={handleSearch} className="flex-1 flex">
            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-youtube-dark border border-youtube-gray rounded-l-full px-4 py-2.5 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 transition-all duration-200 placeholder-gray-400"
              autoFocus
            />
            <button
              type="submit"
              className="bg-youtube-gray border border-l-0 border-youtube-gray rounded-r-full px-4 py-2.5 hover:bg-gray-600 transition-all duration-200"
            >
              <Search size={20} />
            </button>
          </form>
        </div>
      )}

      <div className="flex items-center justify-between px-3 md:px-4 py-3">
        {/* Logo and Menu */}
        <div className="flex items-center space-x-2 md:space-x-4 min-w-0">
          <button 
            onClick={onToggleSidebar}
            className="p-2 hover:bg-youtube-gray rounded-full transition-all duration-200 hover:scale-105 flex-shrink-0"
          >
            <Menu size={isMobile ? 18 : 20} />
          </button>
          <Link to="/" className="flex items-center space-x-2 group min-w-0">
            <div className={`${isMobile ? 'w-7 h-7' : 'w-8 h-8'} bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-red-500/25 transition-all duration-300 flex-shrink-0`}>
              <Play size={isMobile ? 16 : 18} className="text-white ml-0.5" />
            </div>
            <span className={`font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent truncate ${
              isMobile ? 'text-base' : 'text-xl'
            }`}>
              {isMobile ? 'StreamRush' : 'StreamRush'}
            </span>
          </Link>
        </div>

        {/* Desktop Search Bar */}
        {!isMobile && (
          <div className="flex-1 max-w-2xl mx-2 md:mx-8">
            <form onSubmit={handleSearch} className="flex group">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search videos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-youtube-dark border border-youtube-gray rounded-l-full px-4 py-2.5 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 transition-all duration-200 placeholder-gray-400 text-sm md:text-base"
                />
              </div>
              <button
                type="submit"
                className="bg-youtube-gray border border-l-0 border-youtube-gray rounded-r-full px-4 md:px-6 py-2.5 hover:bg-gray-600 transition-all duration-200 group-hover:bg-red-600 group-hover:border-red-600 flex-shrink-0"
              >
                <Search size={18} />
              </button>
            </form>
          </div>
        )}

        {/* User Actions */}
        <div className="flex items-center space-x-1 flex-shrink-0">
          {/* Mobile Search Button */}
          {isMobile && (
            <button
              onClick={() => setShowMobileSearch(true)}
              className="p-2 hover:bg-youtube-gray rounded-full transition-all duration-200 hover:scale-105"
              title="Search"
            >
              <Search size={18} />
            </button>
          )}
          
          {currentUser ? (
            <>
              {!isMobile && (
                <Link
                  to="/upload"
                  className="p-2 hover:bg-youtube-gray rounded-full transition-all duration-200 hover:scale-105 group"
                  title="Upload Video"
                >
                  <Video size={20} className="group-hover:text-red-400 transition-colors" />
                </Link>
              )}
              <NotificationDropdown />
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`${isMobile ? 'w-8 h-8' : 'w-9 h-9'} rounded-full overflow-hidden hover:ring-2 hover:ring-red-500 transition-all duration-200 hover:scale-105`}
                >
                  {userProfile?.photoURL ? (
                    <img
                      src={userProfile.photoURL}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center">
                      <User size={isMobile ? 16 : 18} />
                    </div>
                  )}
                </button>
                
                {showUserMenu && (
                  <div className={`absolute right-0 mt-2 bg-youtube-gray rounded-xl shadow-2xl py-2 z-50 border border-gray-600 backdrop-blur-sm animate-in slide-in-from-top-2 duration-200 ${
                    isMobile ? 'w-56' : 'w-64'
                  }`}>
                    <div className="px-4 py-3 border-b border-gray-600">
                      <p className="font-semibold text-white truncate">{userProfile?.displayName || 'Demo User'}</p>
                      <p className="text-sm text-youtube-lightgray truncate">{userProfile?.email || 'demo@streamrush.com'}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center space-x-3 px-4 py-2 hover:bg-youtube-dark"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User size={16} />
                      <span>Your channel</span>
                    </Link>
                    {isMobile && (
                      <Link
                        to="/upload"
                        className="flex items-center space-x-3 px-4 py-2 hover:bg-youtube-dark"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Video size={16} />
                        <span>Upload Video</span>
                      </Link>
                    )}
                    <Link
                      to="/history"
                      className="flex items-center space-x-3 px-4 py-2 hover:bg-youtube-dark"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <span>History</span>
                    </Link>
                    <Link
                      to="/playlists"
                      className="flex items-center space-x-3 px-4 py-2 hover:bg-youtube-dark"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <span>Your playlists</span>
                    </Link>
                    <hr className="my-2 border-gray-600" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-4 py-2 hover:bg-youtube-dark w-full text-left"
                    >
                      <LogOut size={16} />
                      <span>Sign out</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className={`flex items-center space-x-1 md:space-x-2 border border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 whitespace-nowrap ${
                isMobile ? 'px-2 py-1.5 text-sm' : 'px-4 py-2'
              }`}
            >
              <User size={isMobile ? 14 : 16} />
              <span className="font-medium">Sign in</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;