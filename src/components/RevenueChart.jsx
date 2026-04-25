import React from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Area, 
  ComposedChart,
  Line,
  Bar
} from 'recharts';
import { motion } from 'framer-motion';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        style={{ 
          padding: '12px 16px', 
          background: 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '12px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4)',
        }}
      >
        <p style={{ margin: 0, color: 'var(--text-dim)', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary)', boxShadow: '0 0 8px var(--accent-primary)' }}></div>
          <p style={{ margin: 0, color: '#f8fafc', fontSize: '1.1rem', fontWeight: '800' }}>
            ₹{payload[0].value.toLocaleString('en-IN')}
          </p>
        </div>
      </motion.div>
    );
  }
  return null;
};

const RevenueChart = ({ sales }) => {
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

  const revenueData = sales.reduce((acc, sale) => {
    const date = sale.date;
    acc[date] = (acc[date] || 0) + Number(sale.amount || 0);
    return acc;
  }, {});

  const data = last7Days.map(date => {
    const d = new Date(date);
    const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return { 
      name: label, 
      revenue: revenueData[date] || 0 
    };
  });

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '200px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.03)" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--text-dim)', fontSize: 10, fontWeight: 600 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--text-dim)', fontSize: 10, fontWeight: 600 }}
            tickFormatter={(val) => `₹${val >= 1000 ? (val/1000).toFixed(0) + 'k' : val}`}
          />
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ stroke: 'rgba(255, 255, 255, 0.1)', strokeWidth: 1 }}
          />
          
          <Area 
            type="monotone" 
            dataKey="revenue" 
            stroke="none"
            fill="url(#revenueGradient)" 
            isAnimationActive={true}
            animationDuration={2000}
            animationEasing="ease-out"
          />
          
          <Bar 
            dataKey="revenue" 
            barSize={20} 
            radius={[4, 4, 0, 0]}
            fill="rgba(59, 130, 246, 0.1)"
            isAnimationActive={true}
            animationDuration={1500}
          />

          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke="var(--accent-primary)" 
            strokeWidth={3} 
            dot={{ r: 4, fill: 'var(--accent-primary)', strokeWidth: 2, stroke: 'var(--bg-card)' }}
            activeDot={{ r: 6, fill: 'var(--accent-primary)', stroke: '#fff', strokeWidth: 2 }}
            isAnimationActive={true}
            animationDuration={2500}
            filter="url(#glow)"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
