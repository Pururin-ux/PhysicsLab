import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mascot } from '@/components/Mascot';
import { apiClient } from '@/lib/api';
import { BookOpen, Rocket, Thermometer, Zap, Activity, Eye, Atom, ClipboardCheck, Calculator, Timer, GraduationCap, ArrowRight, Route, ShieldCheck } from 'lucide-react';

const ICONS = {
  Rocket, Thermometer, Zap, Activity, Eye, Atom,
  ClipboardCheck, Calculator, Timer
};

const LEARNING_ART = `${process.env.PUBLIC_URL}/learning/physics-panels.png`;
const Mascot3D = lazy(() => import('@/components/Mascot3D'));

const TRACK_META = {
  school: {
    icon: Route,
    title: 'Трек понимания',
    metric: 'метрика: мастерство темы',
    points: ['короткие визуальные объяснения', 'мини-проверки после темы', 'контроль типичных ошибок'],
    color: '#00E5FF',
  },
  exam: {
    icon: ShieldCheck,
    title: 'Трек результата ЦТ/ЦЭ',
    metric: 'метрика: балл, темп, пропуски',
    points: ['часть A и B отдельно', 'тайминг 210 минут', 'задания по blueprint, без копирования'],
    color: '#FFD700',
  },
};

export default function CourseCatalogPage({ pathFilter }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    apiClient.get('/courses', { params: pathFilter ? { path: pathFilter } : undefined })
      .then(r => setCourses(r.data))
      .catch(() => setError('Не удалось загрузить курсы. Проверь подключение к backend и обнови страницу.'))
      .finally(() => setLoading(false));
  }, [pathFilter]);

  const title = pathFilter === 'school' ? 'Школьная программа' : pathFilter === 'exam' ? 'ЦТ / ЦЭ Тренажёр' : 'Библиотека курсов';
  const desc = pathFilter === 'school' ? 'Твёрдая база знаний VII–XI классов. Выучи теорию и отточи её на мини-тестах.' : pathFilter === 'exam' ? 'Методика РИКЗ: 30 заданий, 210 минут, набивай руку на части А и Б.' : 'Выбери свой путь: глубокое изучение или подготовка к экзамену.';
  const color = pathFilter === 'school' ? '#00E5FF' : pathFilter === 'exam' ? '#FFD700' : '#39FF14';
  const activeTrack = pathFilter ? TRACK_META[pathFilter] : null;

  return (
    <div className="min-h-screen bg-[#08080A] pt-24 pb-16 relative overflow-hidden noise">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center gap-6 mb-12">
          <Suspense fallback={<Mascot pose="pointing" size="md" noFloat />}>
            <Mascot3D compact className="-my-6 -ml-5 -mr-2" />
          </Suspense>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center border" style={{ backgroundColor: `${color}15`, borderColor: `${color}30` }}>
                {pathFilter === 'school' ? <BookOpen className="w-4 h-4" style={{ color }} /> : <GraduationCap className="w-4 h-4" style={{ color }} />}
              </div>
              <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color }}>{pathFilter === 'school' ? 'Режим: Освоение' : 'Режим: Экзамен'}</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">{title}</h1>
            <p className="text-[15px] text-white/50 max-w-2xl leading-relaxed">{desc}</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="relative mb-8 overflow-hidden rounded-[2rem] border border-white/[0.07] bg-[#0D0F12]">
          <img src={LEARNING_ART} alt="" className="absolute inset-0 h-full w-full object-cover opacity-28" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#08080A] via-[#08080A]/80 to-[#08080A]/45" />
          <div className="relative grid gap-4 p-5 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <p className="mb-2 text-[11px] font-mono font-bold uppercase tracking-[0.18em] text-[#00E5FF]/70">визуальная методика</p>
              <h2 className="font-heading text-xl font-black text-white sm:text-2xl">Каждый раздел начинается с модели, а не со стены текста</h2>
              <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-white/50">
                Кинематика, силы, электричество и оптика показываются через сцену, график и типовые ловушки. Экзаменационный режим тренирует структуру задания отдельно от школьного освоения темы.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:w-[330px] sm:grid-cols-3">
              {['модель', 'формула', 'тренажёр'].map((item, idx) => (
                <div key={item} className="rounded-2xl border border-white/[0.06] bg-black/25 px-3 py-3 backdrop-blur-md">
                  <span className="font-mono text-[11px] text-[#FFD700]">0{idx + 1}</span>
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-white/45">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {activeTrack ? (
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-4 mb-8">
            <div className="surface-overlay rounded-2xl p-5 border" style={{ borderColor: `${activeTrack.color}25` }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${activeTrack.color}12` }}>
                  <activeTrack.icon className="w-4 h-4" style={{ color: activeTrack.color }} />
                </div>
                <div>
                  <p className="text-[12px] text-white font-bold">{activeTrack.title}</p>
                  <p className="text-[11px] text-white/35">{activeTrack.metric}</p>
                </div>
              </div>
              <p className="text-[13px] text-white/45 leading-relaxed">
                Этот раздел ведёт отдельный прогресс: школьное понимание не смешивается с экзаменационной скоростью.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {activeTrack.points.map((point) => (
                <div key={point} className="surface-base rounded-2xl p-4 border border-white/[0.06]">
                  <span className="block w-1.5 h-1.5 rounded-full mb-3" style={{ backgroundColor: activeTrack.color }} />
                  <p className="text-[12px] text-white/60 leading-snug font-medium">{point}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {Object.entries(TRACK_META).map(([slug, track]) => (
              <Link key={slug} to={`/${slug}`} className="surface-overlay rounded-2xl p-5 border border-white/[0.06] hover:border-white/15 transition-colors group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${track.color}12` }}>
                    <track.icon className="w-5 h-5" style={{ color: track.color }} />
                  </div>
                  <div>
                    <p className="text-white font-bold">{track.title}</p>
                    <p className="text-[12px] text-white/35">{track.metric}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[13px] text-white/45">{slug === 'school' ? 'Для повышения успеваемости.' : 'Для результата на ЦТ/ЦЭ.'}</p>
                  <ArrowRight className="w-4 h-4 text-white/25 group-hover:text-white/70 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-[#FFB300]/20 bg-[#FFB300]/[0.06] px-4 py-3 text-[13px] leading-6 text-white/66">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="h-48 surface-elevated rounded-3xl skeleton" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, i) => {
              const Icon = ICONS[course.icon] || BookOpen;
              return (
                <motion.div key={course._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05, duration: 0.4 }}>
                  <Link to={course.path === 'exam' && course.chapters_count === 0 ? '/exam-trainer' : `/courses/${course._id}`} className="block h-full group">
                    <div className="relative surface-base border border-white/5 hover:border-white/10 rounded-3xl p-6 transition-all duration-300 h-full overflow-hidden">
                      {/* Glow inside card */}
                      <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none" style={{ backgroundColor: course.color }} />
                      
                      <div className="relative z-10 flex items-start justify-between mb-6">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-sm border" style={{ backgroundColor: `${course.color}15`, borderColor: `${course.color}20` }}>
                          <Icon className="w-6 h-6" style={{ color: course.color }} />
                        </div>
                        {course.grade && (
                          <span className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-white/5 text-white/40 border border-white/10">КЛАСС {course.grade}</span>
                        )}
                      </div>
                      
                      <h3 className="font-heading text-lg font-bold text-white mb-2 tracking-tight group-hover:translate-x-1 transition-transform">{course.title}</h3>
                      <p className="text-[13px] text-white/40 line-clamp-2 leading-relaxed mb-6 group-hover:text-white/60 transition-colors">{course.description}</p>
                      
                      <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
                        <span className="text-[11px] font-bold tracking-widest uppercase text-white/30">{course.chapters_count > 0 ? `${course.chapters_count} ГЛАВ` : 'ТРЕНАЖЁР'}</span>
                        <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                          <ArrowRight className="w-3 h-3 text-white/50 group-hover:text-white" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
