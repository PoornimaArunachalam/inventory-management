import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { PieChart as PieIcon, BarChart3, TrendingUp, DollarSign, Package, Box, ArrowUpRight, FileText, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Reports = () => {
  const { products, sales } = useInventory();
  const reportRef = React.useRef(null);
  const [isExporting, setIsExporting] = React.useState(false);

  // 1. Data Processing
  const totalAssetValue = products.reduce((acc, p) => acc + ( (Number(p.stock) || 0) * (Number(p.price) || 0) ), 0);
  const totalSalesRevenue = sales.reduce((acc, s) => acc + (Number(s.amount) || 0), 0);
  const totalStock = products.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);
  
  // 1.5. Calculate Sales performance per product for "Growth/Velocity"
  const getProductSalesVolume = (productId) => {
    return sales.filter(s => s.productId === productId).reduce((acc, s) => acc + (Number(s.quantity) || 0), 0);
  };
  
  const categoryStats = products.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = { count: 0, assetValue: 0, salesRevenue: 0 };
    acc[p.category].count += (Number(p.stock) || 0);
    acc[p.category].assetValue += ( (Number(p.stock) || 0) * (Number(p.price) || 0) );
    // Add real sales revenue for this category
    const catSales = sales.filter(s => s.category === p.category).reduce((acc, s) => acc + (Number(s.amount) || 0), 0);
    acc[p.category].salesRevenue = catSales;
    return acc;
  }, {});

  const categories = Object.keys(categoryStats);
  const topCategoryBySales = categories.sort((a, b) => categoryStats[b].salesRevenue - categoryStats[a].salesRevenue)[0] || 'N/A';
  const maxValue = Math.max(...categories.map(c => categoryStats[c].assetValue), 1);

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2, // High quality
        useCORS: true,
        backgroundColor: '#0F071A', // Match theme bg
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`Stock-and-Roll-Analytics-${new Date().toLocaleDateString()}.pdf`);
    } catch (error) {
      console.error('PDF Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // 2. Custom Pie Chart Logic (SVG)
  let cumulativePercent = 0;
  
  const getCoordinatesForPercent = (percent) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  const colors = ['var(--accent-purple)', 'var(--accent-glow)', 'var(--accent-blue)', '#8A2BE2', '#9370DB', '#BA55D3'];

  // 3. Bar Chart Logic
  const maxAssetValue = Math.max(...categories.map(c => categoryStats[c].assetValue), 1);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Analytics & Reports</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={handleExportPDF}
            disabled={isExporting}
            className="glass card-hover"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '0.6rem 1.25rem', 
              cursor: isExporting ? 'not-allowed' : 'pointer',
              color: 'var(--accent-glow)',
              border: '1px solid var(--accent-purple)',
              background: 'rgba(157, 80, 255, 0.1)',
              fontWeight: '600'
            }}
          >
            {isExporting ? <Loader2 size={18} className="animate-spin" /> : <FileText size={18} />}
            {isExporting ? 'Generating...' : 'Export PDF'}
          </button>
          <div style={{ padding: '0.6rem 1.25rem', borderRadius: '12px', background: 'rgba(157, 80, 255, 0.1)', color: 'var(--accent-purple)', border: '1px solid rgba(157, 80, 255, 0.2)', fontSize: '0.875rem', fontWeight: '600', display: 'flex', alignItems: 'center' }}>
            Real-time Asset Tracking
          </div>
        </div>
      </div>

      <div ref={reportRef} style={{ display: 'flex', flexDirection: 'column', gap: '2rem', background: 'transparent' }}>
      {/* Summary Cards */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
        {[
          { title: 'Total Asset Value', value: `₹${totalAssetValue.toLocaleString('en-IN')}`, icon: Box, color: 'var(--accent-purple)' },
          { title: 'Total Sales Revenue', value: `₹${totalSalesRevenue.toLocaleString('en-IN')}`, icon: DollarSign, color: 'var(--accent-blue)' },
          { title: 'Top Sales Category', value: topCategoryBySales, icon: TrendingUp, color: 'var(--accent-glow)' }
        ].map((stat, i) => (
          <div key={i} className="glass card-hover" style={{ flex: 1, minWidth: '300px', padding: '1.75rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
             <div style={{ width: '64px', height: '64px', background: 'rgba(0,0,0,0.03)', borderRadius: '16px', display: 'grid', placeItems: 'center', color: stat.color }}>
                <stat.icon size={32} />
             </div>
             <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{stat.title}</p>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{stat.value}</h3>
             </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.5fr)', gap: '2rem' }}>
        {/* Category Distribution (Pie Chart) */}
        <div className="glass" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <PieIcon size={20} className="gradient-text" /> Category Distribution
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
             <svg width="200" height="200" viewBox="-1 -1 2 2" style={{ transform: 'rotate(-90deg)' }}>
                {categories.map((cat, i) => {
                  const percent = categoryStats[cat].count / totalStock;
                  const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
                  cumulativePercent += percent;
                  const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
                  const largeArcFlag = percent > 0.5 ? 1 : 0;
                  const pathData = [
                    `M ${startX} ${startY}`,
                    `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                    `L 0 0`,
                  ].join(' ');
                  return <path key={i} d={pathData} fill={colors[i % colors.length]} stroke="var(--bg-deep)" strokeWidth="0.01" />;
                })}
                <circle r="0.6" cx="0" cy="0" fill="var(--bg-deep)" />
             </svg>
             
             <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {categories.map((cat, i) => (
                   <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: colors[i % colors.length] }}></div>
                      <span style={{ color: 'var(--text-secondary)' }}>{cat}</span>
                   </div>
                ))}
             </div>
          </div>
        </div>

        {/* Asset Value by Category (Bar Chart) */}
        <div className="glass" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BarChart3 size={20} className="gradient-text" /> Asset Value (₹)
          </h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {categories.map((cat, i) => {
              const value = categoryStats[cat].assetValue;
              const percent = (value / maxAssetValue) * 100;
              return (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                    <span style={{ fontWeight: '600' }}>{cat}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>₹{value.toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ height: '12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '6px', overflow: 'hidden' }}>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      style={{ height: '100%', background: `linear-gradient(90deg, ${colors[i % colors.length]}, var(--accent-purple))`, borderRadius: '6px' }}
                    ></motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* High Value Items Table */}
      <div className="glass" style={{ padding: '2rem' }}>
         <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Box size={20} className="gradient-text" /> High-Value Inventory
         </h3>
         <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
               <tr style={{ textAlign: 'left', color: 'var(--text-secondary)', borderBottom: '1px solid var(--glass-border)' }}>
                  <th style={{ padding: '1rem' }}>Product</th>
                  <th style={{ padding: '1rem' }}>Category</th>
                  <th style={{ padding: '1rem' }}>Asset Value</th>
                  <th style={{ padding: '1rem' }}>Stock</th>
                  <th style={{ padding: '1rem' }}>Market Performance</th>
               </tr>
            </thead>
            <tbody>
            {products.sort((a,b) => ( (Number(b.price) || 0) * (Number(b.stock) || 0) ) - ( (Number(a.price) || 0) * (Number(a.stock) || 0) )).slice(0, 5).map((p, i) => (
                  <tr key={i} className="card-hover" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                     <td style={{ padding: '1rem', fontWeight: '700' }}>{p.name}</td>
                     <td style={{ padding: '1rem' }}>{p.category}</td>
                     <td style={{ padding: '1rem', color: 'var(--accent-blue)', fontWeight: '800' }}>₹{( (Number(p.price) || 0) * (Number(p.stock) || 0) ).toLocaleString('en-IN')}</td>
                     <td style={{ padding: '1rem' }}>{p.stock} units</td>
                     <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-emerald)', fontSize: '0.875rem' }}>
                           <ArrowUpRight size={14} /> 
                           {((getProductSalesVolume(p.id) / ((Number(p.stock) || 1) + getProductSalesVolume(p.id))) * 100).toFixed(1)}% Turnover
                        </div>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
      </div>
    </motion.div>
  );
};

export default Reports;
