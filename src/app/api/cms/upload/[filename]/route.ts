import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { del } from '@vercel/blob';

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

    // Attempt to delete from Vercel Blob. 
    // Vercel Blob del() method takes the URL, but if we just have the filename, 
    // it's generally best practice to pass the full URL or the blob url. 
    // For now we will try to pass the filename directly, but ideally the client sends the URL.
    await del(filename);
    
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Image delete error:', e);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
