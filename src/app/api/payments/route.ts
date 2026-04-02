export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { kvGet, kvSet } from '@/lib/storage';
import { Participant } from '@/lib/types';

const KEY = 'prode:participants';

export async function GET() {
  try {
    const participants = await kvGet<Participant[]>(KEY) || [];
    const paid = participants.filter(p => p.paid).length;
    return NextResponse.json({ total: participants.length, paid });
  } catch (e) {
    console.error('GET /api/payments error:', e);
    return NextResponse.json({ total: 0, paid: 0 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const code = req.headers.get('x-admin-code');
    if (code !== 'mundial2026') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { name, paid } = await req.json();
    const participants = await kvGet<Participant[]>(KEY) || [];
    const idx = participants.findIndex(p => p.name === name);
    if (idx < 0) {
      return NextResponse.json({ error: 'Participante no encontrado' }, { status: 404 });
    }

    participants[idx].paid = !!paid;
    await kvSet(KEY, participants);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('POST /api/payments error:', e);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
