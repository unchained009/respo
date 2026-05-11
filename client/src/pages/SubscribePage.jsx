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
      one_time: 'Rs. 50,000 one-time'
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

      <main className="subscribe-main" style={{ display: 'grid', gridTemplateColumns: success ? '1fr 1fr' : '1fr', gap: '40px', alignItems: 'start' }}>
        <section className="subscribe-card" style={{ padding: '60px', borderRadius: '48px', background: 'var(--panel)', border: '1px solid var(--line)', boxShadow: 'var(--shadow-lg)' }}>
          <div className="section-heading" style={{ marginBottom: '40px' }}>
            <p className="eyebrow">Checkout & Provisioning</p>
            <h2 style={{ fontSize: '2.5rem' }}>Workspace Configuration</h2>
            <p style={{ color: 'var(--muted)', marginTop: '12px' }}>Fill in the details to generate your secure restaurant environment.</p>
          </div>

          <form className="stack-form" onSubmit={handleSubmit}>
            <div className="two-column-grid" style={{ gap: '24px' }}>
              <div className="field-group">
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Owner Name</label>
                <input name="ownerName" placeholder="Full Name" value={formData.ownerName} onChange={handleChange} required />
              </div>
              <div className="field-group">
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Business Name</label>
                <input
                  name="businessName"
                  placeholder="Restaurant Name"
                  value={formData.businessName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field-group">
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Email ID</label>
                <input name="email" type="email" placeholder="owner@restaurant.com" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="field-group">
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Phone Number</label>
                <input name="phone" placeholder="+91 00000 00000" value={formData.phone} onChange={handleChange} required />
              </div>
              <div className="field-group">
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Admin Password</label>
                <input
                  name="password"
                  type="password"
                  placeholder="Secure Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field-group">
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Select Plan</label>
                <select name="plan" value={formData.plan} onChange={handleChange} style={{ height: '54px' }}>
                  <option value="monthly">Monthly Subscription (Rs. 650)</option>
                  <option value="one_time">One-Time Setup (Rs. 50,000)</option>
                </select>
              </div>
              <div className="field-group">
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>City</label>
                <input name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
              </div>
              <div className="field-group">
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>District</label>
                <input name="district" placeholder="District" value={formData.district} onChange={handleChange} required />
              </div>
              <div className="field-group">
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>State</label>
                <input name="state" placeholder="State" value={formData.state} onChange={handleChange} required />
              </div>
              <div className="field-group">
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Address</label>
                <input name="address" placeholder="Full Address (optional)" value={formData.address} onChange={handleChange} />
              </div>
            </div>

            <div className="checkout-banner" style={{ marginTop: '32px', padding: '24px', background: 'var(--accent-soft)', borderRadius: '24px', border: '1px solid var(--line)' }}>
              <strong style={{ display: 'block', fontSize: '1.1rem' }}>Selected plan: {planLabel[formData.plan]}</strong>
              <span style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>This demo flow simulates a successful payment and provisions the tenant instantly.</span>
            </div>

            {error ? <div className="alert error" style={{ marginTop: '20px' }}>{error}</div> : null}
            <button type="submit" className="primary-button full-width" style={{ marginTop: '32px', height: '60px', fontSize: '1.1rem' }} disabled={loading}>
              {loading ? 'Provisioning Workspace...' : 'Pay & Launch Restaurant'}
            </button>
          </form>
        </section>

        {success ? (
          <section className="success-card" style={{ padding: '60px', borderRadius: '48px', background: 'var(--panel)', border: '2px solid var(--success)', boxShadow: 'var(--shadow-lg)' }}>
            <p className="eyebrow">Workspace Ready</p>
            <h3 style={{ fontSize: '2.5rem', color: 'var(--success)' }}>{success.restaurant.businessName}</h3>
            <p style={{ color: 'var(--muted)', margin: '20px 0' }}>Your tenant has been created and seeded with tables, categories, menu items, and delivery access.</p>
            <div className="success-grid" style={{ display: 'grid', gap: '20px', marginBottom: '32px' }}>
              <div style={{ padding: '20px', background: 'var(--bg)', borderRadius: '20px', border: '1px solid var(--line)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 800 }}>Restaurant Code</span>
                <strong style={{ display: 'block', fontSize: '1.5rem', marginTop: '4px' }}>{success.restaurant.restaurantCode}</strong>
              </div>
              <div style={{ padding: '20px', background: 'var(--bg)', borderRadius: '20px', border: '1px solid var(--line)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 800 }}>Admin ID</span>
                <strong style={{ display: 'block', fontSize: '1.5rem', marginTop: '4px' }}>{success.credentials.adminCode}</strong>
              </div>
            </div>
            <Link className="primary-button full-width" to="/admin/login" style={{ height: '60px' }}>
              Go To Admin Login
            </Link>
          </section>
        ) : null}
      </main>
    </div>
  );
};

export default SubscribePage;
