'use client';

import { useState, useEffect, useCallback } from 'react';
import { GROUPS, ALL_MATCHES } from '@/lib/data';
import { Predictions, Score } from '@/lib/types';
import { MONTO_ENTRADA, MP_LINK, MONEDA, MESSI_ACCENT_URL } from '@/config';
import { SolDeMayo } from '@/components/SolDeMayo';

const fmtMoney = (n: number) => `$${n.toLocaleString('es-AR')}`;

const LS_KEY = 'prode-username';

export default function JugarPage() {
  const [name, setName] = useState('');
  const [joined, setJoined] = useState(false);
  const [preds, setPreds] = useState<Predictions>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [activeGroup, setActiveGroup] = useState('A');
  const [joining, setJoining] = useState(false);
  const [restoring, setRestoring] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState({ total: 0, paid: 0 });

  // Restore saved username on mount
  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) {
      setName(saved);
      enterAs(saved);
    } else {
      setRestoring(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await fetch('/api/payments');
      if (res.ok) setPaymentInfo(await res.json());
    } catch { /* silent */ }
  };

  const enterAs = async (username: string) => {
    try {
      const res = await fetch('/api/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: username }),
      });
      if (res.ok || res.status === 409) {
        setJoined(true);
        localStorage.setItem(LS_KEY, username);
        try {
          const predRes = await fetch(`/api/predictions/${encodeURIComponent(username)}`);
          if (predRes.ok) setPreds(await predRes.json());
        } catch {
          /* start fresh */
        }
        fetchPayments();
      }
    } catch {
      /* will show login screen */
    } finally {
      setRestoring(false);
      setJoining(false);
    }
  };

  const join = async () => {
    setError('');
    setJoining(true);
    const clean = name.trim();
    try {
      const res = await fetch('/api/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: clean }),
      });

      if (res.ok || res.status === 409) {
        setJoined(true);
        localStorage.setItem(LS_KEY, clean);
        try {
          const predRes = await fetch(`/api/predictions/${encodeURIComponent(clean)}`);
          if (predRes.ok) setPreds(await predRes.json());
        } catch {
          /* start fresh */
        }
        fetchPayments();
      } else {
        const data = await res.json().catch(() => ({ error: 'Error del servidor' }));
        setError(data.error || `Error (${res.status})`);
      }
    } catch {
      setError('No se pudo conectar al servidor. Intentá de nuevo.');
    } finally {
      setJoining(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(LS_KEY);
    setJoined(false);
    setName('');
    setPreds({});
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

  if (restoring) {
    return (
      <div className="flex flex-col items-center pt-20">
        <span className="text-4xl mb-4 animate-pulse">⚽</span>
        <p className="text-slate-400 text-sm">Cargando...</p>
      </div>
    );
  }

  if (!joined) {
    return (
      <div className="flex flex-col items-center pt-8">
        <div className="relative w-full rounded-3xl glass-strong hero-shimmer overflow-hidden p-8 text-center">
          {MESSI_ACCENT_URL && (
            <div
              className="absolute inset-0 opacity-50"
              style={{
                backgroundImage: `url(${MESSI_ACCENT_URL})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center 25%',
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#051838]/95 via-[#051838]/40 to-transparent" />
          <div className="absolute -right-6 -top-6 opacity-30 sol-spin pointer-events-none">
            <SolDeMayo size={140} />
          </div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="flex gap-1 mb-3">
              <span className="text-[#F6B40E] drop-shadow-[0_2px_6px_rgba(246,180,14,0.6)]">★</span>
              <span className="text-[#F6B40E] drop-shadow-[0_2px_6px_rgba(246,180,14,0.6)]">★</span>
              <span className="text-[#F6B40E] drop-shadow-[0_2px_6px_rgba(246,180,14,0.6)]">★</span>
            </div>
            <h1 className="font-['Barlow_Condensed'] font-black text-3xl text-white tracking-wide drop-shadow">
              SUMATE AL PRODE
            </h1>
            <p className="text-slate-200 text-sm mt-2">
              Cargá tus predicciones y competí
            </p>
          </div>
        </div>
        <div className="w-full max-w-xs mt-6 space-y-3">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && name.trim().length >= 2 && join()}
            placeholder="Tu nombre"
            className="w-full input-glass rounded-xl px-4 py-3 text-center font-semibold text-lg"
          />
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button
            onClick={join}
            disabled={name.trim().length < 2 || joining}
            className="w-full py-3 rounded-xl btn-celeste text-lg disabled:cursor-not-allowed"
          >
            {joining ? 'Entrando...' : 'Entrar'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 rounded-2xl glass px-4 py-3">
        <div className="min-w-0">
          <h1 className="font-['Barlow_Condensed'] font-black text-2xl text-white truncate">
            {name.trim()}
          </h1>
          <div className="flex items-center gap-2">
            <p className="text-slate-300 text-xs">
              {filledCount}/{totalMatches} partidos cargados
            </p>
            <button
              onClick={logout}
              className="text-[10px] text-slate-500 hover:text-red-400 transition-colors"
            >
              Cambiar nombre
            </button>
          </div>
        </div>
        <div className="w-16 h-16 relative flex-shrink-0">
          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
            <circle
              cx="18"
              cy="18"
              r="15"
              fill="none"
              stroke="url(#progressGrad)"
              strokeWidth="3"
              strokeDasharray={`${(filledCount / totalMatches) * 94.2} 94.2`}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="progressGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#8FC1F0" />
                <stop offset="100%" stopColor="#FCD34D" />
              </linearGradient>
            </defs>
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-white">
            {Math.round((filledCount / totalMatches) * 100)}%
          </span>
        </div>
      </div>

      {/* Payment banner — Liquid glass dorado */}
      <div className="rounded-2xl glass-sol p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-white">
            Pozo actual:{' '}
            <span className="text-[#FCD34D]">
              {fmtMoney(paymentInfo.paid * MONTO_ENTRADA)}
            </span>
          </span>
        </div>
        <a
          href={MP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-2.5 rounded-xl btn-sol text-center text-sm"
        >
          Pagar mi entrada ({fmtMoney(MONTO_ENTRADA)} {MONEDA})
        </a>
        <p className="text-slate-300 text-[11px] mt-2 text-center">
          Pagá tu entrada para participar. El admin confirma tu pago.
        </p>
      </div>

      {/* Group tabs */}
      <div
        className="flex gap-1.5 overflow-x-auto pb-2 mb-4 -mx-4 px-4"
        style={{ scrollbarWidth: 'none' }}
      >
        {GROUPS.map(g => (
          <button
            key={g.name}
            onClick={() => setActiveGroup(g.name)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
              activeGroup === g.name
                ? 'btn-celeste'
                : 'glass text-slate-300 hover:text-white'
            }`}
          >
            {g.name}
          </button>
        ))}
      </div>

      {/* Group header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="font-['Barlow_Condensed'] font-black text-lg text-white">
          GRUPO {activeGroup}
        </span>
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
              className={`rounded-2xl p-3 transition-all ${
                pred ? 'glass-celeste' : 'glass'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2 justify-end">
                  <span className="text-sm font-semibold text-slate-100 truncate">{match.home.name}</span>
                  <span className="text-xl">{match.home.flag}</span>
                </div>

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
                    className="w-10 h-10 input-glass rounded-lg text-center font-bold text-lg"
                    placeholder="-"
                  />
                  <span className="text-slate-400 font-bold">:</span>
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
                    className="w-10 h-10 input-glass rounded-lg text-center font-bold text-lg"
                    placeholder="-"
                  />
                </div>

                <div className="flex-1 flex items-center gap-2">
                  <span className="text-xl">{match.away.flag}</span>
                  <span className="text-sm font-semibold text-slate-100 truncate">{match.away.name}</span>
                </div>
              </div>

              <div className="flex justify-center mt-1">
                {isSaving ? (
                  <span className="text-[10px] text-[#FCD34D]">Guardando...</span>
                ) : pred ? (
                  <span className="text-[10px] text-[#8FC1F0]">✓ Guardado</span>
                ) : (
                  <span className="text-[10px] text-slate-500">Fecha {match.matchday}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
