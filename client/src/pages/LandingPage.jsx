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
      className="min-h-screen"
    >
      <header className="flex items-center justify-between p-6 px-10 sticky top-0 z-[1000] bg-bg/70 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <span className="bg-accent/10 text-accent-strong px-3 py-1.5 rounded-full text-[0.7rem] font-extrabold tracking-widest uppercase">RESPO POS</span>
          <div>
            <strong className="text-2xl font-extrabold tracking-tight bg-gradient-to-br from-accent to-accent-strong bg-clip-text text-transparent block">respo</strong>
            <p className="m-0 text-sm text-muted font-medium">Growth OS for modern restaurants.</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button 
            className="btn-secondary" 
            onClick={handleDemo}
            disabled={demoLoading}
          >
            {demoLoading ? 'Loading Demo...' : 'Try Demo'}
          </button>
          <Link className="btn-ghost" to="/admin/login">
            Login
          </Link>
          <Link className="btn-primary" to="/subscribe">
            Get Started
          </Link>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto p-12 lg:p-12">
        <section className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 p-10 lg:p-14 bg-bg-elevated/80 backdrop-blur-2xl border border-black/5 rounded-[48px] shadow-premium mb-14 relative overflow-hidden">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <p className="text-[0.75rem] font-extrabold text-accent uppercase tracking-[0.2em] mb-4 block">Built For Restaurant Revenue</p>
            <h1 className="text-4xl lg:text-7xl mb-6 tracking-tight font-fraunces">The smarter way to run your restaurant.</h1>
            <p className="text-xl text-muted mb-10 max-w-[550px]">
              respo gives you a secure QR ordering system, admin dashboard, analytics,
              and delivery flow in one clean package. Built for speed, designed for profit.
            </p>

            <div className="flex items-center gap-6">
              <Link className="btn-primary" to="/subscribe">
                Start Subscription
              </Link>
              <button 
                className="btn-secondary" 
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
            className="glass bg-bg-elevated p-8 rounded-[40px] flex flex-col justify-center gap-6"
          >
            <div className="pl-5 border-l-2 border-black/5 transition-all duration-300 hover:border-accent hover:translate-x-1">
              <span className="text-muted text-[0.75rem] font-extrabold block mb-1 uppercase tracking-widest">Network Scale</span>
              <strong className="text-2xl text-text font-black leading-none">{stats.restaurantCount || 12}+ Restaurants</strong>
            </div>
            <div className="pl-5 border-l-2 border-black/5 transition-all duration-300 hover:border-accent hover:translate-x-1">
              <span className="text-muted text-[0.75rem] font-extrabold block mb-1 uppercase tracking-widest">SaaS Infrastructure</span>
              <strong className="text-2xl text-text font-black leading-none">{stats.activeSubscriptionCount || 8}+ Live Nodes</strong>
            </div>
            <div className="pl-5 border-l-2 border-black/5 transition-all duration-300 hover:border-accent hover:translate-x-1">
              <span className="text-muted text-[0.75rem] font-extrabold block mb-1 uppercase tracking-widest">Processing Volume</span>
              <strong className="text-2xl text-text font-black leading-none">{stats.totalOrders || '500'}+ Orders</strong>
            </div>
          </motion.div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          <motion.article 
            whileHover={{ y: -5 }}
            className="glass p-10 rounded-[40px]"
          >
            <p className="text-[0.75rem] font-extrabold text-accent uppercase tracking-[0.2em] mb-4 block">Seamless Flow</p>
            <h3 className="text-2xl mb-4">QR Ordering & Delivery</h3>
            <p className="text-muted text-lg">
              Branded QR ordering for tables and home delivery. Fast, secure, and integrated directly into your workflow.
            </p>
          </motion.article>

          <motion.article 
            whileHover={{ y: -5 }}
            className="glass p-10 rounded-[40px]"
          >
            <p className="text-[0.75rem] font-extrabold text-accent uppercase tracking-[0.2em] mb-4 block">Efficiency</p>
            <h3 className="text-2xl mb-4">Manage with Ease</h3>
            <p className="text-muted text-lg">
              Cut waiter load, increase order speed, and improve turnover. respo handles the digital layer so you can focus on the food.
            </p>
          </motion.article>

          <motion.article 
            whileHover={{ y: -5 }}
            className="glass p-10 rounded-[40px]"
          >
            <p className="text-[0.75rem] font-extrabold text-accent uppercase tracking-[0.2em] mb-4 block">Enterprise Grade</p>
            <h3 className="text-2xl mb-4">Dedicated Workspace</h3>
            <p className="text-muted text-lg">
              Instant provisioning of your own restaurant-specific workspace with full data isolation and secure admin access.
            </p>
          </motion.article>
        </section>

        <section className="text-center mb-32">
          <div className="mb-14">
            <p className="text-[0.75rem] font-extrabold text-accent uppercase tracking-[0.2em] mb-4 block">Simple Pricing</p>
            <h2 className="text-5xl lg:text-6xl">Transparent plans for every scale.</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-[1100px] mx-auto">
            <motion.article 
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedPlan('monthly')}
              className={`glass p-14 rounded-[56px] flex flex-col gap-10 text-left transition-all duration-500 border-2 ${selectedPlan === 'monthly' ? 'border-accent bg-bg-elevated scale-105 shadow-premium' : 'border-transparent'}`}
              style={{ cursor: 'pointer' }}
            >
              <p className="text-[0.75rem] font-extrabold text-accent uppercase tracking-[0.2em] mb-4 block">Monthly</p>
              <h3 className="text-4xl lg:text-5xl font-black">Rs. {stats.monthlyPlanPrice}/mo</h3>
              <ul className="grid gap-4 list-none p-0">
                <li className="flex items-center gap-3 text-muted font-medium">Tenant-isolated dashboard</li>
                <li className="flex items-center gap-3 text-muted font-medium">Table QR ordering</li>
                <li className="flex items-center gap-3 text-muted font-medium">Delivery QR flows</li>
                <li className="flex items-center gap-3 text-muted font-medium">Ongoing support & updates</li>
              </ul>
              <Link className="btn-primary w-full" to="/subscribe?plan=monthly">
                Choose Monthly
              </Link>
            </motion.article>

            <motion.article 
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedPlan('one_time')}
              className={`glass p-14 rounded-[56px] flex flex-col gap-10 text-left transition-all duration-500 border-2 ${selectedPlan === 'one_time' ? 'border-accent bg-bg-elevated scale-105 shadow-premium' : 'border-transparent'}`}
              style={{ cursor: 'pointer' }}
            >
              <p className="text-[0.75rem] font-extrabold text-accent uppercase tracking-[0.2em] mb-4 block">One-Time</p>
              <h3 className="text-4xl lg:text-5xl font-black">Rs. {stats.oneTimePlanPrice} once</h3>
              <ul className="grid gap-4 list-none p-0">
                <li className="flex items-center gap-3 text-muted font-medium">Everything in Monthly</li>
                <li className="flex items-center gap-3 text-muted font-medium">Full production launch</li>
                <li className="flex items-center gap-3 text-muted font-medium">Lifetime workspace ownership</li>
                <li className="flex items-center gap-3 text-muted font-medium">Priority setup & seeding</li>
              </ul>
              <Link className="btn-primary w-full" to="/subscribe?plan=one_time">
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
