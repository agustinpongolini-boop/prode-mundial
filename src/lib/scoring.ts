import { Score, Results, Predictions, LeaderboardEntry } from './types';

function getOutcome(s: Score): 'home' | 'draw' | 'away' {
  if (s.home > s.away) return 'home';
  if (s.home < s.away) return 'away';
  return 'draw';
}

export function scoreMatch(pred: Score | undefined, result: Score | undefined): 0 | 1 | 3 {
  if (!pred || !result) return 0;
  if (pred.home === result.home && pred.away === result.away) return 3;
  if (getOutcome(pred) === getOutcome(result)) return 1;
  return 0;
}

export function calculateLeaderboard(
  participants: { name: string }[],
  allPredictions: Record<string, Predictions>,
  results: Results
): LeaderboardEntry[] {
  const resultIds = Object.keys(results);
  if (resultIds.length === 0) {
    return participants.map(p => ({
      name: p.name, points: 0, exact: 0, correct: 0, wrong: 0, total: 0,
    }));
  }

  return participants.map(p => {
    const preds = allPredictions[p.name] || {};
    let points = 0, exact = 0, correct = 0, wrong = 0;

    for (const matchId of resultIds) {
      const s = scoreMatch(preds[matchId], results[matchId]);
      points += s;
      if (s === 3) exact++;
      else if (s === 1) correct++;
      else wrong++;
    }

    return { name: p.name, points, exact, correct, wrong, total: resultIds.length };
  }).sort((a, b) => b.points - a.points || b.exact - a.exact);
}
