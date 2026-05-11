import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from './components/admin/AdminLayout.jsx';
import LoginPage from './pages/admin/LoginPage.jsx';
import DashboardPage from './pages/admin/DashboardPage.jsx';
import MenuManagementPage from './pages/admin/MenuManagementPage.jsx';
import OrdersPage from './pages/admin/OrdersPage.jsx';
import SettingsPage from './pages/admin/SettingsPage.jsx';
import TablesPage from './pages/admin/TablesPage.jsx';
import GuestAccessPage from './pages/customer/GuestAccessPage.jsx';
import LandingPage from './pages/LandingPage.jsx';
import SubscribePage from './pages/SubscribePage.jsx';
import { AdminProvider, useAdmin } from './context/AdminContext.jsx';

const ProtectedAdminRoute = ({ children }) => {
  const { token } = useAdmin();

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/subscribe" element={<SubscribePage />} />
    <Route path="/r/:restaurantSlug/access/:accessToken" element={<GuestAccessPage />} />
    <Route path="/admin/login" element={<LoginPage />} />
    <Route
      path="/admin"
      element={
        <ProtectedAdminRoute>
          <AdminLayout />
        </ProtectedAdminRoute>
      }
    >
      <Route index element={<DashboardPage />} />
      <Route path="orders" element={<OrdersPage />} />
      <Route path="menu" element={<MenuManagementPage />} />
      <Route path="tables" element={<TablesPage />} />
      <Route path="settings" element={<SettingsPage />} />
    </Route>
  </Routes>
);

const App = () => {
  return (
    <AdminProvider>
      <AppRoutes />
    </AdminProvider>
  );
};

export default App;
