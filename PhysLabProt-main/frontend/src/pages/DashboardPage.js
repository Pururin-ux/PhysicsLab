import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Mascot } from '@/components/Mascot';
import { Progress } from '@/components/ui/progress';
import { apiClient } from '@/lib/api';
import { Zap, Flame, BookOpen, ArrowRight, Target, CheckCircle2, Timer, Brain, ShieldCheck, AlertTriangle } from 'lucide-react';

const Mascot3D = lazy(() => import('@/components/Mascot3D'));

function AnimatedCard({ icon: Icon, color, title, value, subtitle, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 200, damping: 20 }}
      className="relative overflow-hidden surface-elevated rounded-3xl p-6 group"
    >
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[${color}]/20 to-transparent rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700`} style={{ background: `radial-gradient(circle, ${color}20 0%, transparent 70%)` }} />
      
      <div className="relative z-10 flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-md border" style={{ backgroundColor: `${color}15`, borderColor: `${color}30` }}>
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
        <div className="text-right">
          <p className="text-[12px] font-bold uppercase tracking-widest mb-1 text-white/40">{title}</p>
          <p className="text-2xl font-black font-mono tracking-tighter" style={{ color }}>{value}</p>
        </div>
      </div>
      <div className="relative z-10">{subtitle}</div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [progress, setProgress] = useState([]);
  const [stats, setStats] = useState({ xp: 0, level: 1, streak: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    apiClient.get('/progress')
    .then((progRes) => {
      setProgress(progRes.data.progress || []);
      setStats({ xp: progRes.data.xp || 0, level: progRes.data.level || 1, streak: progRes.data.streak || 0 });
    })
    .catch(() => setError('Не удалось обновить прогресс. Можно продолжать обучение, а статистика подтянется после следующего запроса.'))
    .finally(() => setLoading(false));
  }, []);

  const xpProgress = ((stats.xp % 100) / 100) * 100;
  const completedChapters = progress.filter(p => p.completed).length;

  return (
    <div className="min-h-screen bg-[#08080A] pt-24 pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="flex items-end gap-6 mb-12">
          <div className="relative">
            <div className="absolute inset-0 bg-[#FFD700]/20 blur-3xl rounded-full scale-150" />
            <Suspense fallback={<Mascot pose="explaining" size="sm" noFloat />}>
              <Mascot3D compact className="-my-6 -ml-5 -mr-2" />
            </Suspense>
          </div>
          <div className="pb-2">
            <h1 className="font-heading text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
              Привет, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#FF8C00]">{user?.name}</span>!
            </h1>
            <p className="text-white/40 font-medium">Твоя личная физическая лаборатория готова к работе.</p>
          </div>
        </motion.div>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-[#FFB300]/20 bg-[#FFB300]/[0.06] px-4 py-3 text-[13px] leading-6 text-white/66">
            <AlertTriangle className="mt-1 h-4 w-4 shrink-0 text-[#FFB300]" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[1,2,3].map(i => <div key={i} className="h-40 rounded-3xl skeleton" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <AnimatedCard
              icon={Zap} color="#FFD700" title="Опыт" value={`${stats.xp} XP`} delay={0.1}
              subtitle={
                <div>
                  <div className="flex justify-between text-[11px] font-bold text-white/50 mb-2">
                    <span>УРОВЕНЬ {stats.level}</span>
                    <span>ДО {stats.level + 1}</span>
                  </div>
                  <Progress value={xpProgress} className="h-2 bg-white/5" />
                </div>
              }
            />
            <AnimatedCard
              icon={Flame} color="#FF4500" title="Серия" value={`${stats.streak} ДНЕЙ`} delay={0.2}
              subtitle={<p className="text-[13px] text-white/40 leading-snug">Заходи каждый день для бонусного XP.</p>}
            />
            <AnimatedCard
              icon={CheckCircle2} color="#39FF14" title="Выучено" value={`${completedChapters}`} delay={0.3}
              subtitle={<p className="text-[13px] text-white/40 leading-snug">Глав успешно пройдено на 60%+.</p>}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[
            { icon: Brain, color: '#00E5FF', title: 'Сегодня: понять', text: '1 школьная тема с визуальной картой и короткой проверкой.' },
            { icon: Timer, color: '#FFD700', title: 'Сегодня: формат', text: '10-15 заданий ЦТ/ЦЭ по слабому blueprint без повторов.' },
            { icon: ShieldCheck, color: '#39FF14', title: 'Правило базы', text: 'Школьный прогресс и экзаменационный темп считаются отдельно.' },
          ].map((item) => (
            <div key={item.title} className="surface-base rounded-2xl p-4 border border-white/[0.06]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${item.color}12` }}>
                  <item.icon className="w-4 h-4" style={{ color: item.color }} />
                </div>
                <p className="text-[12px] font-bold text-white">{item.title}</p>
              </div>
              <p className="text-[12px] text-white/42 leading-snug">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/20 to-transparent rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative surface-base border border-[#00E5FF]/20 rounded-[2rem] p-8 h-full flex flex-col justify-between overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#00E5FF]/10 rounded-full blur-2xl" />
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#00E5FF]/10 flex items-center justify-center mb-6">
                  <BookOpen className="w-7 h-7 text-[#00E5FF]" />
                </div>
                <h2 className="font-heading text-2xl font-bold text-white tracking-tight mb-3">Школьная успеваемость</h2>
                <p className="text-[15px] text-white/50 leading-relaxed mb-6">
                  Глубокое изучение механики, термодинамики и электродинамики по школьной программе VII-XI классов. Повышай средний балл без стресса.
                </p>
                <ul className="space-y-3 mb-8">
                  {['Пошаговые алгоритмы решений', 'Анимированные визуализации процессов', 'Срезы знаний после каждой темы'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-[13px] text-white/70">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <Link to="/school" className="inline-flex items-center justify-center gap-2 bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 text-[#00E5FF] font-bold py-3.5 px-6 rounded-xl transition-colors">
                Перейти в школьный раздел <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/20 to-transparent rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative surface-base border border-[#FFD700]/20 rounded-[2rem] p-8 h-full flex flex-col justify-between overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FFD700]/10 rounded-full blur-2xl" />
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#FFD700]/10 flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-[#FFD700]" />
                </div>
                <h2 className="font-heading text-2xl font-bold text-white tracking-tight mb-3">Подготовка к ЦТ / ЦЭ</h2>
                <p className="text-[15px] text-white/50 leading-relaxed mb-6">
                  Оригинальные варианты, разработанные на основе методики РИКЗ. Тренируй распределение времени на Часть А и Часть Б.
                </p>
                <ul className="space-y-3 mb-8">
                  {['Строгий тайминг в 210 минут', 'Никаких повторяющихся заданий', 'Анализ ловушек и типичных ошибок'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-[13px] text-white/70">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FFD700]" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <Link to="/exam" className="inline-flex items-center justify-center gap-2 bg-[#FFD700] hover:bg-[#FFD700]/90 text-black font-bold py-3.5 px-6 rounded-xl shadow-[0_4px_20px_rgba(255,215,0,0.3)] transition-all">
                Открыть экзаменационный тренажёр <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
