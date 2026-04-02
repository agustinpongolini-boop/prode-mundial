export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { kvGet, kvSet } from '@/lib/storage';
import { Predictions } from '@/lib/types';

function key(name: string) {
  return `prode:pred:${name}`;
}

export async function GET(_req: NextRequest, { params }: { params: { name: string } }) {
  try {
    const preds = await kvGet<Predictions>(key(params.name)) || {};
    return NextResponse.json(preds);
  } catch (e) {
    console.error(`GET /api/predictions/${params.name} error:`, e);
    return NextResponse.json({}, { status: 200 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { name: string } }) {
  try {
    const body: Predictions = await req.json();
    const existing = await kvGet<Predictions>(key(params.name)) || {};
    const merged = { ...existing, ...body };
    await kvSet(key(params.name), merged);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(`POST /api/predictions/${params.name} error:`, e);
    return NextResponse.json({ error: 'Error al guardar predicción' }, { status: 500 });
  }
}
