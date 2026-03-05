import fs from 'fs';
import path from 'path';

// This is a singleton that stays in memory during the server's lifecycle
// On Vercel, this will reset when the serverless function sleeps.
let usersCache: any[] | null = null;

const USERS_FILE = path.join(process.cwd(), 'src/data/users.json');

export const getUsers = (): any[] => {
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

export const saveUsers = (users: any[]) => {
  usersCache = users;
  
  // We try to write to disk for local development, 
  // but we catch the error so it doesn't crash on Vercel
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (err) {
    // On Vercel, this will always fail, but now it won't cause a 500 error
    console.warn('Disk write failed (expected on Vercel). Data kept in memory.');
  }
};
