'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { DashboardStats } from '@/lib/types';

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(d => d.success && setStats(d.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: 'Total Products', value: stats.totalProducts, icon: '📦', href: '/admin/products', color: styles.cardBlue },
    { label: 'New Messages', value: stats.newMessages, sub: `${stats.totalMessages} total`, icon: '✉️', href: '/admin/messages', color: styles.cardGreen, alert: stats.newMessages > 0 },
    { label: 'Pending Bookings', value: stats.pendingBookings, sub: `${stats.totalBookings} total`, icon: '📅', href: '/admin/bookings', color: styles.cardOrange, alert: stats.pendingBookings > 0 },
    { label: 'New Enquiries', value: stats.newEnquiries, sub: `${stats.totalEnquiries} total`, icon: '🛒', href: '/admin/enquiries', color: styles.cardPurple, alert: stats.newEnquiries > 0 },
  ] : [];

  return (
    <div>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.pageDesc}>Overview of your website activity</p>
        </div>
        <Link href="/admin/products/new" className="btn btn-primary">
          + Add Product
        </Link>
      </div>

      {loading ? (
        <div className="loading-center" style={{ minHeight: 200 }}>
          <div className="spinner" />
        </div>
      ) : (
        <>
          <div className={styles.statsGrid}>
            {statCards.map(card => (
              <Link key={card.label} href={card.href} className={`${styles.statCard} ${card.color}`}>
                <div className={styles.statCardHeader}>
                  <span className={styles.statCardIcon}>{card.icon}</span>
                  {card.alert && <span className={styles.alertDot} />}
                </div>
                <p className={styles.statCardValue}>{card.value}</p>
                <p className={styles.statCardLabel}>{card.label}</p>
                {card.sub && <p className={styles.statCardSub}>{card.sub}</p>}
              </Link>
            ))}
          </div>

          <div className={styles.quickActions}>
            <h2 className={styles.sectionTitle}>Quick Actions</h2>
            <div className={styles.actionsGrid}>
              {[
                { href: '/admin/products/new', icon: '➕', label: 'Add New Product', desc: 'Upload a product with image' },
                { href: '/admin/messages', icon: '✉️', label: 'View Messages', desc: 'Respond to customer queries' },
                { href: '/admin/bookings', icon: '📅', label: 'Manage Bookings', desc: 'Update booking statuses' },
                { href: '/admin/enquiries', icon: '🛒', label: 'View Enquiries', desc: 'Cart order requests' },
              ].map(a => (
                <Link key={a.href} href={a.href} className={styles.actionCard}>
                  <span className={styles.actionIcon}>{a.icon}</span>
                  <div>
                    <h4 className={styles.actionLabel}>{a.label}</h4>
                    <p className={styles.actionDesc}>{a.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
