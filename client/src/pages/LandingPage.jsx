import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/common/ThemeToggle.jsx';
import { api } from '../services/api.js';

const LandingPage = () => {
  const [stats, setStats] = useState({
    restaurantCount: 0,
    activeSubscriptionCount: 0,
    totalOrders: 0,
    monthlyPlanPrice: 650,
    oneTimePlanPrice: 20000
  });

  useEffect(() => {
    api.getPlatformStats().then(setStats).catch(() => {});
  }, []);

  return (
    <div className="landing-shell">
      <header className="landing-topbar">
        <div className="brand-identity">
          <span className="brand-pill">POS SAAS</span>
          <div>
            <strong>Restaurant Growth OS</strong>
            <p>We help restaurants sell faster, manage tables better, and unlock delivery from the same system.</p>
          </div>
        </div>

        <div className="landing-topbar__actions">
          <ThemeToggle />
          <Link className="ghost-button" to="/admin/login">
            Admin Login
          </Link>
          <Link className="primary-button" to="/subscribe">
            Launch My Restaurant
          </Link>
        </div>
      </header>

      <main className="landing-main">
        <section className="landing-hero">
          <div className="landing-hero__copy">
            <p className="eyebrow">Built For Restaurant Revenue</p>
            <h1>We build restaurant ordering systems that turn service speed into profit.</h1>
            <p>
              Our SaaS platform gives every restaurant its own secure QR ordering system, admin dashboard, analytics,
              delivery flow, and restaurant-specific workspace. We handle the digital layer so operators can focus on food,
              service, and repeat business.
            </p>

            <div className="landing-hero__actions">
              <Link className="primary-button" to="/subscribe">
                Start Subscription
              </Link>
              <Link className="ghost-button" to="/admin/login">
                Existing Client Login
              </Link>
            </div>
          </div>

          <div className="hero-glass-card">
            <div className="hero-glass-card__metric">
              <span>Businesses Using Us</span>
              <strong>{stats.restaurantCount} Restaurants</strong>
            </div>
            <div className="hero-glass-card__metric">
              <span>Active SaaS Clients</span>
              <strong>{stats.activeSubscriptionCount} Live Workspaces</strong>
            </div>
            <div className="hero-glass-card__metric">
              <span>Orders Powered</span>
              <strong>{stats.totalOrders}+ Orders</strong>
            </div>
          </div>
        </section>

        <section className="landing-grid">
          <article className="feature-card">
            <p className="eyebrow">What We Do</p>
            <h3>We give restaurants their own branded QR ordering and delivery operating system.</h3>
            <p>
              Each restaurant gets tenant-isolated data, a unique admin ID, its own dashboard, secure table QR access,
              home-delivery QR flows, menu management, table management, and sales analytics.
            </p>
          </article>

          <article className="feature-card">
            <p className="eyebrow">Business Gain</p>
            <h3>We help restaurants cut waiter load, increase order speed, and improve table turnover.</h3>
            <p>
              Faster ordering means more covers, fewer missed items, better kitchen visibility, and a smoother experience
              that leads to higher average order value and repeat visits.
            </p>
          </article>

          <article className="feature-card">
            <p className="eyebrow">Production Ready</p>
            <h3>Restaurants get their own admin credentials, QR setup, seeded workspace, and settings page instantly.</h3>
            <p>
              After checkout, the system provisions a dedicated restaurant workspace, creates secure delivery/table access,
              and gives the owner a unique admin code with their chosen password.
            </p>
          </article>
        </section>

        <section className="pricing-section">
          <div className="section-heading">
            <p className="eyebrow">Pricing</p>
            <h2>Choose the plan that fits how you want to operate.</h2>
          </div>

          <div className="pricing-grid">
            <article className="pricing-card">
              <p className="eyebrow">Monthly</p>
              <h3>Rs. {stats.monthlyPlanPrice}/month</h3>
              <ul className="pricing-list">
                <li>Tenant-specific admin dashboard</li>
                <li>Secure QR ordering for every table</li>
                <li>Outside-store QR for home delivery</li>
                <li>Ongoing updates, hosting guidance, and support</li>
                <li>Best for restaurants that want low upfront cost</li>
              </ul>
              <Link className="primary-button full-width" to="/subscribe?plan=monthly">
                Choose Monthly
              </Link>
            </article>

            <article className="pricing-card pricing-card--featured">
              <p className="eyebrow">One-Time</p>
              <h3>Rs. {stats.oneTimePlanPrice} once</h3>
              <ul className="pricing-list">
                <li>Everything in monthly</li>
                <li>Full restaurant setup and production launch</li>
                <li>Restaurant-specific credentials and seeded workspace</li>
                <li>Long-term ownership friendly structure</li>
                <li>Best for businesses that want a one-time investment</li>
              </ul>
              <Link className="primary-button full-width" to="/subscribe?plan=one_time">
                Choose One-Time
              </Link>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
