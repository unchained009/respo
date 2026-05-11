import { NavLink, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAdmin } from '../../context/AdminContext.jsx';
import ThemeToggle from '../common/ThemeToggle.jsx';

const AdminLayout = () => {
  const { user, logout, restaurant } = useAdmin();

  return (
    <div className="admin-shell">
      <motion.aside 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="admin-sidebar"
      >
        <div className="sidebar-top">
          <div className="brand-identity" style={{ marginBottom: '32px' }}>
            <span className="brand-pill">RESPO CLOUD</span>
            <div style={{ marginTop: '12px' }}>
              <strong style={{ fontSize: '1.5rem' }}>respo</strong>
            </div>
          </div>
          
          <nav className="admin-nav">
            <NavLink to="/admin" end className={({ isActive }) => isActive ? 'active' : ''}>
              <span>📊</span> Dashboard
            </NavLink>
            <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'active' : ''}>
              <span>🔔</span> Live Orders
            </NavLink>
            <NavLink to="/admin/menu" className={({ isActive }) => isActive ? 'active' : ''}>
              <span>🍱</span> Menu Studio
            </NavLink>
            <NavLink to="/admin/tables" className={({ isActive }) => isActive ? 'active' : ''}>
              <span>🪑</span> Floor Setup
            </NavLink>
            <NavLink to="/admin/settings" className={({ isActive }) => isActive ? 'active' : ''}>
              <span>⚙️</span> Settings
            </NavLink>
          </nav>
        </div>

        <div className="sidebar-bottom">
          <div className="admin-user-card" style={{ background: 'var(--accent-soft)', border: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1.1rem' }}>
                 {user?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)' }}>{user?.name}</p>
                <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 800 }}>{user?.role?.toUpperCase()}</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <ThemeToggle />
            </div>

            <button type="button" className="ghost-button full-width" onClick={logout} style={{ color: 'var(--danger)', justifyContent: 'center', display: 'flex', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '10px' }}>
              Sign Out
            </button>
          </div>
          
          <p style={{ textAlign: 'center', fontSize: '0.65rem', color: 'var(--muted)', marginTop: '16px', letterSpacing: '0.05em' }}>
            RESPO POS v1.0.0
          </p>
        </div>
      </motion.aside>

      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="admin-main"
      >
        <Outlet />
      </motion.main>
    </div>
  );
};

export default AdminLayout;
