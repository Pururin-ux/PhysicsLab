import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mascot } from '@/components/Mascot';
import { AnimatedPhysicsDiagram, pickChapterVisualType } from '@/components/PhysicsChapterVisual';
import { PhysicsInline } from '@/components/PhysicsText';
import { apiClient } from '@/lib/api';
import { AlertTriangle, ArrowLeft, ArrowRight, BookOpen, PlayCircle, Route, Target } from 'lucide-react';

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    apiClient.get(`/courses/${courseId}`)
      .then((response) => {
        setCourse(response.data.course);
        setChapters(response.data.chapters);
      })
      .catch(() => setError('Не удалось загрузить курс. Вернись к списку курсов или обнови страницу.'))
      .finally(() => setLoading(false));
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08080A] pb-16 pt-[72px]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
          <div className="skeleton mb-5 h-4 w-24" />
          <div className="surface-elevated mb-6 rounded-[28px] p-5">
            <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
              <div>
                <div className="skeleton mb-4 h-8 w-56" />
                <div className="skeleton mb-2 h-4 w-full max-w-xl" />
                <div className="skeleton h-4 w-4/5 max-w-lg" />
              </div>
              <div className="skeleton h-28 rounded-2xl" />
            </div>
          </div>
          <div className="space-y-3">
            {[0, 1, 2].map((item) => <div key={item} className="skeleton h-24 rounded-2xl" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#08080A] pb-16 pt-[72px]">
        <div className="mx-auto max-w-5xl px-6 lg:px-12">
          <Link to="/courses" className="mb-8 inline-flex items-center gap-1.5 text-[13px] text-white/40 hover:text-white/70">
            <ArrowLeft className="h-3.5 w-3.5" />
            Назад к курсам
          </Link>
          <div className="surface-elevated rounded-2xl p-8 text-white/62">
            <AlertTriangle className="mb-4 h-5 w-5 text-[#FFB300]" />
            <p className="text-[14px] leading-7">{error || 'Курс не найден.'}</p>
          </div>
        </div>
      </div>
    );
  }

  const courseColor = course.color || '#FFD700';
  const firstChapter = chapters[0];
  const outcomes = (course.learning_outcomes || []).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#08080A] pb-14 pt-[72px]" data-testid="course-detail">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
        <Link
          to={course.path ? `/${course.path}` : '/courses'}
          className="mb-4 inline-flex items-center gap-1.5 text-[13px] text-white/36 transition-colors duration-200 hover:text-white/70"
          data-testid="back-to-courses"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Назад к разделу
        </Link>

        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.045] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.32)] sm:p-5 lg:p-6"
        >
          <div className="grid gap-4 lg:grid-cols-[1fr_320px] lg:items-stretch">
            <div className="min-w-0">
              <div className="mb-3 flex items-center gap-3">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border"
                  style={{ background: `${courseColor}12`, borderColor: `${courseColor}22` }}
                >
                  <BookOpen className="h-6 w-6" style={{ color: courseColor }} />
                </div>
                <div className="min-w-0">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/30">курс</span>
                  <h1 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    <PhysicsInline>{course.title}</PhysicsInline>
                  </h1>
                </div>
              </div>
              <p className="max-w-3xl text-[14px] leading-6 text-white/58">
                <PhysicsInline>{course.description}</PhysicsInline>
              </p>
            </div>

            <div className="min-w-0 rounded-2xl border border-[#FFD700]/18 bg-[#FFD700]/[0.055] p-4">
              <div className="mb-3 flex items-center gap-2 text-[#FFD700]">
                <PlayCircle className="h-4 w-4" />
                <span className="font-mono text-[10px] uppercase tracking-[0.18em]">следующий шаг</span>
              </div>
              {firstChapter ? (
                <Link
                  to={`/chapters/${firstChapter._id}`}
                  className="group flex min-h-[72px] w-full min-w-0 items-center justify-between gap-4 overflow-hidden rounded-2xl bg-[#FFD700] px-4 py-3 text-left text-[#101010] shadow-[0_14px_38px_rgba(255,215,0,0.18)] transition-transform duration-200 hover:-translate-y-0.5"
                  data-testid="start-first-chapter"
                >
                  <span className="min-w-0 flex-1 overflow-hidden">
                    <span className="block text-[12px] font-semibold uppercase tracking-[0.12em] opacity-60">Начать тему 1</span>
                    <span className="mt-1 block overflow-hidden text-ellipsis whitespace-nowrap text-[15px] font-bold">
                      <PhysicsInline>{firstChapter.title}</PhysicsInline>
                    </span>
                  </span>
                  <ArrowRight className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              ) : (
                <p className="text-[13px] leading-6 text-white/55">Главы скоро появятся. Контент готовится под этот курс.</p>
              )}
            </div>
          </div>

          {outcomes.length > 0 && (
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {outcomes.map((outcome, index) => (
                <div key={outcome} className="rounded-2xl border border-white/[0.07] bg-black/18 px-3 py-2.5">
                  <div className="mb-1.5 flex items-center gap-2">
                    {index === 0 ? <Target className="h-3.5 w-3.5 text-[#FFD700]" /> : index === 1 ? <Route className="h-3.5 w-3.5 text-[#00E5FF]" /> : <AlertTriangle className="h-3.5 w-3.5 text-[#FFB300]" />}
                    <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/28">результат</span>
                  </div>
                  <p className="line-clamp-2 text-[12px] font-medium leading-snug text-white/62">
                    <PhysicsInline>{outcome}</PhysicsInline>
                  </p>
                </div>
              ))}
            </div>
          )}
        </motion.header>

        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 className="font-heading text-lg font-semibold text-white">Главы курса</h2>
            <p className="mt-0.5 text-[12px] text-white/34">Открывай темы по порядку: от модели движения к задачам экзаменного типа.</p>
          </div>
          {chapters.length > 0 && (
            <span className="rounded-full border border-white/[0.08] px-3 py-1 text-[11px] text-white/42">
              {chapters.length} глав
            </span>
          )}
        </div>

        <div className="space-y-3">
          {chapters.map((chapter, index) => {
            const visualType = pickChapterVisualType(chapter);
            const isFirst = index === 0;

            return (
              <motion.div
                key={chapter._id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.35 }}
              >
                <Link
                  to={`/chapters/${chapter._id}`}
                  className={`group grid gap-4 rounded-3xl border p-3 transition-all duration-200 sm:grid-cols-[132px_1fr_auto] sm:items-center sm:p-4 ${
                    isFirst
                      ? 'border-[#FFD700]/26 bg-[#FFD700]/[0.055] shadow-[0_18px_48px_rgba(255,215,0,0.07)] hover:border-[#FFD700]/40'
                      : 'border-white/[0.07] bg-white/[0.035] hover:border-white/[0.13] hover:bg-white/[0.055]'
                  }`}
                  data-testid={`chapter-link-${index}`}
                >
                  <div className="hidden overflow-hidden rounded-2xl border border-white/[0.05] bg-black/18 sm:block">
                    <AnimatedPhysicsDiagram type={visualType} className="h-20" />
                  </div>
                  <div className="flex min-w-0 items-center gap-3">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${isFirst ? 'border-[#FFD700]/24 bg-[#FFD700]/12' : 'border-white/[0.08] bg-white/[0.04]'}`}>
                      <span className={`font-mono text-[12px] font-bold ${isFirst ? 'text-[#FFD700]' : 'text-white/45'}`}>{index + 1}</span>
                    </div>
                    <div className="min-w-0">
                      <span className="block truncate text-[15px] font-semibold text-white/86 transition-colors duration-200 group-hover:text-[#FFD700]">
                        <PhysicsInline>{chapter.title}</PhysicsInline>
                      </span>
                      {(chapter.solve_flow?.length || chapter.exam_blueprints?.length) && (
                        <p className="mt-0.5 text-[11px] text-white/34">
                          {chapter.solve_flow?.length ? `${chapter.solve_flow.length} шага решения` : ''}
                          {chapter.solve_flow?.length && chapter.exam_blueprints?.length ? ' · ' : ''}
                          {chapter.exam_blueprints?.length ? `${chapter.exam_blueprints.length} blueprint` : ''}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className={`flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-[13px] font-semibold transition-all duration-200 ${
                    isFirst
                      ? 'bg-[#FFD700] text-[#101010] group-hover:-translate-y-0.5'
                      : 'bg-white/[0.06] text-white/58 group-hover:bg-white/[0.1] group-hover:text-white/82'
                  }`}>
                    {isFirst ? 'Начать' : 'Открыть'}
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {chapters.length === 0 && (
          <div className="surface-elevated rounded-2xl py-20 text-center">
            <Mascot pose="shy" size="md" className="mx-auto mb-4" />
            <p className="text-[15px] font-medium text-white/42">Главы скоро появятся.</p>
            <p className="mt-1 text-[13px] text-white/22">Контент готовится под отдельный трек курса.</p>
          </div>
        )}
      </div>
    </div>
  );
}
