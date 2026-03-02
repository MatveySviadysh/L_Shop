import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUsers } from '@/lib/db';

export async function GET() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session')?.value;

  if (!sessionId) {
    return NextResponse.json({ message: 'Не авторизован' }, { status: 401 });
  }

  const users = getUsers();
  const user = users.find((u: any) => u.id === sessionId);

  if (!user) {
    return NextResponse.json({ message: 'Сессия недействительна' }, { status: 401 });
  }

  return NextResponse.json({
    name: user.name,
    login: user.login,
    cart: user.cart,
    deliveries: user.deliveries
  });
}
