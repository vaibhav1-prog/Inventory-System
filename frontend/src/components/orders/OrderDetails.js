import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/api';

export default function OrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadOrder() {
      try {
        const response = await api.get(`/orders/${orderId}`);
        setOrder(response.data);
      } catch (err) {
        setError('Unable to load order details');
      }
    }
    loadOrder();
  }, [orderId]);

  if (error) {
    return (
      <div className="page">
        <div className="error">{error}</div>
        <Link to="/orders">Back to orders</Link>
      </div>
    );
  }

  if (!order) {
    return <div className="page">Loading order...</div>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Order Details</p>
          <h2>Order #{order.id}</h2>
        </div>
        <Link className="button-link" to="/orders">Back to orders</Link>
      </div>
      <div className="summary-grid compact">
        <div className="metric-card">
          <h3>Customer ID</h3>
          <p>{order.customer_id}</p>
        </div>
        <div className="metric-card">
          <h3>Total Amount</h3>
          <p>${order.total_amount.toFixed(2)}</p>
        </div>
      </div>
      <section className="panel">
        <div className="panel-header">
          <h3>Order Items</h3>
          <span className="pill">{order.items.length} items</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Quantity</th>
                <th>Unit Price</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={`${item.product_id}-${item.quantity}`}>
                  <td><span className="code">#{item.product_id}</span></td>
                  <td>{item.quantity}</td>
                  <td className="strong">${item.unit_price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
