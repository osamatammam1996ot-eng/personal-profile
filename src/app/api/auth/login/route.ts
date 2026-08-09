import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-development-only';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    if (!password || !ADMIN_PASSWORD_HASH) {
      return NextResponse.json({ error: 'Invalid password or configuration missing' }, { status: 401 });
    }

    const match = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    
    if (match) {
      const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
      return NextResponse.json({ success: true, token });
    } else {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
