import React, { useState } from 'react';
import { Menu, Search, Bell, Map, QrCode, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useLocation, useNavigate } from 'react-router-dom';

const Header = ({ toggleSidebar, onSearchClick, onBellClick, onQRClick, onMapClick }) => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Capitalize first letter of path for title
  const pathParts = location.pathname.split('/').filter(Boolean);
  let title = 'Dashboard';
  if (pathParts.length > 1) {
    title = pathParts[pathParts.length - 1];
    title = title.charAt(0).toUpperCase() + title.slice(1);
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 shrink-0 z-10 shadow-sm">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="p-2 mr-4 rounded-md text-gray-500 hover:bg-gray-100 transition-colors focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold text-gray-800 truncate">{title}</h1>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Search */}
        <button 
          onClick={onSearchClick}
          className="flex items-center text-gray-500 hover:bg-gray-100 px-3 py-1.5 rounded-md transition-colors"
        >
          <Search className="w-5 h-5 sm:mr-2" />
          <span className="hidden sm:inline-block text-sm">Search</span>
          <span className="hidden sm:inline-block ml-2 text-xs bg-gray-200 px-1.5 rounded text-gray-600">Cmd+K</span>
        </button>

        {/* Action Icons */}
        <div className="flex items-center space-x-1 sm:space-x-2 border-l border-r border-gray-200 px-2 sm:px-4">
          <button 
            onClick={onMapClick}
            className="p-2 rounded-full text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            title="Campus Map"
          >
            <Map className="w-5 h-5" />
          </button>
          <button 
            onClick={onQRClick}
            className="p-2 rounded-full text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            title="QR Code"
          >
            <QrCode className="w-5 h-5" />
          </button>
          <button 
            onClick={onBellClick}
            className="p-2 rounded-full text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1.5 bg-red-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* User Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
              {user?.initials || 'U'}
            </div>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate capitalize">{user?.role}</p>
              </div>
              <button 
                onClick={() => { setDropdownOpen(false); navigate(`/${user?.role}/profile`); }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
