import { NextResponse } from 'next/server';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import jwt from 'jsonwebtoken';

const UPLOADS_DIR = join(process.cwd(), 'public', 'uploads');
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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const user = verifyToken(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const filename = (await params).filename;
    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    const filepath = join(UPLOADS_DIR, filename);
    if (existsSync(filepath)) {
      unlinkSync(filepath);
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Image delete error:', e);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
