import React, { useState } from 'react';
import { Search, Bell, User, Settings, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ title, toggleSidebar, onBellClick }) => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfile, setShowProfile] = useState(false);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      alert(`Searching inventory for: ${searchQuery}\n\nSearch query received! In a full global setup, this would filter all your tables.`);
      setSearchQuery(''); // clear the search
    }
  };

  return (
    <header className="glass navbar" style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.75rem 1.5rem',
      marginBottom: '2rem',
      position: 'sticky',
      top: '0',
      zIndex: 90,
      background: '#0f172a',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
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
            color: 'var(--accent-glow)'
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
          background: 'transparent',
          padding: '0.5rem 1rem',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          width: '300px'
        }}>
          <Search size={18} color="var(--text-secondary)" />
          <input
            type="text"
            placeholder="Search inventory... (Press Enter)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
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
          <button 
            title="View Alerts & Notifications"
            onClick={onBellClick ? onBellClick : () => alert('No new notifications right now.')}
            className="glass" 
            style={{ width: '40px', height: '40px', display: 'grid', placeItems: 'center', cursor: 'pointer', border: 'none', borderRadius: '10px' }}
          >
            <Bell size={20} color="var(--accent-glow)" />
          </button>
          <div style={{ position: 'relative' }}>
            <button 
              title="View Profile Details"
              onClick={() => setShowProfile(!showProfile)}
              className="glass" 
              style={{ width: '40px', height: '40px', display: 'grid', placeItems: 'center', cursor: 'pointer', border: 'none', borderRadius: '10px' }}
            >
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--accent-blue)', display: 'grid', placeItems: 'center', color: 'white', fontWeight: '900', fontSize: '0.9rem' }}>
                {user?.username?.[0]?.toUpperCase()}
              </div>
            </button>
            
            {showProfile && (
              <div 
                className="glass" 
                style={{
                  position: 'absolute',
                  top: '120%',
                  right: 0,
                  width: '260px',
                  padding: '1.25rem',
                  borderRadius: '12px',
                  border: '1px solid var(--glass-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  zIndex: 100,
                  background: 'rgba(15, 23, 42, 0.95)',
                  boxShadow: '0 10px 40px rgba(2, 6, 23, 0.8)',
                }}
              >
                <div style={{ paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <p style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    {user?.username}
                  </p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                    {user?.email}
                  </p>
                  <span style={{ 
                    fontSize: '0.7rem', 
                    padding: '2px 8px', 
                    borderRadius: '100px', 
                    background: 'var(--accent-blue)', 
                    color: 'white',
                    fontWeight: '800',
                    textTransform: 'uppercase'
                  }}>
                    {user?.role}
                  </span>
                </div>
                
                <button 
                  onClick={() => { if(window.confirm('Are you sure you want to log out of your profile?')) logout(); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'rgba(239, 68, 68, 0.1)',
                    color: '#ff4d4d',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 60, 60, 0.2)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 60, 60, 0.1)'}
                >
                  <User size={16} /> Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
