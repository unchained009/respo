import { NavLink, Outlet } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext.jsx';
import ThemeToggle from '../common/ThemeToggle.jsx';

const AdminLayout = () => {
  const { user, logout, restaurant } = useAdmin();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div>
          <p className="eyebrow">{restaurant?.restaurantCode || 'Restaurant SaaS'}</p>
          <h1>{restaurant?.businessName || 'Control Room'}</h1>
          <p className="sidebar-copy">Manage live orders, menu, tables, delivery, settings, and tenant growth from one dashboard.</p>
        </div>

        <nav className="admin-nav">
          <NavLink to="/admin">Dashboard</NavLink>
          <NavLink to="/admin/orders">Orders</NavLink>
          <NavLink to="/admin/menu">Menu</NavLink>
          <NavLink to="/admin/tables">Tables</NavLink>
          <NavLink to="/admin/settings">Settings</NavLink>
        </nav>

        <div className="admin-user-card">
          <p>{user?.name}</p>
          <span>{user?.role}</span>
          <small>{restaurant?.adminCode || restaurant?.restaurantCode || ''}</small>
          <ThemeToggle />
          <button type="button" className="secondary-button full-width" onClick={logout}>
            Log Out
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
