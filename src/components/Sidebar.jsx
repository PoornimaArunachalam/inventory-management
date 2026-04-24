import React from 'react';
import { LayoutGrid, ShoppingCart, Package, Bell, Settings, PieChart, Menu, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ activePage, setActivePage, isOpen }) => {
  const { user, logout } = useAuth();
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'sales', label: 'Sales', icon: ShoppingCart },
    { id: 'reports', label: 'Reports', icon: PieChart },
    { id: 'alerts', label: 'Alerts', icon: Bell },
  ];

  return (
    <aside 
      className={`sidebar glass ${isOpen ? 'open' : ''}`} 
      style={{
        width: 'var(--sidebar-width)',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        padding: '2rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        zIndex: 100,
        border: 'none',
        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
        background: '#121826',
        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '0 1.5rem', marginBottom: '1rem' }}>
        <div style={{
          width: '40px',
          height: '40px',
          background: '#3b82f6',
          borderRadius: '12px',
          display: 'grid',
          placeItems: 'center',
          fontWeight: '900',
          color: '#ffffff',
          fontSize: '1.1rem',
        }}>S&R</div>
        <h2 style={{ fontSize: '1.25rem', letterSpacing: '0', fontWeight: '800', lineHeight: 1.1, color: '#f8fafc' }}>STOCK &<br/>ROLL</h2>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '0.75rem 1rem',
                border: 'none',
                background: isActive ? '#1e293b' : 'transparent',
                color: isActive ? '#3b82f6' : '#94a3b8',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                width: '100%',
                textAlign: 'left',
                fontWeight: isActive ? '600' : '500',
              }}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ 
          padding: '1rem', 
          background: '#1a2234', 
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'grid', placeItems: 'center', color: '#3b82f6', fontWeight: '900' }}>
            <User size={16} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontSize: '0.85rem', fontWeight: '600', color: '#f8fafc' }}>{user?.username}</p>
            <p style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'capitalize' }}>{user?.role || 'Administrator'}</p>
          </div>
        </div>

        <button 
          onClick={logout}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '0.7rem 1rem',
            color: 'white',
            background: '#ef4444',
            border: 'none',
            cursor: 'pointer',
            width: '100%',
            borderRadius: '10px',
            transition: 'all 0.2s',
            fontWeight: '700',
          }}
          onMouseOver={(e) => e.currentTarget.style.background = '#dc2626'}
          onMouseOut={(e) => e.currentTarget.style.background = '#ef4444'}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
