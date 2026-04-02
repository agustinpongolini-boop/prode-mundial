'use client';

import { useState, useCallback } from 'react';
import { GROUPS, ALL_MATCHES } from '@/lib/data';
import { Predictions, Score } from '@/lib/types';

export default function JugarPage() {
  const [name, setName] = useState('');
  const [joined, setJoined] = useState(false);
  const [preds, setPreds] = useState<Predictions>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [activeGroup, setActiveGroup] = useState('A');

  const join = async () => {
    setError('');
    const res = await fetch('/api/participants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim() }),
    });
    if (res.ok) {
      setJoined(true);
      // Load existing predictions
      const predRes = await fetch(`/api/predictions/${encodeURIComponent(name.trim())}`);
      if (predRes.ok) setPreds(await predRes.json());
    } else if (res.status === 409) {
      // Already exists, just load predictions
      setJoined(true);
      const predRes = await fetch(`/api/predictions/${encodeURIComponent(name.trim())}`);
      if (predRes.ok) setPreds(await predRes.json());
    } else {
      const data = await res.json();
      setError(data.error || 'Error');
    }
  };

  const savePred = useCallback(async (matchId: string, score: Score) => {
    setSaving(matchId);
    setPreds(prev => ({ ...prev, [matchId]: score }));
    await fetch(`/api/predictions/${encodeURIComponent(name.trim())}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [matchId]: score }),
    });
    setSaving(null);
  }, [name]);

  const groupMatches = ALL_MATCHES.filter(m => m.group === activeGroup);
  const totalMatches = ALL_MATCHES.length;
  const filledCount = Object.keys(preds).length;

  if (!joined) {
    return (
      <div className="flex flex-col items-center pt-12">
        <span className="text-6xl mb-4">⚽</span>
        <h1 className="font-['Barlow_Condensed'] font-extrabold text-3xl text-white tracking-wide mb-2">
          SUMATE AL PRODE
        </h1>
        <p className="text-slate-400 text-sm mb-8 text-center">
          Ingresá tu nombre y cargá tus predicciones
        </p>
        <div className="w-full max-w-xs space-y-3">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && name.trim().length >= 2 && join()}
            placeholder="Tu nombre"
            className="w-full bg-[#0d1b2e] border border-[#1a3a5c] rounded-xl px-4 py-3 text-white text-center font-semibold text-lg outline-none focus:border-emerald-500 transition-colors"
          />
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button
            onClick={join}
            disabled={name.trim().length < 2}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded-xl text-lg transition-colors"
          >
            Entrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-['Barlow_Condensed'] font-extrabold text-2xl text-white">
            {name.trim()}
          </h1>
          <p className="text-slate-500 text-xs">
            {filledCount}/{totalMatches} partidos cargados
          </p>
        </div>
        <div className="w-16 h-16 relative">
          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15" fill="none" stroke="#1a3a5c" strokeWidth="3" />
            <circle cx="18" cy="18" r="15" fill="none" stroke="#16a34a" strokeWidth="3"
              strokeDasharray={`${(filledCount / totalMatches) * 94.2} 94.2`}
              strokeLinecap="round" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
            {Math.round((filledCount / totalMatches) * 100)}%
          </span>
        </div>
      </div>

      {/* Group tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4 -mx-4 px-4" style={{ scrollbarWidth: 'none' }}>
        {GROUPS.map(g => (
          <button
            key={g.name}
            onClick={() => setActiveGroup(g.name)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${
              activeGroup === g.name
                ? 'bg-emerald-600 text-white'
                : 'bg-[#0d1b2e] text-slate-400 hover:text-white border border-[#1a3a5c]'
            }`}
          >
            {g.name}
          </button>
        ))}
      </div>

      {/* Group header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="font-['Barlow_Condensed'] font-bold text-lg text-white">GRUPO {activeGroup}</span>
        <div className="flex gap-1">
          {GROUPS.find(g => g.name === activeGroup)?.teams.map(t => (
            <span key={t.code} className="text-lg" title={t.name}>{t.flag}</span>
          ))}
        </div>
      </div>

      {/* Matches */}
      <div className="space-y-2">
        {groupMatches.map(match => {
          const pred = preds[match.id];
          const isSaving = saving === match.id;

          return (
            <div
              key={match.id}
              className={`rounded-xl border p-3 transition-colors ${
                pred ? 'bg-[#0d1b2e] border-emerald-600/30' : 'bg-[#0d1b2e] border-[#1a3a5c]'
              }`}
            >
              <div className="flex items-center gap-2">
                {/* Home */}
                <div className="flex-1 flex items-center gap-2 justify-end">
                  <span className="text-sm font-semibold text-slate-200 truncate">{match.home.name}</span>
                  <span className="text-xl">{match.home.flag}</span>
                </div>

                {/* Score inputs */}
                <div className="flex items-center gap-1 mx-1">
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={pred?.home ?? ''}
                    onChange={e => {
                      const v = e.target.value === '' ? undefined : parseInt(e.target.value);
                      if (v !== undefined && pred?.away !== undefined) {
                        savePred(match.id, { home: v, away: pred.away });
                      } else if (v !== undefined) {
                        setPreds(prev => ({ ...prev, [match.id]: { home: v, away: prev[match.id]?.away ?? 0 } }));
                      }
                    }}
                    onBlur={() => {
                      const p = preds[match.id];
                      if (p && p.home !== undefined && p.away !== undefined) {
                        savePred(match.id, p);
                      }
                    }}
                    className="w-10 h-10 bg-[#0a1628] border border-[#1a3a5c] rounded-lg text-center text-white font-bold text-lg outline-none focus:border-emerald-500 transition-colors"
                    placeholder="-"
                  />
                  <span className="text-slate-600 font-bold">:</span>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={pred?.away ?? ''}
                    onChange={e => {
                      const v = e.target.value === '' ? undefined : parseInt(e.target.value);
                      if (v !== undefined && pred?.home !== undefined) {
                        savePred(match.id, { home: pred.home, away: v });
                      } else if (v !== undefined) {
                        setPreds(prev => ({ ...prev, [match.id]: { home: prev[match.id]?.home ?? 0, away: v } }));
                      }
                    }}
                    onBlur={() => {
                      const p = preds[match.id];
                      if (p && p.home !== undefined && p.away !== undefined) {
                        savePred(match.id, p);
                      }
                    }}
                    className="w-10 h-10 bg-[#0a1628] border border-[#1a3a5c] rounded-lg text-center text-white font-bold text-lg outline-none focus:border-emerald-500 transition-colors"
                    placeholder="-"
                  />
                </div>

                {/* Away */}
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-xl">{match.away.flag}</span>
                  <span className="text-sm font-semibold text-slate-200 truncate">{match.away.name}</span>
                </div>
              </div>

              {/* Status indicator */}
              <div className="flex justify-center mt-1">
                {isSaving ? (
                  <span className="text-[10px] text-amber-400">Guardando...</span>
                ) : pred ? (
                  <span className="text-[10px] text-emerald-500">✓ Guardado</span>
                ) : (
                  <span className="text-[10px] text-slate-600">Fecha {match.matchday}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
