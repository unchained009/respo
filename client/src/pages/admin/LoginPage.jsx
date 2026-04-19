import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext.jsx';
import ThemeToggle from '../../components/common/ThemeToggle.jsx';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAdmin();
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="auth-page">
      <div className="auth-card">
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
          <button type="submit" className="primary-button full-width" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
