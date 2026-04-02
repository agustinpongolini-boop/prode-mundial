'use client';

import { useState, useEffect } from 'react';
import { LeaderboardEntry } from '@/lib/types';
import { MONTO_ENTRADA, MONEDA } from '@/config';

const fmtMoney = (n: number) => `$${n.toLocaleString('es-AR')}`;

export default function TablaPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [matchesPlayed, setMatchesPlayed] = useState(0);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [paidCount, setPaidCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/leaderboard');
      const data = await res.json();
      setEntries(data.leaderboard);
      setMatchesPlayed(data.matchesPlayed);
      setTotalParticipants(data.totalParticipants);
      setPaidCount(data.paidCount);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="font-['Barlow_Condensed'] font-extrabold text-3xl text-white tracking-wide">
          TABLA DE POSICIONES
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          {matchesPlayed} partido{matchesPlayed !== 1 ? 's' : ''} jugado{matchesPlayed !== 1 ? 's' : ''}
          <span className="text-slate-600 mx-2">·</span>
          Se actualiza cada 30s
        </p>
      </div>

      {/* Pozo */}
      {!loading && paidCount > 0 && (
        <div className="rounded-xl bg-gradient-to-r from-emerald-900/40 to-[#0d1b2e] border border-emerald-600/30 p-4 mb-6 text-center">
          <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">Pozo acumulado</p>
          <p className="font-['Barlow_Condensed'] font-extrabold text-3xl text-white">
            {fmtMoney(paidCount * MONTO_ENTRADA)} <span className="text-lg text-slate-400">{MONEDA}</span>
          </p>
          <p className="text-amber-400 text-sm font-semibold mt-1">El ganador se lleva todo</p>
          <p className="text-slate-500 text-xs mt-1">
            {paidCount} de {totalParticipants} participante{totalParticipants !== 1 ? 's' : ''} pagaron
          </p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-slate-500">Cargando...</div>
      ) : entries.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">🏟️</p>
          <p className="text-slate-400">Todavía no hay participantes</p>
          <a href="/jugar" className="inline-block mt-4 px-6 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition-colors">
            Sumate al prode
          </a>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((e, i) => (
            <div
              key={e.name}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 border transition-colors ${
                i === 0 && e.points > 0
                  ? 'bg-[#0d1b2e] border-emerald-600/40'
                  : 'bg-[#0d1b2e] border-[#1a3a5c]'
              }`}
            >
              <span className="text-lg w-8 text-center font-bold text-slate-400">
                {i < 3 ? medals[i] : i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white truncate">{e.name}</p>
                <div className="flex gap-3 text-xs text-slate-500 mt-0.5">
                  <span className="text-emerald-400">{e.exact} exacto{e.exact !== 1 ? 's' : ''}</span>
                  <span className="text-amber-400">{e.correct} ok</span>
                  <span>{e.wrong} mal</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-['Barlow_Condensed'] font-extrabold text-2xl text-white">{e.points}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">pts</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 rounded-xl bg-[#0d1b2e] border border-[#1a3a5c] p-4 text-center">
        <p className="text-sm text-slate-400 mb-1">Sistema de puntos</p>
        <div className="flex justify-center gap-6 text-sm">
          <span><strong className="text-emerald-400">3</strong> exacto</span>
          <span><strong className="text-amber-400">1</strong> resultado</span>
          <span><strong className="text-slate-500">0</strong> errado</span>
        </div>
      </div>
    </div>
  );
}
