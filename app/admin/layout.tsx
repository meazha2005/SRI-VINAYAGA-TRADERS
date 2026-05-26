'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './layout.module.css';

const NAV = [
  { href: '/admin', icon: '📊', label: 'Dashboard', exact: true },
  { href: '/admin/products', icon: '📦', label: 'Products' },
  { href: '/admin/messages', icon: '✉️', label: 'Messages' },
  { href: '/admin/bookings', icon: '📅', label: 'Bookings' },
  { href: '/admin/enquiries', icon: '🛒', label: 'Enquiries' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (pathname === '/admin/login') return <>{children}</>;

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className={styles.adminLayout}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <div>
              <p className={styles.logoText}>SVT Admin</p>
              <p className={styles.logoSub}>Control Panel</p>
            </div>
          </div>
        </div>

        <nav className={styles.nav}>
          {NAV.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${isActive(item.href, item.exact) ? styles.active : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/" className={styles.viewSite} target="_blank">
            🌐 View Website
          </Link>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className={styles.logoutBtn}
          >
            🚪 {loggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className={styles.main}>
        {/* Top bar */}
        <header className={styles.topbar}>
          <button
            className={styles.menuBtn}
            onClick={() => setSidebarOpen(v => !v)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
          <h2 className={styles.pageTitle}>
            {NAV.find(n => isActive(n.href, n.exact))?.label || 'Admin'}
          </h2>
          <div className={styles.topbarActions}>
            <span className={styles.adminBadge}>Admin</span>
          </div>
        </header>

        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
