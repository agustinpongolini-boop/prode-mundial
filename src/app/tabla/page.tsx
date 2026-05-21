'use client';

import { useState, useEffect } from 'react';
import { LeaderboardEntry } from '@/lib/types';
import { MONTO_ENTRADA, MONEDA } from '@/config';
import { MessiHero } from '@/components/MessiHero';

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
      <MessiHero
        title="TABLA DE POSICIONES"
        subtitle={
          <>
            {matchesPlayed} partido{matchesPlayed !== 1 ? 's' : ''} jugado{matchesPlayed !== 1 ? 's' : ''}
            <span className="text-slate-500 mx-2">·</span>
            Se actualiza cada 30s
          </>
        }
      />

      {/* Pozo — Liquid Glass dorado */}
      {!loading && paidCount > 0 && (
        <div className="rounded-2xl glass-sol p-5 mb-6 text-center relative overflow-hidden">
          <p className="text-[#FCD34D] text-xs font-black uppercase tracking-[0.2em] mb-1 drop-shadow">
            Pozo acumulado
          </p>
          <p className="font-['Barlow_Condensed'] font-black text-4xl text-white drop-shadow-[0_2px_8px_rgba(246,180,14,0.4)]">
            {fmtMoney(paidCount * MONTO_ENTRADA)} <span className="text-lg text-slate-300 font-bold">{MONEDA}</span>
          </p>
          <p className="text-[#FCD34D] text-sm font-bold mt-1">El ganador se lleva todo</p>
          <p className="text-slate-400 text-xs mt-1">
            {paidCount} de {totalParticipants} participante{totalParticipants !== 1 ? 's' : ''} pagaron
          </p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-slate-400">Cargando...</div>
      ) : entries.length === 0 ? (
        <div className="text-center py-16 rounded-2xl glass p-8">
          <p className="text-5xl mb-4">🏟️</p>
          <p className="text-slate-300">Todavía no hay participantes</p>
          <a
            href="/jugar"
            className="inline-block mt-4 px-6 py-2 rounded-xl btn-celeste"
          >
            Sumate al prode
          </a>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((e, i) => {
            const isLeader = i === 0 && e.points > 0;
            return (
              <div
                key={e.name}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition-all ${
                  isLeader ? 'glass-celeste' : 'glass'
                }`}
              >
                <span
                  className={`text-lg w-9 h-9 flex items-center justify-center rounded-full font-black ${
                    isLeader
                      ? 'bg-gradient-to-br from-[#FCD34D] to-[#F6B40E] text-[#4a2e00] shadow-[0_4px_12px_rgba(246,180,14,0.4)]'
                      : i < 3
                      ? 'bg-white/10 text-white'
                      : 'text-slate-400'
                  }`}
                >
                  {i < 3 ? medals[i] : i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white truncate">{e.name}</p>
                  <div className="flex gap-3 text-xs mt-0.5">
                    <span className="text-[#8FC1F0]">{e.exact} exacto{e.exact !== 1 ? 's' : ''}</span>
                    <span className="text-[#FCD34D]">{e.correct} ok</span>
                    <span className="text-slate-500">{e.wrong} mal</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-['Barlow_Condensed'] font-black text-2xl text-white leading-none">
                    {e.points}
                  </p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">pts</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8 rounded-2xl glass p-4 text-center">
        <p className="text-sm text-slate-300 mb-1 font-semibold">Sistema de puntos</p>
        <div className="flex justify-center gap-6 text-sm">
          <span><strong className="text-[#8FC1F0]">3</strong> exacto</span>
          <span><strong className="text-[#FCD34D]">1</strong> resultado</span>
          <span><strong className="text-slate-500">0</strong> errado</span>
        </div>
      </div>
    </div>
  );
}
