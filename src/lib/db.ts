import fs from 'fs';
import path from 'path';
import { User } from '@/types';

let usersCache: User[] | null = null;

const USERS_FILE = path.join(process.cwd(), 'src/data/users.json');

export const getUsers = (): User[] => {
  if (usersCache) return usersCache;

  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf-8');
      usersCache = JSON.parse(data);
      return usersCache || [];
    }
  } catch (err) {
    console.error('Failed to read users file, falling back to empty memory store');
  }

  usersCache = [];
  return usersCache;
};

export const saveUsers = (users: User[]) => {
  usersCache = users;

  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (err) {
    console.warn('Disk write failed (expected on Vercel). Data kept in memory.');
  }
};
