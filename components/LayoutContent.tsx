'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutContentProps {
  children: React.ReactNode;
}

export default function LayoutContent({ children }: LayoutContentProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      {!isAdmin && <Navbar />}
      <main style={!isAdmin ? { paddingTop: 'var(--navbar-height)' } : {}}>
        {children}
      </main>
      {!isAdmin && <Footer />}
    </>
  );
}
