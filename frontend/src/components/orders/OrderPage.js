import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Search, ShoppingCart } from 'lucide-react';
import api from '../../api/api';

const initialItem = { product_id: '', quantity: '' };

export default function OrderPage() {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customerId, setCustomerId] = useState('');
  const [items, setItems] = useState([{ ...initialItem }]);
  const [status, setStatus] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [customerRes, productRes, orderRes] = await Promise.all([
        api.get('/customers'),
        api.get('/products'),
        api.get('/orders'),
      ]);
      setCustomers(customerRes.data);
      setProducts(productRes.data);
      setOrders(orderRes.data);
    } catch (error) {
      setStatus('Unable to load order data');
    }
  }

  function handleItemChange(index, field, value) {
    setItems((prev) => prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item)));
  }

  function addItemRow() {
    setItems((prev) => [...prev, { ...initialItem }]);
  }

  function removeItemRow(index) {
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const payload = {
        customer_id: Number(customerId),
        items: items
          .filter((item) => item.product_id && item.quantity)
          .map((item) => ({
            product_id: Number(item.product_id),
            quantity: Number(item.quantity),
          })),
      };
      await api.post('/orders', payload);
      setStatus('Order created successfully.');
      setCustomerId('');
      setItems([{ ...initialItem }]);
      loadData();
    } catch (error) {
      setStatus(error.response?.data?.detail || 'Failed to create order');
    }
  }

  async function deleteOrder(orderId) {
    if (!window.confirm('Cancel this order?')) return;
    try {
      await api.delete(`/orders/${orderId}`);
      setStatus('Order canceled successfully.');
      loadData();
    } catch (error) {
      setStatus(error.response?.data?.detail || 'Failed to cancel order');
    }
  }

  const filteredOrders = orders.filter((order) => String(order.id).includes(query) || String(order.customer_id).includes(query));

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Sales</p>
          <h2>Orders</h2>
          <p className="page-subtitle">Create orders and let backend stock rules protect inventory.</p>
        </div>
        <span className="pill">{filteredOrders.length} orders</span>
      </div>
      {status && <div className="status">{status}</div>}
      <div className="workspace-grid">
        <motion.form className="panel form side-form premium-form" onSubmit={handleSubmit} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="form-title">
            <span><ShoppingCart size={18} /></span>
            <h3>Create Order</h3>
          </div>
          <label>Customer
            <select value={customerId} onChange={(e) => setCustomerId(e.target.value)} required>
              <option value="">Select customer</option>
              {customers.map((customer) => (
                <option value={customer.id} key={customer.id}>
                  {customer.full_name}
                </option>
              ))}
            </select>
          </label>

        <div className="order-items">
          {items.map((item, index) => (
            <div className="order-item-row" key={index}>
              <select
                value={item.product_id}
                onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
                required
              >
                <option value="">Select product</option>
                {products.map((product) => (
                  <option value={product.id} key={product.id}>
                    {product.name} ({product.sku})
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                placeholder="Quantity"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                required
              />
              <button type="button" onClick={() => removeItemRow(index)}>
                Remove
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addItemRow} className="secondary">
          Add Product
        </button>
        <button type="submit">Create Order</button>
      </motion.form>

      <section className="panel data-panel">
        <div className="panel-header">
          <div>
            <h3>Recent Orders</h3>
            <p>Invoice-style order management with fulfillment status.</p>
          </div>
          <label className="mini-search">
            <Search size={16} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search orders" />
          </label>
        </div>
        <div className="order-card-grid">
          {filteredOrders.map((order) => (
            <motion.div className="order-card" key={order.id} whileHover={{ y: -6 }}>
              <div className="order-card-head">
                <div>
                  <span className="code">#{order.id}</span>
                  <h3>Customer {order.customer_id}</h3>
                </div>
                <span className="status-pill completed">Completed</span>
              </div>
              <div className="order-card-body">
                <div><small>Total</small><strong>${order.total_amount.toFixed(2)}</strong></div>
                <div><small>Items</small><strong>{order.items.length}</strong></div>
              </div>
              <div className="order-timeline">
                <span></span><span></span><span></span>
              </div>
              <div className="actions">
                <Link className="button-link" to={`/orders/${order.id}`}><FileText size={14} /> View</Link>
                <button className="small danger" onClick={() => deleteOrder(order.id)}>Cancel</button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      </div>
    </div>
  );
}
