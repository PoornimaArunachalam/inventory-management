import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { Plus, Edit2, Trash2, Search, Filter, ShoppingCart, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PRODUCT_CATEGORIES = [
  "Mobile and Accessories",
  "Laptops and Computers",
  "TV and Home Entertainment",
  "Home Appliances",
  "Kitchen Appliances",
  "Wearable Devices",
  "Cameras and Accessories",
  "Gaming",
  "Networking Devices",
  "Storage Devices",
  "Power and Electricals",
  "Other Items"
];

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [sellingProduct, setSellingProduct] = useState(null);
  const { recordSale, products, deleteProduct, addProduct, updateProduct, loading } = useInventory();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div className="animate-float" style={{ fontSize: '1.5rem', color: 'var(--accent-green)', fontWeight: '700' }}>Fetching inventory...</div>
      </div>
    );
  }

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  return (
    <div className="responsive-grid" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '300px' }}>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (searchTerm.trim()) {
                alert(`Search logic triggered for: ${searchTerm}. The list below is filtered automatically as you type.`);
              }
            }}
            className="glass" 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0.6rem 1rem',
              borderRadius: '12px',
              width: '300px',
              background: 'rgba(137, 168, 148, 0.08)',
              transition: 'var(--transition)'
            }}
          >
            <button 
              type="submit" 
              style={{ 
                background: 'none', 
                border: 'none', 
                padding: 0, 
                cursor: 'pointer', 
                display: 'grid', 
                placeItems: 'center',
                color: 'var(--text-secondary)'
              }}
            >
              <Search size={18} />
            </button>
            <input
              type="text"
              placeholder="Filter products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ background: 'none', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '100%' }}
            />
          </form>
          <button className="glass" style={{ padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', border: 'none', borderRadius: '12px', color: 'var(--text-secondary)' }}>
            <Filter size={18} />
            Filter
          </button>
        </div>

        <button
          onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
          className="btn-primary"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 8px 25px rgba(137, 168, 148, 0.25)'
          }}
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'none', msOverflowStyle: 'none' }} className="hide-scrollbar">
        <button
          onClick={() => setSelectedCategory('All')}
          style={{
            padding: '0.5rem 1.25rem',
            borderRadius: '20px',
            whiteSpace: 'nowrap',
            fontWeight: '600',
            fontSize: '0.85rem',
            border: selectedCategory === 'All' ? '1px solid var(--accent-glow)' : '1px solid var(--glass-border)',
            background: selectedCategory === 'All' ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-card)',
            color: selectedCategory === 'All' ? 'var(--text-primary)' : 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'var(--transition)'
          }}
        >
          All
        </button>
        {PRODUCT_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '20px',
              whiteSpace: 'nowrap',
              fontWeight: '600',
              fontSize: '0.85rem',
              border: selectedCategory === cat ? '1px solid var(--accent-glow)' : '1px solid var(--glass-border)',
              background: selectedCategory === cat ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-card)',
              color: selectedCategory === cat ? 'var(--text-primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="glass table-container" style={{ padding: '1.5rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', color: 'var(--text-secondary)', borderBottom: '1px solid var(--glass-border)' }}>
              <th style={{ padding: '1rem' }}>Product Name</th>
              <th style={{ padding: '1rem' }}>Description</th>
              <th style={{ padding: '1rem' }}>Category</th>
              <th style={{ padding: '1rem' }}>Stock</th>
              <th style={{ padding: '1rem' }}>Price</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredProducts.map((product) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}
                >
                  <td style={{ padding: '1.25rem 1rem' }}>
                    <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{product.name}</span>
                  </td>
                  <td style={{ padding: '1.25rem 1rem', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {product.description || 'No description provided'}
                  </td>
                  <td style={{ padding: '1.25rem 1rem' }}>
                    <span style={{
                      padding: '4px 12px',
                      background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-glow))',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)'
                    }}>{product.category}</span>
                  </td>
                  <td style={{ padding: '1.25rem 1rem' }}>{product.stock}</td>
                  <td style={{ padding: '1.25rem 1rem' }}>₹{(Number(product.price) || 0).toLocaleString('en-IN')}</td>
                  <td style={{ padding: '1.25rem 1rem' }}>
                      <span style={{ 
                        padding: '4px 12px', 
                        borderRadius: '20px', 
                        fontSize: '0.75rem', 
                        fontWeight: '700',
                        background: 'rgba(39, 174, 96, 0.1)',
                        color: 'var(--accent-success)',
                        border: '1px solid rgba(39, 174, 96, 0.2)'
                      }}>
                        {product.status}
                      </span>
                  </td>
                  <td style={{ padding: '1.25rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                      <button 
                        onClick={() => { setSellingProduct(product); setIsSellModalOpen(true); }} 
                        style={{ background: 'rgba(137, 168, 148, 0.1)', border: '1px solid rgba(137, 168, 148, 0.2)', padding: '12px', borderRadius: '12px', cursor: 'pointer', color: 'var(--accent-green)', display: 'grid', placeItems: 'center', transition: 'var(--transition)' }}
                        title={`Record Sale (₹${product.price}/unit)`}
                      >
                        <ShoppingCart size={18} />
                      </button>
                      <button onClick={() => handleEdit(product)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(product.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#FF4D4D' }}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(255, 255, 255, 0.8)',
          display: 'grid',
          placeItems: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(10px)'
        }}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass"
            style={{ padding: '2.5rem', width: '450px', position: 'relative', boxShadow: '0 20px 50px rgba(137, 168, 148, 0.15)' }}
          >
            <h2 style={{ marginBottom: '2rem' }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const data = {
                name: formData.get('name'),
                description: formData.get('description'),
                imageUrl: formData.get('imageUrl'),
                category: formData.get('category'),
                stock: parseInt(formData.get('stock')),
                price: parseFloat(formData.get('price')),
              };
              if (editingProduct) updateProduct(editingProduct.id, data);
              else addProduct(data);
              setIsModalOpen(false);
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Product Name</label>
                  <input name="name" defaultValue={editingProduct?.name} required className="glass" style={{ padding: '0.75rem', color: 'var(--text-primary)', background: 'rgba(0,0,0,0.03)' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Description</label>
                  <textarea name="description" defaultValue={editingProduct?.description} className="glass" rows="3" style={{ padding: '0.75rem', color: 'var(--text-primary)', background: 'var(--bg-card)', resize: 'vertical' }} placeholder="Short description about the product..." />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Category</label>
                  <select name="category" defaultValue={editingProduct?.category || PRODUCT_CATEGORIES[0]} required className="glass" style={{ padding: '0.75rem', color: 'var(--text-primary)', background: 'var(--bg-card)', outline: 'none' }}>
                    {PRODUCT_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Stock</label>
                    <input name="stock" type="number" defaultValue={editingProduct?.stock} required className="glass" style={{ padding: '0.75rem', color: 'var(--text-primary)', background: 'rgba(255,255,255,0.03)' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Price (₹)</label>
                    <input name="price" type="number" step="0.01" defaultValue={editingProduct?.price} required className="glass" style={{ padding: '0.75rem', color: 'var(--text-primary)', background: 'rgba(255,255,255,0.03)' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', cursor: 'pointer', background: 'none', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>Cancel</button>
                  <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save Product</button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      {isSellModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(15px)',
          display: 'grid',
          placeItems: 'center',
          zIndex: 2000
        }}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="glass"
            style={{ padding: '2.5rem', width: '400px', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }}
          >
            <div style={{ width: '64px', height: '64px', background: 'rgba(137, 168, 148, 0.1)', borderRadius: '16px', display: 'grid', placeItems: 'center', color: 'var(--accent-green)', margin: '0 auto 1.5rem' }}>
               <ShoppingCart size={32} />
            </div>
            <h2 style={{ marginBottom: '0.5rem' }}>Record Sale</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{sellingProduct?.name} @ ₹{sellingProduct?.price}/unit</p>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const qty = parseInt(new FormData(e.target).get('quantity'));
              if (qty > 0 && qty <= sellingProduct.stock) {
                recordSale(sellingProduct.id, qty);
                setIsSellModalOpen(false);
              } else {
                alert(`Please enter a valid quantity (1 to ${sellingProduct.stock})`);
              }
            }}>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
                     <label style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>Quantity to Sell</label>
                     <input 
                        name="quantity" 
                        type="number" 
                        autoFocus
                        placeholder={`Available: ${sellingProduct?.stock}`} 
                        className="glass" 
                        style={{ padding: '1rem', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.03)', fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }} 
                     />
                     <span style={{ padding: '6px 14px', background: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent-glow)', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800', border: '1px solid rgba(59, 130, 246, 0.3)' }}>In Stock</span>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1rem' }}>
                     <button type="button" onClick={() => setIsSellModalOpen(false)} style={{ padding: '1rem', borderRadius: '12px', background: 'none', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                     <button type="submit" className="btn-primary" style={{ padding: '1rem' }}>Confirm Sale</button>
                  </div>
               </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
