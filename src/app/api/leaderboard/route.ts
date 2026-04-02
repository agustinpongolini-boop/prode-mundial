export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { kvGet } from '@/lib/storage';
import { Participant, Predictions, Results } from '@/lib/types';
import { calculateLeaderboard } from '@/lib/scoring';

export async function GET() {
  try {
    const [participants, results] = await Promise.all([
      kvGet<Participant[]>('prode:participants'),
      kvGet<Results>('prode:results'),
    ]);

    const parts = participants || [];
    const res = results || {};

    const allPredictions: Record<string, Predictions> = {};
    await Promise.all(
      parts.map(async (p) => {
        const preds = await kvGet<Predictions>(`prode:pred:${p.name}`);
        allPredictions[p.name] = preds || {};
      })
    );

    const leaderboard = calculateLeaderboard(parts, allPredictions, res);
    return NextResponse.json({ leaderboard, matchesPlayed: Object.keys(res).length });
  } catch (e) {
    console.error('GET /api/leaderboard error:', e);
    return NextResponse.json({ leaderboard: [], matchesPlayed: 0 });
  }
}
