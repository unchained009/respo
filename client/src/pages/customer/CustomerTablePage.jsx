import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import CartDrawer from '../../components/customer/CartDrawer.jsx';
import MenuCategoryTabs from '../../components/customer/MenuCategoryTabs.jsx';
import MenuItemCard from '../../components/customer/MenuItemCard.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import { api } from '../../services/api.js';
import { createSocket } from '../../services/socket.js';

const CustomerTablePage = () => {
  const { tableName } = useParams();
  const [table, setTable] = useState(null);
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tableData, categoryList, menuList] = await Promise.all([
          api.lookupTable(tableName),
          api.getCategories(),
          api.getMenu()
        ]);
        setTable(tableData);
        setCategories(categoryList);
        setMenuItems(menuList.filter((item) => item.isAvailable));
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load this table right now.');
      }
    };

    loadData();
  }, [tableName]);

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
    if (!activeCategoryId) {
      return menuItems;
    }

    return menuItems.filter((item) => item.category?._id === activeCategoryId);
  }, [activeCategoryId, menuItems]);

  const placeOrder = async () => {
    setLoading(true);
    setError('');

    try {
      const createdOrder = await api.createOrder({
        tableId: table._id,
        items: cart.map((item) => ({
          menuItemId: item._id,
          quantity: item.quantity
        }))
      });
      setOrder(createdOrder);
      setCart([]);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="customer-shell">
      <section className="customer-hero">
        <div>
          <p className="eyebrow">Scan. Tap. Eat.</p>
          <h1>{table ? `Table ${table.tableNumber}` : 'Restaurant Menu'}</h1>
          <p>Browse the menu, place your order, and track kitchen updates in real time.</p>
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

      <MenuCategoryTabs categories={categories} activeCategoryId={activeCategoryId} onChange={setActiveCategoryId} />

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

        <CartDrawer cartItems={cart} onAdd={addToCart} onRemove={removeFromCart} onPlaceOrder={placeOrder} loading={loading} />
      </div>
    </div>
  );
};

export default CustomerTablePage;
