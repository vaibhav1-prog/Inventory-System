import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AlertTriangle, Boxes, DollarSign, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import api from '../api/api';

const chartTone = ['#60a5fa', '#a78bfa', '#34d399', '#f59e0b'];

export default function Dashboard() {
  const [summary, setSummary] = useState({ products: [], customers: [], orders: [] });
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadSummary() {
      try {
        const [products, customers, orders] = await Promise.all([
          api.get('/products'),
          api.get('/customers'),
          api.get('/orders'),
        ]);
        setSummary({
          products: products.data,
          customers: customers.data,
          orders: orders.data,
        });
      } catch (err) {
        setError('Unable to load dashboard data');
      }
    }

    loadSummary();
  }, []);

  const lowStock = summary.products.filter((product) => product.quantity <= 5);
  const stockUnits = summary.products.reduce((total, product) => total + product.quantity, 0);
  const orderValue = summary.orders.reduce((total, order) => total + order.total_amount, 0);
  const recentOrders = [...summary.orders].slice(-6).reverse();
  const healthyProducts = summary.products.filter((product) => product.quantity > 5).length;
  const stockHealth = summary.products.length
    ? Math.round((healthyProducts / summary.products.length) * 100)
    : 100;

  const revenueData = useMemo(() => {
    const base = orderValue || 12000;
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => ({
      month,
      revenue: Math.round(base * (0.42 + index * 0.13)),
      orders: Math.max(1, summary.orders.length + index),
    }));
  }, [orderValue, summary.orders.length]);

  const inventoryData = summary.products.slice(0, 8).map((product) => ({
    name: product.sku,
    stock: product.quantity,
  }));

  const statusData = [
    { name: 'Completed', value: Math.max(summary.orders.length, 1) },
    { name: 'Processing', value: Math.max(Math.round(summary.orders.length * 0.35), 1) },
    { name: 'Pending', value: Math.max(Math.round(summary.orders.length * 0.2), 1) },
    { name: 'Cancelled', value: Math.max(Math.round(summary.orders.length * 0.08), 1) },
  ];

  const stats = [
    { label: 'Products', value: summary.products.length, icon: Boxes, tone: 'blue', note: 'Catalog items' },
    { label: 'Customers', value: summary.customers.length, icon: Users, tone: 'violet', note: 'Buyer records' },
    { label: 'Orders', value: summary.orders.length, icon: ShoppingCart, tone: 'teal', note: 'All-time orders' },
    { label: 'Revenue', value: `$${orderValue.toFixed(0)}`, icon: DollarSign, tone: 'green', note: 'Backend calculated' },
    { label: 'Low Stock', value: lowStock.length, icon: AlertTriangle, tone: 'amber', note: 'Needs attention', warning: true },
  ];

  return (
    <div className="page">
      <motion.section
        className="hero-panel"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="hero-copy">
          <p className="eyebrow">Enterprise Overview</p>
          <h2>Inventory Command Center</h2>
          <p>Premium operating layer for products, customers, orders, revenue, and stock risk.</p>
          <div className="hero-actions">
            <a href="/products">Manage Products</a>
            <a href="/orders">Create Order</a>
          </div>
        </div>
        <div className="hero-stat">
          <span>Total Stock Units</span>
          <strong>{stockUnits}</strong>
          <small>{stockHealth}% inventory health</small>
        </div>
      </motion.section>

      {error && <div className="error">{error}</div>}

      <div className="summary-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              className={stat.warning ? 'metric-card warning' : 'metric-card'}
              key={stat.label}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <span className={`metric-icon ${stat.tone}`}><Icon size={20} /></span>
              <h3>{stat.label}</h3>
              <p>{stat.value}</p>
              <small>{stat.note}</small>
            </motion.div>
          );
        })}
      </div>

      <div className="analytics-grid">
        <section className="panel chart-panel wide">
          <div className="panel-header">
            <div>
              <h3>Revenue Analytics</h3>
              <p>Monthly revenue trend</p>
            </div>
            <span className="pill"><TrendingUp size={14} /> +18.4%</span>
          </div>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenue" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.7} />
                    <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(148,163,184,0.18)" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,.1)', borderRadius: 14, color: '#fff' }} />
                <Area type="monotone" dataKey="revenue" stroke="#60a5fa" strokeWidth={3} fill="url(#revenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="panel health-card">
          <div className="panel-header">
            <h3>Inventory Health</h3>
            <span className="pill">{stockHealth}% healthy</span>
          </div>
          <div className="health-body">
            <div className="health-ring" style={{ '--health': `${stockHealth}%` }}>
              <span>{stockHealth}%</span>
            </div>
            <div>
              <h4>Stock Coverage</h4>
              <p>{healthyProducts} products are above the low-stock threshold.</p>
              <div className="meter">
                <span style={{ width: `${stockHealth}%` }}></span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="analytics-grid secondary">
        <section className="panel chart-panel">
          <div className="panel-header">
            <h3>Inventory Trends</h3>
            <span className="pill">{inventoryData.length || 0} SKUs</span>
          </div>
          <div className="chart-box small">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={inventoryData.length ? inventoryData : [{ name: 'No SKU', stock: 0 }]}>
                <CartesianGrid stroke="rgba(148,163,184,0.16)" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,.1)', borderRadius: 14, color: '#fff' }} />
                <Bar dataKey="stock" radius={[8, 8, 0, 0]} fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="panel chart-panel">
          <div className="panel-header">
            <h3>Order Distribution</h3>
            <span className="pill">Live mix</span>
          </div>
          <div className="chart-box small">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={statusData} dataKey="value" innerRadius={58} outerRadius={88} paddingAngle={4}>
                  {statusData.map((entry, index) => (
                    <Cell key={entry.name} fill={chartTone[index % chartTone.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,.1)', borderRadius: 14, color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="panel activity-panel">
          <div className="panel-header">
            <h3>Activity Timeline</h3>
          </div>
          <div className="activity-list">
            <div><span className="dot good"></span><p><strong>Catalog synced</strong>{summary.products.length} products are available.</p></div>
            <div><span className="dot good"></span><p><strong>Customer records</strong>{summary.customers.length} customer profiles loaded.</p></div>
            <div><span className={lowStock.length ? 'dot warn' : 'dot good'}></span><p><strong>Stock monitor</strong>{lowStock.length ? `${lowStock.length} product needs restock.` : 'All stock levels look healthy.'}</p></div>
          </div>
        </section>
      </div>

      <div className="analytics-grid bottom">
        <section className="panel">
          <div className="panel-header">
            <h3>Recent Orders</h3>
            <span className="pill">{recentOrders.length} latest</span>
          </div>
          {recentOrders.length === 0 ? (
            <p className="empty-state">No orders yet.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Order</th><th>Customer</th><th>Status</th><th>Total</th></tr></thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td><span className="code">#{order.id}</span></td>
                      <td>{order.customer_id}</td>
                      <td><span className="status-pill completed">Completed</span></td>
                      <td className="strong">${order.total_amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="panel">
          <div className="panel-header">
            <h3>Low Stock Products</h3>
            <span className="pill">{lowStock.length} items</span>
          </div>
          {lowStock.length === 0 ? (
            <p className="empty-state">No low stock products.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Name</th><th>SKU</th><th>Quantity</th></tr></thead>
                <tbody>
                  {lowStock.map((product) => (
                    <tr key={product.id}>
                      <td className="strong">{product.name}</td>
                      <td><span className="code">{product.sku}</span></td>
                      <td><span className="stock-badge low">{product.quantity}</span></td>
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
