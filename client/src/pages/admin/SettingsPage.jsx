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
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">{restaurant?.restaurantCode || 'Settings'}</p>
          <h2>Restaurant Settings</h2>
        </div>
      </header>

      <SectionCard title="Business Profile" subtitle="Everything here is stored per restaurant workspace.">
        <form className="stack-form" onSubmit={handleSubmit}>
          <div className="two-column-grid">
            <input name="businessName" placeholder="Business name" value={formData.businessName} onChange={handleChange} />
            <input name="ownerName" placeholder="Owner name" value={formData.ownerName} onChange={handleChange} />
            <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
            <input name="phone" placeholder="Phone number" value={formData.phone} onChange={handleChange} />
            <input name="city" placeholder="City" value={formData.city} onChange={handleChange} />
            <input name="district" placeholder="District" value={formData.district} onChange={handleChange} />
            <input name="state" placeholder="State" value={formData.state} onChange={handleChange} />
            <input name="supportPhone" placeholder="Support phone" value={formData.supportPhone} onChange={handleChange} />
            <input name="primaryColor" placeholder="Primary color" value={formData.primaryColor} onChange={handleChange} />
            <input name="secondaryColor" placeholder="Secondary color" value={formData.secondaryColor} onChange={handleChange} />
            <select name="themePreference" value={formData.themePreference} onChange={handleChange}>
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
            <label className="checkbox-row">
              <input
                name="deliveryEnabled"
                type="checkbox"
                checked={formData.deliveryEnabled}
                onChange={handleChange}
              />
              Delivery enabled
            </label>
          </div>
          <textarea name="address" rows="3" placeholder="Address" value={formData.address} onChange={handleChange} />
          <textarea name="tagline" rows="2" placeholder="Tagline" value={formData.tagline} onChange={handleChange} />
          <textarea name="heroTitle" rows="2" placeholder="Hero title" value={formData.heroTitle} onChange={handleChange} />
          <textarea name="heroDescription" rows="3" placeholder="Hero description" value={formData.heroDescription} onChange={handleChange} />
          {message ? <div className="success-banner">{message}</div> : null}
          <button type="submit" className="primary-button">
            Save Settings
          </button>
        </form>
      </SectionCard>
    </div>
  );
};

export default SettingsPage;
