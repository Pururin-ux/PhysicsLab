import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mascot } from '@/components/Mascot';
import { apiClient } from '@/lib/api';
import {
  Activity,
  ArrowRight,
  Atom,
  BookOpen,
  Calculator,
  ClipboardCheck,
  Eye,
  GraduationCap,
  Rocket,
  Route,
  ShieldCheck,
  Thermometer,
  Timer,
  Zap,
} from 'lucide-react';

const ICONS = {
  Rocket, Thermometer, Zap, Activity, Eye, Atom,
  ClipboardCheck, Calculator, Timer,
};

const Mascot3D = lazy(() => import('@/components/Mascot3D'));

const TRACK_META = {
  school: {
    icon: Route,
    title: 'Понять тему',
    shortTitle: 'Школа',
    description: 'Когда нужно разобраться спокойно: рисунок, смысл, формула, короткая проверка.',
    points: ['сначала простая модель', 'потом формула', 'в конце пара задач'],
    color: '#00E5FF',
    href: '/school',
  },
  exam: {
    icon: ShieldCheck,
    title: 'Готовиться к ЦТ/ЦЭ',
    shortTitle: 'Экзамен',
    description: 'Когда тему уже знаешь и хочешь тренировать скорость, формат и ошибки.',
    points: ['части A и B отдельно', 'таймер как на экзамене', 'новые задания без заучивания'],
    color: '#FFD700',
    href: '/exam',
  },
};

function TrackSwitch({ active }) {
  return (
    <div className="inline-flex rounded-2xl border border-white/[0.08] bg-white/[0.035] p-1">
      {Object.entries(TRACK_META).map(([slug, track]) => {
        const isActive = active === slug;
        return (
          <Link
            key={slug}
            to={track.href}
            className={`flex items-center gap-2 rounded-xl px-3 py-2 text-[12px] font-bold transition-colors ${
              isActive ? 'bg-white/[0.1] text-white' : 'text-white/42 hover:bg-white/[0.06] hover:text-white/72'
            }`}
            data-testid={`track-switch-${slug}`}
          >
            <track.icon className="h-3.5 w-3.5" style={{ color: isActive ? track.color : undefined }} />
            {track.shortTitle}
          </Link>
        );
      })}
    </div>
  );
}

function TrackChoiceCard({ slug, track }) {
  return (
    <Link
      to={track.href}
      className="group block rounded-3xl border border-white/[0.07] bg-white/[0.035] p-5 transition-colors hover:border-white/[0.16] hover:bg-white/[0.055]"
      data-testid={`track-choice-${slug}`}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border" style={{ backgroundColor: `${track.color}12`, borderColor: `${track.color}28` }}>
            <track.icon className="h-5 w-5" style={{ color: track.color }} />
          </div>
          <div>
            <h2 className="font-heading text-[18px] font-black text-white">{track.title}</h2>
            <p className="mt-0.5 text-[12px] text-white/36">{track.shortTitle}</p>
          </div>
        </div>
        <ArrowRight className="mt-2 h-4 w-4 text-white/24 transition-colors group-hover:text-white/70" />
      </div>
      <p className="mb-4 text-[13px] leading-6 text-white/56">{track.description}</p>
      <div className="grid gap-2 sm:grid-cols-3">
        {track.points.map((point) => (
          <span key={point} className="rounded-xl border border-white/[0.06] bg-black/18 px-3 py-2 text-[11px] font-medium leading-snug text-white/50">
            {point}
          </span>
        ))}
      </div>
    </Link>
  );
}

export default function CourseCatalogPage({ pathFilter }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    apiClient.get('/courses', { params: pathFilter ? { path: pathFilter } : undefined })
      .then((response) => setCourses(response.data))
      .catch(() => setError('Не получилось загрузить темы. Проверь интернет или обнови страницу.'))
      .finally(() => setLoading(false));
  }, [pathFilter]);

  const activeTrack = pathFilter ? TRACK_META[pathFilter] : null;
  const title = pathFilter === 'school'
    ? 'Школьная физика'
    : pathFilter === 'exam'
      ? 'Тренировка ЦТ/ЦЭ'
      : 'Что хочешь сделать сейчас?';
  const desc = pathFilter === 'school'
    ? 'Выбери тему. Внутри будет короткое объяснение, рисунок или график и проверка на пару задач.'
    : pathFilter === 'exam'
      ? 'Решай задания в формате экзамена. Здесь важны время, внимательность и слабые места.'
      : 'Если тема непонятна - начни со школы. Если хочешь набить руку перед экзаменом - открой тренировку.';
  const color = activeTrack?.color || '#39FF14';

  return (
    <div className="noise relative min-h-screen overflow-hidden bg-[#08080A] pb-16 pt-24">
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 grid gap-5 md:grid-cols-[auto_1fr_auto] md:items-center"
        >
          <Suspense fallback={<Mascot pose="pointing" size="md" noFloat />}>
            <Mascot3D compact className="-my-6 -ml-5 -mr-2" />
          </Suspense>

          <div className="min-w-0">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border" style={{ backgroundColor: `${color}15`, borderColor: `${color}30` }}>
                {pathFilter === 'exam' ? <GraduationCap className="h-4 w-4" style={{ color }} /> : <BookOpen className="h-4 w-4" style={{ color }} />}
              </div>
              <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color }}>
                {pathFilter === 'exam' ? 'тренировка формата' : pathFilter === 'school' ? 'учимся без спешки' : 'выбор пути'}
              </span>
            </div>
            <h1 className="font-heading mb-3 text-3xl font-black tracking-tight text-white sm:text-4xl">{title}</h1>
            <p className="max-w-2xl text-[15px] leading-relaxed text-white/56">{desc}</p>
          </div>

          <TrackSwitch active={pathFilter} />
        </motion.div>

        {!pathFilter && (
          <div className="mb-8 grid gap-4 md:grid-cols-2">
            {Object.entries(TRACK_META).map(([slug, track]) => (
              <TrackChoiceCard key={slug} slug={slug} track={track} />
            ))}
          </div>
        )}

        {activeTrack && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="mb-8 grid gap-3 rounded-[2rem] border border-white/[0.07] bg-white/[0.035] p-4 sm:grid-cols-[1fr_auto] sm:items-center"
          >
            <div>
              <p className="mb-1 text-[12px] font-bold text-white">Как это работает</p>
              <p className="text-[13px] leading-6 text-white/52">{activeTrack.description}</p>
            </div>
            <div className="grid gap-2 sm:w-[420px] sm:grid-cols-3">
              {activeTrack.points.map((point, index) => (
                <div key={point} className="rounded-2xl border border-white/[0.06] bg-black/18 px-3 py-3">
                  <span className="font-mono text-[11px]" style={{ color: activeTrack.color }}>0{index + 1}</span>
                  <p className="mt-1 text-[11px] font-semibold leading-snug text-white/54">{point}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-[#FFB300]/20 bg-[#FFB300]/[0.06] px-4 py-3 text-[13px] leading-6 text-white/66">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => <div key={item} className="skeleton h-48 rounded-3xl surface-elevated" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, index) => {
              const Icon = ICONS[course.icon] || BookOpen;
              const href = course.path === 'exam' && course.chapters_count === 0 ? '/exam-trainer' : `/courses/${course._id}`;

              return (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05, duration: 0.35 }}
                >
                  <Link to={href} className="group block h-full" data-testid={`course-card-${index}`}>
                    <div className="relative h-full overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.035] p-6 transition-colors duration-200 hover:border-white/[0.13] hover:bg-white/[0.055]">
                      <div className="absolute right-0 top-0 h-32 w-32 rounded-full opacity-0 blur-[60px] transition-opacity duration-500 group-hover:opacity-20" style={{ backgroundColor: course.color }} />

                      <div className="relative z-10 mb-6 flex items-start justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border backdrop-blur-sm" style={{ backgroundColor: `${course.color}15`, borderColor: `${course.color}20` }}>
                          <Icon className="h-6 w-6" style={{ color: course.color }} />
                        </div>
                        {course.grade && (
                          <span className="rounded bg-white/[0.05] px-2 py-1 font-mono text-[10px] font-bold text-white/40">
                            {course.grade} класс
                          </span>
                        )}
                      </div>

                      <h3 className="font-heading mb-2 text-lg font-bold tracking-tight text-white transition-colors group-hover:text-[#FFD700]">{course.title}</h3>
                      <p className="mb-6 line-clamp-2 text-[13px] leading-relaxed text-white/46">{course.description}</p>

                      <div className="mt-auto flex items-center justify-between border-t border-white/[0.06] pt-4">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-white/34">
                          {course.chapters_count > 0 ? `${course.chapters_count} главы` : 'тренажер'}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-[12px] font-bold text-white/58 transition-colors group-hover:text-white">
                          Открыть <ArrowRight className="h-3.5 w-3.5" />
                        </span>
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
