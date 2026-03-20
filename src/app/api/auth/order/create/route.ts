import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUsers, saveUsers } from '@/lib/db';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session')?.value;

  if (!sessionId) {
    return NextResponse.json({ message: 'Не авторизован' }, { status: 401 });
  }

  const { address } = await request.json();
  if (!address) {
    return NextResponse.json({ message: 'Адрес доставки обязателен' }, { status: 400 });
  }

  const users = getUsers();
  const userIndex = users.findIndex((u: any) => u.id === sessionId);

  if (userIndex === -1) {
    return NextResponse.json({ message: 'Пользователь не найден' }, { status: 401 });
  }

  const user = users[userIndex];
  if (user.cart.length === 0) {
    return NextResponse.json({ message: 'Корзина пуста' }, { status: 400 });
  }

  const newDelivery = {
    id: Math.floor(Math.random() * 1000000).toString(),
    items: [...user.cart],
    status: 'pending',
    createdAt: new Date().toISOString(),
    address: address
  };

  user.deliveries.push(newDelivery);
  user.cart = [];
  saveUsers(users);

  return NextResponse.json({ message: 'Заказ создан', deliveries: user.deliveries, cart: user.cart });
}
