import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ThemeToggle from '../components/common/ThemeToggle.jsx';
import { api } from '../services/api.js';

const SubscribePage = () => {
  const [searchParams] = useSearchParams();
  const defaultPlan = searchParams.get('plan') === 'one_time' ? 'one_time' : 'monthly';
  const [formData, setFormData] = useState({
    ownerName: '',
    businessName: '',
    email: '',
    phone: '',
    password: '',
    city: '',
    district: '',
    state: '',
    address: '',
    plan: defaultPlan
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  const planLabel = useMemo(
    () => ({
      monthly: 'Rs. 650/month',
      one_time: 'Rs. 20,000 one-time'
    }),
    []
  );

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
      const response = await api.subscribeRestaurant({
        ...formData,
        paymentStatus: 'paid',
        paymentReference: `SIM-${Date.now()}`
      });
      setSuccess(response);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to provision the restaurant workspace.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="subscribe-shell">
      <header className="landing-topbar">
        <div className="brand-identity">
          <span className="brand-pill">ONBOARDING</span>
          <div>
            <strong>Launch Your Restaurant Workspace</strong>
            <p>Complete onboarding, pick a plan, and we will provision your restaurant environment instantly.</p>
          </div>
        </div>
        <div className="landing-topbar__actions">
          <ThemeToggle />
          <Link className="ghost-button" to="/">
            Back Home
          </Link>
        </div>
      </header>

      <main className="subscribe-main">
        <section className="subscribe-card">
          <div className="section-heading">
            <p className="eyebrow">Checkout & Provisioning</p>
            <h2>Everything needed to create a restaurant-specific admin workspace.</h2>
          </div>

          <form className="stack-form" onSubmit={handleSubmit}>
            <div className="two-column-grid">
              <input name="ownerName" placeholder="Owner name" value={formData.ownerName} onChange={handleChange} required />
              <input
                name="businessName"
                placeholder="Restaurant / business name"
                value={formData.businessName}
                onChange={handleChange}
                required
              />
              <input name="email" type="email" placeholder="Email ID" value={formData.email} onChange={handleChange} required />
              <input name="phone" placeholder="Phone number" value={formData.phone} onChange={handleChange} required />
              <input
                name="password"
                type="password"
                placeholder="Create password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <select name="plan" value={formData.plan} onChange={handleChange}>
                <option value="monthly">Monthly Subscription</option>
                <option value="one_time">One-Time Setup</option>
              </select>
              <input name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
              <input name="district" placeholder="District" value={formData.district} onChange={handleChange} required />
              <input name="state" placeholder="State" value={formData.state} onChange={handleChange} required />
              <input name="address" placeholder="Address (optional)" value={formData.address} onChange={handleChange} />
            </div>

            <div className="checkout-banner">
              <strong>Selected plan: {planLabel[formData.plan]}</strong>
              <span>This demo flow simulates a successful payment and provisions the tenant instantly.</span>
            </div>

            {error ? <div className="alert error">{error}</div> : null}
            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? 'Provisioning Workspace...' : 'Pay & Launch Restaurant'}
            </button>
          </form>
        </section>

        {success ? (
          <section className="success-card">
            <p className="eyebrow">Workspace Ready</p>
            <h3>{success.restaurant.businessName}</h3>
            <p>Your tenant has been created and seeded with tables, categories, menu items, and delivery access.</p>
            <div className="success-grid">
              <div>
                <span>Restaurant Code</span>
                <strong>{success.restaurant.restaurantCode}</strong>
              </div>
              <div>
                <span>Admin ID</span>
                <strong>{success.credentials.adminCode}</strong>
              </div>
              <div>
                <span>Login</span>
                <strong>Use your chosen password</strong>
              </div>
            </div>
            <p className="success-link">Delivery QR URL: {success.deliveryUrl}</p>
            <Link className="primary-button" to="/admin/login">
              Go To Admin Login
            </Link>
          </section>
        ) : null}
      </main>
    </div>
  );
};

export default SubscribePage;
