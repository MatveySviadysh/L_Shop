import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUsers, saveUsers } from '@/lib/db';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session')?.value;

  if (!sessionId) {
    return NextResponse.json({ message: 'Не авторизован' }, { status: 401 });
  }

  const { product } = await request.json();
  const users = getUsers();
  const userIndex = users.findIndex((u: any) => u.id === sessionId);

  if (userIndex === -1) {
    return NextResponse.json({ message: 'Пользователь не найден' }, { status: 401 });
  }

  users[userIndex].cart.push(product);
  saveUsers(users);

  return NextResponse.json({ message: 'Добавлено в корзину', cart: users[userIndex].cart });
}
