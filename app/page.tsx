'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/components/CartProvider';
import { Product } from '@/lib/types';
import styles from './page.module.css';

const PARTNER_LOGOS = [
  { name: 'ARS 550', src: '/logos/ars_550.png' },
  { name: 'MCR', src: '/logos/mcr.png' },
  { name: 'Amman', src: '/logos/amman.png' },
  { name: 'Tata Steel', src: '/logos/tata.png' },
  { name: 'Blue Gold', src: '/logos/bluegold.png' },
  { name: 'iSteel', src: '/logos/isteel.png' },
  { name: 'JSW', src: '/logos/jsw.png' },
  { name: 'Kamachi', src: '/logos/kamachi.png' },
  { name: 'Pulkit', src: '/logos/pulkit.png' },
  { name: 'SAIL', src: '/logos/sail.png' },
  { name: 'Suryadev', src: '/logos/suryadev.png' },
  { name: 'Vizag', src: '/logos/vizag.png' },
];

const STATS = [
  { value: '40+', label: 'Years of Experience' },
  { value: '70+', label: 'Products Available' },
  { value: '10K+', label: 'Satisfied Customers' },
  { value: '9+', label: 'Product Categories' },
];

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    fetch('/api/products?featured=true&limit=4')
      .then(r => r.json())
      .then(data => {
        if (data.success) setFeaturedProducts(data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = useCallback((product: Product) => {
    addItem({
      product_id: product.id,
      name: product.name,
      image_url: product.image_url,
      category_slug: product.category_slug,
      quantity: 1,
      price_label: product.price_label,
    });
  }, [addItem]);

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={`container ${styles.heroContainer}`}>
          <div className={styles.heroLeft}>
            <h1 className={styles.heroTitle}>
              Sri Vinayaga<br />
              <span className={styles.heroTitleAccent}>Traders</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Premium Steel &amp; Construction Materials<br />
              Sourced From India&apos;s Top Manufacturers.
            </p>
            <div className={styles.heroCta}>
              <Link href="/products" className={`btn btn-primary btn-lg ${styles.heroBtn}`}>
                Explore Products
              </Link>
              <Link href="/contact" className={`btn btn-secondary btn-lg ${styles.heroBtn}`}>
                Get a Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className={styles.stats}>
        <div className="container">
          <div className={styles.statsGrid}>
            {STATS.map(s => (
              <div key={s.label} className={styles.statItem}>
                <p className={styles.statValue}>{s.value}</p>
                <p className={styles.statLabel}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className={`section ${styles.featuredSection}`}>
        <div className="container">
          <div className="section-heading">
            <span className="overline">What We Offer</span>
            <h2>Our Key Products</h2>
            <p>High-quality construction materials sourced from top manufacturers across India</p>
          </div>

          {loading ? (
            <div className="loading-center">
              <div className="spinner" />
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className={styles.productGrid}>
              {featuredProducts.map(product => (
                <div key={product.id} className={styles.productCard}>
                  <div className={styles.productImageWrap}>
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 25vw"
                        className={styles.productImage}
                        unoptimized
                      />
                    ) : (
                      <div className={styles.productImagePlaceholder}>📦</div>
                    )}
                  </div>
                  <div className={styles.productBody}>
                    <h3 className={styles.productName}>{product.name}</h3>
                    <p className={styles.productPrice}>{product.price_label}</p>
                    <div className={styles.productActions}>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="btn btn-primary btn-sm"
                        style={{ width: '100%', gap: '0.5rem' }}
                      >
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noProducts}>
              <p>Products will appear here once added via the admin panel.</p>
              <Link href="/products" className="btn btn-primary">View All Products</Link>
            </div>
          )}

          <div className={styles.viewAll}>
            <Link href="/products" className="btn btn-secondary btn-lg">
              View All Products →
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className={`section ${styles.categoriesSection}`}>
        <div className="container">
          <div className="section-heading">
            <span className="overline">Browse By Category</span>
            <h2>Product Categories</h2>
          </div>
          <div className={styles.categoriesGrid}>
            {[
              { slug: 'tmt', icon: '🔩', name: 'TMT Bars', desc: '25+ brands' },
              { slug: 'cement', icon: '🏗️', name: 'Cement', desc: '10+ brands' },
              { slug: 'rsheets', icon: '🏠', name: 'Roofing Sheets', desc: 'Color coated' },
              { slug: 'pipes', icon: '🔧', name: 'Metal Pipes', desc: 'MS, GI, GP' },
              { slug: 'sheets', icon: '📋', name: 'Steel Sheets', desc: 'MS & GI' },
              { slug: 'strmatr', icon: '🏛️', name: 'Structural', desc: 'Angles, Channels' },
              { slug: 'asbseet', icon: '🌧️', name: 'Asbestos Sheets', desc: 'Roofing' },
              { slug: 'others', icon: '🛠️', name: 'Others', desc: 'Hardware & more' },
            ].map(cat => (
              <Link key={cat.slug} href={`/products?category=${cat.slug}`} className={styles.categoryCard}>
                <span className={styles.categoryIcon}>{cat.icon}</span>
                <h4 className={styles.categoryName}>{cat.name}</h4>
                <p className={styles.categoryDesc}>{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className={styles.partnersSection}>
        <div className="container">
          <div className="section-heading">
            <span className="overline">Our Partners</span>
            <h2>Joined Hands With Top Manufacturers</h2>
          </div>
          <div className={styles.logoCarouselWrap}>
            <div className={styles.logoCarousel}>
              {[...PARTNER_LOGOS, ...PARTNER_LOGOS].map((logo, i) => (
                <div key={`${logo.name}-${i}`} className={styles.logoItem}>
                  <Image
                    src={logo.src}
                    alt={logo.name}
                    width={120}
                    height={60}
                    className={styles.logoImg}
                    style={{ height: 'auto' }}
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className={`section ${styles.aboutSection}`}>
        <div className="container">
          <div className={styles.aboutGrid}>
            <div className={styles.aboutContent}>
              <span className="overline" style={{ color: 'var(--color-navy-light)' }}>Who We Are</span>
              <h2 className={styles.aboutTitle}>Your Trusted Partner for Quality Materials</h2>
              <p className={styles.aboutText}>
                Sri Vinayaga Traders is a leading importer and distributor of high-quality
                construction materials, serving Tamil Nadu since 1982. We partner with India&apos;s
                top manufacturers to deliver premium TMT bars, cement, steel sheets, pipes, and more.
              </p>
              <p className={styles.aboutText}>
                With decades of industry expertise, we serve construction professionals, contractors,
                and retailers with reliability and trust.
              </p>
              <Link href="/about" className="btn btn-primary">
                Learn More About Us
              </Link>
            </div>
            <div className={styles.aboutFeatures}>
              {[
                { icon: '✅', title: 'Quality Assured', desc: 'All products sourced from certified manufacturers' },
                { icon: '🚚', title: 'Reliable Delivery', desc: 'Timely delivery across Tamil Nadu' },
                { icon: '💰', title: 'Competitive Pricing', desc: 'Best prices without compromising quality' },
                { icon: '🤝', title: 'Expert Guidance', desc: '40+ years of domain expertise' },
              ].map(f => (
                <div key={f.title} className={styles.featureItem}>
                  <span className={styles.featureIcon}>{f.icon}</span>
                  <div>
                    <h4 className={styles.featureTitle}>{f.title}</h4>
                    <p className={styles.featureDesc}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Ready to Order? Let&apos;s Talk.</h2>
            <p className={styles.ctaDesc}>Contact us for bulk pricing, delivery scheduling, and expert material recommendations.</p>
            <div className={styles.ctaBtns}>
              <Link href="/contact" className="btn btn-primary btn-lg">Contact Us</Link>
              <Link href="/booking" className={`btn btn-lg ${styles.ctaBtnOutline}`}>Book a Delivery</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
