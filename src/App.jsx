import React, { useState } from 'react';
import './App.css';
import { InventoryProvider } from './context/InventoryContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Sales from './pages/Sales';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';
import Auth from './pages/Auth';
import ChatBot from './components/ChatBot';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (loading) return null;

  if (!isAuthenticated) {
    return <Auth />;
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard />;
      case 'inventory': return <Inventory />;
      case 'sales': return <Sales />;
      case 'reports': return <Reports />;
      case 'alerts': return <Alerts />;
      default: return <Dashboard />;
    }
  };

  const getPageTitle = () => {
    return activePage.charAt(0).toUpperCase() + activePage.slice(1);
  };

  return (
    <div className={`app-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 95,
            transition: 'all 0.3s'
          }}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar 
        activePage={activePage} 
        setActivePage={(page) => {
          setActivePage(page);
          setIsSidebarOpen(false); // Close sidebar on mobile after clicking
        }} 
        isOpen={isSidebarOpen} 
      />

      <main className="main-content">
        <Navbar 
          title={getPageTitle()} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        {renderPage()}
      </main>
      <ChatBot />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <InventoryProvider>
        <AppContent />
      </InventoryProvider>
    </AuthProvider>
  );
}

export default App;
