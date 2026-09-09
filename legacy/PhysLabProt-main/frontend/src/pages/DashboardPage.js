import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Mascot } from '@/components/Mascot';
import { Progress } from '@/components/ui/progress';
import { apiClient } from '@/lib/api';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Flame,
  Target,
  Zap,
} from 'lucide-react';

const Mascot3D = lazy(() => import('@/components/Mascot3D'));

function StatCard({ icon: Icon, color, title, value, subtitle, delay, testId }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 200, damping: 20 }}
      className="group relative overflow-hidden rounded-3xl surface-elevated p-6"
      data-testid={testId}
    >
      <div className="absolute right-0 top-0 h-32 w-32 -translate-y-1/2 translate-x-1/2 rounded-full blur-2xl transition-transform duration-700 group-hover:scale-150" style={{ background: `radial-gradient(circle, ${color}20 0%, transparent 70%)` }} />

      <div className="relative z-10 mb-4 flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border backdrop-blur-md" style={{ backgroundColor: `${color}15`, borderColor: `${color}30` }}>
          <Icon className="h-6 w-6" style={{ color }} />
        </div>
        <div className="text-right">
          <p className="mb-1 text-[12px] font-bold uppercase tracking-widest text-white/40">{title}</p>
          <p className="font-mono text-2xl font-black tracking-tighter" style={{ color }}>{value}</p>
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
  const [recommendedCourse, setRecommendedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    Promise.allSettled([
      apiClient.get('/progress'),
      apiClient.get('/courses', { params: { path: 'school' } }),
    ])
      .then(([progressResult, coursesResult]) => {
        if (progressResult.status === 'fulfilled') {
          const data = progressResult.value.data;
          setProgress(data.progress || []);
          setStats({ xp: data.xp || 0, level: data.level || 1, streak: data.streak || 0 });
        } else {
          setError('Не получилось обновить прогресс. Учиться можно дальше - статистика подтянется позже.');
        }

        if (coursesResult.status === 'fulfilled') {
          setRecommendedCourse((coursesResult.value.data || [])[0] || null);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const xpRemainder = stats.xp % 100;
  const xpProgress = (xpRemainder / 100) * 100;
  const xpToNextLevel = xpRemainder === 0 ? 100 : 100 - xpRemainder;
  const completedChapters = progress.filter((item) => item.completed).length;
  const lessonHref = recommendedCourse ? `/courses/${recommendedCourse._id}` : '/school';
  const lessonTitle = recommendedCourse?.title || 'первая тема по физике';

  return (
    <div className="min-h-screen overflow-hidden bg-[#08080A] pb-16 pt-24">
      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8 grid gap-5 md:grid-cols-[auto_1fr] md:items-end"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-[#FFD700]/20 blur-3xl" />
            <Suspense fallback={<Mascot pose="explaining" size="sm" noFloat />}>
              <Mascot3D compact className="-my-6 -ml-5 -mr-2" />
            </Suspense>
          </div>
          <div className="pb-2">
            <h1 className="font-heading mb-2 text-3xl font-black tracking-tight text-white md:text-4xl">
              Привет, <span className="bg-gradient-to-r from-[#FFD700] to-[#FF8C00] bg-clip-text text-transparent">{user?.name}</span>!
            </h1>
            <p className="font-medium text-white/46">Давай начнем с одного понятного шага. Не нужно разбирать все сразу.</p>
          </div>
        </motion.div>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-[#FFB300]/20 bg-[#FFB300]/[0.06] px-4 py-3 text-[13px] leading-6 text-white/66">
            <AlertTriangle className="mt-1 h-4 w-4 shrink-0 text-[#FFB300]" />
            <span>{error}</span>
          </div>
        )}

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mb-8 grid gap-4 rounded-[2rem] border border-[#FFD700]/18 bg-[#FFD700]/[0.055] p-5 lg:grid-cols-[1fr_auto] lg:items-center"
          data-testid="today-lesson"
        >
          <div className="min-w-0">
            <div className="mb-3 flex items-center gap-2 text-[#FFD700]">
              <Target className="h-4 w-4" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]">твоё занятие сегодня</span>
            </div>
            <h2 className="font-heading text-2xl font-black text-white">Начни с темы: {lessonTitle}</h2>
            <p className="mt-2 max-w-2xl text-[14px] leading-6 text-white/58">
              Сначала посмотри модель и график, потом реши короткую проверку. Это лучше, чем просто читать длинный текст.
            </p>
          </div>
          <Link
            to={lessonHref}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#FFD700] px-6 text-[14px] font-black text-black shadow-[0_12px_32px_rgba(255,215,0,0.18)] transition-transform hover:-translate-y-0.5"
            data-testid="today-lesson-cta"
          >
            Начать <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.section>

        {loading ? (
          <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[1, 2, 3].map((item) => <div key={item} className="skeleton h-40 rounded-3xl" />)}
          </div>
        ) : (
          <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            <StatCard
              icon={Zap}
              color="#FFD700"
              title="Опыт"
              value={`${stats.xp} XP`}
              delay={0.1}
              testId="stats-xp"
              subtitle={(
                <div>
                  <div className="mb-2 flex justify-between text-[11px] font-bold text-white/52">
                    <span>Уровень {stats.level}</span>
                    <span>{xpToNextLevel} XP до следующего</span>
                  </div>
                  <Progress value={xpProgress} className="h-3 bg-white/8" />
                </div>
              )}
            />
            <StatCard
              icon={Flame}
              color="#FF6B2A"
              title="Серия"
              value={stats.streak > 0 ? `${stats.streak} дн.` : 'Старт'}
              delay={0.2}
              testId={stats.streak > 0 ? 'active-streak' : 'empty-streak'}
              subtitle={(
                <p className="text-[13px] leading-snug text-white/46">
                  {stats.streak > 0 ? 'Зайди сегодня еще раз, чтобы серия не сбилась.' : 'Серия начнется после первого занятия сегодня.'}
                </p>
              )}
            />
            <StatCard
              icon={CheckCircle2}
              color="#39FF14"
              title="Темы"
              value={completedChapters > 0 ? `${completedChapters}` : 'Старт'}
              delay={0.3}
              testId={completedChapters > 0 ? 'completed-chapters' : 'empty-completed'}
              subtitle={(
                <p className="text-[13px] leading-snug text-white/46">
                  {completedChapters > 0 ? 'Столько тем уже закрыто проверкой.' : 'Здесь появятся пройденные темы. Начни с одной.'}
                </p>
              )}
            />
          </div>
        )}

        <div className="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="group relative">
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-[#00E5FF]/20 to-transparent opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[2rem] border border-[#00E5FF]/20 surface-base p-8">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#00E5FF]/10 blur-2xl" />
              <div>
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00E5FF]/10">
                  <BookOpen className="h-7 w-7 text-[#00E5FF]" />
                </div>
                <h2 className="font-heading mb-3 text-2xl font-bold tracking-tight text-white">Школьные темы</h2>
                <p className="mb-6 text-[15px] leading-relaxed text-white/52">
                  Для обычной учебы: понять тему, решить пару задач и не потеряться на контрольной.
                </p>
                <ul className="mb-8 space-y-3">
                  {['короткое объяснение', 'рисунок или график перед формулой', 'проверка после темы'].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-[13px] text-white/70">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#00E5FF]" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <Link to="/school" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00E5FF]/10 px-6 py-3.5 font-bold text-[#00E5FF] transition-colors hover:bg-[#00E5FF]/20">
                Открыть школьные темы <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="group relative">
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-[#FFD700]/20 to-transparent opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[2rem] border border-[#FFD700]/20 surface-base p-8">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#FFD700]/10 blur-2xl" />
              <div>
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFD700]/10">
                  <Target className="h-7 w-7 text-[#FFD700]" />
                </div>
                <h2 className="font-heading mb-3 text-2xl font-bold tracking-tight text-white">ЦТ / ЦЭ</h2>
                <p className="mb-6 text-[15px] leading-relaxed text-white/52">
                  Для тренировки формата: решать быстрее, замечать ловушки и привыкать к времени.
                </p>
                <ul className="mb-8 space-y-3">
                  {['таймер как на экзамене', 'части A и B отдельно', 'разбор слабых мест после ответа'].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-[13px] text-white/70">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#FFD700]" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <Link to="/exam" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFD700] px-6 py-3.5 font-bold text-black shadow-[0_4px_20px_rgba(255,215,0,0.3)] transition-all hover:bg-[#FFD700]/90">
                Открыть тренировку <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
