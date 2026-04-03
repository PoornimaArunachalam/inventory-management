import React from 'react';
import { Search, Bell, User, Settings, Menu } from 'lucide-react';

const Navbar = ({ title, toggleSidebar }) => {
  return (
    <header className="glass navbar" style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.75rem 1.5rem',
      marginBottom: '2rem',
      position: 'sticky',
      top: '1rem',
      zIndex: 90,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button 
          className="mobile-toggle glass" 
          onClick={toggleSidebar}
          style={{
            display: 'none', // Hidden by default, shown by CSS media query
            width: '40px',
            height: '40px',
            placeItems: 'center',
            cursor: 'pointer',
            border: 'none',
            borderRadius: '10px',
            color: 'var(--accent-purple)'
          }}
        >
          <Menu size={20} />
        </button>
        <h1 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{title}</h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '0.5rem 1rem',
          borderRadius: '12px',
          border: '1px solid var(--glass-border)',
          width: '300px'
        }}>
          <Search size={18} color="var(--text-secondary)" />
          <input
            type="text"
            placeholder="Search inventory..."
            style={{
              background: 'none',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              width: '100%',
              fontSize: '0.9rem'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="glass" style={{ width: '40px', height: '40px', display: 'grid', placeItems: 'center', cursor: 'pointer', border: 'none', borderRadius: '10px' }}>
            <Bell size={20} color="var(--accent-purple)" />
          </button>
          <button className="glass" style={{ width: '40px', height: '40px', display: 'grid', placeItems: 'center', cursor: 'pointer', border: 'none', borderRadius: '10px' }}>
            <User size={20} color="var(--accent-purple)" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
