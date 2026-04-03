import React from 'react';
import { motion } from 'framer-motion';

const RevenueChart = ({ sales }) => {
  // Get last 7 days (including today)
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split('T')[0]);
    }
    return days;
  };

  const last7Days = getLast7Days();

  // Aggregate real sales by date
  const revenueData = sales.reduce((acc, sale) => {
    const date = sale.date;
    acc[date] = (acc[date] || 0) + Number(sale.amount || 0);
    return acc;
  }, {});

  // Map to last 7 days, filling with 0 if no sales
  const chartData = last7Days.map(date => {
    // Format date for label (e.g., 'Apr 03')
    const d = new Date(date);
    const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return { 
      fullDate: date,
      date: label, 
      amount: revenueData[date] || 0 
    };
  });

  const rawMax = Math.max(...chartData.map(d => d.amount));
  const maxAmount = rawMax === 0 ? 100 : rawMax * 1.2;
  const height = 200;
  const width = 600;
  const padding = 40;

  const points = chartData.map((d, i) => ({
    x: padding + (chartData.length > 1 ? (i * (width - 2 * padding) / (chartData.length - 1)) : (width / 2)),
    y: height - padding - (d.amount / maxAmount * (height - 2 * padding))
  }));

  const pathD = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;
  const areaD = `${pathD} L ${points[points.length - 1].x},${height - padding} L ${points[0].x},${height - padding} Z`;

  return (
    <div style={{ width: '100%', height: '240px', position: 'relative' }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent-blue)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--accent-blue)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
          <line 
            key={i} 
            x1={padding} 
            y1={padding + p * (height - 2 * padding)} 
            x2={width - padding} 
            y2={padding + p * (height - 2 * padding)} 
            stroke="rgba(255, 255, 255, 0.03)" 
            strokeWidth="1" 
          />
        ))}

        {/* Gradient Fill */}
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent-purple)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--accent-purple)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path 
          d={areaD} 
          fill="url(#areaGradient)" 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />

        {/* Main Line */}
        <motion.path 
          d={pathD} 
          fill="none" 
          stroke="var(--accent-purple)" 
          strokeWidth="4" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />

        {/* Dots */}
        {points.map((p, i) => (
          <motion.circle 
            key={i} 
            cx={p.x} 
            cy={p.y} 
            r="4" 
            fill="var(--bg-deep)" 
            stroke="var(--accent-glow)" 
            strokeWidth="2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1 + i * 0.1 }}
          />
        ))}
      </svg>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: `0 ${padding}px`, marginTop: '-15px' }}>
        {chartData.map((d, i) => (
          <span key={i} style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>{d.date}</span>
        ))}
      </div>
    </div>
  );
};

export default RevenueChart;
