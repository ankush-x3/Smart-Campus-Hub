import React, { useState } from 'react';
import { X, CheckCircle, AlertTriangle, Info, Clock } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

const NotificationPanel = ({ onClose }) => {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const [filter, setFilter] = useState('all'); // all, unread

  const filteredNotifs = notifications.filter(n => 
    filter === 'all' ? true : !n.read
  );

  const getIcon = (type) => {
    switch(type) {
      case 'assignment': return <Clock className="w-5 h-5 text-orange-500" />;
      case 'event': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'notice': return <Info className="w-5 h-5 text-blue-500" />;
      default: return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getBgColor = (type) => {
    switch(type) {
      case 'assignment': return 'bg-orange-50';
      case 'event': return 'bg-emerald-50';
      case 'notice': return 'bg-blue-50';
      default: return 'bg-gray-50';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 py-2 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex space-x-4 text-sm">
            <button 
              onClick={() => setFilter('all')}
              className={`pb-2 border-b-2 font-medium transition-colors ${filter === 'all' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('unread')}
              className={`pb-2 border-b-2 font-medium transition-colors ${filter === 'unread' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              Unread
            </button>
          </div>
          {unreadCount > 0 && (
            <button 
              onClick={markAllRead}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotifs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <CheckCircle className="w-12 h-12 text-gray-300 mb-3" />
              <p>You're all caught up!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filteredNotifs.map(notification => (
                <div 
                  key={notification.id}
                  onClick={() => markRead(notification.id)}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors relative ${!notification.read ? 'bg-indigo-50/30' : ''}`}
                >
                  {!notification.read && (
                    <div className="absolute top-4 left-2 w-2 h-2 rounded-full bg-indigo-600"></div>
                  )}
                  <div className="flex items-start pl-4">
                    <div className={`p-2 rounded-lg ${getBgColor(notification.type)} mr-4 shrink-0`}>
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium text-gray-900 ${!notification.read ? 'font-semibold' : ''}`}>
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(notification.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationPanel;
