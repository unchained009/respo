const CartDrawer = ({
  cartItems,
  onAdd,
  onRemove,
  onPlaceOrder,
  loading,
  mode,
  notes,
  onNotesChange,
  deliveryDetails,
  onDeliveryFieldChange,
  entryLabel
}) => {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <aside className="cart-drawer">
      <div className="cart-drawer__header">
        <div>
          <h2>Your Order</h2>
          <p>{mode === 'delivery' ? 'Delivery basket ready to dispatch' : `${entryLabel} ordering is live`}</p>
        </div>
        <strong>Rs. {total}</strong>
      </div>

      <div className="cart-drawer__items">
        {cartItems.length === 0 ? (
          <p className="empty-state">Your cart is empty. Add something tasty.</p>
        ) : (
          cartItems.map((item) => (
            <div key={item._id} className="cart-item">
              <div>
                <h4>{item.name}</h4>
                <p>Rs. {item.price}</p>
              </div>
              <div className="quantity-control">
                <button type="button" onClick={() => onRemove(item)}>
                  -
                </button>
                <span>{item.quantity}</span>
                <button type="button" onClick={() => onAdd(item)}>
                  +
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="cart-drawer__meta">
        <label className="field-stack">
          <span>Notes for the kitchen</span>
          <textarea
            rows="3"
            placeholder="Add spice level, allergies, cutlery requests, or anything important."
            value={notes}
            onChange={(event) => onNotesChange(event.target.value)}
          />
        </label>

        {mode === 'delivery' ? (
          <div className="delivery-form">
            <label className="field-stack">
              <span>Your name</span>
              <input
                type="text"
                value={deliveryDetails.customerName}
                onChange={(event) => onDeliveryFieldChange('customerName', event.target.value)}
                placeholder="Enter full name"
              />
            </label>
            <label className="field-stack">
              <span>Phone number</span>
              <input
                type="tel"
                value={deliveryDetails.customerPhone}
                onChange={(event) => onDeliveryFieldChange('customerPhone', event.target.value)}
                placeholder="Enter contact number"
              />
            </label>
            <label className="field-stack">
              <span>Delivery address</span>
              <textarea
                rows="4"
                value={deliveryDetails.deliveryAddress}
                onChange={(event) => onDeliveryFieldChange('deliveryAddress', event.target.value)}
                placeholder="House / flat, street, landmark, and city"
              />
            </label>
          </div>
        ) : null}
      </div>

      <button type="button" className="primary-button full-width" onClick={onPlaceOrder} disabled={!cartItems.length || loading}>
        {loading ? 'Placing order...' : mode === 'delivery' ? 'Place Delivery Order' : 'Send To Kitchen'}
      </button>
    </aside>
  );
};

export default CartDrawer;
