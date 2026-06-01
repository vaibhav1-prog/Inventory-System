import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Search, UserPlus } from 'lucide-react';
import api from '../../api/api';

const initialForm = { full_name: '', email: '', phone: '' };

export default function CustomerPage() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    try {
      const response = await api.get('/customers');
      setCustomers(response.data);
    } catch (err) {
      setStatus('Unable to load customers');
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await api.post('/customers', form);
      setStatus('Customer added successfully.');
      setForm(initialForm);
      loadCustomers();
    } catch (error) {
      setStatus(error.response?.data?.detail || 'Failed to create customer');
    }
  }

  async function removeCustomer(id) {
    if (!window.confirm('Delete this customer?')) return;
    try {
      await api.delete(`/customers/${id}`);
      setStatus('Customer deleted successfully.');
      loadCustomers();
    } catch (error) {
      setStatus(error.response?.data?.detail || 'Failed to delete customer');
    }
  }

  const filteredCustomers = customers.filter((customer) => (
    customer.full_name.toLowerCase().includes(query.toLowerCase())
    || customer.email.toLowerCase().includes(query.toLowerCase())
  ));

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Directory</p>
          <h2>Customers</h2>
          <p className="page-subtitle">Keep buyer contact information ready for order creation.</p>
        </div>
        <span className="pill">{filteredCustomers.length} customers</span>
      </div>
      {status && <div className="status">{status}</div>}
      <div className="workspace-grid">
        <motion.form className="panel form side-form premium-form" onSubmit={handleSubmit} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="form-title">
            <span><UserPlus size={18} /></span>
            <h3>Add Customer</h3>
          </div>
          <div className="form-grid single">
            <label>Full Name
              <input name="full_name" value={form.full_name} onChange={handleChange} required />
            </label>
            <label>Email
              <input name="email" type="email" value={form.email} onChange={handleChange} required />
            </label>
            <label>Phone
              <input name="phone" value={form.phone} onChange={handleChange} required />
            </label>
          </div>
          <button type="submit">Add Customer</button>
        </motion.form>

        <section className="panel data-panel">
          <div className="panel-header">
            <div>
              <h3>Customer List</h3>
              <p>Contact cards with quick account actions.</p>
            </div>
            <label className="mini-search">
              <Search size={16} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search customers" />
            </label>
          </div>
          <div className="customer-grid">
            {filteredCustomers.map((customer) => (
              <motion.div className="customer-card" key={customer.id} whileHover={{ y: -6 }}>
                <div className="avatar">{customer.full_name.slice(0, 2).toUpperCase()}</div>
                <div>
                  <h3>{customer.full_name}</h3>
                  <p><Mail size={15} /> {customer.email}</p>
                  <p><Phone size={15} /> {customer.phone}</p>
                </div>
                <div className="customer-footer">
                  <span className="status-pill completed">Active</span>
                  <button className="small danger" onClick={() => removeCustomer(customer.id)}>Delete</button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
