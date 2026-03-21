import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUsers } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { User } from '@/types';


export async function POST(request: Request) {
  const { login, password } = await request.json();
  const users = getUsers();

  const user = users.find((u: User) => u.login === login || u.email === login);

  let isMatch = false;
  try {
    isMatch = await bcrypt.compare(password, user?.password || '');
  } catch (e) {
    isMatch = false;
  }

  if (!user || (!isMatch && password !== user.password)) {
    return NextResponse.json({ message: 'Неверные учетные данные' }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set('session', user.id, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 10 * 60 * 1000
  });

  return NextResponse.json({ message: 'Вход выполнен успешно', user: { name: user.name, login: user.login, cart: user.cart, deliveries: user.deliveries } });
}
