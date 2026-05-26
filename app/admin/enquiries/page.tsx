'use client';

import React, { useEffect, useState } from 'react';
import { Enquiry, CartItem } from '@/lib/types';
import styles from './page.module.css';

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'new' | 'processing' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    fetch('/api/enquiries')
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          // Parse items JSON string if needed
          const parsed = d.data.map((e: Enquiry) => ({
            ...e,
            items: typeof e.items === 'string' ? JSON.parse(e.items) : e.items,
          }));
          setEnquiries(parsed);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: number, status: string) => {
    await fetch(`/api/enquiries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status: status as Enquiry['status'] } : e));
  };

  const deleteEnquiry = async (id: number) => {
    if (!confirm('Delete this enquiry?')) return;
    await fetch(`/api/enquiries/${id}`, { method: 'DELETE' });
    setEnquiries(prev => prev.filter(e => e.id !== id));
  };

  const filtered = filter === 'all' ? enquiries : enquiries.filter(e => e.status === filter);

  const statusBadge: Record<string, React.ReactNode> = {
    new: <span className="badge badge-danger">New</span>,
    processing: <span className="badge badge-warning">Processing</span>,
    completed: <span className="badge badge-success">Completed</span>,
    cancelled: <span className="badge badge-gray">Cancelled</span>,
  };

  const counts = {
    all: enquiries.length,
    new: enquiries.filter(e => e.status === 'new').length,
    processing: enquiries.filter(e => e.status === 'processing').length,
    completed: enquiries.filter(e => e.status === 'completed').length,
    cancelled: enquiries.filter(e => e.status === 'cancelled').length,
  };

  return (
    <div>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Enquiries</h1>
          <p className={styles.pageDesc}>{enquiries.length} total enquiries (from cart)</p>
        </div>
      </div>

      <div className={styles.tabs}>
        {(['all', 'new', 'processing', 'completed', 'cancelled'] as const).map(f => (
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
        <div className={styles.empty}>No enquiries found.</div>
      ) : (
        <div className={styles.list}>
          {filtered.map(enq => (
            <div key={enq.id} className={`${styles.card} ${enq.status === 'new' ? styles.isNew : ''}`}>
              <div className={styles.header}>
                <div className={styles.meta}>
                  <span className={styles.name}>{enq.name}</span>
                  <span className={styles.phone}><a href={`tel:${enq.phone}`}>{enq.phone}</a></span>
                  {enq.email && <span className={styles.email}><a href={`mailto:${enq.email}`}>{enq.email}</a></span>}
                </div>
                <div className={styles.right}>
                  {statusBadge[enq.status]}
                  <span className={styles.date}>
                    {new Date(enq.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>

              <div className={styles.itemsList}>
                <p className={styles.itemsTitle}>Requested Items:</p>
                {Array.isArray(enq.items) && enq.items.map((item: CartItem, i: number) => (
                  <div key={i} className={styles.item}>
                    <span className={styles.itemName}>{item.name}</span>
                    <span className={styles.itemQty}>×{item.quantity}</span>
                    <span className={styles.itemPrice}>{item.price_label}</span>
                  </div>
                ))}
              </div>

              {enq.notes && (
                <div className={styles.notes}><strong>Notes:</strong> {enq.notes}</div>
              )}

              <div className={styles.actions}>
                <select
                  className={`form-control ${styles.statusSelect}`}
                  value={enq.status}
                  onChange={e => updateStatus(enq.id, e.target.value)}
                  aria-label={`Update status for enquiry ${enq.id}`}
                >
                  <option value="new">New</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <a href={`tel:${enq.phone}`} className="btn btn-sm btn-secondary">📞 Call</a>
                <button onClick={() => deleteEnquiry(enq.id)} className="btn btn-sm btn-danger" id={`deleteEnq-${enq.id}`}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
