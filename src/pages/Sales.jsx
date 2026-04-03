import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { ShoppingCart, TrendingUp, ArrowUpRight, ArrowDownRight, Download, Filter, FileText, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';

const Sales = () => {
  const { sales, products } = useInventory();
  const [isExporting, setIsExporting] = useState(false);

   const totalRevenue = sales.reduce((acc, s) => acc + (Number(s.amount) || 0), 0);
   const totalItemsSold = sales.reduce((acc, s) => acc + (Number(s.quantity) || 0), 0);
   const averageOrderValue = sales.length > 0 ? totalRevenue / sales.length : 0;

  const handleExportPDF = () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      let y = 20;

      // 1. Header
      doc.setFontSize(22);
      doc.setTextColor(157, 80, 255); // --accent-purple
      doc.setFont('helvetica', 'bold');
      doc.text('STOCK & ROLL', margin, y);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.setFont('helvetica', 'normal');
      doc.text(`Sales Ledger - ${new Date().toLocaleDateString()}`, pageWidth - margin - 50, y);
      
      y += 10;
      doc.setDrawColor(157, 80, 255);
      doc.line(margin, y, pageWidth - margin, y);
      
      y += 15;
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('Sales Transaction History Report', margin, y);
      
      // 2. Executive Summary
      y += 15;
      doc.setFillColor(245, 240, 255);
      doc.rect(margin, y, pageWidth - (2 * margin), 30, 'F');
      
      y += 12;
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text('Total Revenue (INR)', margin + 5, y);
      doc.text('Units Sold', margin + 70, y);
      doc.text('Avg. Order Value', margin + 130, y);
      
      y += 10;
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.text(`INR ${totalRevenue.toLocaleString('en-IN')}`, margin + 5, y);
      doc.text(`${totalItemsSold} Units`, margin + 70, y);
      doc.text(`INR ${averageOrderValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, margin + 130, y);
      
      // 3. Transactions Table
      y += 20;
      doc.setFontSize(12);
      doc.text('Detailed Transaction Ledger', margin, y);
      
      y += 10;
      doc.setFillColor(157, 80, 255);
      doc.setTextColor(255, 255, 255);
      doc.rect(margin, y, pageWidth - (2 * margin), 8, 'F');
      
      y += 6;
      doc.setFontSize(8);
      doc.text('Txn ID', margin + 5, y);
      doc.text('Product Name', margin + 30, y);
      doc.text('Category', margin + 85, y);
      doc.text('Qty', margin + 130, y);
      doc.text('Amount (INR)', margin + 150, y);
      doc.text('Date', margin + 175, y);
      
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      
      sales.slice().reverse().forEach((sale, index) => {
        y += 10;
        if (y > 275) { doc.addPage(); y = 20; }
        
        const idStr = sale.id ? String(sale.id).slice(-6).toUpperCase() : 'N/A';
        doc.text(`TXN-${idStr}`, margin + 5, y);
        doc.text(sale.productName ? (sale.productName.length > 25 ? sale.productName.slice(0, 22) + '...' : sale.productName) : 'N/A', margin + 30, y);
        doc.text(sale.category || 'N/A', margin + 85, y);
        doc.text(String(sale.quantity || 0), margin + 130, y);
        doc.text((Number(sale.amount) || 0).toLocaleString('en-IN'), margin + 150, y);
        doc.text(sale.date || 'N/A', margin + 175, y);
        
        doc.setDrawColor(245, 245, 245);
        doc.line(margin, y + 2, pageWidth - margin, y + 2);
      });

      doc.save(`Stock_and_Roll_Sales_Report_${new Date().getTime()}.pdf`);
    } catch (err) {
      console.error('Sales PDF Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Sales Report</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={handleExportPDF}
            disabled={isExporting}
            className="glass card-hover" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '0.6rem 1.2rem', 
              cursor: isExporting ? 'not-allowed' : 'pointer', 
              background: 'rgba(157, 80, 255, 0.1)', 
              border: '1px solid var(--accent-purple)', 
              color: 'var(--accent-glow)', 
              borderRadius: '12px',
              fontWeight: '600'
            }}
          >
            {isExporting ? <Loader2 size={18} className="animate-spin" /> : <FileText size={18} />}
            {isExporting ? 'Generating...' : 'Export PDF'}
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
