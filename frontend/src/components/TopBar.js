import { Bell, Moon, Plus, Search } from 'lucide-react';

export default function TopBar() {
  return (
    <div className="topbar">
      <div>
        <p className="breadcrumb">Workspace / Inventory</p>
        <h1>Operations Dashboard</h1>
      </div>
      <div className="topbar-actions">
        <label className="search-box">
          <Search size={18} />
          <input placeholder="Search products, customers, orders..." />
        </label>
        <button className="icon-button" type="button" aria-label="Notifications">
          <Bell size={18} />
        </button>
        <button className="icon-button" type="button" aria-label="Theme">
          <Moon size={18} />
        </button>
        <a className="quick-action" href="/orders">
          <Plus size={18} />
          New Order
        </a>
        <div className="profile-chip">
          <span>AK</span>
          <div>
            <strong>Admin</strong>
            <small>Manager</small>
          </div>
        </div>
      </div>
    </div>
  );
}
