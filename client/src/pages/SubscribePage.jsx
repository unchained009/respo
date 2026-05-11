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
    <div className="min-h-screen">
      <header className="flex items-center justify-between p-6 px-10 sticky top-0 z-[1000] bg-bg/70 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <span className="bg-accent/10 text-accent-strong px-3 py-1.5 rounded-full text-[0.7rem] font-extrabold tracking-widest uppercase">ONBOARDING</span>
          <div>
            <strong className="text-2xl font-extrabold tracking-tight bg-gradient-to-br from-accent to-accent-strong bg-clip-text text-transparent block">Launch Your Restaurant Workspace</strong>
            <p className="m-0 text-sm text-muted font-medium">Complete onboarding, pick a plan, and we will provision your restaurant environment instantly.</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link className="btn-ghost" to="/">
            Back Home
          </Link>
        </div>
      </header>

      <main className={`max-w-[1440px] mx-auto p-12 lg:p-12 grid ${success ? 'lg:grid-cols-2' : 'grid-cols-1'} gap-10 items-start`}>
        <section className="glass p-14 rounded-[48px] border border-line shadow-premium bg-bg-elevated/70">
          <div className="mb-10">
            <p className="text-[0.75rem] font-extrabold text-accent uppercase tracking-[0.2em] mb-4 block">Checkout & Provisioning</p>
            <h2 className="text-text font-bold">Workspace Configuration</h2>
            <p className="text-muted mt-3">Fill in the details to generate your secure restaurant environment.</p>
          </div>

          <form className="grid gap-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid gap-2.5 text-left">
                <label className="text-[0.8rem] font-extrabold text-accent uppercase tracking-widest">Owner Name</label>
                <input name="ownerName" className="input-base" placeholder="Full Name" value={formData.ownerName} onChange={handleChange} required />
              </div>
              <div className="grid gap-2.5 text-left">
                <label className="text-[0.8rem] font-extrabold text-accent uppercase tracking-widest">Business Name</label>
                <input
                  name="businessName"
                  className="input-base"
                  placeholder="Restaurant Name"
                  value={formData.businessName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2.5 text-left">
                <label className="text-[0.8rem] font-extrabold text-accent uppercase tracking-widest">Email ID</label>
                <input name="email" className="input-base" type="email" placeholder="owner@restaurant.com" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="grid gap-2.5 text-left">
                <label className="text-[0.8rem] font-extrabold text-accent uppercase tracking-widest">Phone Number</label>
                <input name="phone" className="input-base" placeholder="+91 00000 00000" value={formData.phone} onChange={handleChange} required />
              </div>
              <div className="grid gap-2.5 text-left">
                <label className="text-[0.8rem] font-extrabold text-accent uppercase tracking-widest">Admin Password</label>
                <input
                  name="password"
                  className="input-base"
                  type="password"
                  placeholder="Secure Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2.5 text-left">
                <label className="text-[0.8rem] font-extrabold text-accent uppercase tracking-widest">Select Plan</label>
                <select name="plan" className="input-base" value={formData.plan} onChange={handleChange}>
                  <option value="monthly">Monthly Subscription (Rs. 650)</option>
                  <option value="one_time">One-Time Setup (Rs. 50,000)</option>
                </select>
              </div>
              <div className="grid gap-2.5 text-left">
                <label className="text-[0.8rem] font-extrabold text-accent uppercase tracking-widest">City</label>
                <input name="city" className="input-base" placeholder="City" value={formData.city} onChange={handleChange} required />
              </div>
              <div className="grid gap-2.5 text-left">
                <label className="text-[0.8rem] font-extrabold text-accent uppercase tracking-widest">District</label>
                <input name="district" className="input-base" placeholder="District" value={formData.district} onChange={handleChange} required />
              </div>
              <div className="grid gap-2.5 text-left">
                <label className="text-[0.8rem] font-extrabold text-accent uppercase tracking-widest">State</label>
                <input name="state" className="input-base" placeholder="State" value={formData.state} onChange={handleChange} required />
              </div>
              <div className="grid gap-2.5 text-left">
                <label className="text-[0.8rem] font-extrabold text-accent uppercase tracking-widest">Address</label>
                <input name="address" className="input-base" placeholder="Full Address (optional)" value={formData.address} onChange={handleChange} />
              </div>
            </div>

            <div className="mt-8 p-6 bg-accent/10 rounded-3xl border border-line">
              <strong className="block text-lg">Selected plan: {planLabel[formData.plan]}</strong>
              <span className="text-sm text-muted">This demo flow simulates a successful payment and provisions the tenant instantly.</span>
            </div>

            {error ? <div className="p-4 bg-danger/10 text-danger rounded-2xl border border-danger/20 mt-5">{error}</div> : null}
            <button type="submit" className="btn-primary w-full mt-8 h-[60px] text-lg" disabled={loading}>
              {loading ? 'Provisioning Workspace...' : 'Pay & Launch Restaurant'}
            </button>
          </form>
        </section>

        {success ? (
          <section className="glass p-14 rounded-[48px] border-2 border-success shadow-premium">
            <p className="text-[0.75rem] font-extrabold text-accent uppercase tracking-[0.2em] mb-4 block">Workspace Ready</p>
            <h3 className="text-text font-bold text-success">{success.restaurant.businessName}</h3>
            <p className="text-muted my-5">Your tenant has been created and seeded with tables, categories, menu items, and delivery access.</p>
            <div className="grid gap-5 mb-8">
              <div className="p-5 bg-bg rounded-[20px] border border-line">
                <span className="text-[0.8rem] text-muted uppercase font-extrabold">Restaurant Code</span>
                <strong className="block text-2xl mt-1">{success.restaurant.restaurantCode}</strong>
              </div>
              <div className="p-5 bg-bg rounded-[20px] border border-line">
                <span className="text-[0.8rem] text-muted uppercase font-extrabold">Admin ID</span>
                <strong className="block text-2xl mt-1">{success.credentials.adminCode}</strong>
              </div>
            </div>
            <Link className="btn-primary w-full h-[60px]" to="/admin/login">
              Go To Admin Login
            </Link>
          </section>
        ) : null}
      </main>
    </div>

  );
};

export default SubscribePage;
