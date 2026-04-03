import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { Bell, AlertTriangle, AlertCircle, CheckCircle2, Package, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const AlertItem = ({ title, message, type, icon: Icon, delay, onResolve }) => {
  const getColors = () => {
    switch(type) {
      case 'critical': return { bg: 'rgba(244, 63, 94, 0.1)', color: 'var(--accent-rose)', border: 'rgba(244, 63, 94, 0.2)' };
      case 'warning': return { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: 'rgba(245, 158, 11, 0.2)' };
      case 'success': return { bg: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-emerald)', border: 'rgba(59, 130, 246, 0.2)' };
      default: return { bg: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-blue)', border: 'rgba(59, 130, 246, 0.2)' };
    }
  };

  const { bg, color, border } = getColors();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className={`glass card-hover ${type === 'critical' ? 'alert-pulse' : ''}`}
      style={{
        padding: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem',
        border: `1px solid ${border}`,
        marginBottom: '1rem'
      }}
    >
      <div style={{
        width: '48px',
        height: '48px',
        background: bg,
        borderRadius: '12px',
        display: 'grid',
        placeItems: 'center',
        color: color
      }}>
        <Icon size={24} />
      </div>
      <div style={{ flex: 1 }}>
        <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.25rem' }}>{title}</h4>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{message}</p>
      </div>
      <button onClick={onResolve} style={{
        padding: '0.5rem 1rem',
        borderRadius: '8px',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid var(--glass-border)',
        color: 'var(--text-secondary)',
        cursor: 'pointer',
        fontSize: '0.75rem',
        transition: 'var(--transition)'
      }}>
        Resolve
      </button>
    </motion.div>
  );
};

const Alerts = () => {
  const { products, updateProduct } = useInventory();

  const handleResolve = (product) => {
    if (window.confirm(`Auto-restock 50 units for ${product.name} to resolve this alert?`)) {
      updateProduct(product.id, { ...product, stock: product.stock + 50 });
    }
  };

  const outOfStock = products.filter(p => p.stock === 0);
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= 10);
  const inStock = products.filter(p => p.stock > 10);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Bell className="gradient-text" /> System Alerts
        </h2>

        <section>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={20} /> Critical (Out of Stock)
          </h3>
          {outOfStock.length > 0 ? outOfStock.map((p, i) => (
            <AlertItem key={p.id} title={p.name} message="Stock level reached 0. Immediate restock required." type="critical" icon={XCircle} delay={i * 0.1} onResolve={() => handleResolve(p)} />
          )) : (
            <div className="glass" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No critical alerts found.</div>
          )}
        </section>

        <section>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={20} /> Warning (Low Stock)
          </h3>
          {lowStock.length > 0 ? lowStock.map((p, i) => (
            <AlertItem key={p.id} title={p.name} message={`Only ${p.stock} units remaining in inventory.`} type="warning" icon={AlertTriangle} delay={i * 0.1} onResolve={() => handleResolve(p)} />
          )) : (
            <div className="glass" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No low stock items.</div>
          )}
        </section>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>Integrity Check</h3>
        <div className="glass" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 1rem' }}>
              <svg width="120" height="120" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="10" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="var(--accent-purple)" strokeWidth="10" strokeDasharray={`${((inStock.length || 0) / (products.length || 1)) * 283} 283`} strokeLinecap="round" transform="rotate(-90 50 50)" />
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <h4 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{Math.round((inStock.length / products.length) * 100) || 0}%</h4>
                <p style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>Healthy</p>
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{inStock.length} / {products.length} Items Optimal</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             <div className="glass" style={{ padding: '1rem', background: 'rgba(157, 80, 255, 0.08)', borderColor: 'rgba(157, 80, 255, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-purple)', marginBottom: '0.5rem' }}>
                  <CheckCircle2 size={18} /> <span style={{ fontWeight: '600' }}>System Status</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>All inventory nodes are synchronizing correctly with the cloud database.</p>
             </div>
             
             <div className="glass" style={{ padding: '1rem', background: 'rgba(157, 80, 255, 0.08)', borderColor: 'rgba(157, 80, 255, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-purple)', marginBottom: '0.5rem' }}>
                  <Package size={18} /> <span style={{ fontWeight: '600' }}>Stock Insights</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Recommended restock value based on previous 30 days: ₹24,500.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alerts;
