import { NavLink, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAdmin } from '../../context/AdminContext.jsx';
import ThemeToggle from '../common/ThemeToggle.jsx';

const AdminLayout = () => {
  const { user, logout, restaurant } = useAdmin();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr]">
      <motion.aside 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="bg-bg-elevated border-r border-line p-12 px-8 flex flex-col justify-between h-screen sticky top-0"
      >
        <div>
          <div className="flex items-center gap-4 mb-8">
            <span className="bg-accent/10 text-accent-strong px-3 py-1.5 rounded-full text-[0.7rem] font-extrabold tracking-widest uppercase">RESPO CLOUD</span>
            <div className="mt-3">
              <strong className="text-2xl font-extrabold tracking-tight bg-gradient-to-br from-accent to-accent-strong bg-clip-text text-transparent block">respo</strong>
            </div>
          </div>
          
          <nav className="grid gap-4 mt-14">
            <NavLink to="/admin" end className={({ isActive }) => `flex items-center gap-4 p-4 px-7 rounded-[22px] text-text font-bold no-underline transition-all duration-400 text-[1.05rem] ${isActive ? 'bg-accent text-white shadow-[0_16px_32px_rgba(249,115,22,0.35)]' : 'text-muted hover:bg-accent/10 hover:text-accent hover:translate-x-2'}`}>
              <span className="text-2xl transition-transform duration-300">📊</span> Dashboard
            </NavLink>
            <NavLink to="/admin/orders" className={({ isActive }) => `flex items-center gap-4 p-4 px-7 rounded-[22px] text-text font-bold no-underline transition-all duration-400 text-[1.05rem] ${isActive ? 'bg-accent text-white shadow-[0_16px_32px_rgba(249,115,22,0.35)]' : 'text-muted hover:bg-accent/10 hover:text-accent hover:translate-x-2'}`}>
              <span className="text-2xl transition-transform duration-300">🔔</span> Live Orders
            </NavLink>
            <NavLink to="/admin/menu" className={({ isActive }) => `flex items-center gap-4 p-4 px-7 rounded-[22px] text-text font-bold no-underline transition-all duration-400 text-[1.05rem] ${isActive ? 'bg-accent text-white shadow-[0_16px_32px_rgba(249,115,22,0.35)]' : 'text-muted hover:bg-accent/10 hover:text-accent hover:translate-x-2'}`}>
              <span className="text-2xl transition-transform duration-300">🍱</span> Menu Studio
            </NavLink>
            <NavLink to="/admin/tables" className={({ isActive }) => `flex items-center gap-4 p-4 px-7 rounded-[22px] text-text font-bold no-underline transition-all duration-400 text-[1.05rem] ${isActive ? 'bg-accent text-white shadow-[0_16px_32px_rgba(249,115,22,0.35)]' : 'text-muted hover:bg-accent/10 hover:text-accent hover:translate-x-2'}`}>
              <span className="text-2xl transition-transform duration-300">🪑</span> Floor Setup
            </NavLink>
            <NavLink to="/admin/settings" className={({ isActive }) => `flex items-center gap-4 p-4 px-7 rounded-[22px] text-text font-bold no-underline transition-all duration-400 text-[1.05rem] ${isActive ? 'bg-accent text-white shadow-[0_16px_32px_rgba(249,115,22,0.35)]' : 'text-muted hover:bg-accent/10 hover:text-accent hover:translate-x-2'}`}>
              <span className="text-2xl transition-transform duration-300">⚙️</span> Settings
            </NavLink>
          </nav>
        </div>

        <div className="mt-auto">
          <div className="glass bg-accent/10 border-none p-6 rounded-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center text-white font-extrabold text-lg">
                 {user?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="m-0 font-bold text-[0.95rem] text-text dark:text-text">{user?.name}</p>
                <p className="m-0 text-[0.7rem] text-accent font-extrabold uppercase tracking-widest">{user?.role}</p>
              </div>
            </div>
            
            <div className="flex gap-2 mb-4">
              <ThemeToggle />
            </div>

            <button type="button" className="btn-ghost w-full text-danger bg-danger/10 hover:bg-danger/20 hover:text-danger rounded-xl justify-center flex" onClick={logout}>
              Sign Out
            </button>
          </div>
          
          <p className="text-center text-[0.65rem] text-muted mt-4 tracking-widest uppercase font-bold">
            RESPO POS v1.0.0
          </p>
        </div>
      </motion.aside>

      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="max-w-[1440px] mx-auto p-12 lg:p-12 w-full"
      >
        <Outlet />
      </motion.main>
    </div>

  );
};

export default AdminLayout;
