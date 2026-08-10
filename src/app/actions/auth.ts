'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import jwt from 'jsonwebtoken';

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'development-secret';
const COOKIE_NAME = 'admin_session';

export async function loginAction(formData: FormData) {
  const password = formData.get('password') as string;

  if (password !== ADMIN_SECRET) {
    return { error: 'Invalid password' };
  }

  // Create a secure token
  const token = jwt.sign({ admin: true }, ADMIN_SECRET, { expiresIn: '7d' });

  // Set the HTTP-only cookie
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });

  revalidatePath('/', 'layout');
  redirect('/admin');
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect('/login');
}

export async function verifyAuthAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return false;

  try {
    jwt.verify(token, ADMIN_SECRET);
    return true;
  } catch (error) {
    return false;
  }
}
