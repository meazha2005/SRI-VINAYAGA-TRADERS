'use client';

import React, { useEffect, useState } from 'react';
import { Booking } from '@/lib/types';
import styles from './page.module.css';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    fetch('/api/bookings')
      .then(r => r.json())
      .then(d => d.success && setBookings(d.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: number, status: string) => {
    await fetch(`/api/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: status as Booking['status'] } : b));
  };

  const deleteBooking = async (id: number) => {
    if (!confirm('Delete this booking?')) return;
    await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  const statusBadge: Record<string, React.ReactNode> = {
    pending: <span className="badge badge-warning">Pending</span>,
    confirmed: <span className="badge badge-navy">Confirmed</span>,
    completed: <span className="badge badge-success">Completed</span>,
    cancelled: <span className="badge badge-danger">Cancelled</span>,
  };

  const counts = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  return (
    <div>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Bookings</h1>
          <p className={styles.pageDesc}>{bookings.length} total bookings</p>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map(f => (
          <button key={f} className={`${styles.tab} ${filter === f ? styles.activeTab : ''}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span className={styles.tabCount}>{counts[f]}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-center" style={{ minHeight: 200 }}>
          <div className="spinner" />
        </div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>No bookings found.</div>
      ) : (
        <div className={styles.bookingsList}>
          {filtered.map(booking => (
            <div key={booking.id} className={`${styles.bookingCard} ${booking.status === 'pending' ? styles.isPending : ''}`}>
              <div className={styles.bookingHeader}>
                <div className={styles.bookingMeta}>
                  <span className={styles.bookingName}>{booking.name}</span>
                  <span className={styles.bookingPhone}>
                    <a href={`tel:${booking.phone}`}>{booking.phone}</a>
                  </span>
                  {booking.email && (
                    <span className={styles.bookingEmail}>
                      <a href={`mailto:${booking.email}`}>{booking.email}</a>
                    </span>
                  )}
                </div>
                <div className={styles.bookingRight}>
                  {statusBadge[booking.status]}
                  <span className={styles.bookingDate}>
                    Booked: {new Date(booking.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>

              <div className={styles.bookingDetails}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>📅 Preferred Date</span>
                  <span className={styles.detailValue}>{new Date(booking.preferred_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                </div>
                {booking.preferred_time && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>🕐 Preferred Time</span>
                    <span className={styles.detailValue}>{booking.preferred_time}</span>
                  </div>
                )}
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>📍 Address</span>
                  <span className={styles.detailValue}>{booking.address}</span>
                </div>
              </div>

              {booking.items_description && (
                <div className={styles.itemsDesc}>
                  <strong>Materials Requested:</strong> {booking.items_description}
                </div>
              )}
              {booking.notes && (
                <div className={styles.itemsDesc} style={{ marginTop: '0.5rem' }}>
                  <strong>Notes:</strong> {booking.notes}
                </div>
              )}

              <div className={styles.bookingActions}>
                <select
                  className={`form-control ${styles.statusSelect}`}
                  value={booking.status}
                  onChange={e => updateStatus(booking.id, e.target.value)}
                  aria-label={`Update status for booking ${booking.id}`}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <a href={`tel:${booking.phone}`} className="btn btn-sm btn-secondary">📞 Call</a>
                <button onClick={() => deleteBooking(booking.id)} className="btn btn-sm btn-danger" id={`deleteBooking-${booking.id}`}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
