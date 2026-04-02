'use client';

import { useState, useCallback } from 'react';
import { GROUPS, ALL_MATCHES } from '@/lib/data';
import { Results, Score, Participant } from '@/lib/types';
import { MONTO_ENTRADA } from '@/config';

const fmtMoney = (n: number) => `$${n.toLocaleString('es-AR')}`;

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [results, setResults] = useState<Results>({});
  const [activeGroup, setActiveGroup] = useState('A');
  const [saving, setSaving] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [activeTab, setActiveTab] = useState<'results' | 'payments'>('results');
  const [savingPay, setSavingPay] = useState<string | null>(null);

  const login = async () => {
    if (password !== 'mundial2026') {
      alert('Contraseña incorrecta');
      return;
    }
    setAuthed(true);
    const [resR, resP] = await Promise.all([
      fetch('/api/results'),
      fetch('/api/participants'),
    ]);
    if (resR.ok) setResults(await resR.json());
    if (resP.ok) setParticipants(await resP.json());
    setLoaded(true);
  };

  const togglePaid = async (name: string, paid: boolean) => {
    setSavingPay(name);
    setParticipants(prev => prev.map(p => p.name === name ? { ...p, paid } : p));
    await fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-code': 'mundial2026' },
      body: JSON.stringify({ name, paid }),
    });
    setSavingPay(null);
  };

  const saveResult = useCallback(async (matchId: string, score: Score) => {
    setSaving(matchId);
    setResults(prev => ({ ...prev, [matchId]: score }));
    await fetch('/api/results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-code': 'mundial2026',
      },
      body: JSON.stringify({ [matchId]: score }),
    });
    setSaving(null);
  }, []);

  if (!authed) {
    return (
      <div className="flex flex-col items-center pt-16">
        <span className="text-5xl mb-4">🔒</span>
        <h1 className="font-['Barlow_Condensed'] font-extrabold text-2xl text-white mb-6">
          ADMIN — RESULTADOS
        </h1>
        <div className="w-full max-w-xs space-y-3">
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            placeholder="Contraseña"
            className="w-full bg-[#0d1b2e] border border-[#1a3a5c] rounded-xl px-4 py-3 text-white text-center font-semibold outline-none focus:border-emerald-500"
          />
          <button
            onClick={login}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors"
          >
            Entrar
          </button>
        </div>
      </div>
    );
  }

  const groupMatches = ALL_MATCHES.filter(m => m.group === activeGroup);
  const totalResults = Object.keys(results).length;
  const paidCount = participants.filter(p => p.paid).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-['Barlow_Condensed'] font-extrabold text-2xl text-white">
            ADMIN
          </h1>
          <p className="text-slate-500 text-xs">{totalResults} resultados · {paidCount}/{participants.length} pagos</p>
        </div>
        <span className="text-3xl">🏆</span>
      </div>

      {/* Admin tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('results')}
          className={`flex-1 py-2 rounded-xl font-bold text-sm transition-colors ${
            activeTab === 'results' ? 'bg-emerald-600 text-white' : 'bg-[#0d1b2e] text-slate-400 border border-[#1a3a5c]'
          }`}
        >
          ⚽ Resultados
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`flex-1 py-2 rounded-xl font-bold text-sm transition-colors ${
            activeTab === 'payments' ? 'bg-amber-600 text-white' : 'bg-[#0d1b2e] text-slate-400 border border-[#1a3a5c]'
          }`}
        >
          Pagos ({paidCount}/{participants.length})
        </button>
      </div>

      {activeTab === 'payments' && (
        <div>
          <div className="rounded-xl bg-gradient-to-r from-amber-900/30 to-[#0d1b2e] border border-amber-600/30 p-4 mb-4 text-center">
            <p className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">Pozo total</p>
            <p className="font-['Barlow_Condensed'] font-extrabold text-3xl text-white">{fmtMoney(paidCount * MONTO_ENTRADA)}</p>
          </div>
          <div className="space-y-2">
            {participants.length === 0 ? (
              <p className="text-center text-slate-500 py-8">Sin participantes</p>
            ) : participants.map(p => (
              <div key={p.name} className={`flex items-center gap-3 rounded-xl px-4 py-3 border ${
                p.paid ? 'bg-[#0d1b2e] border-emerald-600/30' : 'bg-[#0d1b2e] border-[#1a3a5c]'
              }`}>
                <span className="flex-1 font-semibold text-white truncate">{p.name}</span>
                {savingPay === p.name ? (
                  <span className="text-xs text-amber-400">...</span>
                ) : (
                  <button
                    onClick={() => togglePaid(p.name, !p.paid)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      p.paid
                        ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/30'
                        : 'bg-[#0a1628] text-slate-500 border border-[#1a3a5c] hover:border-amber-500 hover:text-amber-400'
                    }`}
                  >
                    {p.paid ? 'Pago ✓' : 'Pendiente ⏳'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'results' && <>
      {/* Group tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4 -mx-4 px-4" style={{ scrollbarWidth: 'none' }}>
        {GROUPS.map(g => {
          const groupResults = ALL_MATCHES.filter(m => m.group === g.name && results[m.id]);
          return (
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
              {groupResults.length > 0 && (
                <span className="ml-1 text-[10px] text-emerald-300">{groupResults.length}/6</span>
              )}
            </button>
          );
        })}
      </div>

      {!loaded ? (
        <div className="text-center py-12 text-slate-500">Cargando...</div>
      ) : (
        <div className="space-y-2">
          {groupMatches.map(match => {
            const result = results[match.id];
            const isSaving = saving === match.id;

            return (
              <div
                key={match.id}
                className={`rounded-xl border p-3 ${
                  result ? 'bg-[#0d1b2e] border-emerald-600/30' : 'bg-[#0d1b2e] border-[#1a3a5c]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-2 justify-end">
                    <span className="text-sm font-semibold text-slate-200 truncate">{match.home.name}</span>
                    <span className="text-xl">{match.home.flag}</span>
                  </div>
                  <div className="flex items-center gap-1 mx-1">
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={result?.home ?? ''}
                      onChange={e => {
                        const v = e.target.value === '' ? undefined : parseInt(e.target.value);
                        if (v !== undefined) {
                          const away = result?.away ?? 0;
                          saveResult(match.id, { home: v, away });
                        }
                      }}
                      className="w-10 h-10 bg-[#0a1628] border border-[#1a3a5c] rounded-lg text-center text-white font-bold text-lg outline-none focus:border-amber-500"
                      placeholder="-"
                    />
                    <span className="text-slate-600 font-bold">:</span>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={result?.away ?? ''}
                      onChange={e => {
                        const v = e.target.value === '' ? undefined : parseInt(e.target.value);
                        if (v !== undefined) {
                          const home = result?.home ?? 0;
                          saveResult(match.id, { home, away: v });
                        }
                      }}
                      className="w-10 h-10 bg-[#0a1628] border border-[#1a3a5c] rounded-lg text-center text-white font-bold text-lg outline-none focus:border-amber-500"
                      placeholder="-"
                    />
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-xl">{match.away.flag}</span>
                    <span className="text-sm font-semibold text-slate-200 truncate">{match.away.name}</span>
                  </div>
                </div>
                <div className="flex justify-center mt-1">
                  {isSaving ? (
                    <span className="text-[10px] text-amber-400">Guardando...</span>
                  ) : result ? (
                    <span className="text-[10px] text-emerald-500">✓ {result.home} - {result.away}</span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
      </>}
    </div>
  );
}
