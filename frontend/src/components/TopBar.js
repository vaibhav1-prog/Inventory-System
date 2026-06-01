import { Plus } from 'lucide-react';

export default function TopBar() {
  return (
    <div className="topbar">
      <div>
        <p className="breadcrumb">Workspace / Inventory</p>
        <h1>Operations Dashboard</h1>
      </div>
      <div className="topbar-actions">
        <a className="quick-action" href="/orders">
          <Plus size={18} />
          New Order
        </a>
        <div className="profile-chip">
          <span>VB</span>
          <div>
            <strong>Vaibhav</strong>
            <small>Manager</small>
          </div>
        </div>
      </div>
    </div>
  );
}
