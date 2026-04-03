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
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        borderTop: 'none',
        borderLeft: 'none',
        borderBottom: 'none',
        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        // Mobile-specific transform will be handled by CSS class, 
        // but we can ensure it's hidden by default on small screens
      }}
    >
      <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '0 1.5rem' }}>
        <div style={{
          width: '44px',
          height: '44px',
          background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-glow))',
          borderRadius: '14px',
          display: 'grid',
          placeItems: 'center',
          fontWeight: '900',
          color: 'white',
          fontSize: '1.25rem',
          boxShadow: '0 6px 20px rgba(157, 80, 255, 0.4)',
          transform: 'rotate(-5deg)'
        }}>S&R</div>
        <h2 className="gradient-text" style={{ fontSize: '1.6rem', letterSpacing: '-0.04em', fontWeight: '900' }}>STOCK & ROLL</h2>
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
                background: isActive ? 'rgba(157, 80, 255, 0.15)' : 'transparent',
                color: isActive ? 'var(--accent-purple)' : 'var(--text-secondary)',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'var(--transition)',
                width: '100%',
                textAlign: 'left',
                fontWeight: isActive ? '600' : '400',
              }}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ 
          padding: '1rem', 
          background: 'rgba(255, 255, 255, 0.03)', 
          borderRadius: '12px',
          border: '1px solid var(--glass-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{ width: '32px', height: '32px', background: 'rgba(157, 80, 255, 0.1)', borderRadius: '8px', display: 'grid', placeItems: 'center', color: 'var(--accent-purple)' }}>
            <User size={18} />
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: '600', whiteSpace: 'nowrap', textOverflow: 'ellipsis', color: 'var(--text-primary)' }}>{user?.username}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Administrator</p>
          </div>
        </div>

        <button 
          onClick={logout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '0.75rem 1rem',
            color: 'white',
            background: '#EF4444',
            border: 'none',
            cursor: 'pointer',
            width: '100%',
            borderRadius: '12px',
            transition: 'all 0.3s',
            fontWeight: '700',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#DC2626';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = '#EF4444';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
          }}
          className="card-hover"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
