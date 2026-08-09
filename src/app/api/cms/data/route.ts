import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { kv } from '@vercel/kv';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-development-only';

function verifyToken(request: Request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export async function GET() {
  try {
    const raw = await kv.get('cms_data');
    if (!raw) {
      return NextResponse.json({ data: null });
    }
    // kv.get automatically parses JSON
    return NextResponse.json({ data: raw });
  } catch (e) {
    console.error('CMS GET error:', e);
    return NextResponse.json({ error: 'Failed to retrieve CMS data' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const user = verifyToken(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    body.updatedAt = new Date().toISOString();
    await kv.set('cms_data', body);
    return NextResponse.json({ success: true, updatedAt: body.updatedAt });
  } catch (e) {
    console.error('CMS PUT error:', e);
    return NextResponse.json({ error: 'Failed to save CMS data' }, { status: 500 });
  }
}
