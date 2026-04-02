export const dynamic = 'force-dynamic';

import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';
import { Participant, Predictions, Results } from '@/lib/types';
import { calculateLeaderboard } from '@/lib/scoring';

export async function GET() {
  const [participants, results] = await Promise.all([
    kv.get<Participant[]>('prode:participants'),
    kv.get<Results>('prode:results'),
  ]);

  const parts = participants || [];
  const res = results || {};

  const allPredictions: Record<string, Predictions> = {};
  await Promise.all(
    parts.map(async (p) => {
      const preds = await kv.get<Predictions>(`prode:pred:${p.name}`);
      allPredictions[p.name] = preds || {};
    })
  );

  const leaderboard = calculateLeaderboard(parts, allPredictions, res);
  return NextResponse.json({ leaderboard, matchesPlayed: Object.keys(res).length });
}
