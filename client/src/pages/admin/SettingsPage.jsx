import { useEffect, useState } from 'react';
import SectionCard from '../../components/common/SectionCard.jsx';
import { useAdmin } from '../../context/AdminContext.jsx';
import { api } from '../../services/api.js';

const SettingsPage = () => {
  const { restaurant, refreshRestaurant } = useAdmin();
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    phone: '',
    email: '',
    city: '',
    district: '',
    state: '',
    address: '',
    tagline: '',
    heroTitle: '',
    heroDescription: '',
    supportPhone: '',
    primaryColor: '#f97316',
    secondaryColor: '#0f172a',
    themePreference: 'system',
    deliveryEnabled: true
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!restaurant) {
      return;
    }

    setFormData({
      businessName: restaurant.businessName || '',
      ownerName: restaurant.ownerName || '',
      phone: restaurant.phone || '',
      email: restaurant.email || '',
      city: restaurant.city || '',
      district: restaurant.district || '',
      state: restaurant.state || '',
      address: restaurant.address || '',
      tagline: restaurant.tagline || '',
      heroTitle: restaurant.heroTitle || '',
      heroDescription: restaurant.heroDescription || '',
      supportPhone: restaurant.supportPhone || '',
      primaryColor: restaurant.primaryColor || '#f97316',
      secondaryColor: restaurant.secondaryColor || '#0f172a',
      themePreference: restaurant.themePreference || 'system',
      deliveryEnabled: restaurant.deliveryEnabled ?? true
    });
  }, [restaurant]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    await api.updateRestaurantSettings(formData);
    await refreshRestaurant();
    setMessage('Settings saved successfully.');
  };

  return (
    <div className="grid gap-8">
      <header className="mb-8">
        <div>
          <p className="text-[0.75rem] font-extrabold text-accent uppercase tracking-[0.2em] mb-4 block">{restaurant?.restaurantCode || 'Settings'}</p>
          <h2 className="text-4xl font-bold">Restaurant Settings</h2>
        </div>
      </header>

      <SectionCard title="Business Profile" subtitle="Everything here is stored per restaurant workspace.">
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <input className="input-base" name="businessName" placeholder="Business name" value={formData.businessName} onChange={handleChange} />
            <input className="input-base" name="ownerName" placeholder="Owner name" value={formData.ownerName} onChange={handleChange} />
            <input className="input-base" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
            <input className="input-base" name="phone" placeholder="Phone number" value={formData.phone} onChange={handleChange} />
            <input className="input-base" name="city" placeholder="City" value={formData.city} onChange={handleChange} />
            <input className="input-base" name="district" placeholder="District" value={formData.district} onChange={handleChange} />
            <input className="input-base" name="state" placeholder="State" value={formData.state} onChange={handleChange} />
            <input className="input-base" name="supportPhone" placeholder="Support phone" value={formData.supportPhone} onChange={handleChange} />
            <input className="input-base" name="primaryColor" placeholder="Primary color" value={formData.primaryColor} onChange={handleChange} />
            <input className="input-base" name="secondaryColor" placeholder="Secondary color" value={formData.secondaryColor} onChange={handleChange} />
            <select className="input-base" name="themePreference" value={formData.themePreference} onChange={handleChange}>
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
            <label className="flex items-center gap-3 px-5 h-[60px] bg-bg-elevated border border-line rounded-[18px]">
              <input
                className="w-5 h-5 accent-accent"
                name="deliveryEnabled"
                type="checkbox"
                checked={formData.deliveryEnabled}
                onChange={handleChange}
              />
              Delivery enabled
            </label>
          </div>
          <textarea className="input-base h-auto py-4" name="address" rows="3" placeholder="Address" value={formData.address} onChange={handleChange} />
          <textarea className="input-base h-auto py-4" name="tagline" rows="2" placeholder="Tagline" value={formData.tagline} onChange={handleChange} />
          <textarea className="input-base h-auto py-4" name="heroTitle" rows="2" placeholder="Hero title" value={formData.heroTitle} onChange={handleChange} />
          <textarea className="input-base h-auto py-4" name="heroDescription" rows="3" placeholder="Hero description" value={formData.heroDescription} onChange={handleChange} />
          {message ? <div className="p-4 bg-success/10 text-success rounded-2xl border border-success/20">{message}</div> : null}
          <button type="submit" className="btn-primary">
            Save Settings
          </button>
        </form>
      </SectionCard>
    </div>

  );
};

export default SettingsPage;
