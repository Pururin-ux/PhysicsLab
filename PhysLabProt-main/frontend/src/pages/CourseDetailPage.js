import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mascot } from '@/components/Mascot';
import { AnimatedPhysicsDiagram, pickChapterVisualType } from '@/components/PhysicsChapterVisual';
import { PhysicsInline } from '@/components/PhysicsText';
import { apiClient } from '@/lib/api';
import { AlertTriangle, ArrowLeft, BookOpen, ChevronRight, Route, Target } from 'lucide-react';

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
        <div className="mx-auto max-w-5xl px-6 lg:px-12">
          <div className="skeleton mb-8 h-4 w-24" />
          <div className="mb-10 flex items-center gap-5">
            <div className="skeleton h-14 w-14 rounded-2xl" />
            <div>
              <div className="skeleton mb-2 h-6 w-48" />
              <div className="skeleton h-3 w-64" />
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

  return (
    <div className="min-h-screen bg-[#08080A] pb-16 pt-[72px]" data-testid="course-detail">
      <div className="mx-auto max-w-5xl px-6 lg:px-12">
        <Link
          to={course.path ? `/${course.path}` : '/courses'}
          className="mb-8 inline-flex items-center gap-1.5 text-[13px] text-white/32 transition-colors duration-200 hover:text-white/64"
          data-testid="back-to-courses"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Назад к разделу
        </Link>

        <motion.header initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10 flex items-center gap-5">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
            style={{ background: `${course.color || '#FFD700'}0D`, boxShadow: `0 0 0 1px ${course.color || '#FFD700'}15` }}
          >
            <BookOpen className="h-7 w-7" style={{ color: course.color || '#FFD700' }} />
          </div>
          <div>
            <h1 className="font-heading text-xl font-bold tracking-tight text-white sm:text-2xl">
              <PhysicsInline>{course.title}</PhysicsInline>
            </h1>
            <p className="mt-1 text-[13px] leading-6 text-white/38">
              <PhysicsInline>{course.description}</PhysicsInline>
            </p>
          </div>
        </motion.header>

        <div className="mb-8 grid grid-cols-1 gap-3 md:grid-cols-3">
          {(course.learning_outcomes || []).slice(0, 3).map((outcome, index) => (
            <div key={outcome} className="surface-base rounded-2xl border border-white/[0.06] p-4">
              <div className="mb-2 flex items-center gap-2">
                {index === 0 ? <Target className="h-4 w-4 text-[#FFD700]" /> : index === 1 ? <Route className="h-4 w-4 text-[#00E5FF]" /> : <AlertTriangle className="h-4 w-4 text-[#FFB300]" />}
                <span className="font-mono text-[10px] uppercase text-white/28">результат</span>
              </div>
              <p className="text-[12px] font-medium leading-snug text-white/62">
                <PhysicsInline>{outcome}</PhysicsInline>
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          {chapters.map((chapter, index) => {
            const visualType = pickChapterVisualType(chapter);
            return (
              <motion.div
                key={chapter._id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.06, duration: 0.4 }}
              >
                <Link
                  to={`/chapters/${chapter._id}`}
                  className="card-interactive group grid gap-4 rounded-3xl surface-elevated p-4 sm:grid-cols-[160px_1fr_auto] sm:items-center"
                  data-testid={`chapter-link-${index}`}
                >
                  <div className="hidden sm:block">
                    <AnimatedPhysicsDiagram type={visualType} className="h-24" />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#FFD700]/10 bg-[#FFD700]/[0.06]">
                      <span className="font-mono text-[12px] font-bold text-[#FFD700]/75">{index + 1}</span>
                    </div>
                    <div>
                      <span className="text-[14px] font-medium text-white/82 transition-colors duration-200 group-hover:text-[#FFD700]">
                        <PhysicsInline>{chapter.title}</PhysicsInline>
                      </span>
                      {(chapter.solve_flow?.length || chapter.exam_blueprints?.length) && (
                        <p className="mt-0.5 text-[11px] text-white/28">
                          {chapter.solve_flow?.length ? `${chapter.solve_flow.length} шага решения` : ''}
                          {chapter.solve_flow?.length && chapter.exam_blueprints?.length ? ' · ' : ''}
                          {chapter.exam_blueprints?.length ? `${chapter.exam_blueprints.length} blueprint` : ''}
                        </p>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 justify-self-end self-center text-white/18 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[#FFD700]/55" />
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
