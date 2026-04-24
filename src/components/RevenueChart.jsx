import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  Area, 
  ComposedChart 
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass" style={{ 
        padding: '10px 15px', 
        border: '1px solid #89a894', 
        background: 'rgba(30, 41, 59, 0.9)',
        boxShadow: '0 0 15px rgba(137, 168, 148, 0.15)'
      }}>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: '500' }}>{label}</p>
        <p style={{ margin: '4px 0 0', color: '#89a894', fontSize: '1rem', fontWeight: '800' }}>
          ₹{payload[0].value.toLocaleString('en-IN')}
        </p>
      </div>
    );
  }
  return null;
};

const RevenueChart = ({ sales }) => {
  // ... (keeping existing logic)
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

  // Map to last 7 days
  const data = last7Days.map(date => {
    const d = new Date(date);
    const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return { 
      name: label, 
      revenue: revenueData[date] || 0 
    };
  });

  return (
    <div style={{ width: '100%', height: '240px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--accent-blue)" stopOpacity={0.4}/>
            <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0}/>
          </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.05)" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--text-secondary)', fontSize: 10 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--text-secondary)', fontSize: 10 }}
            tickFormatter={(val) => `₹${val >= 1000 ? (val/1000).toFixed(0) + 'k' : val}`}
          />
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ fill: 'rgba(255, 117, 24, 0.05)' }}
          />
          <Bar 
            dataKey="revenue" 
            radius={[6, 6, 0, 0]} 
            animationDuration={1500}
            animationBegin={0}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill="url(#colorValue)" 
                style={{ filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.2))' }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
