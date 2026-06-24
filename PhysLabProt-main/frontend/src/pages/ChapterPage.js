import React, { lazy, Suspense, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Mascot } from '@/components/Mascot';
import {
  AnimatedRepresentationCard,
  ChapterVisualHero,
  VisualMethodStrip,
} from '@/components/PhysicsChapterVisual';
import { FormulaDisplay, PhysicsInline, PhysicsRichText } from '@/components/PhysicsText';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api';
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  FlaskConical,
  GraduationCap,
  Lightbulb,
  Loader2,
  Network,
  Play,
  Route,
  Target,
  Timer,
  XCircle,
} from 'lucide-react';

const Mascot3D = lazy(() => import('@/components/Mascot3D'));

const tabMotion = {
  initial: { opacity: 0, y: 16, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.36, ease: [0.33, 1, 0.68, 1] } },
  exit: { opacity: 0, y: -8, filter: 'blur(4px)', transition: { duration: 0.18 } },
};

function InfoCard({ icon: Icon, title, children, color = '#FFD700', className = '' }) {
  return (
    <section className={`surface-overlay rounded-3xl border border-white/[0.07] p-5 ${className}`}>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: `${color}14` }}>
          <Icon className="h-4 w-4" style={{ color }} />
        </div>
        <h3 className="font-heading text-[13px] font-bold uppercase tracking-wider text-white">{title}</h3>
      </div>
      {children}
    </section>
  );
}

export default function ChapterPage() {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [tab, setTab] = useState('theory');
  const [loading, setLoading] = useState(true);

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setCurrentQ(0);
    setAnswers([]);
    setShowResult(false);
    setQuizResult(null);
    setSelectedOption(null);
    setShowFeedback(false);
    setError('');

    apiClient.get(`/chapters/${chapterId}`)
      .then((response) => {
        setChapter(response.data.chapter);
        setQuiz(response.data.quiz);
      })
      .catch(() => setError('Не удалось загрузить главу. Проверь подключение к backend или вернись к курсу.'))
      .finally(() => setLoading(false));
  }, [chapterId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#08080A] pb-16 pt-24">
        <Mascot pose="shy" size="md" noFloat />
        <span className="ml-4 animate-pulse font-mono text-white/50">Собираем тему в понятную схему...</span>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="min-h-screen bg-[#08080A] pb-16 pt-24">
        <div className="mx-auto max-w-4xl px-6">
          <button onClick={() => navigate(-1)} className="group mb-8 inline-flex items-center gap-2 text-[13px] text-white/40 transition-colors hover:text-white">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Назад к разделам
          </button>
          <div className="surface-elevated rounded-3xl p-8">
            <AlertTriangle className="mb-4 h-5 w-5 text-[#FFB300]" />
            <p className="text-[14px] leading-7 text-white/62">{error || 'Глава не найдена.'}</p>
          </div>
        </div>
      </div>
    );
  }

  const conceptMap = chapter.key_concepts || [];
  const formulas = chapter.formulas || [];
  const solveFlow = chapter.solve_flow || [];
  const traps = chapter.common_traps || [];
  const representations = chapter.representation_cards || chapter.theory_visuals?.filter((item) => item.type === 'diagram') || [];
  const blueprints = chapter.exam_blueprints || [];
  const currentQuestion = quiz?.questions?.[currentQ];

  return (
    <div className="noise relative min-h-screen overflow-hidden bg-[#08080A] pb-24 pt-24 font-body" data-testid="chapter-page">
      <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-[#00E5FF]/[0.025] blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-[#FFD700]/[0.025] blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-4xl px-6">
        <button
          onClick={() => navigate(-1)}
          className="group mb-8 inline-flex items-center gap-2 text-[13px] text-white/40 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Назад к разделам
        </button>

        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex flex-col gap-6 md:flex-row md:items-center"
        >
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-full bg-[#FFD700]/20 blur-2xl" />
            <Suspense fallback={<Mascot pose="explaining" size="sm" interactive />}>
              <Mascot3D compact pose="pointing" className="-my-6 -ml-5 -mr-2" />
            </Suspense>
          </div>
          <div>
            <div className="mb-2 flex gap-2">
              <span className="rounded-md bg-[#FFD700]/10 px-2.5 py-1 font-mono text-[10px] font-bold text-[#FFD700]">
                ГЛАВА {chapter.order}
              </span>
            </div>
            <h1 className="mb-3 font-heading text-3xl font-black tracking-tight text-white sm:text-4xl">
              <PhysicsInline>{chapter.title}</PhysicsInline>
            </h1>
            <p className="max-w-2xl text-[14px] leading-7 text-white/46">
              Разберем тему так, чтобы ее можно было объяснить у доски, применить в задаче и не попасться на форматную ловушку ЦТ/ЦЭ.
            </p>
          </div>
        </motion.header>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="mb-6">
          <ChapterVisualHero chapter={chapter} />
        </motion.div>

        <div className="mb-10">
          <VisualMethodStrip />
        </div>

        <div className="mb-10 flex w-max max-w-full gap-2 overflow-x-auto rounded-2xl border border-white/5 bg-[#0F0F11] p-1.5 shadow-2xl">
          {[
            { id: 'theory', icon: BookOpen, label: 'Понять тему' },
            { id: 'formulas', icon: FlaskConical, label: 'Формулы' },
            ...(quiz ? [{ id: 'quiz', icon: Play, label: 'Мини-тест' }] : []),
          ].map((item) => (
            <button
              key={item.id}
              data-testid={`chapter-tab-${item.id}`}
              onClick={() => setTab(item.id)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-5 py-2.5 text-[13px] font-bold transition-all duration-300 ${
                tab === item.id
                  ? 'bg-[#FFD700] text-black shadow-[0_4px_16px_rgba(255,215,0,0.2)]'
                  : 'text-white/44 hover:bg-white/5 hover:text-white/82'
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-[#FFB300]/20 bg-[#FFB300]/[0.06] px-4 py-3 text-[13px] leading-6 text-white/66">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {tab === 'theory' && (
            <motion.div key="theory" {...tabMotion}>
              <div className="mb-5 grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <InfoCard icon={GraduationCap} title="Для школы" color="#00E5FF">
                  <p className="mb-4 text-[13px] leading-7 text-white/62">
                    <PhysicsInline>
                      {chapter.school_mastery?.goal || 'Понять физический смысл величин и закрепить тему на коротких проверках.'}
                    </PhysicsInline>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(chapter.school_mastery?.checkpoints || conceptMap).slice(0, 5).map((item) => (
                      <span key={item} className="rounded-lg border border-[#00E5FF]/15 bg-[#00E5FF]/10 px-2.5 py-1 text-[11px] text-[#00E5FF]/85">
                        <PhysicsInline>{item}</PhysicsInline>
                      </span>
                    ))}
                  </div>
                </InfoCard>

                <InfoCard icon={Timer} title="Для ЦТ/ЦЭ" color="#FFD700">
                  <p className="mb-4 text-[13px] leading-7 text-white/62">
                    Видеть форматную ловушку и решать оригинальные задания по blueprint, а не узнавать знакомый текст.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="rounded-xl bg-white/[0.04] px-3 py-2 text-[11px] text-white/56">A: выбор и соответствия</span>
                    <span className="rounded-xl bg-white/[0.04] px-3 py-2 text-[11px] text-white/56">B: числовой ответ</span>
                  </div>
                </InfoCard>
              </div>

              <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                <InfoCard icon={Network} title="Карта понятий" color="#00E5FF">
                  <div className="flex flex-wrap gap-2">
                    {conceptMap.map((concept, index) => (
                      <span key={`${concept}-${index}`} className="cursor-default rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[12px] text-white/80 transition-colors hover:bg-white/10">
                        <PhysicsInline>{concept}</PhysicsInline>
                      </span>
                    ))}
                  </div>
                </InfoCard>

                <InfoCard icon={Lightbulb} title="На что смотреть" color="#FFD700">
                  <p className="text-[13px] leading-7 text-white/62">
                    <PhysicsInline>
                      {chapter.theory_visuals?.find((item) => item.type === 'tip')?.text
                        || 'Сначала определи, что дано в условии: величина, график, направление или единица. В вариантах часто проверяют именно этот перевод.'}
                    </PhysicsInline>
                  </p>
                </InfoCard>
              </div>

              {representations.length > 0 && (
                <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
                  {representations.slice(0, 3).map((item, index) => (
                    <AnimatedRepresentationCard key={`${item.title}-${index}`} item={item} index={index} />
                  ))}
                </div>
              )}

              <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-[0.95fr_1.05fr]">
                <InfoCard icon={Route} title="Как решать" color="#39FF14">
                  <ol className="space-y-3">
                    {(solveFlow.length ? solveFlow : ['Определи модель.', 'Выпиши данные в СИ.', 'Выбери формулу.', 'Проверь смысл ответа.']).map((step, index) => (
                      <li key={`${step}-${index}`} className="flex gap-3 text-[13px] text-white/64">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#39FF14]/10 font-mono text-[11px] text-[#39FF14]">{index + 1}</span>
                        <span><PhysicsInline>{step}</PhysicsInline></span>
                      </li>
                    ))}
                  </ol>
                </InfoCard>

                <InfoCard icon={AlertTriangle} title="Типичные ошибки" color="#FFB300">
                  <ul className="space-y-3">
                    {(traps.length ? traps : ['Не подставляй числа до выбора физической модели.', 'Проверяй единицы и знак величины.']).map((trap, index) => (
                      <li key={`${trap}-${index}`} className="flex gap-3 text-[13px] text-white/64">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FFB300]" />
                        <span><PhysicsInline>{trap}</PhysicsInline></span>
                      </li>
                    ))}
                  </ul>
                </InfoCard>
              </div>

              {blueprints.length > 0 && (
                <section className="surface-overlay mb-6 rounded-3xl border border-[#FFD700]/15 p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <Target className="h-4 w-4 text-[#FFD700]" />
                    <h3 className="font-heading text-[13px] font-bold uppercase tracking-wider text-white">
                      Как из темы строятся оригинальные задания ЦТ/ЦЭ
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    {blueprints.slice(0, 3).map((blueprint) => (
                      <div key={blueprint.code} className="rounded-2xl border border-white/[0.06] bg-black/20 p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-mono text-[10px] text-[#FFD700]">{blueprint.code}</span>
                          <span className="font-mono text-[10px] text-white/30">часть {blueprint.part}</span>
                        </div>
                        <p className="mb-2 text-[12px] leading-snug text-white/70">
                          <PhysicsInline>{blueprint.skill}</PhysicsInline>
                        </p>
                        <p className="text-[11px] leading-snug text-white/38">
                          <PhysicsInline>{blueprint.novelty_rule}</PhysicsInline>
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <section className="surface-elevated rounded-3xl p-6 text-white/70 sm:p-8">
                <div className="mb-6 flex items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/35">теория без полотна</p>
                    <h3 className="mt-1 font-heading text-lg font-black text-white">Разбор по смысловым кускам</h3>
                  </div>
                </div>
                <PhysicsRichText text={chapter.theory} />
              </section>
            </motion.div>
          )}

          {tab === 'formulas' && (
            <motion.div key="formulas" {...tabMotion}>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {formulas.map((formula, index) => (
                  <motion.section
                    key={`${formula.name}-${index}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="group surface-overlay rounded-3xl border border-white/10 p-6 transition-colors hover:border-[#FFD700]/30"
                  >
                    <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.15em] text-white/32">
                      <PhysicsInline>{formula.name}</PhysicsInline>
                    </p>
                    <div className="mb-4 flex min-h-[112px] items-center justify-center rounded-2xl border border-white/5 bg-black/40 p-5 shadow-inner">
                      <FormulaDisplay formula={formula.formula} />
                    </div>
                    <div className="space-y-2">
                      <p className="text-[12px] leading-6 text-white/45">
                        <span className="text-white/65">Переменные:</span> <PhysicsInline>{formula.variables || 'обозначения зависят от условия задачи'}</PhysicsInline>
                      </p>
                      <p className="text-[12px] leading-6 text-white/45">
                        <span className="text-white/65">СИ:</span>{' '}
                        <span className="rounded bg-[#00E5FF]/10 px-1.5 py-0.5 font-mono text-[#00E5FF]">
                          <PhysicsInline>{formula.units || 'проверь по величинам'}</PhysicsInline>
                        </span>
                      </p>
                    </div>
                  </motion.section>
                ))}
              </div>
            </motion.div>
          )}

          {tab === 'quiz' && quiz && currentQuestion && (
            <motion.div key="quiz" {...tabMotion}>
              {!showResult ? (
                <section className="surface-elevated relative overflow-hidden rounded-3xl border border-white/5 p-8 sm:p-10">
                  <div className="absolute left-0 top-0 h-1 w-full bg-white/5">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#FFD700] to-[#FF8C00]"
                      initial={{ width: 0 }}
                      animate={{ width: `${(currentQ / quiz.questions.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>

                  <div className="mb-8 flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-white/35">
                      Задание {currentQ + 1} из {quiz.questions.length}
                    </span>
                  </div>

                  <h3 className="mb-8 text-lg font-medium leading-relaxed text-white md:text-xl">
                    <PhysicsInline>{currentQuestion.question}</PhysicsInline>
                  </h3>

                  <div className="mb-10 space-y-3">
                    {currentQuestion.options.map((option, optionIndex) => {
                      let stateClass = 'border-white/10 bg-white/5 text-white/72 hover:bg-white/10';
                      if (selectedOption === optionIndex && !showFeedback) stateClass = 'border-[#FFD700]/30 bg-[#FFD700]/10 text-[#FFD700] ring-1 ring-[#FFD700]/20';
                      if (showFeedback && optionIndex === currentQuestion.correct_index) stateClass = 'border-[#39FF14]/30 bg-[#39FF14]/10 text-[#39FF14]';
                      if (showFeedback && selectedOption === optionIndex && optionIndex !== currentQuestion.correct_index) stateClass = 'border-[#FF3B30]/30 bg-[#FF3B30]/10 text-[#FF3B30]';

                      return (
                        <button
                          key={`${option}-${optionIndex}`}
                          onClick={() => !showFeedback && setSelectedOption(optionIndex)}
                          disabled={showFeedback}
                          className={`flex w-full items-center rounded-2xl border px-5 py-4 text-left transition-all duration-300 ${stateClass}`}
                        >
                          <span className="mr-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-black/20 font-mono text-[12px] font-bold opacity-60">
                            {String.fromCharCode(65 + optionIndex)}
                          </span>
                          <span className="flex-1 text-[15px]"><PhysicsInline>{option}</PhysicsInline></span>
                          {showFeedback && optionIndex === currentQuestion.correct_index && <CheckCircle2 className="ml-2 h-5 w-5 shrink-0" />}
                          {showFeedback && selectedOption === optionIndex && optionIndex !== currentQuestion.correct_index && <XCircle className="ml-2 h-5 w-5 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {showFeedback && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className={`mb-6 rounded-2xl border p-5 ${selectedOption === currentQuestion.correct_index ? 'border-[#39FF14]/20 bg-[#39FF14]/5' : 'border-[#FF3B30]/20 bg-[#FF3B30]/5'}`}
                    >
                      <p className="text-[13px] leading-7 text-white/72">
                        <PhysicsInline>{currentQuestion.explanation}</PhysicsInline>
                      </p>
                    </motion.div>
                  )}

                  <div className="flex justify-end border-t border-white/5 pt-4">
                    {!showFeedback ? (
                      <Button
                        onClick={() => setShowFeedback(true)}
                        disabled={selectedOption === null}
                        className="h-12 rounded-xl bg-[#FFD700] px-8 font-bold text-black hover:bg-[#FFCA00]"
                      >
                        Проверить
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          const nextAnswers = [...answers, selectedOption];
                          setAnswers(nextAnswers);
                          if (currentQ < quiz.questions.length - 1) {
                            setCurrentQ(currentQ + 1);
                            setSelectedOption(null);
                            setShowFeedback(false);
                            return;
                          }

                          setSubmitting(true);
                          apiClient.post(`/quizzes/${quiz._id}/submit`, { answers: nextAnswers })
                            .then((response) => {
                              setQuizResult(response.data);
                              setShowResult(true);
                            })
                            .catch(() => setError('Ответы не удалось отправить. Проверь соединение и попробуй еще раз.'))
                            .finally(() => setSubmitting(false));
                        }}
                        className="h-12 rounded-xl bg-white px-8 font-bold text-black hover:bg-white/90"
                      >
                        {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : currentQ < quiz.questions.length - 1 ? 'Следующий вопрос' : 'Завершить'}
                      </Button>
                    )}
                  </div>
                </section>
              ) : (
                <motion.section initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="surface-elevated relative overflow-hidden rounded-3xl p-10 text-center">
                  <div className={`absolute inset-0 opacity-20 blur-3xl ${quizResult.score >= quiz.questions.length * 0.6 ? 'bg-[#39FF14]' : 'bg-[#FF3B30]'}`} />
                  <Mascot pose={quizResult.score >= quiz.questions.length * 0.6 ? 'smiling' : 'shy'} size="lg" noFloat />
                  <h2 className="mb-2 mt-6 font-heading text-2xl font-black text-white">Работа принята</h2>
                  <p className="mb-4 font-mono text-4xl font-black tracking-tighter text-[#FFD700]">{quizResult.score} / {quiz.questions.length}</p>
                  <p className="mx-auto mb-8 max-w-md text-white/44">
                    Получено <span className="font-bold text-[#00E5FF]">+{quizResult.xp_earned} XP</span>. Ошибки лучше разобрать сразу: так тема превращается в навык.
                  </p>
                  <Button onClick={() => navigate('/dashboard')} className="h-12 rounded-xl bg-[#FFD700] px-8 font-bold text-black hover:bg-[#FFCA00]">
                    Вернуться в дашборд
                  </Button>
                </motion.section>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
