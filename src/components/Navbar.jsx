import React, { useState } from 'react';
import { Search, Bell, User, Settings, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ title, toggleSidebar, onBellClick }) => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfile, setShowProfile] = useState(false);

  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      console.log(`Global Search Triggered: ${searchQuery}`);
      // Simulate search interaction
      setTimeout(() => {
        setIsSearching(false);
        alert(`Search results for "${searchQuery}" would appear here. In this demo, the Inventory page reactively filters as you type.`);
        setSearchQuery('');
      }, 800);
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
      background: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button 
          className="mobile-toggle glass" 
          onClick={toggleSidebar}
          style={{
            display: 'none', 
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
        <h1 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#f8fafc', letterSpacing: '-0.02em' }}>{title}</h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <form 
          onSubmit={handleSearch}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '0.5rem 1rem',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            width: '320px',
            transition: 'var(--transition)'
          }}
          className="search-container"
        >
          <button 
            type="submit" 
            style={{ 
              background: 'none', 
              border: 'none', 
              padding: 0, 
              cursor: 'pointer', 
              display: 'grid', 
              placeItems: 'center',
              color: 'var(--text-dim)',
              transition: 'color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent-primary)'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-dim)'}
          >
            <Search size={18} />
          </button>
          <input
            type="text"
            placeholder={isSearching ? "Searching..." : "Search inventory..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isSearching}
            style={{
              background: 'none',
              border: 'none',
              outline: 'none',
              color: isSearching ? 'var(--accent-primary)' : 'var(--text-main)',
              width: '100%',
              fontSize: '0.9rem',
              fontWeight: '500',
              opacity: isSearching ? 0.7 : 1
            }}
          />
        </form>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            title="View Alerts & Notifications"
            onClick={onBellClick ? onBellClick : () => alert('No new notifications right now.')}
            className="glass card-hover" 
            style={{ width: '40px', height: '40px', display: 'grid', placeItems: 'center', cursor: 'pointer', border: 'none', borderRadius: '10px' }}
          >
            <Bell size={20} color="var(--accent-primary)" />
          </button>
          <div style={{ position: 'relative' }}>
            <button 
              title="View Profile Details"
              onClick={() => setShowProfile(!showProfile)}
              className="glass card-hover" 
              style={{ width: '40px', height: '40px', display: 'grid', placeItems: 'center', cursor: 'pointer', border: 'none', borderRadius: '10px' }}
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-soft))', display: 'grid', placeItems: 'center', color: 'white', fontWeight: '900', fontSize: '0.85rem' }}>
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
                  width: '280px',
                  padding: '1.5rem',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                  zIndex: 100,
                  background: '#1e293b',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
                }}
              >
                <div style={{ paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <p style={{ fontWeight: '800', fontSize: '1.1rem', color: '#f8fafc', marginBottom: '0.25rem' }}>
                    {user?.username}
                  </p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '0.75rem' }}>
                    {user?.email}
                  </p>
                  <span style={{ 
                    fontSize: '0.65rem', 
                    padding: '4px 10px', 
                    borderRadius: '8px', 
                    background: 'rgba(59, 130, 246, 0.1)', 
                    color: 'var(--accent-primary)',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {user?.role}
                  </span>
                </div>
                
                <button 
                  onClick={() => { if(window.confirm('Are you sure you want to log out?')) logout(); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    background: 'rgba(244, 63, 94, 0.05)',
                    color: 'var(--accent-rose)',
                    border: '1px solid rgba(244, 63, 94, 0.1)',
                    padding: '0.875rem',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontWeight: '700',
                    fontSize: '0.9rem',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(244, 63, 94, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(244, 63, 94, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(244, 63, 94, 0.05)';
                    e.currentTarget.style.borderColor = 'rgba(244, 63, 94, 0.1)';
                  }}
                >
                  <User size={18} /> Log Out
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
