'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Product } from '@/lib/types';
import ProductForm from '@/components/ProductForm';

export default function EditProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then(r => r.json())
      .then(d => d.success && setProduct(d.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [params.id]);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <Link href="/admin/products" style={{ color: 'var(--color-gray-500)', textDecoration: 'none' }}>
          ← Products
        </Link>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-gray-900)' }}>
          Edit Product
        </h1>
      </div>

      {loading ? (
        <div className="loading-center" style={{ minHeight: 200 }}>
          <div className="spinner" />
        </div>
      ) : product ? (
        <ProductForm mode="edit" product={product} />
      ) : (
        <div className="alert alert-error">Product not found.</div>
      )}
    </div>
  );
}
