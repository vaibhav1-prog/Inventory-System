import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import TopBar from './components/TopBar';
import Dashboard from './components/Dashboard';
import ProductPage from './components/products/ProductPage';
import CustomerPage from './components/customers/CustomerPage';
import OrderPage from './components/orders/OrderPage';
import OrderDetails from './components/orders/OrderDetails';

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <aside className="sidebar">
          <div className="brand">
            <span className="brand-mark">IM</span>
            <div>
              <h1>Inventra</h1>
              <p>Operations Console</p>
            </div>
          </div>
          <NavBar />
          <div className="sidebar-card">
            <span className="sidebar-label">System Status</span>
            <strong>Live</strong>
            <p>API, database, and web app are connected through Docker.</p>
          </div>
        </aside>
        <main className="content">
          <TopBar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<ProductPage />} />
            <Route path="/customers" element={<CustomerPage />} />
            <Route path="/orders" element={<OrderPage />} />
            <Route path="/orders/:orderId" element={<OrderDetails />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
