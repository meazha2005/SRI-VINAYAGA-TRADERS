'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Product, Category } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/components/CartProvider';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const { addItem } = useCart();
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeCategory = searchParams.get('category') || 'all';

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  // Fetch categories
  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(d => d.success && setCategories(d.data))
      .catch(console.error);
  }, []);

  // Fetch products
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (activeCategory !== 'all') params.set('category', activeCategory);
    if (debouncedSearch) params.set('search', debouncedSearch);

    fetch(`/api/products?${params}`)
      .then(r => r.json())
      .then(d => d.success && setProducts(d.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeCategory, debouncedSearch]);

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

  const setCategory = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === 'all') params.delete('category');
    else params.set('category', slug);
    router.push(`/products?${params}`);
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <h1>Our Product Range</h1>
          <p>High-quality construction materials sourced from top manufacturers</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Search */}
          <div className={styles.searchWrap}>
            <div className={styles.searchBox}>
              <svg className={styles.searchIcon} width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search products, brands..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className={styles.searchInput}
                id="productSearch"
              />
              {search && (
                <button className={styles.clearSearch} onClick={() => setSearch('')}>✕</button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className={styles.filtersWrap}>
            {/* Desktop */}
            <div className={styles.filterButtons}>
              <button
                className={`${styles.filterBtn} ${activeCategory === 'all' ? styles.active : ''}`}
                onClick={() => setCategory('all')}
              >
                All Products
              </button>
              {categories.map(cat => (
                <button
                  key={cat.slug}
                  className={`${styles.filterBtn} ${activeCategory === cat.slug ? styles.active : ''}`}
                  onClick={() => setCategory(cat.slug)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            {/* Mobile select */}
            <select
              className={`form-control ${styles.mobileSelect}`}
              value={activeCategory}
              onChange={e => setCategory(e.target.value)}
              aria-label="Filter by category"
            >
              <option value="all">All Products</option>
              {categories.map(cat => (
                <option key={cat.slug} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Count */}
          {!loading && (
            <p className={styles.resultCount}>
              {products.length} product{products.length !== 1 ? 's' : ''} found
              {activeCategory !== 'all' && ` in "${categories.find(c => c.slug === activeCategory)?.name || activeCategory}"`}
            </p>
          )}

          {/* Grid */}
          {loading ? (
            <div className="loading-center" style={{ minHeight: 300 }}>
              <div className="spinner" />
            </div>
          ) : products.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>📦</div>
              <h3>No products found</h3>
              <p>Try adjusting your search or filter.</p>
              <button onClick={() => { setSearch(''); setCategory('all'); }} className="btn btn-primary">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className={styles.grid}>
              {products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
