import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ThemeToggle from '../components/common/ThemeToggle.jsx';
import { api } from '../services/api.js';
import { useAdmin } from '../context/AdminContext.jsx';

const LandingPage = () => {
  const navigate = useNavigate();
  const { loginDemo } = useAdmin();
  const [stats, setStats] = useState({
    restaurantCount: 0,
    activeSubscriptionCount: 0,
    totalOrders: 0,
    monthlyPlanPrice: 650,
    oneTimePlanPrice: 50000
  });

  const [demoLoading, setDemoLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('one_time');

  useEffect(() => {
    api.getPlatformStats()
      .then(setStats)
      .catch((err) => {
        console.warn('Could not fetch live stats, using defaults.', err);
      });
  }, []);

  const handleDemo = async () => {
    setDemoLoading(true);
    try {
      await loginDemo();
      navigate('/admin');
    } catch (error) {
      // Demo fail handled in context
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="landing-shell"
    >
      <header className="landing-topbar">
        <div className="brand-identity">
          <span className="brand-pill">RESPO POS</span>
          <div>
            <strong>respo</strong>
            <p>Growth OS for modern restaurants.</p>
          </div>
        </div>

        <div className="landing-topbar__actions">
          <ThemeToggle />
          <button 
            className="secondary-button" 
            onClick={handleDemo}
            disabled={demoLoading}
          >
            {demoLoading ? 'Loading Demo...' : 'Try Demo'}
          </button>
          <Link className="ghost-button" to="/admin/login">
            Login
          </Link>
          <Link className="primary-button" to="/subscribe">
            Get Started
          </Link>
        </div>
      </header>

      <main className="landing-main">
        <section className="landing-hero">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="landing-hero__copy"
          >
            <p className="eyebrow">Built For Restaurant Revenue</p>
            <h1>The smarter way to run your restaurant.</h1>
            <p>
              respo gives you a secure QR ordering system, admin dashboard, analytics,
              and delivery flow in one clean package. Built for speed, designed for profit.
            </p>

            <div className="landing-hero__actions">
              <Link className="primary-button" to="/subscribe">
                Start Subscription
              </Link>
              <button 
                className="secondary-button" 
                onClick={handleDemo}
                disabled={demoLoading}
              >
                Explore Demo
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="hero-glass-card"
          >
            <div className="hero-glass-card__metric">
              <span>Network Scale</span>
              <strong>{stats.restaurantCount || 12}+ Restaurants</strong>
            </div>
            <div className="hero-glass-card__metric">
              <span>SaaS Infrastructure</span>
              <strong>{stats.activeSubscriptionCount || 8}+ Live Nodes</strong>
            </div>
            <div className="hero-glass-card__metric">
              <span>Processing Volume</span>
              <strong>{stats.totalOrders || '500'}+ Orders</strong>
            </div>
          </motion.div>
        </section>

        <section className="landing-grid">
          <motion.article 
            whileHover={{ y: -5 }}
            className="feature-card"
          >
            <p className="eyebrow">Seamless Flow</p>
            <h3>QR Ordering & Delivery</h3>
            <p>
              Branded QR ordering for tables and home delivery. Fast, secure, and integrated directly into your workflow.
            </p>
          </motion.article>

          <motion.article 
            whileHover={{ y: -5 }}
            className="feature-card"
          >
            <p className="eyebrow">Efficiency</p>
            <h3>Manage with Ease</h3>
            <p>
              Cut waiter load, increase order speed, and improve turnover. respo handles the digital layer so you can focus on the food.
            </p>
          </motion.article>

          <motion.article 
            whileHover={{ y: -5 }}
            className="feature-card"
          >
            <p className="eyebrow">Enterprise Grade</p>
            <h3>Dedicated Workspace</h3>
            <p>
              Instant provisioning of your own restaurant-specific workspace with full data isolation and secure admin access.
            </p>
          </motion.article>
        </section>

        <section className="pricing-section">
          <div className="section-heading">
            <p className="eyebrow">Simple Pricing</p>
            <h2>Transparent plans for every scale.</h2>
          </div>

          <div className="pricing-grid">
            <motion.article 
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedPlan('monthly')}
              className={`pricing-card ${selectedPlan === 'monthly' ? 'pricing-card--featured' : ''}`}
              style={{ cursor: 'pointer' }}
            >
              <p className="eyebrow">Monthly</p>
              <h3>Rs. {stats.monthlyPlanPrice}/mo</h3>
              <ul className="pricing-list">
                <li>Tenant-isolated dashboard</li>
                <li>Table QR ordering</li>
                <li>Delivery QR flows</li>
                <li>Ongoing support & updates</li>
              </ul>
              <Link className="primary-button full-width" to="/subscribe?plan=monthly">
                Choose Monthly
              </Link>
            </motion.article>

            <motion.article 
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedPlan('one_time')}
              className={`pricing-card ${selectedPlan === 'one_time' ? 'pricing-card--featured' : ''}`}
              style={{ cursor: 'pointer' }}
            >
              <p className="eyebrow">One-Time</p>
              <h3>Rs. {stats.oneTimePlanPrice} once</h3>
              <ul className="pricing-list">
                <li>Everything in Monthly</li>
                <li>Full production launch</li>
                <li>Lifetime workspace ownership</li>
                <li>Priority setup & seeding</li>
              </ul>
              <Link className="primary-button full-width" to="/subscribe?plan=one_time">
                Choose One-Time
              </Link>
            </motion.article>
          </div>
        </section>
      </main>
    </motion.div>
  );
};

export default LandingPage;
