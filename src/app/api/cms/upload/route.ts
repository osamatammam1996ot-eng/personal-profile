import { NextResponse } from 'next/server';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import jwt from 'jsonwebtoken';

const UPLOADS_DIR = join(process.cwd(), 'public', 'uploads');
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-development-only';

// Ensure uploads directory exists inside public/ for Next.js to serve it
if (!existsSync(UPLOADS_DIR)) {
  mkdirSync(UPLOADS_DIR, { recursive: true });
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

export async function POST(request: Request) {
  const user = verifyToken(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
    const safeName = `cms-${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;
    const filepath = join(UPLOADS_DIR, safeName);
    
    writeFileSync(filepath, buffer);
    const publicUrl = `/uploads/${safeName}`;

    return NextResponse.json({ url: publicUrl, filename: safeName });
  } catch (e) {
    console.error('Image upload error:', e);
    return NextResponse.json({ error: 'Image upload failed' }, { status: 500 });
  }
}
