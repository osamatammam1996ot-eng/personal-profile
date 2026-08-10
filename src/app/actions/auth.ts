"use server";

import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-development-only';

export async function loginAction(password: string) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  if (!password || !adminPassword) {
    return { error: 'Invalid password or configuration missing (ADMIN_PASSWORD)' };
  }

  if (password !== adminPassword) {
    return { error: 'Invalid password' };
  }

  const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
  
  // Set secure HTTP-only cookie
  (await cookies()).set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60, // 24 hours
    path: '/',
  });

  return { success: true };
}

export async function logoutAction() {
  (await cookies()).delete('admin_token');
  return { success: true };
}

export async function verifyAuthAction() {
  const token = (await cookies()).get('admin_token')?.value;
  if (!token) return false;

  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch (err) {
    return false;
  }
}
