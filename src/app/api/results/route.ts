export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { kvGet, kvSet } from '@/lib/storage';
import { Results } from '@/lib/types';

const KEY = 'prode:results';

export async function GET() {
  try {
    const results = await kvGet<Results>(KEY) || {};
    return NextResponse.json(results);
  } catch (e) {
    console.error('GET /api/results error:', e);
    return NextResponse.json({}, { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const code = req.headers.get('x-admin-code');
    if (code !== 'mundial2026') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body: Results = await req.json();
    const existing = await kvGet<Results>(KEY) || {};
    const merged = { ...existing, ...body };
    await kvSet(KEY, merged);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('POST /api/results error:', e);
    return NextResponse.json({ error: 'Error al guardar resultado' }, { status: 500 });
  }
}
