'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AuthForm from '../components/AuthForm';
import ProductList from '../components/ProductList';
import UserProfile from '../components/UserProfile';
import Toast from '../components/Toast';
import { ShoppingBag } from 'lucide-react';
import { User, Product, Address } from '../types';
import { AnimatePresence } from 'motion/react';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  };

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
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

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  };

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
      }
    } catch (err) {
      console.error('Не удалось добавить в корзину');
    }
  };

  const handleRemoveFromCart = async (index: number) => {
    if (!user) return;
    try {
      const res = await fetch('/api/auth/cart/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ index })
      });
      if (res.ok) {
        const data = await res.json();
        setUser({ ...user, cart: data.cart });
      }
    } catch (err) {
      console.error('Не удалось удалить из корзины');
    }
  };

  const handleClearCart = async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/auth/cart/clear', {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        setUser({ ...user, cart: data.cart });
      }
    } catch (err) {
      console.error('Не удалось очистить корзину');
    }
  };

  const handleCheckout = async (address: Address) => {
    if (!user) return;

    try {
      const res = await fetch('/api/auth/order/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address })
      });
      if (res.ok) {
        const data = await res.json();
        setUser({ ...user, cart: data.cart, deliveries: data.deliveries });
        showToast('Заказ успешно оформлен!', 'success');
      }
    } catch (err) {
      console.error('Не удалось оформить заказ');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

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
        <div className="space-y-8">
          {!user ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-5xl font-bold text-slate-900 leading-tight">
                  Ваши любимые товары, <br />
                  <span className="text-indigo-600">с быстрой доставкой.</span>
                </h1>
                <p className="text-lg text-slate-600 max-w-lg">
                  Присоединяйтесь к тысячам довольных клиентов и получите доступ к эксклюзивным предложениям, быстрой доставке и персонализированному шопингу.
                </p>
                <div className="flex gap-4">
                  <div className="flex -space-x-2">
                    {[...Array(4)].map((_, i) => (
                      <img
                        key={i}
                        className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
                        src={`https://picsum.photos/seed/user${i}/100/100`}
                        alt=""
                      />
                    ))}
                  </div>
                  <div className="text-sm">
                    <span className="block font-bold text-slate-900">10k+ пользователей</span>
                    <span className="block text-slate-500">Доверяют нашей платформе</span>
                  </div>
                </div>
              </div>
              <AuthForm onSuccess={(user) => setUser(user)} />
            </div>
          ) : (
            <UserProfile 
              user={user} 
              onLogout={handleLogout} 
              onCheckout={handleCheckout} 
              onRemoveFromCart={handleRemoveFromCart}
              onClearCart={handleClearCart}
            />
          )}

          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Рекомендуемые товары</h2>
              <div className="h-px flex-1 bg-slate-200 mx-8 hidden sm:block"></div>
            </div>
            <ProductList onAddToCart={handleAddToCart} />
          </section>
        </div>
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
