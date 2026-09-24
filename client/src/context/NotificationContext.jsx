import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'assignment', title: 'New Assignment', message: 'Math 101 Assignment posted', time: new Date(Date.now() - 5000).toISOString(), read: false },
  { id: 2, type: 'event', title: 'Campus Event', message: 'Annual Fest registration open', time: new Date(Date.now() - 3600000).toISOString(), read: false },
  { id: 3, type: 'notice', title: 'Holiday Notice', message: 'College closed on Friday', time: new Date(Date.now() - 86400000).toISOString(), read: true },
];

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  
  const fetchNotifications = useCallback(() => {
    if (!user) return;
    // In a real app, this would be an API call
    // For now, we use mock data if empty
    setNotifications(prev => prev.length ? prev : [...MOCK_NOTIFICATIONS]);
  }, [user]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addNotification = (notification) => {
    const newNotif = {
      ...notification,
      id: Date.now(),
      time: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
    // Show toast here if you have a toast system
    console.log("New Notification:", newNotif.title);
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markRead, markAllRead, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
