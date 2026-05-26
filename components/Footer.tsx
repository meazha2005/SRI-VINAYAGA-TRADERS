import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className="container">
          <div className={styles.grid}>
            {/* Brand */}
            <div className={styles.brand}>
              <div className={styles.logo}>
                <div>
                  <p className={styles.logoMain}>SRI VINAYAGA TRADERS</p>
                  <p className={styles.logoTagline}>Quality Construction Materials Since 1982</p>
                </div>
              </div>
              <p className={styles.brandDesc}>
                Tamil Nadu&apos;s trusted importer and distributor of premium steel and construction materials. Serving contractors, retailers, and builders across the region.
              </p>
              <div className={styles.socials}>
                <a href="https://www.facebook.com/profile.php?id=100085026091135" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={styles.socialLink}>
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                </a>
                <a href="https://www.instagram.com/srivinayagatraders_1982/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={styles.socialLink}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
                <a href="https://youtube.com/@srivinayagatraders_1982" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className={styles.socialLink}>
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></svg>
                </a>
                <a href="https://x.com/sri_vinayaga_" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className={styles.socialLink}>
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className={styles.col}>
              <h4 className={styles.colTitle}>Quick Links</h4>
              <ul className={styles.linkList}>
                <li><Link href="/" className={styles.link}>Home</Link></li>
                <li><Link href="/products" className={styles.link}>Products</Link></li>
                <li><Link href="/about" className={styles.link}>About Us</Link></li>
                <li><Link href="/contact" className={styles.link}>Contact</Link></li>
                <li><Link href="/cart" className={styles.link}>Cart</Link></li>
                <li><Link href="/booking" className={styles.link}>Booking</Link></li>
              </ul>
            </div>

            {/* Products */}
            <div className={styles.col}>
              <h4 className={styles.colTitle}>Products</h4>
              <ul className={styles.linkList}>
                <li><Link href="/products?category=tmt" className={styles.link}>TMT Bars</Link></li>
                <li><Link href="/products?category=cement" className={styles.link}>Cement</Link></li>
                <li><Link href="/products?category=rsheets" className={styles.link}>Roofing Sheets</Link></li>
                <li><Link href="/products?category=pipes" className={styles.link}>Metal Pipes</Link></li>
                <li><Link href="/products?category=sheets" className={styles.link}>Steel Sheets</Link></li>
                <li><Link href="/products?category=strmatr" className={styles.link}>Structural Materials</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div className={styles.col}>
              <h4 className={styles.colTitle}>Contact Us</h4>
              <ul className={styles.contactList}>
                <li>
                  <span className={styles.contactIcon}>📍</span>
                  <span>No. 64/3D, Sriperambudur Main Road,<br />Pudupper Village, Chennai - 600069</span>
                </li>
                <li>
                  <span className={styles.contactIcon}>📞</span>
                  <div>
                    <a href="tel:+919710631234" className={styles.contactLink}>+91 97106 31234</a><br />
                    <a href="tel:+919710651234" className={styles.contactLink}>+91 97106 51234</a><br />
                    <a href="tel:+917598711234" className={styles.contactLink}>+91 75987 11234</a>
                  </div>
                </li>
                <li>
                  <span className={styles.contactIcon}>✉️</span>
                  <div>
                    <a href="mailto:support@srivinayagatraders.com" className={styles.contactLink}>support@srivinayagatraders.com</a>
                  </div>
                </li>
                <li>
                  <span className={styles.contactIcon}>⏰</span>
                  <span>Mon – Sat: 9:00 AM – 6:00 PM<br />Sunday: Closed</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className="container">
          <div className={styles.bottomInner}>
            <p className={styles.copyright}>
              &copy; {new Date().getFullYear()} Sri Vinayaga Traders. All rights reserved.
            </p>
            <Link href="/admin" className={styles.adminLink}>Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
