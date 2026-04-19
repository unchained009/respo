const MenuItemCard = ({ item, quantity, onAdd, onRemove }) => (
  <article className="menu-item-card">
    <img src={item.image} alt={item.name} className="menu-item-card__image" />
    <div className="menu-item-card__content">
      <div className="menu-item-card__top">
        <div>
          <h3>{item.name}</h3>
          <p>{item.description}</p>
        </div>
        <strong>Rs. {item.price}</strong>
      </div>
      <div className="menu-item-card__bottom">
        <span className={item.isAvailable ? 'availability available' : 'availability unavailable'}>
          {item.isAvailable ? 'Available' : 'Unavailable'}
        </span>
        <div className="quantity-control">
          <button type="button" onClick={() => onRemove(item)} disabled={!quantity}>
            -
          </button>
          <span>{quantity || 0}</span>
          <button type="button" onClick={() => onAdd(item)} disabled={!item.isAvailable}>
            +
          </button>
        </div>
      </div>
    </div>
  </article>
);

export default MenuItemCard;
