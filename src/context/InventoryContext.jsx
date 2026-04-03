import React, { createContext, useContext, useState, useEffect } from 'react';

const InventoryContext = createContext();
const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");
if (!API_URL) {
  console.warn("[InventoryContext]: VITE_API_URL is undefined. API calls may fail.");
} else {
  console.log(`[InventoryContext]: Using backend at ${API_URL}`);
}

export const useInventory = () => useContext(InventoryContext);

export const InventoryProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('inventory_token');
      const res = await fetch(`${API_URL}/data`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      setProducts(data.products || []);
      setSales(data.sales || []);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (API_URL) fetchData();
  }, [API_URL]);

  const getStatus = (stock) => {
    if (stock > 10) return 'In Stock';
    if (stock > 0) return 'Low Stock';
    return 'Out of Stock';
  };

  const addProduct = async (product) => {
    const newProduct = { ...product, id: Date.now(), status: getStatus(product.stock) };
    try {
      const token = localStorage.getItem('inventory_token');
      const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newProduct)
      });
      if (res.ok) {
        const savedProduct = await res.json();
        setProducts(prev => [...prev, savedProduct]);
      }
    } catch (err) {
      console.error("Add Product error:", err);
    }
  };

  const updateProduct = async (id, updatedProduct) => {
    const formatted = { ...updatedProduct, status: getStatus(updatedProduct.stock) };
    try {
      const token = localStorage.getItem('inventory_token');
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formatted)
      });
      if (res.ok) {
        const savedProduct = await res.json();
        setProducts(prev => prev.map(p => p.id === id ? savedProduct : p));
      }
    } catch (err) {
      console.error("Update Product error:", err);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const token = localStorage.getItem('inventory_token');
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error("Delete Product error:", err);
    }
  };

  const recordSale = async (productId, quantity) => {
    const product = products.find(p => p.id === productId);
    if (product && product.stock >= quantity) {
      const sale = {
        id: Date.now(),
        productId,
        productName: product.name,
        category: product.category,
        quantity,
        unitPrice: product.price,
        amount: Number(product.price * quantity),
        date: new Date().toISOString().split('T')[0]
      };

      try {
        const token = localStorage.getItem('inventory_token');
        // Record the sale
        const saleRes = await fetch(`${API_URL}/sales`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(sale)
        });

        if (saleRes.ok) {
          const savedSale = await saleRes.json();
          setSales(prev => [...prev, savedSale]);

          // Update stock status
          const newStock = product.stock - quantity;
          const updatedProduct = { ...product, stock: newStock, status: getStatus(newStock) };
          
          const prodRes = await fetch(`${API_URL}/products/${productId}`, {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedProduct)
          });

          if (prodRes.ok) {
            const savedProduct = await prodRes.json();
            setProducts(prev => prev.map(p => p.id === productId ? savedProduct : p));
          }
        }
      } catch (err) {
        console.error("Record Sale error:", err);
      }
    }
  };

  return (
    <InventoryContext.Provider value={{ products, sales, addProduct, updateProduct, deleteProduct, recordSale, loading, refreshData: fetchData }}>
      {children}
    </InventoryContext.Provider>
  );
};

