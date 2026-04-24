import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ShoppingCart, Bell, Settings, Zap, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SpeedDial = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  // Don't show the quick actions if not logged in or if it's a worker (since workers only have view access)
  // Wait, if it's a worker, maybe show different actions? Let's hide it for workers for now, or just show a "Refresh" action.
  // Actually, we can show actions based on role.
  const isAdmin = user?.role === 'admin';

  const actions = isAdmin ? [
    { icon: <Plus size={20} />, label: 'Add Product', color: '#10b981', action: () => alert('Quick Add coming soon!') },
    { icon: <ShoppingCart size={20} />, label: 'New Sale', color: '#3b82f6', action: () => alert('Quick Sale coming soon!') },
    { icon: <Bell size={20} />, label: 'Alerts', color: '#f59e0b', action: () => window.location.hash = 'alerts' },
    { icon: <Settings size={20} />, label: 'Settings', color: '#8b5cf6', action: () => alert('Settings coming soon!') },
  ] : [
    { icon: <Bell size={20} />, label: 'Alerts', color: '#f59e0b', action: () => window.location.hash = 'alerts' }
  ];

  if (!user) return null;

  return (
    <div className="speed-dial-container">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="speed-dial-overlay"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="speed-dial-actions">
        <AnimatePresence>
          {isOpen && actions.map((action, index) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 20, scale: 0.5 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
                transition: { delay: index * 0.05, type: 'spring', stiffness: 300, damping: 20 }
              }}
              exit={{ 
                opacity: 0, 
                y: 20, 
                scale: 0.5,
                transition: { delay: (actions.length - 1 - index) * 0.05 }
              }}
              className="speed-dial-action-wrapper"
            >
              <span className="speed-dial-tooltip">{action.label}</span>
              <button
                className="speed-dial-btn-small"
                style={{ backgroundColor: action.color }}
                onClick={() => {
                  action.action();
                  setIsOpen(false);
                }}
              >
                {action.icon}
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        <motion.button
          className="speed-dial-main-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <Zap size={24} color="white" />
        </motion.button>
      </div>
    </div>
  );
};

export default SpeedDial;
