import React, { useState } from 'react';
import { ShoppingCart, Truck, LogOut, Package, Calendar, MapPin, ChevronDown, ChevronUp, Trash2, XCircle } from 'lucide-react';
import { User, Product, Address } from '../types';
import DeliveryForm from './DeliveryForm';

interface UserProfileProps {
  user: User;
  onLogout: () => void;
  onCheckout: (address: Address) => void;
  onRemoveFromCart: (index: number) => void;
  onClearCart: () => void;
}

export default function UserProfile({ user, onLogout, onCheckout, onRemoveFromCart, onClearCart }: UserProfileProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [expandedDelivery, setExpandedDelivery] = useState<string | null>(null);

  const cartTotal = user.cart.reduce((sum, item) => {
    const price = item.discount ? item.price * (1 - item.discount / 100) : item.price;
    return sum + price;
  }, 0);

  const handleFormSubmit = (address: Address) => {
    onCheckout(address);
    setIsCheckingOut(false);
  };

  const toggleDelivery = (id: string) => {
    setExpandedDelivery(expandedDelivery === id ? null : id);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-6 space-y-8">
      {isCheckingOut && (
        <DeliveryForm 
          totalAmount={cartTotal} 
          onCancel={() => setIsCheckingOut(false)} 
          onSubmit={handleFormSubmit} 
        />
      )}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Добро пожаловать, {user.name}!</h2>
          <p className="text-sm text-slate-500">Вы вошли как @{user.login}</p>
        </div>
        <button
          onClick={onLogout}
          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
          title="Выйти"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <ShoppingCart className="w-5 h-5" />
              <h3>Ваша корзина</h3>
            </div>
            <div className="flex items-center gap-3">
              {user.cart.length > 0 && (
                <>
                  <button
                    onClick={onClearCart}
                    className="flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
                    title="Очистить корзину"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Очистить
                  </button>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                    {user.cart.length} товаров
                  </span>
                </>
              )}
            </div>
          </div>
          
          <div className="bg-slate-50 rounded-2xl p-4 min-h-[120px] flex flex-col">
            {user.cart.length > 0 ? (
              <>
                <ul className="space-y-3 mb-4 flex-1">
                  {user.cart.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 group">
                      <img src={item.images.preview} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">{item.title}</p>
                        <p className="text-xs text-slate-500">
                          ${item.discount ? (item.price * (1 - item.discount / 100)).toFixed(2) : item.price}
                        </p>
                      </div>
                      <button
                        onClick={() => onRemoveFromCart(i)}
                        className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        title="Удалить"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Итого</p>
                    <p className="text-xl font-bold text-slate-900">${cartTotal.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => setIsCheckingOut(true)}
                    className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                  >
                    Оформить
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 py-8">
                <Package className="w-8 h-8 mb-2 opacity-20" />
                <p className="text-sm italic">Корзина пуста</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            <Truck className="w-5 h-5" />
            <h3>Доставки</h3>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4 min-h-[120px]">
            {user.deliveries && user.deliveries.length > 0 ? (
              <div className="space-y-4">
                {user.deliveries.map((delivery: any, i: number) => (
                  <div key={i} className="bg-white rounded-xl border border-black/5 shadow-sm overflow-hidden">
                    <button 
                      onClick={() => toggleDelivery(delivery.id)}
                      className="w-full p-4 flex flex-col space-y-3 text-left hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Заказ #{delivery.id}</span>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full uppercase">
                            {delivery.status === 'pending' ? 'В обработке' : delivery.status}
                          </span>
                          {expandedDelivery === delivery.id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(delivery.createdAt).toLocaleDateString('ru-RU')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="w-3 h-3" />
                          <span>{delivery.items.length} товаров</span>
                        </div>
                      </div>
                    </button>
                    
                    {expandedDelivery === delivery.id && (
                      <div className="px-4 pb-4 pt-2 border-t border-slate-50 space-y-4 animate-in slide-in-from-top-2 duration-200">
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Адрес доставки</p>
                          <div className="flex items-start gap-2 text-sm text-slate-700">
                            <MapPin className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                            <p>{delivery.address.country}, г. {delivery.address.town}, ул. {delivery.address.street}, д. {delivery.address.houseNumber}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Товары</p>
                          <ul className="space-y-2">
                            {delivery.items.map((item: Product, j: number) => (
                              <li key={j} className="flex items-center gap-3 text-sm">
                                <img src={item.images.preview} alt="" className="w-8 h-8 rounded object-cover" />
                                <span className="flex-1 truncate text-slate-700">{item.title}</span>
                                <span className="font-bold text-slate-900">${item.price}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                          <span className="text-sm font-bold text-slate-900">Итоговая сумма</span>
                          <span className="text-lg font-bold text-indigo-600">
                            ${delivery.items.reduce((s: number, it: Product) => s + (it.discount ? it.price * (1 - it.discount / 100) : it.price), 0).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400 py-8">
                <Truck className="w-8 h-8 mb-2 opacity-20" />
                <p className="text-sm italic">Нет активных доставок</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
