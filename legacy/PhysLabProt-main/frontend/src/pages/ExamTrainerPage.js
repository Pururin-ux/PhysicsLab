import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mascot } from '@/components/Mascot';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { apiClient } from '@/lib/api';
import { Timer, ArrowLeft, CheckCircle2, XCircle, Zap, Loader2, ClipboardCheck, Brain, Calculator, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function ExamTrainerPage() {
  const navigate = useNavigate();
  const [variants, setVariants] = useState([]);
  const [activeVariant, setActiveVariant] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [numericAnswer, setNumericAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    apiClient.get('/exam-variants')
      .then(r => setVariants(r.data))
      .catch(() => setError('Не удалось загрузить варианты. Проверь подключение к backend и обнови страницу.'))
      .finally(() => setLoading(false));
  }, []);

  // Timer
  useEffect(() => {
    if (!activeVariant || showResult) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [activeVariant, showResult]);

  const startExam = async (variantId) => {
    try {
      setError('');
      const res = await apiClient.get(`/exam-variants/${variantId}`);
      setActiveVariant(res.data);
      setTimeLeft(res.data.time_limit * 60);
      setCurrentQ(0);
      setAnswers([]);
      setSelectedOption(null);
      setNumericAnswer('');
      setShowResult(false);
    } catch {
      setError('Вариант не открылся. Попробуй выбрать его еще раз.');
    }
  };

  const selectAnswer = () => {
    const q = activeVariant.questions?.[currentQ];
    const answer = q?.answer_type === 'numeric' ? numericAnswer.trim() : selectedOption;
    if (q?.answer_type === 'numeric' ? !answer : answer === null) return;
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    if (currentQ < activeVariant.questions.length - 1) {
      setCurrentQ(prev => prev + 1);
      setSelectedOption(null);
      setNumericAnswer('');
    } else {
      submitExam(newAnswers);
    }
  };

  const submitExam = async (finalAnswers) => {
    setSubmitting(true);
    try {
      const res = await apiClient.post(`/exam-variants/${activeVariant._id}/submit`, { answers: finalAnswers });
      setResult(res.data);
      setShowResult(true);
    } catch {
      setError('Ответы не отправились. Проверь соединение и попробуй еще раз.');
    }
    finally { setSubmitting(false); }
  };

  const formatTime = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  // Variant selection
  if (!activeVariant) {
    return (
      <div className="min-h-screen bg-[#08080A] pt-[72px] pb-16" data-testid="exam-trainer-page">
        <div className="max-w-3xl mx-auto px-6 lg:px-12">
          <button onClick={() => navigate('/exam')} className="inline-flex items-center gap-1.5 text-[13px] text-white/30 hover:text-white/60 mb-6 transition-colors" data-testid="back-btn">
            <ArrowLeft className="w-3.5 h-3.5" /> Назад
          </button>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <Mascot pose="pointing" size="md" className="mx-auto mb-5" noFloat />
            <h1 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-tight mb-2">Тренажёр ЦТ / ЦЭ</h1>
            <p className="text-[13px] text-white/35">Выбери вариант и реши в формате настоящего экзамена</p>
            <p className="text-[11px] text-[#FFD700]/65 mt-2">Задания ориентированы на методику РИКЗ: без копирования оригинальных формулировок</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            {[
              { icon: Brain, label: 'Часть A', text: 'быстрый выбор модели и ловушки' },
              { icon: Calculator, label: 'Часть B', text: 'числовой ответ без единиц' },
              { icon: ShieldCheck, label: 'Новизна', text: 'новый сюжет, не замена чисел' },
            ].map((item) => (
              <div key={item.label} className="surface-base rounded-2xl p-4 border border-white/[0.06]">
                <item.icon className="w-4 h-4 text-[#FFD700] mb-3" />
                <p className="text-[12px] text-white font-bold mb-1">{item.label}</p>
                <p className="text-[11px] text-white/40 leading-snug">{item.text}</p>
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-[#FFB300]/20 bg-[#FFB300]/[0.06] px-4 py-3 text-[13px] leading-6 text-white/66">
              <AlertTriangle className="mt-1 h-4 w-4 shrink-0 text-[#FFB300]" />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="space-y-3">{[0,1].map(i => <div key={i} className="h-20 skeleton rounded-2xl" />)}</div>
          ) : variants.length === 0 ? (
            <div className="text-center py-16 surface-elevated rounded-2xl">
              <Mascot pose="shy" size="md" className="mx-auto mb-4" />
              <p className="text-white/40">Варианты скоро появятся!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {variants.map((v, i) => (
                <motion.div key={v._id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                  <button
                    onClick={() => startExam(v._id)}
                    className="w-full text-left surface-elevated rounded-xl p-5 card-interactive group flex items-center justify-between"
                    data-testid={`exam-variant-${i}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#FFD700]/[0.08] flex items-center justify-center">
                        <ClipboardCheck className="w-5 h-5 text-[#FFD700]" />
                      </div>
                      <div>
                        <p className="text-[14px] text-white font-medium group-hover:text-[#FFD700] transition-colors">{v.title}</p>
                        <p className="text-[12px] text-white/30">{v.questions?.length || 0} заданий · {v.time_limit || 210} мин</p>
                        {v.blueprint_summary?.[0] && <p className="text-[11px] text-white/25 mt-1">{v.blueprint_summary[0]}</p>}
                      </div>
                    </div>
                    <span className="text-[13px] text-[#FFD700]/60 font-medium">Начать</span>
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  const q = activeVariant.questions?.[currentQ];

  // Results screen
  if (showResult && result) {
    return (
      <div className="min-h-screen bg-[#08080A] pt-[72px] pb-16" data-testid="exam-results">
        <div className="max-w-3xl mx-auto px-6 lg:px-12">
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="surface-elevated rounded-2xl p-8 text-center">
            <Mascot pose={result.score >= result.total * 0.6 ? 'smiling' : 'shy'} size="md" className="mx-auto mb-6" noFloat />
            <h2 className="font-heading text-xl font-bold text-white tracking-tight mb-2">
              {result.score >= result.total * 0.6 ? 'Хороший результат!' : 'Есть над чем работать!'}
            </h2>
            <p className="text-3xl font-mono font-bold text-[#FFD700] mb-1 stat-value">{result.score}/{result.total}</p>
            <p className="text-[13px] text-white/30 mb-2">{Math.round(result.score / result.total * 100)}% правильных</p>
            <div className="flex items-center justify-center gap-1.5 mb-8">
              <Zap className="w-4 h-4 text-[#FFD700]" />
              <span className="text-[14px] text-[#FFD700] font-bold">+{result.xp_earned} XP</span>
            </div>

            <div className="space-y-2.5 text-left mb-8 max-w-2xl mx-auto max-h-[400px] overflow-y-auto pr-2">
              {result.results?.map((r, i) => (
                <div key={i} className={`rounded-xl p-4 ${r.is_correct ? 'bg-[#39FF14]/[0.03] border border-[#39FF14]/[0.08]' : 'bg-[#FF3B30]/[0.03] border border-[#FF3B30]/[0.08]'}`}>
                  <div className="flex items-start gap-2">
                    {r.is_correct ? <CheckCircle2 className="w-4 h-4 text-[#39FF14]/60 mt-0.5 shrink-0" /> : <XCircle className="w-4 h-4 text-[#FF3B30]/60 mt-0.5 shrink-0" />}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.04] text-white/30">{r.topic}</span>
                      </div>
                      <p className="text-[13px] text-white/60 mb-0.5 leading-snug">{r.question}</p>
                      {r.answer_type === 'numeric' && (
                        <p className="text-[11px] text-white/35 mb-1">
                          Твой ответ: <span className="font-mono text-white/55">{r.user_answer ?? '—'}</span> · верно: <span className="font-mono text-[#FFD700]">{r.correct_answer}</span>
                        </p>
                      )}
                      <p className="text-[12px] text-white/30">{r.explanation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-3">
              <Button onClick={() => { setActiveVariant(null); setShowResult(false); }} variant="ghost" className="text-white/50 hover:text-white rounded-full h-10 px-5 text-[13px]" data-testid="back-to-variants">
                К вариантам
              </Button>
              <Button onClick={() => navigate('/dashboard')} className="bg-[#FFD700] text-black hover:bg-[#FFCA00] font-bold rounded-full h-10 px-6 text-[13px]" data-testid="go-to-dashboard">
                Дашборд
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Active exam
  return (
    <div className="min-h-screen bg-[#08080A] pt-[72px] pb-16" data-testid="exam-active">
      <div className="max-w-3xl mx-auto px-6 lg:px-12">
        {/* Timer bar */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="surface-overlay rounded-xl p-3 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[12px] text-white/30 font-mono">Вопрос {currentQ + 1} / {activeVariant.questions.length}</span>
            {q?.part && <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FFD700]/10 text-[#FFD700]/70">Часть {q.part}</span>}
          </div>
          <div className="flex items-center gap-2">
            <Timer className="w-3.5 h-3.5 text-white/30" />
            <span className={`text-[13px] font-mono font-bold ${timeLeft < 300 ? 'text-[#FF3B30]' : 'text-white/50'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </motion.div>

        <Progress value={((currentQ + 1) / activeVariant.questions.length) * 100} className="h-1 bg-white/[0.04] mb-8 rounded-full" />

        {error && (
          <div className="mb-6 rounded-2xl border border-[#FFB300]/20 bg-[#FFB300]/[0.06] px-4 py-3 text-[13px] leading-6 text-white/66">
            {error}
          </div>
        )}

        {/* Question */}
        <div className="surface-elevated rounded-2xl p-7">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {q?.topic && <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-white/25">{q.topic}</span>}
            {q?.blueprint && <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FFD700]/10 text-[#FFD700]/65">{q.blueprint}</span>}
            {q?.answer_type === 'numeric' && <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00E5FF]/10 text-[#00E5FF]/65">числовой ответ</span>}
          </div>
          <h3 className="text-[15px] text-white font-medium leading-relaxed mb-7" data-testid="exam-question">{q?.question}</h3>

          {q?.answer_type === 'numeric' ? (
            <div className="mb-7">
              <label className="block text-[11px] uppercase tracking-widest text-white/25 font-bold mb-2" htmlFor="numeric-answer">
                Ответ
              </label>
              <div className="flex items-center gap-3 surface-base rounded-2xl p-3 border border-white/[0.06] focus-within:border-[#FFD700]/30">
                <input
                  id="numeric-answer"
                  value={numericAnswer}
                  onChange={(e) => setNumericAnswer(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-2xl font-mono text-[#FFD700] placeholder:text-white/15"
                  placeholder="только число"
                  inputMode="decimal"
                  data-testid="exam-numeric-answer"
                />
                <span className="text-[11px] text-white/25">единицы не вводить</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5 mb-7">
              {q?.options?.map((opt, oi) => (
                <button
                  key={oi}
                  onClick={() => setSelectedOption(oi)}
                  className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all duration-200 flex items-center ${
                    selectedOption === oi
                      ? 'bg-[#FFD700]/[0.06] border-[#FFD700]/25 text-[#FFD700] ring-1 ring-[#FFD700]/15'
                      : 'bg-white/[0.02] border-white/[0.06] text-white/70 hover:bg-white/[0.04]'
                  }`}
                  data-testid={`exam-option-${oi}`}
                >
                  <span className="w-6 h-6 rounded-md bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mr-3 shrink-0">
                    <span className="font-mono text-[11px] font-bold opacity-50">{String.fromCharCode(65 + oi)}</span>
                  </span>
                  <span className="text-[14px] leading-snug">{opt}</span>
                </button>
              ))}
            </div>
          )}

          <div className="flex justify-end">
            <Button
              onClick={selectAnswer}
              disabled={(q?.answer_type === 'numeric' ? !numericAnswer.trim() : selectedOption === null) || submitting}
              className="bg-[#FFD700] text-black hover:bg-[#FFCA00] font-bold rounded-full h-10 px-6 text-[13px] disabled:opacity-30 transition-all"
              data-testid="exam-next-btn"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : currentQ < activeVariant.questions.length - 1 ? 'Далее' : 'Завершить'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
