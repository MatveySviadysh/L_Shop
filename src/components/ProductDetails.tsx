import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Truck, Calendar, MapPin, XCircle, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailsProps {
  onAddToCart: (product: Product) => void;
}

export default function ProductDetails({ onAddToCart }: ProductDetailsProps) {
  const params = useParams();
  const id = params?.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${id}`);
        if (res.ok) {
          const found = await res.json();
          setProduct(found);
          setActiveImage(found.images.preview);
        }
      } catch (err) {
        console.error('Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-48 bg-slate-200 rounded-lg"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-slate-200 rounded-3xl"></div>
            <div className="space-y-6">
              <div className="h-10 w-3/4 bg-slate-200 rounded-lg"></div>
              <div className="h-6 w-1/4 bg-slate-200 rounded-lg"></div>
              <div className="h-32 w-full bg-slate-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Товар не найден</h2>
        <Link href="/" className="text-indigo-600 font-medium hover:underline flex items-center justify-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Назад к товарам
        </Link>
      </div>
    );
  }

  const discountedPrice = product.discount 
    ? (product.price * (1 - product.discount / 100)).toFixed(2) 
    : product.price.toFixed(2);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <nav className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/" className="hover:text-indigo-600 transition-colors">Товары</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-slate-900 font-medium truncate">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images Section */}
        <div className="space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden bg-white border border-black/5 shadow-sm">
            <img 
              src={activeImage} 
              alt={product.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          {product.images.gallery && product.images.gallery.length > 0 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              <button 
                onClick={() => setActiveImage(product.images.preview)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${activeImage === product.images.preview ? 'border-indigo-600 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`}
              >
                <img src={product.images.preview} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
              {product.images.gallery.map((img, i) => (
                <button 
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${activeImage === img ? 'border-indigo-600 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {product.categories.map((cat, i) => (
                <span key={i} className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-lg">
                  {cat}
                </span>
              ))}
            </div>
            <h1 className="text-4xl font-bold text-slate-900 leading-tight">{product.title}</h1>
            
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-slate-900">${discountedPrice}</span>
                {product.discount && (
                  <div className="flex items-center gap-2">
                    <span className="text-lg text-slate-400 line-through">${product.price.toFixed(2)}</span>
                    <span className="text-sm font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-lg">
                      Скидка {product.discount}%
                    </span>
                  </div>
                )}
              </div>
              <div className="h-10 w-px bg-slate-200"></div>
              <div className="flex items-center gap-2">
                {product.isAvailable ? (
                  <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5" />
                    В наличии
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-red-500 font-bold text-sm">
                    <XCircle className="w-5 h-5" />
                    Нет в наличии
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-sm">Описание</h3>
            <p className="text-slate-600 leading-relaxed">{product.description}</p>
          </div>

          {product.delivery && (
            <div className="bg-slate-50 rounded-2xl p-6 space-y-4 border border-slate-100">
              <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs flex items-center gap-2">
                <Truck className="w-4 h-4" />
                Информация о доставке
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <MapPin className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Откуда</p>
                    <p className="text-sm font-medium text-slate-900">{product.delivery.startTown.town}, {product.delivery.startTown.country}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Ближайшая доставка</p>
                    <p className="text-sm font-medium text-slate-900">{new Date(product.delivery.earlyDate).toLocaleDateString('ru-RU')}</p>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                <span className="text-sm text-slate-500">Стоимость доставки</span>
                <span className="font-bold text-slate-900">${product.delivery.price.toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className="pt-6">
            <button
              onClick={() => onAddToCart(product)}
              disabled={!product.isAvailable}
              className="w-full sm:w-auto px-12 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-200 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              В корзину
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
