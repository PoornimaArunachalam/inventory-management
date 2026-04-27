import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useInventory } from '../context/InventoryContext';
import { Package, Search, LogOut, User, RefreshCcw, Box, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PRODUCT_CATEGORIES = [
  "Mobile and Accessories",
  "Laptops and Computers",
  "TV and Home Entertainment",
  "Home Appliances",
  "Kitchen Appliances",
  "Wearable Devices",
  "Cameras and Accessories",
  "Gaming",
  "Networking Devices",
  "Storage Devices",
  "Power and Electricals",
  "Other Items"
];

const WorkerView = () => {
  const { user, logout, isAdmin } = useAuth();
  const { products: stock, loading, refreshData: fetchStock } = useInventory();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredStock = (stock || []).filter(item => {
    const matchesSearch = (item.name || '').toLowerCase().includes(search.toLowerCase()) || (item.category || '').toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });


  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'in stock': return 'var(--accent-success)';
      case 'low stock': return 'var(--accent-warning)';
      case 'out of stock': return 'var(--accent-danger)';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: isAdmin ? 'transparent' : 'var(--bg-deep)', padding: isAdmin ? '0' : '2rem' }}>
      <div className="aurora-container">
        <div className="aurora"></div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        {!isAdmin && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '3rem',
              padding: '1.5rem',
              borderRadius: '24px',
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--glass-border)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                borderRadius: '14px',
                display: 'grid',
                placeItems: 'center',
                fontWeight: '900',
                color: '#ffffff',
                fontSize: '1.4rem',
                boxShadow: '0 6px 20px rgba(59, 130, 246, 0.2)',
                transform: 'rotate(-5deg)'
              }}>S&R</div>
              <div>
                <h2 className="gradient-text" style={{ fontSize: '1.5rem', margin: 0 }}>Worker Hub</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Stock Availability Tracker</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-primary)' }}>{user?.username}</p>
                <p style={{ fontSize: '0.8rem', color: '#60a5fa', fontWeight: '800', textTransform: 'uppercase' }}>{user?.role}</p>
              </div>
              <button 
                onClick={logout}
                className="glass"
                style={{ 
                  padding: '0.75rem', 
                  borderRadius: '12px', 
                  border: '1px solid rgba(239, 68, 68, 0.2)', 
                  color: '#ef4444',
                  cursor: 'pointer',
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center',
                  fontWeight: '700'
                }}
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          </motion.div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem', marginBottom: '1.5rem' }}>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (search.trim()) {
                alert(`Search logic triggered for: ${search}. The stock list below is already filtered.`);
              }
            }}
            style={{ 
              flex: 1, 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              background: 'var(--glass-bg)', 
              padding: '1rem 1.5rem', 
              borderRadius: '18px',
              border: '1px solid var(--glass-border)',
              transition: 'var(--transition)'
            }}
            className="search-container-worker"
          >
            <button 
              type="submit" 
              style={{ 
                background: 'none', 
                border: 'none', 
                padding: 0, 
                cursor: 'pointer', 
                color: 'var(--text-secondary)',
                display: 'grid',
                placeItems: 'center'
              }}
            >
              <Search size={20} />
            </button>
            <input 
              type="text" 
              placeholder="Filter stock by name or category..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', width: '100%', fontSize: '1rem' }}
            />
          </form>
          <button 
            onClick={fetchStock}
            className="btn-primary" 
            style={{ borderRadius: '18px' }}
          >
            <RefreshCcw size={20} className={loading ? 'spin' : ''} /> Refresh Data
          </button>
        </div>

        {/* Category Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '1rem', scrollbarWidth: 'none', msOverflowStyle: 'none', marginBottom: '1rem' }} className="hide-scrollbar">
          <button
            onClick={() => setSelectedCategory('All')}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '20px',
              whiteSpace: 'nowrap',
              fontWeight: '600',
              fontSize: '0.85rem',
              border: selectedCategory === 'All' ? '1px solid var(--accent-glow)' : '1px solid var(--glass-border)',
              background: selectedCategory === 'All' ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-card)',
              color: selectedCategory === 'All' ? 'var(--text-primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
          >
            All
          </button>
          {PRODUCT_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '20px',
                whiteSpace: 'nowrap',
                fontWeight: '600',
                fontSize: '0.85rem',
                border: selectedCategory === cat ? '1px solid var(--accent-glow)' : '1px solid var(--glass-border)',
                background: selectedCategory === cat ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-card)',
                color: selectedCategory === cat ? 'var(--text-primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Stock List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <AnimatePresence>
            {loading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="glass" style={{ height: '80px', opacity: 0.5, borderRadius: '16px' }}></div>
              ))
            ) : filteredStock.length > 0 ? (
              filteredStock.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass glass-hover"
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    padding: '1.5rem 2rem', 
                    borderRadius: '16px',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: '1 1 250px' }}>
                    <div className="stat-icon" style={{ background: 'rgba(124, 58, 237, 0.1)', color: 'var(--accent-purple)' }}>
                      <Box size={24} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '4px' }}>{item.name}</h3>
                      <p style={{ color: 'var(--accent-glow)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', fontWeight: '600' }}>{item.category}</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '350px', lineHeight: '1.4' }}>{item.description || 'No description available for this item.'}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '3rem', flex: '2 1 300px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '4px' }}>Price</p>
                      <p style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                        ₹{(Number(item.price) || 0).toLocaleString('en-IN')}
                      </p>
                    </div>
                    
                    <div style={{ textAlign: 'right', minWidth: '80px' }}>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '4px' }}>Stock</p>
                      <p style={{ fontSize: '1.25rem', fontWeight: '900', color: getStatusColor(item.status) }}>{item.stock}</p>
                    </div>

                    <div style={{ minWidth: '100px', textAlign: 'right' }}>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: '800', 
                        padding: '6px 12px', 
                        borderRadius: '100px', 
                        background: `${getStatusColor(item.status)}15`,
                        color: getStatusColor(item.status),
                        border: `1px solid ${getStatusColor(item.status)}30`,
                        textTransform: 'uppercase',
                        display: 'inline-block'
                      }}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                <Package size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                <p>No products found matching your search.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        .spin { animation: rotate 2s linear infinite; }
        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default WorkerView;
