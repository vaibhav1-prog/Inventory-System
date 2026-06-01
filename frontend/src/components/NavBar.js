import { NavLink } from 'react-router-dom';
import { BarChart3, Boxes, LayoutDashboard, Settings, ShoppingCart, Users } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/products', label: 'Products', icon: Boxes },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/', label: 'Analytics', icon: BarChart3 },
  { to: '/', label: 'Settings', icon: Settings },
];

export default function NavBar() {
  return (
    <nav className="nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink key={item.label} to={item.to} className={({ isActive }) => (isActive && item.label !== 'Analytics' && item.label !== 'Settings' ? 'active' : undefined)}>
            <span><Icon size={17} /></span>
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  );
}
