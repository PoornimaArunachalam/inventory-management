import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, PieChart, Package, AlertTriangle } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm StockIQ, your AI-powered Inventory Analyst. Ask me complex questions about your stock, prices, or sales performance!", sender: 'bot' }
  ]);
  const [inputText, setInputText] = useState('');
  const { products, sales } = useInventory();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (input) => {
    const text = input.toLowerCase();
    const words = text.split(' ');
    
    // 0. Identity Query
    if (text.includes('who are you') || text.includes('your name')) {
      return "I'm StockIQ, your real-time data assistant. I help you monitor inventory value, stock concentrations, and sales trends.";
    }

    // 1. Price Extremes (Most Expensive / Cheapest)
    if (text.includes('expensive') || text.includes('highest price') || text.includes('costly')) {
      if (products.length === 0) return "No products found to analyze.";
      const mostExp = [...products].sort((a, b) => b.price - a.price)[0];
      return `The most expensive item is "${mostExp.name}" at $${mostExp.price.toLocaleString()}. We have ${mostExp.stock} units.`;
    }
    if (text.includes('cheapest') || text.includes('lowest price')) {
      if (products.length === 0) return "No products found to analyze.";
      const cheapest = [...products].sort((a, b) => a.price - b.price)[0];
      return `The cheapest item is "${cheapest.name}" at $${cheapest.price.toLocaleString()}.`;
    }

    // 2. Category Analysis
    if (text.includes('category') || text.includes('categories')) {
      const categories = [...new Set(products.map(p => p.category))];
      if (text.includes('how many')) return `You have ${categories.length} unique product categories.`;
      
      // Check for specific category query: "How many Electronics?"
      const mentionedCategory = categories.find(c => text.includes(c.toLowerCase()));
      if (mentionedCategory) {
        const catItems = products.filter(p => p.category === mentionedCategory);
        const catUnits = catItems.reduce((acc, p) => acc + p.stock, 0);
        return `In the "${mentionedCategory}" category, you have ${catItems.length} products with a total of ${catUnits} units.`;
      }
      return `Your categories are: ${categories.join(', ')}. Ask me about a specific one for more details!`;
    }

    // 3. Stock Depth (Highest Quantity)
    if (text.includes('highest quantity') || text.includes('most stock') || text.includes('top stock')) {
      if (products.length === 0) return "No products found.";
      const topStock = [...products].sort((a, b) => b.stock - a.stock)[0];
      return `"${topStock.name}" has the highest quantity with ${topStock.stock} units in stock.`;
    }

    // 4. Low Stock Alert
    if (text.includes('low stock') || text.includes('alert') || text.includes('running out')) {
      const lowStockItems = products.filter(p => p.stock > 0 && p.stock <= 10);
      if (lowStockItems.length === 0) return "All your inventory is currently at healthy levels (above 10 units each).";
      return `Alert: ${lowStockItems.length} products are running low (<= 10 units): ${lowStockItems.map(i => i.name).join(', ')}.`;
    }

    // 5. Out of Stock
    if (text.includes('out of stock') || text.includes('zero') || text.includes('none')) {
      const outOfStockItems = products.filter(p => p.stock === 0);
      if (outOfStockItems.length === 0) return "Great news! Every product in your catalog is currently available.";
      return `The following ${outOfStockItems.length} items are sold out: ${outOfStockItems.map(i => i.name).join(', ')}.`;
    }

    // 6. Total Inventory Stats
    if (text.includes('total value') || text.includes('worth') || text.includes('how much inventory')) {
      const totalUnits = products.reduce((acc, p) => acc + p.stock, 0);
      const totalValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);
      return `Your warehouse currently holds ${totalUnits} total units across ${products.length} unique products, with a combined value of $${totalValue.toLocaleString()}.`;
    }

    // 7. Revenue / Sales Performance
    if (text.includes('revenue') || text.includes('total sales') || text.includes('earned')) {
      const totalRevenue = sales.reduce((acc, s) => acc + s.amount, 0);
      if (text.includes('today')) {
        const todayStr = new Date().toISOString().split('T')[0];
        const daySales = sales.filter(s => s.date === todayStr);
        const dayRev = daySales.reduce((acc, s) => acc + s.amount, 0);
        return `Today you have recorded ${daySales.length} sales totaling $${dayRev.toLocaleString()}.`;
      }
      return `To date, you have generated $${totalRevenue.toLocaleString()} in revenue from ${sales.length} transactions.`;
    }

    // 8. Specific Product Search
    const foundProduct = products.find(p => text.includes(p.name.toLowerCase()));
    if (foundProduct) {
      return `Real-time stats for "${foundProduct.name}": ${foundProduct.stock} in stock, priced at $${foundProduct.price}. Category: ${foundProduct.category}.`;
    }

    // Default Fallback
    return "I'm StockIQ. Ask me about your 'most expensive' item, 'low stock', 'total value', or specific categories like 'Electronics'.";
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = { id: Date.now(), text: inputText, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    setTimeout(() => {
      const botReply = { id: Date.now() + 1, text: getBotResponse(inputText), sender: 'bot' };
      setMessages(prev => [...prev, botReply]);
    }, 600);
  };

  const quickAction = (text) => {
    setInputText(text);
    const dummyEvent = { preventDefault: () => {} };
    setTimeout(() => handleSend(dummyEvent), 100);
  };

  return (
    <div className="chatbot-container">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="chat-window glass"
          >
            <div className="chat-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MessageSquare size={20} />
                <span style={{ fontWeight: '600' }}>StockIQ Analytics Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div className="chat-messages">
              {messages.map(msg => (
                <div key={msg.id} className={`message ${msg.sender}`}>
                  {msg.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area">
              <div style={{ width: '100%' }}>
                <div className="quick-actions">
                  <button className="quick-btn" onClick={() => quickAction("Stock Alerts")}>Alerts</button>
                  <button className="quick-btn" onClick={() => quickAction("What is the most expensive item?")}>Most Expensive</button>
                  <button className="quick-btn" onClick={() => quickAction("List my categories")}>Categories</button>
                  <button className="quick-btn" onClick={() => quickAction("Total Inventory Value")}>Total Value</button>
                </div>
                <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                  <input 
                    type="text" 
                    className="chat-input" 
                    placeholder="Ask a question..." 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  />
                  <button type="submit" className="btn-primary" style={{ padding: '0.5rem', borderRadius: '10px', boxShadow: 'none' }}>
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="chat-bubble animate-float"
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </motion.button>
    </div>
  );
};

export default ChatBot;
