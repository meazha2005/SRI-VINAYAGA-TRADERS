'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Product, Category } from '@/lib/types';
import styles from './ProductForm.module.css';

interface ProductFormProps {
  product?: Product;
  mode: 'new' | 'edit';
}

export default function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    category_id: product?.category_id?.toString() || '',
    category_slug: product?.category_slug || '',
    description: product?.description || '',
    details: product?.details || '',
    price_label: product?.price_label || 'Call for Price',
    availability: product?.availability || 'in_stock',
    brand: product?.brand || '',
    image_url: product?.image_url || '',
    is_featured: product?.is_featured || false,
    sort_order: product?.sort_order?.toString() || '0',
  });
  const [imagePreview, setImagePreview] = useState<string>(product?.image_url || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(d => d.success && setCategories(d.data));
  }, []);

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setForm(prev => {
      const updated = { ...prev, [name]: type === 'checkbox' ? checked : value };
      // Auto-generate slug from name in new mode
      if (name === 'name' && mode === 'new') {
        updated.slug = generateSlug(value);
      }
      // Auto-set category_slug from category_id
      if (name === 'category_id') {
        const cat = categories.find(c => c.id.toString() === value);
        if (cat) updated.category_slug = cat.slug;
      }
      return updated;
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');
    const fd = new FormData();
    fd.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) {
        setForm(prev => ({ ...prev, image_url: data.url }));
        setImagePreview(data.url);
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      ...form,
      category_id: form.category_id ? parseInt(form.category_id) : null,
      sort_order: parseInt(form.sort_order) || 0,
    };

    try {
      const url = mode === 'new' ? '/api/products' : `/api/products/${product!.id}`;
      const method = mode === 'new' ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        router.push('/admin/products');
        router.refresh();
      } else {
        setError(data.error || 'Failed to save product');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form} id={mode === 'new' ? 'newProductForm' : 'editProductForm'}>
      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>{error}</div>
      )}

      <div className={styles.formGrid}>
        {/* Left column */}
        <div className={styles.mainCol}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Basic Information</h3>

            <div className="form-group">
              <label className="form-label" htmlFor="pName">Product Name *</label>
              <input id="pName" name="name" type="text" className="form-control"
                value={form.name} onChange={handleChange} required placeholder="e.g. iSteel TMT Bars" />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="pSlug">Slug * <span className={styles.hint}>(URL-friendly ID)</span></label>
              <input id="pSlug" name="slug" type="text" className="form-control"
                value={form.slug} onChange={handleChange} required placeholder="e.g. isteel-tmt-bars" />
            </div>

            <div className={styles.rowTwo}>
              <div className="form-group">
                <label className="form-label" htmlFor="pCategory">Category *</label>
                <select id="pCategory" name="category_id" className="form-control"
                  value={form.category_id} onChange={handleChange} required>
                  <option value="">Select Category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="pBrand">Brand</label>
                <input id="pBrand" name="brand" type="text" className="form-control"
                  value={form.brand} onChange={handleChange} placeholder="e.g. Tata Steel" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="pDesc">Description</label>
              <textarea id="pDesc" name="description" className="form-control"
                value={form.description} onChange={handleChange} rows={3}
                placeholder="Brief product description visible to customers..." />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="pDetails">Product Details</label>
              <textarea id="pDetails" name="details" className="form-control"
                value={form.details} onChange={handleChange} rows={5}
                placeholder="Detailed specifications, sizes, grades, certifications..." />
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className={styles.sideCol}>
          {/* Image */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Product Image</h3>
            <div
              className={styles.imageUpload}
              onClick={() => fileRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && fileRef.current?.click()}
            >
              {imagePreview ? (
                <Image src={imagePreview} alt="Preview" fill className={styles.previewImg} sizes="300px" unoptimized />
              ) : (
                <div className={styles.uploadPlaceholder}>
                  <span className={styles.uploadIcon}>📷</span>
                  <p>Click to upload image</p>
                  <p className={styles.uploadHint}>JPEG, PNG, WEBP (max 5MB)</p>
                </div>
              )}
              {uploading && (
                <div className={styles.uploadOverlay}>
                  <div className="spinner" />
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className={styles.hiddenInput}
              id="productImageInput"
              aria-label="Upload product image"
            />
            {imagePreview && (
              <button
                type="button"
                className={`btn btn-sm ${styles.removeImg}`}
                onClick={() => { setImagePreview(''); setForm(p => ({ ...p, image_url: '' })); }}
              >
                Remove Image
              </button>
            )}
          </div>

          {/* Pricing & Status */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Pricing & Status</h3>
            <div className="form-group">
              <label className="form-label" htmlFor="pPrice">Price Label</label>
              <input id="pPrice" name="price_label" type="text" className="form-control"
                value={form.price_label} onChange={handleChange} placeholder="Call for Price" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="pAvail">Availability</label>
              <select id="pAvail" name="availability" className="form-control"
                value={form.availability} onChange={handleChange}>
                <option value="in_stock">In Stock</option>
                <option value="out_of_stock">Out of Stock</option>
                <option value="on_order">On Order</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="pOrder">Sort Order</label>
              <input id="pOrder" name="sort_order" type="number" className="form-control"
                value={form.sort_order} onChange={handleChange} min="0" />
            </div>
            <div className={styles.checkboxGroup}>
              <input
                id="pFeatured"
                name="is_featured"
                type="checkbox"
                className={styles.checkbox}
                checked={!!form.is_featured}
                onChange={handleChange}
              />
              <label htmlFor="pFeatured" className={styles.checkboxLabel}>
                Featured product (shown on homepage)
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.formActions}>
        <button type="button" onClick={() => router.back()} className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary btn-lg" disabled={saving} id="saveProductBtn">
          {saving ? 'Saving...' : mode === 'new' ? 'Create Product' : 'Update Product'}
        </button>
      </div>
    </form>
  );
}
