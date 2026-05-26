import Link from 'next/link';
import ProductForm from '@/components/ProductForm';

export default function NewProductPage() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <Link href="/admin/products" style={{ color: 'var(--color-gray-500)', textDecoration: 'none' }}>
          ← Products
        </Link>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-gray-900)' }}>
          Add New Product
        </h1>
      </div>
      <ProductForm mode="new" />
    </div>
  );
}
