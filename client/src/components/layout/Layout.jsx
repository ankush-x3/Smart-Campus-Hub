import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import AIAssistant from '../../features/AIAssistant';
import NotificationPanel from '../../features/NotificationPanel';
import GlobalSearch from '../../features/GlobalSearch';
import QRModal from '../../features/QRModal';
import CampusMap from '../../features/CampusMap';
import { useAuth } from '../../context/AuthContext';

const Layout = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifPanelOpen, setNotifPanelOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <Sidebar 
        role={user.role} 
        isOpen={sidebarOpen} 
      />
      
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header 
          toggleSidebar={toggleSidebar}
          onSearchClick={() => setSearchOpen(true)}
          onBellClick={() => setNotifPanelOpen(true)}
          onQRClick={() => setQrOpen(true)}
          onMapClick={() => setMapOpen(true)}
        />
        
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Global Features */}
      <AIAssistant />
      
      {notifPanelOpen && (
        <NotificationPanel onClose={() => setNotifPanelOpen(false)} />
      )}
      
      {searchOpen && (
        <GlobalSearch onClose={() => setSearchOpen(false)} />
      )}
      
      {qrOpen && (
        <QRModal onClose={() => setQrOpen(false)} />
      )}
      
      {mapOpen && (
        <CampusMap onClose={() => setMapOpen(false)} />
      )}
    </div>
  );
};

export default Layout;
