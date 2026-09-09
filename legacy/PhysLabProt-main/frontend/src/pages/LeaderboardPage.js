import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mascot } from '@/components/Mascot';
import { apiClient } from '@/lib/api';
import { Zap, Medal, AlertTriangle } from 'lucide-react';

export default function LeaderboardPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    apiClient.get('/leaderboard')
      .then(r => setUsers(r.data))
      .catch(() => setError('Не удалось загрузить рейтинг. Попробуй обновить страницу чуть позже.'))
      .finally(() => setLoading(false));
  }, []);

  const medals = ['#FFD700', '#B8C4CF', '#CD7F32'];

  return (
    <div className="min-h-screen bg-[#08080A] pt-[72px] pb-16" data-testid="leaderboard-page">
      <div className="max-w-2xl mx-auto px-6 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <Mascot pose="explaining" size="sm" className="mx-auto mb-5" noFloat />
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-tight mb-1.5">
            Рейтинг учеников
          </h1>
          <p className="text-[13px] text-white/35">Топ по количеству XP</p>
        </motion.div>

        {loading ? (
          <div className="space-y-2.5">
            {[0,1,2,3,4].map(i => (
              <div key={i} className="flex items-center gap-4 surface-elevated rounded-xl p-4">
                <div className="w-8 h-8 skeleton rounded-lg" />
                <div className="flex-1"><div className="h-4 w-24 skeleton mb-1" /><div className="h-3 w-16 skeleton" /></div>
                <div className="h-5 w-12 skeleton rounded-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="surface-elevated rounded-2xl p-8 text-center">
            <AlertTriangle className="mx-auto mb-4 h-5 w-5 text-[#FFB300]" />
            <p className="text-[14px] leading-7 text-white/52">{error}</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20 surface-elevated rounded-2xl">
            <Mascot pose="shy" size="md" className="mx-auto mb-4" />
            <p className="text-[15px] text-white/40 font-medium">Пока нет учеников</p>
            <p className="text-[13px] text-white/20 mt-1">Будь первым в рейтинге!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {users.map((u, i) => (
              <motion.div
                key={u._id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04, duration: 0.35 }}
                className={`flex items-center gap-4 surface-elevated rounded-xl p-4 ${
                  i < 3 ? 'border-l-2' : ''
                }`}
                style={i < 3 ? { borderLeftColor: medals[i] + '40' } : {}}
                data-testid={`leaderboard-entry-${i}`}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: i < 3 ? `${medals[i]}12` : 'rgba(255,255,255,0.03)' }}
                >
                  {i < 3 ? (
                    <Medal className="w-4 h-4" style={{ color: medals[i] }} />
                  ) : (
                    <span className="text-[11px] font-mono font-bold text-white/25">{i + 1}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] text-white font-medium truncate">{u.name || 'Ученик'}</p>
                  <p className="text-[11px] text-white/25">Уровень {u.level || 1}</p>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFD700]/[0.06] border border-[#FFD700]/10 shrink-0">
                  <Zap className="w-3 h-3 text-[#FFD700]" strokeWidth={2.5} />
                  <span className="text-[12px] font-mono font-semibold text-[#FFD700]">{u.xp || 0}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
