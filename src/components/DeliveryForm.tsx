import React, { useState } from 'react';
import { MapPin, Home, Building2, Globe, ArrowRight, X } from 'lucide-react';
import { Address } from '../types';

interface DeliveryFormProps {
  onSubmit: (address: Address) => void;
  onCancel: () => void;
  totalAmount: number;
}

export default function DeliveryForm({ onSubmit, onCancel, totalAmount }: DeliveryFormProps) {
  const [address, setAddress] = useState<Address>({
    country: '',
    town: '',
    street: '',
    houseNumber: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.country || !address.town || !address.street || !address.houseNumber) {
      alert('Пожалуйста, заполните все данные для доставки');
      return;
    }
    onSubmit(address);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-indigo-600 p-6 text-white relative">
          <button 
            onClick={onCancel}
            className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-xl font-bold mb-1">Детали доставки</h3>
          <p className="text-indigo-100 text-sm">Куда нам отправить ваш заказ?</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-4">
            <div className="relative">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block ml-1">Страна</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="напр. Россия"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  value={address.country}
                  onChange={(e) => setAddress({ ...address, country: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="relative">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block ml-1">Город</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="напр. Москва"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  value={address.town}
                  onChange={(e) => setAddress({ ...address, town: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block ml-1">Улица</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Ленина"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="relative">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block ml-1">Дом</label>
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="1"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    value={address.houseNumber}
                    onChange={(e) => setAddress({ ...address, houseNumber: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-slate-500">Итого</span>
              <span className="text-xl font-bold text-slate-900">${totalAmount.toFixed(2)}</span>
            </div>
            <button
              type="submit"
              className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group shadow-xl shadow-slate-200"
            >
              Подтвердить заказ
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
