import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { TrendingUp, Package, AlertCircle, DollarSign, Activity, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import RevenueChart from '../components/RevenueChart';

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass card-hover"
    style={{
      padding: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem',
      flex: 1,
      minWidth: '240px'
    }}
  >
    <div style={{
      width: '48px',
      height: '48px',
      background: `rgba(${color}, 0.1)`,
      borderRadius: '12px',
      display: 'grid',
      placeItems: 'center',
      color: `rgb(${color})`
    }}>
      <Icon size={24} />
    </div>
    <div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>{title}</p>
      <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{value}</h3>
    </div>
  </motion.div>
);


const Dashboard = () => {

  const { products, sales, loading } = useInventory();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div className="animate-float" style={{ fontSize: '1.5rem', color: 'var(--accent-rose)', fontWeight: '600' }}>Loading live stats...</div>
      </div>
    );
  }

  const totalProducts = products.length;

  const lowStock = products.filter(p => p.stock > 0 && p.stock <= 10).length;
  const outOfStock = products.filter(p => p.stock === 0).length;
  const totalRevenue = sales.reduce((acc, sale) => acc + (Number(sale.amount) || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header with Stats Overview */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
        {[
          { title: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, change: '+12.5%', icon: DollarSign, color: 'var(--accent-purple)' },
          { title: 'Active Items', value: products.length, change: '+5', icon: Package, color: 'var(--accent-blue)' },
          { title: 'Pending Orders', value: sales.length, change: '+2', icon: ShoppingCart, color: 'var(--accent-glow)' },
          { title: 'Critical Alerts', value: products.filter(p => p.stock <= 5).length, change: '-1', icon: Activity, color: '#FF4D4D' }
        ].map((stat, i) => (
          <motion.div 
            key={i} 
            className="glass card-hover" 
            style={{ flex: 1, minWidth: '240px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
               <div style={{ width: '48px', height: '48px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '14px', display: 'grid', placeItems: 'center', color: stat.color, border: '1px solid var(--glass-border)' }}>
                  <stat.icon size={24} />
               </div>
               <span style={{ fontSize: '0.75rem', fontWeight: '800', color: stat.change.startsWith('+') ? 'var(--accent-cyan)' : '#FF4D4D', background: stat.change.startsWith('+') ? 'rgba(160, 216, 179, 0.1)' : 'rgba(255, 77, 77, 0.1)', padding: '4px 8px', borderRadius: '8px' }}>
                  {stat.change}
               </span>
            </div>
            <div>
               <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '500' }}>{stat.title}</p>
               <h3 style={{ fontSize: '1.75rem', fontWeight: '800', marginTop: '0.25rem' }}>{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Revenue Trends</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Visual breakdown of sales performance</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
             <span style={{ fontSize: '0.75rem', padding: '4px 12px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-blue)', borderRadius: '20px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>7 Days</span>
             <span style={{ fontSize: '0.75rem', padding: '4px 12px', color: 'var(--text-secondary)' }}>30 Days</span>
          </div>
        </div>
        <RevenueChart sales={sales} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div className="glass" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Recent Sales</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '1rem 0' }}>Product</th>
                <th style={{ padding: '1rem 0' }}>Qty</th>
                <th style={{ padding: '1rem 0' }}>Amount</th>
                <th style={{ padding: '1rem 0' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {sales && sales.length > 0 ? sales.slice(-5).reverse().map((sale, idx) => {
                const safeId = sale && sale.id ? String(sale.id) : `dash-temp-${idx}`;
                return (
                  <tr key={safeId} style={{ borderTop: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '1rem 0' }}>{sale?.productName || 'Unknown'}</td>
                    <td style={{ padding: '1rem 0' }}>{sale?.quantity || 0}</td>
                    <td style={{ padding: '1rem 0' }}>₹{(Number(sale?.amount) || 0).toLocaleString('en-IN')}</td>
                    <td style={{ padding: '1rem 0' }}>{sale?.date || 'N/A'}</td>
                  </tr>
                );
              }) : (
                <tr><td colSpan="4" style={{ padding: '1rem 0', textAlign: 'center', color: 'var(--text-secondary)' }}>No recent sales</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="glass" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity size={20} className="gradient-text" /> Inventory Health
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {products.slice(0, 3).map((p, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ fontWeight: '700' }}>{p.name}</span>
                  <span style={{ color: p.stock <= 10 ? '#FF4D4D' : 'var(--accent-cyan)' }}>{p.stock} left</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px', overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(p.stock, 100)}%` }}
                    style={{ height: '100%', background: p.stock <= 10 ? 'linear-gradient(90deg, #FF4D4D, #FF8080)' : 'linear-gradient(90deg, var(--accent-purple), var(--accent-glow))', borderRadius: '10px' }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '2.5rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.08)', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.15)' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
              "Stock levels are healthy for the current sales velocity. Recommended to monitor High-Demand catalog."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
