import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CartDrawer from '../../components/customer/CartDrawer.jsx';
import MenuCategoryTabs from '../../components/customer/MenuCategoryTabs.jsx';
import MenuItemCard from '../../components/customer/MenuItemCard.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import ThemeToggle from '../../components/common/ThemeToggle.jsx';
import { api } from '../../services/api.js';
import { createSocket } from '../../services/socket.js';

const GuestAccessPage = () => {
  const { restaurantSlug, accessToken } = useParams();
  const [access, setAccess] = useState(null);
  const [cart, setCart] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notes, setNotes] = useState('');
  const [deliveryDetails, setDeliveryDetails] = useState({
    customerName: '',
    customerPhone: '',
    deliveryAddress: ''
  });

  useEffect(() => {
    api
      .resolveGuestAccess(restaurantSlug, accessToken)
      .then((response) => {
        setAccess(response);
        setError('');
      })
      .catch((requestError) => {
        setError(requestError.response?.data?.message || 'Unable to load this guest access link right now.');
      });
  }, [restaurantSlug, accessToken]);

  useEffect(() => {
    if (!order?._id) {
      return undefined;
    }

    const socket = createSocket();
    socket.emit('join:order', order._id);
    socket.on('order:updated', (updatedOrder) => {
      if (updatedOrder._id === order._id) {
        setOrder(updatedOrder);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [order?._id]);

  const addToCart = (item) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find((cartItem) => cartItem._id === item._id);

      if (existingItem) {
        return currentCart.map((cartItem) =>
          cartItem._id === item._id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      }

      return [...currentCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (item) => {
    setCart((currentCart) =>
      currentCart
        .map((cartItem) =>
          cartItem._id === item._id ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem
        )
        .filter((cartItem) => cartItem.quantity > 0)
    );
  };

  const filteredItems = useMemo(() => {
    if (!access) {
      return [];
    }

    if (!activeCategoryId) {
      return access.menuItems;
    }

    return access.menuItems.filter((item) => item.category?._id === activeCategoryId);
  }, [access, activeCategoryId]);

  const handleDeliveryFieldChange = (field, value) => {
    setDeliveryDetails((current) => ({
      ...current,
      [field]: value
    }));
  };

  const placeOrder = async () => {
    setLoading(true);
    setError('');

    try {
      const createdOrder = await api.createOrder({
        restaurantSlug,
        accessToken,
        notes,
        ...deliveryDetails,
        items: cart.map((item) => ({
          menuItemId: item._id,
          quantity: item.quantity
        }))
      });
      setOrder(createdOrder);
      setCart([]);
      setNotes('');
      setDeliveryDetails({
        customerName: '',
        customerPhone: '',
        deliveryAddress: ''
      });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="guest-shell">
      <header className="guest-topbar">
        <div className="brand-identity">
          <span className="brand-pill">{access?.restaurant?.restaurantCode || 'GUEST'}</span>
          <div>
            <strong>{access?.restaurant?.businessName || 'Restaurant Workspace'}</strong>
            <p>{access?.restaurant?.tagline || 'Guest ordering made fast and secure.'}</p>
          </div>
        </div>
        <div className="landing-topbar__actions">
          <ThemeToggle />
          <Link className="btn-ghost" to="/">
            Visit Platform
          </Link>
        </div>
      </header>

      <main className="customer-shell">
        <section className="customer-hero">
          <div>
            <p className="eyebrow">{access?.accessType === 'delivery' ? 'Home Delivery' : 'Secure Table Ordering'}</p>
            <h1>{access?.entryLabel || 'Guest Ordering'}</h1>
            <p>
              {access?.accessType === 'delivery'
                ? "Place a delivery order from the restaurant's public QR and send it directly to the kitchen."
                : 'This access token is tied to a single table, so guests cannot switch tables by editing the URL.'}
            </p>
          </div>
          {order ? (
            <div className="order-status-card">
              <span>Current Order</span>
              <strong>#{order._id.slice(-6)}</strong>
              <StatusBadge status={order.status} />
            </div>
          ) : null}
        </section>

        {error ? <div className="alert error">{error}</div> : null}

        <MenuCategoryTabs
          categories={access?.categories || []}
          activeCategoryId={activeCategoryId}
          onChange={setActiveCategoryId}
        />

        <div className="customer-content">
          <div className="menu-grid">
            {filteredItems.map((item) => (
              <MenuItemCard
                key={item._id}
                item={item}
                quantity={cart.find((cartItem) => cartItem._id === item._id)?.quantity || 0}
                onAdd={addToCart}
                onRemove={removeFromCart}
              />
            ))}
          </div>

          <CartDrawer
            cartItems={cart}
            onAdd={addToCart}
            onRemove={removeFromCart}
            onPlaceOrder={placeOrder}
            loading={loading}
            mode={access?.accessType || 'dine_in'}
            notes={notes}
            onNotesChange={setNotes}
            deliveryDetails={deliveryDetails}
            onDeliveryFieldChange={handleDeliveryFieldChange}
            entryLabel={access?.entryLabel || 'Guest'}
          />
        </div>
      </main>
    </div>
  );
};

export default GuestAccessPage;
