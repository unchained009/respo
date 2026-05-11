import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAdmin } from '../../context/AdminContext.jsx';
import ThemeToggle from '../../components/common/ThemeToggle.jsx';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loginDemo } = useAdmin();
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData);
      navigate('/admin');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to log in.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setDemoLoading(true);
    setError('');
    try {
      await loginDemo();
      navigate('/admin');
    } catch (requestError) {
      setError('Demo login failed. Please ensure database is seeded.');
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="auth-card"
      >
        <div className="auth-card__actions">
          <ThemeToggle />
        </div>
        <p className="eyebrow">Client Login</p>
        <h1>Admin Login</h1>
        <p>Sign in with your admin ID or email plus the password created during onboarding.</p>

        <form onSubmit={handleSubmit} className="stack-form">
          <input
            name="identifier"
            value={formData.identifier}
            onChange={handleChange}
            placeholder="Admin ID or email"
            required
          />
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
          {error ? <div className="alert error">{error}</div> : null}
          <button type="submit" className="primary-button full-width" disabled={loading || demoLoading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <div className="divider" style={{ margin: '20px 0', textAlign: 'center', color: 'var(--muted)', fontSize: '0.85rem' }}>
          OR
        </div>

        <button 
          onClick={handleDemo} 
          className="secondary-button full-width" 
          disabled={loading || demoLoading}
        >
          {demoLoading ? 'Launching Demo...' : 'Try Demo Experience'}
        </button>
      </motion.div>
    </div>
  );
};

export default LoginPage;
