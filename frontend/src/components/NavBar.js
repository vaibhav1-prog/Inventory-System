import { NavLink } from 'react-router-dom';
import { Boxes, LayoutDashboard, ShoppingCart, Users } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/products', label: 'Products', icon: Boxes },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/orders', label: 'Orders', icon: ShoppingCart },
];

export default function NavBar() {
  return (
    <nav className="nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink key={item.label} to={item.to} className={({ isActive }) => (isActive ? 'active' : undefined)}>
            <span><Icon size={17} /></span>
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  );
}
