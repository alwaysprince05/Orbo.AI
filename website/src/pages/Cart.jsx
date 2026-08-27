import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';
import './Cart.css';

export default function Cart() {
  const { items, removeItem, clearCart, totalItems, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <div className="cart-empty__icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any products yet.</p>
          <Link to="/" className="cart-btn cart-btn--primary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1 className="cart-title">Shopping Cart ({totalItems} items)</h1>

      <div className="cart-layout">
        {/* Items list */}
        <div className="cart-items">
          {items.map(item => (
            <div key={item.product_id} className="cart-item">
              <img
                src={`https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=120&h=120&fit=crop&q=80`}
                alt={item.name}
                className="cart-item__img"
              />
              <div className="cart-item__info">
                <p className="cart-item__brand">{item.brand}</p>
                <h3 className="cart-item__name">{item.name}</h3>
                <div className="cart-item__meta">
                  <span className="cart-item__rating">★ {item.rating}</span>
                  <span className="cart-item__reviews">({Number(item.review_count).toLocaleString()})</span>
                </div>
              </div>
              <div className="cart-item__right">
                <p className="cart-item__price">{formatPrice(item.price)}</p>
                <button className="cart-item__remove" onClick={() => removeItem(item.product_id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="cart-summary">
          <h2 className="cart-summary__title">Order Summary</h2>
          <div className="cart-summary__row">
            <span>Items ({totalItems})</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
          <div className="cart-summary__row">
            <span>Delivery</span>
            <span className="cart-summary__free">FREE</span>
          </div>
          <div className="cart-summary__divider" />
          <div className="cart-summary__row cart-summary__row--total">
            <span>Total</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
          <button
            className="cart-btn cart-btn--checkout"
            onClick={() => {
              alert(`Order placed successfully! Total: ${formatPrice(totalPrice)} (Demo)`);
              clearCart();
            }}
          >
            Place Order at {formatPrice(totalPrice)}
          </button>
          <Link to="/" className="cart-btn cart-btn--continue">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
