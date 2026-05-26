'use client';

import React, { useState } from 'react';
import styles from './page.module.css';

export default function BookingPage() {
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({
    name: '', phone: '', email: '', address: '',
    preferred_date: '', preferred_time: '', items_description: '', notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.success) {
        setStatus('success');
        setForm({ name: '', phone: '', email: '', address: '', preferred_date: '', preferred_time: '', items_description: '', notes: '' });
      } else {
        setStatus('error');
        setErrorMsg(data.error || 'Failed to submit booking');
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
          <h1>Book a Delivery</h1>
          <p>Schedule a delivery appointment for your construction materials</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className={styles.layout}>
            {/* Info Panel */}
            <div className={styles.infoPanel}>
              <h2 className={styles.infoPanelTitle}>How It Works</h2>
              <div className={styles.steps}>
                {[
                  { num: '01', title: 'Fill the Form', desc: 'Provide your delivery details and preferred date' },
                  { num: '02', title: 'We Confirm', desc: 'Our team reviews and confirms within 24 hours' },
                  { num: '03', title: 'We Deliver', desc: 'Materials delivered to your site on the scheduled date' },
                ].map(step => (
                  <div key={step.num} className={styles.step}>
                    <div className={styles.stepNum}>{step.num}</div>
                    <div>
                      <h4 className={styles.stepTitle}>{step.title}</h4>
                      <p className={styles.stepDesc}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.contactBox}>
                <h4>Need immediate help?</h4>
                <p>Call us directly:</p>
                <a href="tel:+919710631234" className={styles.phoneLink}>📞 +91 97106 31234</a>
                <a href="tel:+919710651234" className={styles.phoneLink}>📞 +91 97106 51234</a>
              </div>

              <div className={styles.noteBox}>
                <p>📅 Bookings are subject to availability and delivery area coverage.</p>
                <p>🕘 Business hours: Mon–Sat, 9 AM – 6 PM</p>
              </div>
            </div>

            {/* Form */}
            <div className={styles.formWrap}>
              {status === 'success' ? (
                <div className={styles.successCard}>
                  <div className={styles.successIcon}>📅</div>
                  <h2>Booking Submitted!</h2>
                  <p>
                    Thank you! Your delivery booking has been received. Our team will confirm
                    the appointment within 24 business hours.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="btn btn-primary btn-lg"
                  >
                    Book Another
                  </button>
                </div>
              ) : (
                <div className={styles.formCard}>
                  <h2 className={styles.formTitle}>Delivery Booking Form</h2>

                  {status === 'error' && (
                    <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
                      {errorMsg}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} id="bookingForm">
                    <div className={styles.formRow}>
                      <div className="form-group">
                        <label className="form-label" htmlFor="bookName">Full Name *</label>
                        <input id="bookName" name="name" type="text" className="form-control"
                          placeholder="Your full name" value={form.name} onChange={handleChange} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="bookPhone">Phone *</label>
                        <input id="bookPhone" name="phone" type="tel" className="form-control"
                          placeholder="10-digit mobile" value={form.phone} onChange={handleChange}
                          maxLength={10} required />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="bookEmail">Email (optional)</label>
                      <input id="bookEmail" name="email" type="email" className="form-control"
                        placeholder="your@email.com" value={form.email} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="bookAddress">Delivery Address *</label>
                      <textarea id="bookAddress" name="address" className="form-control"
                        placeholder="Full delivery address including landmark and pincode"
                        value={form.address} onChange={handleChange} required rows={3} />
                    </div>

                    <div className={styles.formRow}>
                      <div className="form-group">
                        <label className="form-label" htmlFor="bookDate">Preferred Date *</label>
                        <input id="bookDate" name="preferred_date" type="date" className="form-control"
                          value={form.preferred_date} onChange={handleChange}
                          min={today} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="bookTime">Preferred Time</label>
                        <select id="bookTime" name="preferred_time" className="form-control"
                          value={form.preferred_time} onChange={handleChange}>
                          <option value="">Any time</option>
                          <option value="morning">Morning (9 AM – 12 PM)</option>
                          <option value="afternoon">Afternoon (12 PM – 3 PM)</option>
                          <option value="evening">Evening (3 PM – 6 PM)</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="bookItems">Materials Needed *</label>
                      <textarea id="bookItems" name="items_description" className="form-control"
                        placeholder="e.g. 50 bags Ultratech Cement, 2 tons TMT bars 12mm, 10 GI sheets..."
                        value={form.items_description} onChange={handleChange} rows={4} required />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="bookNotes">Additional Notes</label>
                      <textarea id="bookNotes" name="notes" className="form-control"
                        placeholder="Access instructions, special requirements, contact at site..."
                        value={form.notes} onChange={handleChange} rows={2} />
                    </div>

                    <button type="submit" className="btn btn-primary w-full btn-lg" disabled={loading} id="submitBooking">
                      {loading ? 'Submitting...' : 'Submit Booking Request'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
