'use client';

import React, { useState } from 'react';
import type { Metadata } from 'next';
import styles from './page.module.css';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.success) {
        setStatus('success');
        setForm({ name: '', phone: '', email: '', message: '' });
      } else {
        setStatus('error');
        setErrorMsg(data.error || 'Failed to send message');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>Contact Us</h1>
          <p>Get in touch with our team for orders, enquiries, or any assistance</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className={styles.grid}>
            {/* Info */}
            <div className={styles.info}>
              <h2 className={styles.infoTitle}>Get in Touch</h2>
              <p className={styles.infoDesc}>
                We&apos;re here to help with all your construction material needs. Reach out via phone,
                email, or fill out the form — we typically respond within 1 business day.
              </p>

              <div className={styles.contactItems}>
                <div className={styles.contactItem}>
                  <div className={styles.contactIconWrap}>📍</div>
                  <div>
                    <h4>Address</h4>
                    <p>No. 64/3D, Sriperambudur Main Road<br />Pudupper Village, Chennai - 600069</p>
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <div className={styles.contactIconWrap}>📞</div>
                  <div>
                    <h4>Phone</h4>
                    <p><a href="tel:+919710631234">+91 97106 31234</a></p>
                    <p><a href="tel:+919710651234">+91 97106 51234</a></p>
                    <p><a href="tel:+917598711234">+91 75987 11234</a></p>
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <div className={styles.contactIconWrap}>✉️</div>
                  <div>
                    <h4>Email</h4>
                    <p><a href="mailto:support@srivinayagatraders.com">support@srivinayagatraders.com</a></p>
                    <p><a href="mailto:help@srivinayagatraders.com">help@srivinayagatraders.com</a></p>
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <div className={styles.contactIconWrap}>⏰</div>
                  <div>
                    <h4>Business Hours</h4>
                    <p>Monday – Saturday: 9:00 AM – 6:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className={styles.formCard}>
              <h2 className={styles.formTitle}>Send Us a Message</h2>

              {status === 'success' && (
                <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
                  ✅ Message sent successfully! We&apos;ll get back to you soon.
                </div>
              )}
              {status === 'error' && (
                <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
                  ❌ {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} id="contactForm" noValidate>
                <div className="form-group">
                  <label className="form-label" htmlFor="name">Your Name *</label>
                  <input
                    id="name"
                    name="name"
                    className="form-control"
                    type="text"
                    placeholder="e.g. Rajan Kumar"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="phone">Phone Number *</label>
                  <input
                    id="phone"
                    name="phone"
                    className="form-control"
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={form.phone}
                    onChange={handleChange}
                    maxLength={10}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    name="email"
                    className="form-control"
                    type="email"
                    placeholder="your@email.com (optional)"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    className="form-control"
                    placeholder="Tell us about your requirements, quantity needed, delivery location..."
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={loading}
                  id="submitContactForm"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>

          {/* Map */}
          <div className={styles.mapSection}>
            <h2 className={styles.mapTitle}>Find Us</h2>
            <div className={styles.mapWrap}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d971.9963867419956!2d80.04234276035453!3d12.972776111725322!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52f58bb64ab6b5%3A0xed129ceeaa354755!2sSRI%20VINAYAGA%20TRADERS!5e0!3m2!1sen!2sin!4v1733495695862!5m2!1sen!2sin"
                width="100%"
                height="400"
                style={{ border: 0, borderRadius: '12px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Sri Vinayaga Traders Location"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
