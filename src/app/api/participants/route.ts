export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { kvGet, kvSet } from '@/lib/storage';
import { Participant } from '@/lib/types';

const KEY = 'prode:participants';

export async function GET() {
  try {
    const participants = await kvGet<Participant[]>(KEY) || [];
    return NextResponse.json(participants);
  } catch (e) {
    console.error('GET /api/participants error:', e);
    return NextResponse.json({ error: 'Error al obtener participantes' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ error: 'Nombre inválido (mínimo 2 caracteres)' }, { status: 400 });
    }

    const clean = name.trim();
    const participants = await kvGet<Participant[]>(KEY) || [];

    if (participants.some(p => p.name.toLowerCase() === clean.toLowerCase())) {
      return NextResponse.json({ error: 'Ya existe ese participante' }, { status: 409 });
    }

    participants.push({ name: clean, addedAt: new Date().toISOString() });
    await kvSet(KEY, participants);

    return NextResponse.json({ ok: true, name: clean });
  } catch (e) {
    console.error('POST /api/participants error:', e);
    return NextResponse.json({ error: 'Error del servidor. Intentá de nuevo.' }, { status: 500 });
  }
}
