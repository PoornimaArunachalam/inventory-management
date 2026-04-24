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
          { title: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, change: '+12.5%', changeBg: '#064e3b', changeColor: '#34d399', icon: DollarSign, color: '#3b82f6' },
          { title: 'Active Items', value: products.length, change: '+5', changeBg: '#164e63', changeColor: '#22d3ee', icon: Package, color: '#3b82f6' },
          { title: 'Pending Orders', value: sales.length, change: '+2', changeBg: '#1e3a8a', changeColor: '#60a5fa', icon: ShoppingCart, color: '#3b82f6' },
          { title: 'Critical Alerts', value: products.filter(p => p.stock <= 5).length, change: '-1', changeBg: '#450a0a', changeColor: '#f87171', icon: Activity, color: '#f87171' }
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
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', display: 'grid', placeItems: 'center', color: stat.color }}>
                        <stat.icon size={20} />
                      </div>
               <span style={{ fontSize: '0.75rem', fontWeight: '800', color: stat.changeColor, background: stat.changeBg, padding: '4px 10px', borderRadius: '20px' }}>
                  {stat.change}
               </span>
            </div>
            <div>
               <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', fontWeight: '500' }}>{stat.title}</p>
               <h3 style={{ fontSize: '1.75rem', fontWeight: '800', marginTop: '0.25rem', color: '#f8fafc' }}>{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f8fafc' }}>Revenue Trends</h3>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.875rem' }}>Visual breakdown of sales performance</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
             <span style={{ fontSize: '0.75rem', padding: '6px 14px', background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', borderRadius: '20px', fontWeight: '600' }}>7 Days</span>
             <span style={{ fontSize: '0.75rem', padding: '6px 14px', color: 'var(--text-dim)', fontWeight: '600' }}>30 Days</span>
          </div>
        </div>
        <RevenueChart sales={sales} />
      </div>

      <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div className="glass" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem', color: '#f8fafc', fontWeight: '800' }}>Recent Sales</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: 'var(--text-dim)' }}>
                <th style={{ padding: '1rem 0' }}>Product</th>
                <th style={{ padding: '1rem 0' }}>Qty</th>
                <th style={{ padding: '1rem 0' }}>Amount</th>
                <th style={{ padding: '1rem 0' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {sales && sales.length > 0 ? sales.slice(-5).reverse().map((sale, idx) => {
                const safeId = sale && sale.id ? String(sale.id) : `dash-temp-${idx}`;
                const matchedProduct = products.find(p => p.id === sale.productId) || {};
                return (
                  <tr key={safeId} style={{ borderTop: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '1rem 0' }}>
                      <span style={{ fontWeight: '600', color: '#f8fafc' }}>{sale?.productName || 'Unknown'}</span>
                    </td>
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
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', color: '#f8fafc', fontWeight: '800' }}>
            <Activity size={20} color="#94a3b8" /> Inventory Health
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {products.slice(0, 3).map((p, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ fontWeight: '700' }}>{p.name}</span>
                  <span style={{ color: p.stock <= 10 ? 'var(--accent-danger)' : 'var(--accent-success)' }}>{p.stock} left</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(0, 0, 0, 0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(p.stock, 100)}%` }}
                    style={{ height: '100%', background: p.stock <= 10 ? 'linear-gradient(90deg, var(--accent-danger), #ff8080)' : 'linear-gradient(90deg, var(--accent-green), var(--accent-glow))', borderRadius: '10px' }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '2.5rem', padding: '1rem', background: 'rgba(137, 168, 148, 0.08)', borderRadius: '12px', border: '1px solid rgba(137, 168, 148, 0.15)' }}>
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
