export const dynamic = 'force-dynamic';

import { kv } from '@vercel/kv';
import { NextRequest, NextResponse } from 'next/server';
import { Participant } from '@/lib/types';

const KEY = 'prode:participants';

export async function GET() {
  const participants: Participant[] = await kv.get(KEY) || [];
  return NextResponse.json(participants);
}

export async function POST(req: NextRequest) {
  const { name } = await req.json();
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return NextResponse.json({ error: 'Nombre inválido' }, { status: 400 });
  }

  const clean = name.trim();
  const participants: Participant[] = await kv.get(KEY) || [];

  if (participants.some(p => p.name.toLowerCase() === clean.toLowerCase())) {
    return NextResponse.json({ error: 'Ya existe ese participante' }, { status: 409 });
  }

  participants.push({ name: clean, addedAt: new Date().toISOString() });
  await kv.set(KEY, participants);

  return NextResponse.json({ ok: true, name: clean });
}
