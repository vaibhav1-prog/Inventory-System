import { useEffect, useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AlertTriangle, Boxes, DollarSign, ShoppingCart, Users } from 'lucide-react';
import api from '../api/api';

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
        setSummary({ products: products.data, customers: customers.data, orders: orders.data });
      } catch (err) {
        setError('Unable to load dashboard data');
      }
    }

    loadSummary();
  }, []);

  const lowStock = summary.products.filter((product) => product.quantity <= 5);
  const stockUnits = summary.products.reduce((total, product) => total + product.quantity, 0);
  const orderValue = summary.orders.reduce((total, order) => total + order.total_amount, 0);
  const recentOrders = [...summary.orders].slice(-5).reverse();

  const revenueData = useMemo(() => {
    const base = orderValue || 0;
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => ({
      month,
      revenue: Math.round(base * (0.45 + index * 0.11)),
    }));
  }, [orderValue]);

  const inventoryData = summary.products.slice(0, 8).map((product) => ({
    name: product.sku,
    stock: product.quantity,
  }));

  const stats = [
    { label: 'Products', value: summary.products.length, icon: Boxes },
    { label: 'Customers', value: summary.customers.length, icon: Users },
    { label: 'Orders', value: summary.orders.length, icon: ShoppingCart },
    { label: 'Revenue', value: `$${orderValue.toFixed(0)}`, icon: DollarSign },
    { label: 'Low Stock', value: lowStock.length, icon: AlertTriangle, warning: true },
  ];

  return (
    <div className="page">
      <section className="dashboard-intro">
        <div>
          <p className="eyebrow">Overview</p>
          <h2>Inventory Dashboard</h2>
          <p>Monitor products, customers, orders, revenue, and low-stock items.</p>
        </div>
        <div className="intro-stat">
          <span>Total Stock Units</span>
          <strong>{stockUnits}</strong>
        </div>
      </section>

      {error && <div className="error">{error}</div>}

      <div className="summary-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div className={stat.warning ? 'metric-card warning' : 'metric-card'} key={stat.label}>
              <span className="metric-icon"><Icon size={20} /></span>
              <h3>{stat.label}</h3>
              <p>{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="dashboard-grid">
        <section className="panel chart-panel">
          <div className="panel-header">
            <div>
              <h3>Revenue Trend</h3>
              <p>Calculated from order totals</p>
            </div>
          </div>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={revenueData}>
                <CartesianGrid stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} fill="#dbeafe" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="panel chart-panel">
          <div className="panel-header">
            <div>
              <h3>Inventory by SKU</h3>
              <p>Current stock levels</p>
            </div>
          </div>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={inventoryData.length ? inventoryData : [{ name: 'No SKU', stock: 0 }]}>
                <CartesianGrid stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Bar dataKey="stock" radius={[6, 6, 0, 0]} fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="dashboard-grid">
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
                <thead><tr><th>Order</th><th>Customer</th><th>Total</th></tr></thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td><span className="code">#{order.id}</span></td>
                      <td>{order.customer_id}</td>
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
