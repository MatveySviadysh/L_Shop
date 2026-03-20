import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Truck, Tag } from 'lucide-react';
import { Product } from '../types';

interface ProductListProps {
  onAddToCart: (product: Product) => void;
}

export default function ProductList({ onAddToCart }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products?search=${search}&sort=${sort}`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, sort]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Поиск товаров..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="w-full md:w-48 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="">Сортировка</option>
          <option value="price-asc">Цена: по возрастанию</option>
          <option value="price-desc">Цена: по убыванию</option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse bg-slate-100 rounded-2xl h-80"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden flex flex-col hover:shadow-md transition-shadow group">
              <Link href={`/product/${product.id}`} className="relative aspect-square overflow-hidden">
                <img
                  src={product.images.preview}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                {product.discount && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    -{product.discount}%
                  </div>
                )}
                {!product.isAvailable && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                    <span className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                      Нет в наличии
                    </span>
                  </div>
                )}
              </Link>
              
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex flex-wrap gap-1 mb-2">
                  {product.categories.map((cat, i) => (
                    <span key={i} className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-1.5 py-0.5 rounded">
                      {cat}
                    </span>
                  ))}
                </div>
                
                <Link href={`/product/${product.id}`} className="hover:text-indigo-600 transition-colors">
                  <h3 className="font-bold text-slate-900 mb-1 line-clamp-1">{product.title}</h3>
                </Link>
                <p className="text-xs text-slate-500 line-clamp-2 mb-3 flex-1">{product.description}</p>
                
                {product.delivery && (
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-3">
                    <Truck className="w-3 h-3" />
                    <span>Из {product.delivery.startTown.town} • ${product.delivery.price} дост.</span>
                  </div>
                )}

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-slate-900">
                      ${product.discount ? (product.price * (1 - product.discount / 100)).toFixed(2) : product.price}
                    </span>
                    {product.discount && (
                      <span className="text-xs text-slate-400 line-through">${product.price}</span>
                    )}
                  </div>
                  <button
                    onClick={() => onAddToCart(product)}
                    disabled={!product.isAvailable}
                    className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    В корзину
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && products.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          Товары не найдены.
        </div>
      )}
    </div>
  );
}
