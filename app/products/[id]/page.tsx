'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { useCart } from '@/components/CartProvider';
import styles from './page.module.css';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const loadProduct = useCallback(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/products/${params.id}`)
      .then(async r => {
        if (r.status === 404) {
          router.push('/products');
          return;
        }
        const d = await r.json();
        if (d.success) {
          setProduct(d.data);
        } else {
          setError(d.error || 'Failed to load product');
        }
      })
      .catch(() => {
        setError('A network error occurred. Please check your connection and try again.');
      })
      .finally(() => setLoading(false));
  }, [params.id, router]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    addItem({
      product_id: product.id,
      name: product.name,
      image_url: product.image_url,
      category_slug: product.category_slug,
      quantity,
      price_label: product.price_label,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }, [product, quantity, addItem]);

  if (loading) return (
    <div className="loading-center section" style={{ minHeight: '60vh' }}>
      <div className="spinner" />
    </div>
  );

  if (error) return (
    <div className="section text-center container" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h2 className="text-navy" style={{ marginBottom: '1rem' }}>Connection Timeout</h2>
      <p style={{ color: 'var(--color-gray-600)', marginBottom: '2rem', maxWidth: '440px' }}>
        We had trouble connecting to our product database. This is usually temporary. Please try reloading.
      </p>
      <button onClick={loadProduct} className="btn btn-primary btn-lg">
        🔄 Retry Connection
      </button>
    </div>
  );

  if (!product) return null;

  const availabilityMap = {
    in_stock: { label: 'In Stock', cls: styles.inStock },
    out_of_stock: { label: 'Out of Stock', cls: styles.outOfStock },
    on_order: { label: 'On Order', cls: styles.onOrder },
  };

  const avail = availabilityMap[product.availability];

  return (
    <div>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <div className="container">
          <nav aria-label="Breadcrumb">
            <Link href="/" className={styles.breadLink}>Home</Link>
            <span className={styles.sep}>/</span>
            <Link href="/products" className={styles.breadLink}>Products</Link>
            <span className={styles.sep}>/</span>
            <span className={styles.breadCurrent}>{product.name}</span>
          </nav>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className={styles.productLayout}>
            {/* Image */}
            <div className={styles.imageSection}>
              <div className={styles.imageWrap}>
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className={styles.image}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    unoptimized
                  />
                ) : (
                  <div className={styles.imagePlaceholder}>
                    <svg width="80" height="80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.75}>
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </svg>
                    <p>No image available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className={styles.infoSection}>
              <div className={styles.categoryTag}>
                <Link href={`/products?category=${product.category_slug}`} className={styles.catLink}>
                  {product.category_slug.toUpperCase()}
                </Link>
              </div>
              <h1 className={styles.productName}>{product.name}</h1>
              {product.brand && <p className={styles.brand}>Brand: <strong>{product.brand}</strong></p>}

              <div className={styles.availability}>
                <span className={`${styles.availBadge} ${avail.cls}`}>{avail.label}</span>
              </div>

              <div className={styles.priceBox}>
                <p className={styles.priceLabel}>Price</p>
                <p className={styles.price}>{product.price_label}</p>
              </div>

              {product.description && (
                <div className={styles.description}>
                  <h3>About this Product</h3>
                  <p>{product.description}</p>
                </div>
              )}

              {product.details && (
                <div className={styles.details}>
                  <h3>Product Details</h3>
                  <p style={{ whiteSpace: 'pre-line' }}>{product.details}</p>
                </div>
              )}

              {product.availability === 'in_stock' && (
                <div className={styles.purchaseSection}>
                  <div className={styles.quantityWrap}>
                    <label className={styles.qtyLabel}>Quantity</label>
                    <div className={styles.qtyControl}>
                      <button
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className={styles.qtyBtn}
                        aria-label="Decrease quantity"
                      >−</button>
                      <span className={styles.qtyValue}>{quantity}</span>
                      <button
                        onClick={() => setQuantity(q => q + 1)}
                        className={styles.qtyBtn}
                        aria-label="Increase quantity"
                      >+</button>
                    </div>
                  </div>

                  <div className={styles.ctaButtons}>
                    <button
                      onClick={handleAddToCart}
                      className={`btn btn-primary btn-lg ${styles.addToCartBtn} ${added ? styles.added : ''}`}
                    >
                      {added ? '✓ Added to Cart' : 'Add to Cart'}
                    </button>
                    <Link href="/cart" className="btn btn-secondary btn-lg">
                      View Cart
                    </Link>
                  </div>
                </div>
              )}

              {product.availability !== 'in_stock' && (
                <div className={styles.enquiryNote}>
                  <p>This product is currently {avail.label.toLowerCase()}.</p>
                  <Link href="/contact" className="btn btn-primary btn-lg">
                    Contact Us for Availability
                  </Link>
                </div>
              )}

              <div className={styles.helpBox}>
                <p>📞 Need help? Call us at <a href="tel:+919710631234"><strong>+91 97106 31234</strong></a></p>
              </div>
            </div>
          </div>

          {/* Back */}
          <div className={styles.backWrap}>
            <Link href="/products" className="btn btn-secondary">
              ← Back to Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
