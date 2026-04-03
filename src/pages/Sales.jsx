import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { ShoppingCart, TrendingUp, ArrowUpRight, ArrowDownRight, Download, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const Sales = () => {
  const { sales, products } = useInventory();

   const totalRevenue = sales.reduce((acc, s) => acc + (Number(s.amount) || 0), 0);
   const totalItemsSold = sales.reduce((acc, s) => acc + (Number(s.quantity) || 0), 0);
   const averageOrderValue = sales.length > 0 ? totalRevenue / sales.length : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Sales Report</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="glass" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.6rem 1.2rem', cursor: 'pointer', background: 'rgba(0,0,0,0.03)', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)', borderRadius: '12px' }}>
            <Filter size={18} /> Filter
          </button>
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={18} /> Export CSV
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
        {[
          { title: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: TrendingUp, color: 'var(--accent-blue)', trend: '+12.5%' },
          { title: 'Units Sold', value: totalItemsSold, icon: ShoppingCart, color: 'var(--accent-cyan)', trend: '+5.2%' },
          { title: 'Avg. Order', value: `₹${averageOrderValue.toLocaleString('en-IN')}`, icon: ArrowUpRight, color: 'var(--accent-emerald)', trend: '+2.1%' }
        ].map((stat, i) => (
          <div key={i} className="glass card-hover" style={{ flex: 1, minWidth: '280px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{stat.title}</p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: '800' }}>{stat.value}</h3>
              <p style={{ color: 'var(--accent-emerald)', fontSize: '0.75rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ArrowUpRight size={14} /> {stat.trend} <span style={{ color: 'var(--text-secondary)' }}>from last month</span>
              </p>
            </div>
            <div style={{ width: '56px', height: '56px', background: `rgba(255, 255, 255, 0.03)`, borderRadius: '16px', display: 'grid', placeItems: 'center', color: stat.color }}>
              <stat.icon size={28} />
            </div>
          </div>
        ))}
      </div>

      <div className="glass" style={{ padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <TrendingUp size={20} className="gradient-text" /> Transaction History
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: 'var(--text-secondary)', borderBottom: '1px solid var(--glass-border)' }}>
                 <th style={{ padding: '1rem' }}>Transaction ID</th>
                 <th style={{ padding: '1rem' }}>Product Name</th>
                 <th style={{ padding: '1rem' }}>Category</th>
                 <th style={{ padding: '1rem' }}>Quantity</th>
                 <th style={{ padding: '1rem' }}>Total Amount</th>
                 <th style={{ padding: '1rem' }}>Date</th>
                 <th style={{ padding: '1rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
               {sales && sales.length > 0 ? sales.slice().reverse().map((sale, index) => {
                 const safeId = sale && sale.id ? String(sale.id) : `temp-${index}`;
                 return (
                    <tr key={safeId} className="card-hover" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.3s' }}>
                      <td style={{ padding: '1rem', fontFamily: 'monospace', color: 'var(--accent-purple)' }}>TXN-{safeId.slice(-6)}</td>
                      <td style={{ padding: '1rem', fontWeight: '600' }}>{sale?.productName || 'Unknown Product'}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '8px', background: 'rgba(157, 80, 255, 0.1)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {sale?.category || 'N/A'}
                        </span>
                      </td>
                     <td style={{ padding: '1rem' }}>{sale?.quantity || 0}</td>
                     <td style={{ padding: '1rem', fontWeight: '700' }}>₹{(Number(sale?.amount) || 0).toLocaleString('en-IN')}</td>
                     <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{sale?.date || 'N/A'}</td>
                     <td style={{ padding: '1rem' }}>
                       <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-emerald)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>Completed</span>
                     </td>
                   </tr>
                 );
               }) : (
                <tr>
                  <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No sales recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default Sales;
