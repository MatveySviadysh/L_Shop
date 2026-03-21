import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUsers, saveUsers } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { User } from '@/types';

export async function POST(request: Request) {
  const { name, email, login, phone, password } = await request.json();
  const users = getUsers();

  if (users.find((u: User) => u.login === login || u.email === email)) {
    return NextResponse.json({ message: 'Пользователь уже существует' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    login,
    phone,
    password: hashedPassword,
    cart: [],
    deliveries: []
  };

  users.push(newUser);
  saveUsers(users);

  const cookieStore = await cookies();
  cookieStore.set('session', newUser.id, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 10 * 60 * 1000 
  });

  return NextResponse.json({ message: 'Регистрация прошла успешно', user: { name: newUser.name, login: newUser.login, cart: [], deliveries: [] } });
}
