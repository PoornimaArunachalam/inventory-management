import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { TrendingUp, Package, AlertCircle, DollarSign, Activity, ShoppingCart, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';
import RevenueChart from '../components/RevenueChart';

const BentoCard = ({ children, className = '', delay = 0, style = {} }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
    className={`glass bento-item card-hover ${className}`}
    style={{ padding: '1.5rem', ...style }}
  >
    {children}
  </motion.div>
);

const PremiumStat = ({ title, value, change, isPositive, icon: Icon, color, delay }) => (
  <BentoCard delay={delay} className={color === 'var(--accent-rose)' ? 'neon-glow-rose' : 'neon-glow-blue'}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
      <div style={{ 
        width: '42px', 
        height: '42px', 
        borderRadius: '12px', 
        background: `rgba(${color === 'var(--accent-rose)' ? '244, 63, 94' : '59, 130, 246'}, 0.1)`, 
        display: 'grid', 
        placeItems: 'center', 
        color: color,
        border: `1px solid rgba(${color === 'var(--accent-rose)' ? '244, 63, 94' : '59, 130, 246'}, 0.2)`
      }}>
        <Icon size={20} />
      </div>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '2px', 
        fontSize: '0.75rem', 
        fontWeight: '700',
        color: isPositive ? 'var(--accent-emerald)' : 'var(--accent-rose)',
        background: `rgba(${isPositive ? '16, 185, 129' : '244, 63, 94'}, 0.1)`,
        padding: '4px 8px',
        borderRadius: '8px'
      }}>
        {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {change}
      </div>
    </div>
    <div>
      <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', fontWeight: '500' }}>{title}</p>
      <h3 style={{ fontSize: '1.85rem', fontWeight: '800', marginTop: '0.5rem', color: '#f8fafc', letterSpacing: '-0.02em' }}>{value}</h3>
    </div>
  </BentoCard>
);

const Dashboard = () => {
  const { products, sales, loading } = useInventory();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ fontSize: '1.25rem', color: 'var(--accent-primary)', fontWeight: '600', letterSpacing: '0.1em' }}
        >
          SYNCING INVENTORY DATA...
        </motion.div>
      </div>
    );
  }

  const totalRevenue = sales.reduce((acc, sale) => acc + (Number(sale.amount) || 0), 0);
  const criticalItems = products.filter(p => p.stock <= 5);

  return (
    <div className="bento-grid">
      {/* Row 1 & 2 Left: Main Stats */}
      <PremiumStat 
        title="Total Revenue" 
        value={`₹${totalRevenue.toLocaleString('en-IN')}`} 
        change="12.5%" 
        isPositive={true} 
        icon={DollarSign} 
        color="var(--accent-primary)"
        delay={0.1}
      />
      
      <PremiumStat 
        title="Active Items" 
        value={products.length} 
        change="+5" 
        isPositive={true} 
        icon={Package} 
        color="var(--accent-primary)"
        delay={0.2}
      />

      {/* Row 1 & 2 Right: Large Revenue Chart */}
      <BentoCard className="bento-large" delay={0.3}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#f8fafc' }}>Revenue performance</h3>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Live tracking of sales velocity</p>
          </div>
          <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '12px' }}>
             <button style={{ border: 'none', background: 'var(--accent-primary)', color: 'white', fontSize: '0.7rem', padding: '6px 12px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>7D</button>
             <button style={{ border: 'none', background: 'transparent', color: 'var(--text-dim)', fontSize: '0.7rem', padding: '6px 12px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>30D</button>
          </div>
        </div>
        <div style={{ height: 'calc(100% - 80px)' }}>
          <RevenueChart sales={sales} />
        </div>
      </BentoCard>

      <PremiumStat 
        title="Pending Orders" 
        value={sales.length} 
        change="+2" 
        isPositive={true} 
        icon={ShoppingCart} 
        color="var(--accent-primary)"
        delay={0.4}
      />

      <PremiumStat 
        title="Critical Alerts" 
        value={criticalItems.length} 
        change={criticalItems.length > 5 ? "+3" : "-1"} 
        isPositive={criticalItems.length <= 5} 
        icon={Activity} 
        color="var(--accent-rose)"
        delay={0.5}
      />

      {/* Row 3: Recent Sales (Wide) */}
      <BentoCard className="bento-wide bento-tall" delay={0.6}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ color: '#f8fafc', fontWeight: '800', fontSize: '1.1rem' }}>Recent Transactions</h3>
          <button style={{ background: 'transparent', border: '1px solid var(--glass-stroke)', color: 'var(--text-dim)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '600' }}>View All</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '1rem 0.5rem' }}>Product</th>
                <th style={{ padding: '1rem 0.5rem' }}>Amount</th>
                <th style={{ padding: '1rem 0.5rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {sales.slice(-6).reverse().map((sale, idx) => (
                <tr key={idx} style={{ borderTop: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '1rem 0.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: '600', color: '#f8fafc', fontSize: '0.9rem' }}>{sale.productName}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{sale.date}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 0.5rem', fontWeight: '700', color: 'var(--accent-emerald)' }}>₹{sale.amount}</td>
                  <td style={{ padding: '1rem 0.5rem' }}>
                    <span style={{ fontSize: '0.65rem', padding: '3px 8px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-emerald)', fontWeight: '700' }}>COMPLETED</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </BentoCard>

      {/* Row 3: Inventory Health (Small but Tall) */}
      <BentoCard className="bento-wide bento-tall" delay={0.7}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', color: '#f8fafc', fontWeight: '800', fontSize: '1.1rem' }}>
          <Activity size={18} color="var(--accent-primary)" /> Inventory Health
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {products.slice(0, 4).map((p, i) => (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: '600', color: '#e2e8f0' }}>{p.name}</span>
                <span style={{ color: p.stock <= 10 ? 'var(--accent-rose)' : 'var(--accent-emerald)', fontWeight: '700' }}>{p.stock} units</span>
              </div>
              <div className="progress-premium-container">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((p.stock / 100) * 100, 100)}%` }}
                  transition={{ duration: 1, delay: 0.8 + (i * 0.1) }}
                  className="progress-premium-bar"
                  style={{ 
                    background: p.stock <= 10 
                      ? 'linear-gradient(90deg, #f43f5e, #fb7185)' 
                      : 'linear-gradient(90deg, #3b82f6, #60a5fa)' 
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '2.5rem', padding: '1.25rem', background: 'rgba(59, 130, 246, 0.03)', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
             <div style={{ padding: '8px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '10px', color: 'var(--accent-primary)' }}>
                <AlertCircle size={16} />
             </div>
             <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', lineHeight: '1.4' }}>
               <strong style={{ color: 'var(--text-main)' }}>AI Insight:</strong> 3 items are approaching critical stock levels. Reorder recommended within 48h.
             </p>
          </div>
        </div>
      </BentoCard>
    </div>
  );
};

export default Dashboard;
