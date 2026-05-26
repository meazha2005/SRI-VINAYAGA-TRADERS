'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/components/CartProvider';
import styles from './page.module.css';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCart();
  const [form, setForm] = useState({ name: '', phone: '', email: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);
    setStatus('idle');

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, items }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus('success');
        clearCart();
        setForm({ name: '', phone: '', email: '', notes: '' });
      } else {
        setStatus('error');
        setErrorMsg(data.error || 'Failed to submit enquiry');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && status !== 'success') {
    return (
      <div>
        <div className="page-header">
          <div className="container">
            <h1>Your Cart</h1>
            <p>Review your selected products and submit an enquiry</p>
          </div>
        </div>
        <section className="section">
          <div className="container">
            <div className={styles.emptyCart}>
              <div className={styles.emptyIcon}>🛒</div>
              <h2>Your cart is empty</h2>
              <p>Browse our products and add items to get started</p>
              <Link href="/products" className="btn btn-primary btn-lg">
                Browse Products
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>Your Cart</h1>
          <p>Review your selected products and submit an enquiry</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {status === 'success' ? (
            <div className={styles.successState}>
              <div className={styles.successIcon}>✅</div>
              <h2>Enquiry Submitted!</h2>
              <p>Thank you! We&apos;ve received your enquiry and will contact you shortly at the number provided.</p>
              <div className={styles.successBtns}>
                <Link href="/products" className="btn btn-primary btn-lg">Continue Shopping</Link>
                <Link href="/contact" className="btn btn-secondary btn-lg">Contact Us</Link>
              </div>
            </div>
          ) : (
            <div className={styles.layout}>
              {/* Cart Items */}
              <div className={styles.itemsSection}>
                <div className={styles.itemsHeader}>
                  <h2 className={styles.sectionTitle}>Cart Items ({items.length})</h2>
                  <button onClick={clearCart} className={styles.clearBtn}>Clear All</button>
                </div>

                <div className={styles.itemsList}>
                  {items.map(item => (
                    <div key={item.product_id} className={styles.cartItem}>
                      <div className={styles.itemImage}>
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            fill
                            className={styles.itemImg}
                            sizes="80px"
                            unoptimized
                          />
                        ) : (
                          <div className={styles.itemImgPlaceholder}>📦</div>
                        )}
                      </div>
                      <div className={styles.itemInfo}>
                        <Link href={`/products/${item.product_id}`} className={styles.itemName}>
                          {item.name}
                        </Link>
                        <p className={styles.itemPrice}>{item.price_label}</p>
                      </div>
                      <div className={styles.itemQty}>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          className={styles.qtyBtn}
                          aria-label="Decrease"
                        >−</button>
                        <span className={styles.qtyNum}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          className={styles.qtyBtn}
                          aria-label="Increase"
                        >+</button>
                      </div>
                      <button
                        onClick={() => removeItem(item.product_id)}
                        className={styles.removeBtn}
                        aria-label="Remove item"
                      >
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                          <path d="M10 11v6M14 11v6" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>

                <div className={styles.continueShop}>
                  <Link href="/products" className="btn btn-secondary">
                    ← Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Enquiry Form */}
              <div className={styles.formSection}>
                <div className={styles.formCard}>
                  <h2 className={styles.sectionTitle}>Submit Enquiry</h2>
                  <p className={styles.formNote}>
                    Our team will contact you with pricing and availability details for your selected items.
                  </p>

                  {status === 'error' && (
                    <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
                      {errorMsg}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} id="enquiryForm">
                    <div className="form-group">
                      <label className="form-label" htmlFor="cartName">Your Name *</label>
                      <input id="cartName" name="name" type="text" className="form-control"
                        placeholder="Full name" value={form.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="cartPhone">Phone Number *</label>
                      <input id="cartPhone" name="phone" type="tel" className="form-control"
                        placeholder="10-digit mobile" value={form.phone} onChange={handleChange}
                        maxLength={10} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="cartEmail">Email (optional)</label>
                      <input id="cartEmail" name="email" type="email" className="form-control"
                        placeholder="your@email.com" value={form.email} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="cartNotes">Additional Notes</label>
                      <textarea id="cartNotes" name="notes" className="form-control"
                        placeholder="Delivery location, urgency, quantity preferences..."
                        value={form.notes} onChange={handleChange} rows={3} />
                    </div>

                    <div className={styles.itemsSummary}>
                      <h4>Items in your enquiry:</h4>
                      {items.map(item => (
                        <div key={item.product_id} className={styles.summaryRow}>
                          <span>{item.name}</span>
                          <span>×{item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <button type="submit" className="btn btn-primary w-full btn-lg" disabled={loading} id="submitEnquiry">
                      {loading ? 'Submitting...' : 'Submit Enquiry'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
