import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Grid2X2, List, PackagePlus, Search } from 'lucide-react';
import api from '../../api/api';

const initialForm = { name: '', sku: '', price: '', quantity: '' };

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('');
  const [query, setQuery] = useState('');
  const [view, setView] = useState('table');

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (err) {
      setStatus('Unable to load products');
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const payload = {
        name: form.name,
        sku: form.sku,
        price: Number(form.price),
        quantity: Number(form.quantity),
      };

      await api.post('/products', payload);
      setStatus('Product created successfully.');

      setForm(initialForm);
      loadProducts();
    } catch (error) {
      setStatus(error.response?.data?.detail || 'Failed to save product');
    }
  }

  async function removeProduct(id) {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      setStatus('Product deleted successfully.');
      loadProducts();
    } catch (error) {
      setStatus(error.response?.data?.detail || 'Failed to delete product');
    }
  }

  async function adjustStock(product, delta) {
    const nextQuantity = product.quantity + delta;
    if (nextQuantity < 0) return;

    try {
      await api.put(`/products/${product.id}`, { quantity: nextQuantity });
      setStatus(`Stock updated for ${product.name}.`);
      loadProducts();
    } catch (error) {
      setStatus(error.response?.data?.detail || 'Failed to update stock');
    }
  }

  const filteredProducts = products.filter((product) => (
    product.name.toLowerCase().includes(query.toLowerCase())
    || product.sku.toLowerCase().includes(query.toLowerCase())
  ));

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Catalog</p>
          <h2>Products</h2>
          <p className="page-subtitle">Maintain SKUs, prices, and available inventory.</p>
        </div>
        <span className="pill">{filteredProducts.length} products</span>
      </div>
      {status && <div className="status">{status}</div>}
      <div className="workspace-grid">
        <motion.form className="panel form side-form premium-form" onSubmit={handleSubmit} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="form-title">
            <span><PackagePlus size={18} /></span>
            <h3>Add Product</h3>
          </div>
          <div className="form-grid single">
            <label>Name
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>
            <label>SKU
              <input name="sku" value={form.sku} onChange={handleChange} required />
            </label>
            <label>Price
              <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required />
            </label>
            <label>Quantity
              <input name="quantity" type="number" min="0" value={form.quantity} onChange={handleChange} required />
            </label>
          </div>
          <div className="button-row">
            <button type="submit">Add Product</button>
          </div>
        </motion.form>

      <section className="panel data-panel">
        <div className="panel-header">
          <div>
            <h3>Product List</h3>
            <p>Search, review, and manage current inventory.</p>
          </div>
          <div className="panel-tools">
            <label className="mini-search">
              <Search size={16} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search SKU or name" />
            </label>
            <button type="button" className={view === 'table' ? 'tool active' : 'tool'} onClick={() => setView('table')}><List size={16} /></button>
            <button type="button" className={view === 'grid' ? 'tool active' : 'tool'} onClick={() => setView('grid')}><Grid2X2 size={16} /></button>
          </div>
        </div>
        {view === 'grid' ? (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <motion.div className="product-card" key={product.id} whileHover={{ y: -6 }}>
                <div className="product-image">{product.name.slice(0, 2).toUpperCase()}</div>
                <div>
                  <h3>{product.name}</h3>
                  <span className="code">{product.sku}</span>
                </div>
                <div className="product-meta">
                  <strong>${product.price.toFixed(2)}</strong>
                  <div className="stock-control">
                    <button type="button" onClick={() => adjustStock(product, -1)} disabled={product.quantity === 0}>-</button>
                    <span className={product.quantity <= 5 ? 'stock-badge low' : 'stock-badge'}>{product.quantity}</span>
                    <button type="button" onClick={() => adjustStock(product, 1)}>+</button>
                  </div>
                </div>
                <div className="actions">
                  <button className="small danger" onClick={() => removeProduct(product.id)}>Delete</button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>SKU</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td className="strong">{product.name}</td>
                  <td><span className="code">{product.sku}</span></td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>
                    <div className="stock-control">
                      <button type="button" onClick={() => adjustStock(product, -1)} disabled={product.quantity === 0}>-</button>
                      <span className={product.quantity <= 5 ? 'stock-badge low' : 'stock-badge'}>{product.quantity}</span>
                      <button type="button" onClick={() => adjustStock(product, 1)}>+</button>
                    </div>
                  </td>
                  <td className="actions">
                    <button className="small danger" onClick={() => removeProduct(product.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </section>
      </div>
    </div>
  );
}
