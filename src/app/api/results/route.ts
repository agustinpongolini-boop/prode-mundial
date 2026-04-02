export const dynamic = 'force-dynamic';

import { kv } from '@vercel/kv';
import { NextRequest, NextResponse } from 'next/server';
import { Results } from '@/lib/types';

const KEY = 'prode:results';

export async function GET() {
  const results: Results = await kv.get(KEY) || {};
  return NextResponse.json(results);
}

export async function POST(req: NextRequest) {
  const code = req.headers.get('x-admin-code');
  if (code !== 'mundial2026') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const body: Results = await req.json();
  const existing: Results = await kv.get(KEY) || {};
  const merged = { ...existing, ...body };
  await kv.set(KEY, merged);
  return NextResponse.json({ ok: true });
}
