'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product, Category } from '@/lib/types';
import styles from './page.module.css';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [deleting, setDeleting] = useState<number | null>(null);

  const fetchProducts = useCallback(async () => {
    const params = new URLSearchParams();
    if (activeCategory !== 'all') params.set('category', activeCategory);
    if (search) params.set('search', search);

    const res = await fetch(`/api/products?${params}`);
    const data = await res.json();
    if (data.success) setProducts(data.data);
  }, [activeCategory, search]);

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(d => d.success && setCategories(d.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchProducts().finally(() => setLoading(false));
  }, [fetchProducts]);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch {
      alert('Failed to delete product');
    } finally {
      setDeleting(null);
    }
  };

  const availMap = {
    in_stock: <span className={`badge badge-success`}>In Stock</span>,
    out_of_stock: <span className={`badge badge-danger`}>Out of Stock</span>,
    on_order: <span className={`badge badge-warning`}>On Order</span>,
  };

  return (
    <div>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Products</h1>
          <p className={styles.pageDesc}>{products.length} product{products.length !== 1 ? 's' : ''} total</p>
        </div>
        <Link href="/admin/products/new" className="btn btn-primary">
          + Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={`form-control ${styles.searchInput}`}
          id="adminProductSearch"
        />
        <select
          className={`form-control ${styles.categorySelect}`}
          value={activeCategory}
          onChange={e => setActiveCategory(e.target.value)}
          aria-label="Filter by category"
        >
          <option value="all">All Categories</option>
          {categories.map(c => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="loading-center" style={{ minHeight: 200 }}>
          <div className="spinner" />
        </div>
      ) : products.length === 0 ? (
        <div className={styles.empty}>
          <p>No products found.</p>
          <Link href="/admin/products/new" className="btn btn-primary">Add First Product</Link>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Availability</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className={styles.row}>
                  <td>
                    <div className={styles.productCell}>
                      <div className={styles.productThumb}>
                        {product.image_url ? (
                          <Image src={product.image_url} alt={product.name} fill className={styles.thumbImg} sizes="48px" unoptimized />
                        ) : (
                          <span className={styles.thumbPlaceholder}>📦</span>
                        )}
                      </div>
                      <div>
                        <p className={styles.productName}>{product.name}</p>
                        <p className={styles.productPrice}>{product.price_label}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-navy">{product.category_slug}</span>
                  </td>
                  <td className={styles.brand}>{product.brand || '—'}</td>
                  <td>{availMap[product.availability]}</td>
                  <td>
                    {product.is_featured ? (
                      <span className="badge badge-success">Yes</span>
                    ) : (
                      <span className="badge badge-gray">No</span>
                    )}
                  </td>
                  <td>
                    <div className={styles.actionBtns}>
                      <Link href={`/products/${product.id}`} target="_blank" className="btn btn-sm btn-secondary">View</Link>
                      <Link href={`/admin/products/${product.id}/edit`} className="btn btn-sm btn-navy-light">Edit</Link>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        disabled={deleting === product.id}
                        className="btn btn-sm btn-danger"
                        id={`deleteProduct-${product.id}`}
                      >
                        {deleting === product.id ? '...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
