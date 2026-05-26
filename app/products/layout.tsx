import type { Metadata } from 'next';
import { Suspense } from 'react';
import ProductsPage from './page';

export const metadata: Metadata = {
  title: 'Products',
  description: 'Browse our complete range of steel and construction materials including TMT bars, cement, roofing sheets, pipes, and more.',
};

export default function ProductsLayout() {
  return (
    <Suspense fallback={
      <div style={{ paddingTop: '72px' }}>
        <div className="page-header">
          <div className="container">
            <h1>Our Product Range</h1>
            <p>Loading...</p>
          </div>
        </div>
        <div className="loading-center section"><div className="spinner" /></div>
      </div>
    }>
      <ProductsPage />
    </Suspense>
  );
}
