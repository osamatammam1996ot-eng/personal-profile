import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import jwt from 'jsonwebtoken';

const DATA_DIR = join(process.cwd(), 'server', 'data');
const CMS_FILE = join(DATA_DIR, 'cms.json');
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-development-only';

// Ensure data directory exists
if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}

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
    if (!existsSync(CMS_FILE)) {
      return NextResponse.json({ data: null });
    }
    const raw = readFileSync(CMS_FILE, 'utf-8');
    return NextResponse.json({ data: JSON.parse(raw) });
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
    writeFileSync(CMS_FILE, JSON.stringify(body, null, 2), 'utf-8');
    return NextResponse.json({ success: true, updatedAt: body.updatedAt });
  } catch (e) {
    console.error('CMS PUT error:', e);
    return NextResponse.json({ error: 'Failed to save CMS data' }, { status: 500 });
  }
}
