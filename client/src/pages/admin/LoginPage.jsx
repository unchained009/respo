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
    <div className="grid place-items-center p-6 min-h-screen">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass w-full max-w-[520px] p-14 rounded-[48px] text-center grid gap-6 relative"
      >
        <div className="absolute top-10 right-10">
          <ThemeToggle />
        </div>
        <p className="text-[0.75rem] font-extrabold text-accent uppercase tracking-[0.2em] mb-4 block">Client Login</p>
        <h1 className="text-5xl font-bold mb-2 text-text">Admin Login</h1>
        <p className="text-muted font-medium">Sign in with your admin ID or email plus the password created during onboarding.</p>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <input
            name="identifier"
            className="input-base"
            value={formData.identifier}
            onChange={handleChange}
            placeholder="Admin ID or email"
            required
          />
          <input
            name="password"
            className="input-base"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
          {error ? <div className="p-4 bg-danger/10 text-danger rounded-2xl border border-danger/20">{error}</div> : null}
          <button type="submit" className="btn-primary w-full" disabled={loading || demoLoading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <div className="relative flex justify-center text-xs uppercase"><span className="bg-bg-elevated px-4 text-muted font-black tracking-widest">OR</span></div>

        <button 
          onClick={handleDemo} 
          className="btn-secondary w-full" 
          disabled={loading || demoLoading}
        >
          {demoLoading ? 'Launching Demo...' : 'Try Demo Experience'}
        </button>
      </motion.div>
    </div>

  );
};

export default LoginPage;
