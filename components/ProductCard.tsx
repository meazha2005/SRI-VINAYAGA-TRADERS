import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/types';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

const availabilityMap = {
  in_stock: { label: 'In Stock', cls: 'badge-success' },
  out_of_stock: { label: 'Out of Stock', cls: 'badge-danger' },
  on_order: { label: 'On Order', cls: 'badge-warning' },
};

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const avail = availabilityMap[product.availability] || availabilityMap.in_stock;

  return (
    <div className={styles.card}>
      <div className={styles.imageWrap}>
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={styles.image}
            unoptimized
          />
        ) : (
          <div className={styles.imagePlaceholder}>
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        )}
        <span className={`${styles.badge} badge ${avail.cls}`}>{avail.label}</span>
      </div>

      <div className={styles.body}>
        <h3 className={styles.name}>
          {product.name}
        </h3>
        {product.brand && <p className={styles.brand}>{product.brand}</p>}
        <p className={styles.price}>{product.price_label}</p>

        <div className={styles.actions}>
          {product.availability === 'in_stock' && onAddToCart ? (
            <button
              onClick={() => onAddToCart(product)}
              className={`btn btn-primary btn-sm ${styles.cartBtn}`}
              style={{ width: '100%', gap: '0.5rem' }}
              aria-label={`Add ${product.name} to cart`}
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Add to Cart
            </button>
          ) : (
            <button
              disabled
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', cursor: 'not-allowed', opacity: 0.6 }}
            >
              Unavailable
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
