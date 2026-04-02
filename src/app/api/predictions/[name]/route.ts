export const dynamic = 'force-dynamic';

import { kv } from '@vercel/kv';
import { NextRequest, NextResponse } from 'next/server';
import { Predictions } from '@/lib/types';

function key(name: string) {
  return `prode:pred:${name}`;
}

export async function GET(_req: NextRequest, { params }: { params: { name: string } }) {
  const preds: Predictions = await kv.get(key(params.name)) || {};
  return NextResponse.json(preds);
}

export async function POST(req: NextRequest, { params }: { params: { name: string } }) {
  const body: Predictions = await req.json();
  const existing: Predictions = await kv.get(key(params.name)) || {};
  const merged = { ...existing, ...body };
  await kv.set(key(params.name), merged);
  return NextResponse.json({ ok: true });
}
