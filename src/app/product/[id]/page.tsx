'use client';

import React, { useState, useEffect } from 'react';
import ProductDetails from '../../../components/ProductDetails';
import Toast from '../../../components/Toast';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { User, Product, Address } from '../../../types';
import { AnimatePresence } from 'motion/react';

export default function ProductPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  };

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me'  );
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (err) {
      console.error('Auth check failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleAddToCart = async (product: Product) => {
    if (!user) {
      showToast('Пожалуйста, войдите, чтобы добавить товары в корзину', 'info');
      return;
    }

    try {
      const res = await fetch('/api/auth/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product })
      });
      if (res.ok) {
        const data = await res.json();
        setUser({ ...user, cart: data.cart });
        showToast('Добавлено в корзину!', 'success');
      }
    } catch (err) {
      console.error('Не удалось добавить в корзину');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-xl">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">ShopExpress</span>
          </Link>
          {user && (
            <div className="flex items-center gap-4">
              <span className="hidden sm:block text-sm font-medium text-slate-600">
                Привет, {user.name}
              </span>
              <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-xs uppercase">
                {user.name[0]}
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductDetails onAddToCart={handleAddToCart} />
      </main>

      <footer className="bg-white border-t border-slate-200 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-sm">
          <p>© 2026 ShopExpress. Все права защищены.</p>
        </div>
      </footer>

      <AnimatePresence>
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
