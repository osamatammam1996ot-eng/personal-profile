'use server';

import { timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import jwt from 'jsonwebtoken';

const COOKIE_NAME = 'admin_session';

// Only used by `next dev` on your own machine, never on Vercel.
const DEV_FALLBACK_SECRET = 'development-secret';

/**
 * The admin password is the ADMIN_SECRET env var (Vercel → Settings →
 * Environment Variables). To reset it, change that value and redeploy.
 * Sessions are signed with it, so changing it also logs out every session.
 * If it is missing outside local development, login is disabled — there is
 * deliberately no fallback password.
 */
function getAdminSecret(): string | null {
  const secret = process.env.ADMIN_SECRET;
  if (secret) return secret;
  return process.env.NODE_ENV === 'development' ? DEV_FALLBACK_SECRET : null;
}

function passwordMatches(input: string, secret: string) {
  const a = Buffer.from(input);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function loginAction(formData: FormData) {
  const secret = getAdminSecret();
  if (!secret) {
    return { error: 'Admin login is not configured. See "Forgot password?" below.' };
  }

  const password = formData.get('password');
  if (typeof password !== 'string' || !passwordMatches(password, secret)) {
    return { error: 'Invalid password' };
  }

  // Create a secure token
  const token = jwt.sign({ admin: true }, secret, { expiresIn: '7d' });

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
  // Read cookies first so pages that call this always render per request.
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const secret = getAdminSecret();

  if (!token || !secret) return false;

  try {
    jwt.verify(token, secret);
    return true;
  } catch (error) {
    return false;
  }
}
