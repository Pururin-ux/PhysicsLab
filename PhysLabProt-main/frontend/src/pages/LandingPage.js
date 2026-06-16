import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Brain, CheckCircle2, GraduationCap, Route, Sparkles, Target, Timer } from 'lucide-react';
import { Mascot } from '@/components/Mascot';
import { Button } from '@/components/ui/button';
import { AnimatedPhysicsDiagram } from '@/components/PhysicsChapterVisual';
import { FormulaDisplay } from '@/components/PhysicsText';

const Mascot3D = lazy(() => import('@/components/Mascot3D'));

function useLargeViewport() {
  const [isLarge, setIsLarge] = useState(() => (
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)').matches : true
  ));

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsLarge(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return isLarge;
}

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.48, ease: [0.33, 1, 0.68, 1] } },
};

const trackCards = [
  {
    icon: BookOpen,
    title: 'Школьная физика',
    text: 'Разобраться в теме, подтянуть оценки и не бояться контрольных.',
    color: '#00E5FF',
    href: '/school',
    meta: 'VII-XI классы',
  },
  {
    icon: GraduationCap,
    title: 'ЦТ / ЦЭ тренажёр',
    text: 'Отдельный темп, часть A/B, тайминг и оригинальные задания по blueprint.',
    color: '#FFD700',
    href: '/exam',
    meta: 'экзамен Беларуси',
  },
];

const methodSteps = [
  { icon: Route, title: 'Сначала модель', text: 'Рисунок, график или схема до подстановки чисел.' },
  { icon: Brain, title: 'Потом смысл', text: 'Что сохраняется, что меняется и где ловушка условия.' },
  { icon: CheckCircle2, title: 'Затем тренажёр', text: 'Короткая проверка закрепляет тему без заучивания формулировок.' },
];

function TrackCard({ track, index }) {
  return (
    <Link to={track.href} className="group block rounded-2xl border border-white/[0.07] bg-white/[0.035] p-4 transition-colors hover:border-white/[0.16] hover:bg-white/[0.055]">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border" style={{ backgroundColor: `${track.color}12`, borderColor: `${track.color}28` }}>
            <track.icon className="h-5 w-5" style={{ color: track.color }} />
          </div>
          <div>
            <p className="text-[11px] font-mono uppercase text-white/32">{track.meta}</p>
            <h3 className="font-heading text-[15px] font-bold text-white">{track.title}</h3>
          </div>
        </div>
        <span className="font-mono text-[11px]" style={{ color: track.color }}>0{index + 1}</span>
      </div>
      <p className="mb-4 text-[13px] leading-6 text-white/52">{track.text}</p>
      <span className="inline-flex items-center gap-1.5 text-[12px] font-bold text-white/68 transition-colors group-hover:text-white">
        Начать <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

function PhysicsPreview() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#0B0D10] p-4 shadow-2xl">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(0,229,255,0.08),transparent_36%,rgba(255,215,0,0.08))]" />
      <div className="relative grid gap-4">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#00E5FF]/70">живая глава</p>
            <p className="mt-1 text-[13px] font-bold text-white">Кинематика без стены текста</p>
          </div>
          <div className="rounded-xl border border-[#FFD700]/20 bg-[#FFD700]/10 px-3 py-2 text-right">
            <p className="font-mono text-[10px] text-[#FFD700]">ЦТ/ЦЭ</p>
            <p className="text-[11px] text-white/48">формат отдельно</p>
          </div>
        </div>

        <AnimatedPhysicsDiagram type="motion" className="h-44" />

        <div className="grid gap-3 sm:grid-cols-[1fr_0.85fr]">
          <div className="rounded-2xl border border-white/[0.06] bg-black/24 p-4">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-white/32">формула</p>
            <FormulaDisplay formula="x = x_0 + v_0t + \\frac{at^2}{2}" size="sm" />
          </div>
          <div className="rounded-2xl border border-white/[0.06] bg-black/24 p-4">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white/32">подсказка</p>
            <p className="text-[12px] leading-5 text-white/58">Площадь под графиком скорости дает перемещение. Сначала читаем оси.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const isLargeViewport = useLargeViewport();

  return (
    <div className="noise min-h-screen overflow-hidden bg-[#08080A] text-white">
      <section className="relative pt-24 pb-12 lg:min-h-[82dvh] lg:pb-10">
        <div className="absolute inset-0 opacity-[0.16]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.13) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.13) 1px, transparent 1px)', backgroundSize: '44px 44px' }} />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FFD700]/50 to-transparent" />

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 lg:grid-cols-[0.94fr_1.06fr] lg:px-12">
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }} className="max-w-2xl">
            <motion.h1 variants={fadeUp} className="font-heading text-[44px] font-black leading-[1.02] tracking-tight sm:text-6xl lg:text-[76px]">
              PhysicsLab
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-5 max-w-xl text-[17px] leading-8 text-white/58 sm:text-lg">
              Физика для белорусских школьников: отдельно школьное понимание, отдельно подготовка к ЦТ/ЦЭ. Без копирования заданий, без заучивания чисел, с визуальными моделями и короткими проверками.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" data-testid="landing-start-link">
                <Button className="h-12 rounded-xl bg-[#FFD700] px-6 text-[14px] font-black text-black shadow-[0_12px_32px_rgba(255,215,0,0.24)] hover:bg-[#FFCA00]">
                  Начать подготовку <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login" data-testid="landing-login-link">
                <Button variant="outline" className="h-12 rounded-xl border-white/[0.12] bg-white/[0.04] px-6 text-[14px] font-bold text-white hover:bg-white/[0.08] hover:text-white">
                  Войти
                </Button>
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-8 grid gap-3 sm:grid-cols-2">
              {trackCards.map((track, index) => <TrackCard key={track.title} track={track} index={index} />)}
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 22, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.62, ease: [0.33, 1, 0.68, 1] }} className="relative">
            <PhysicsPreview />
            <div className="pointer-events-none absolute -right-72 -top-10 hidden h-[430px] w-[310px] lg:block">
              {isLargeViewport && (
                <Suspense fallback={<Mascot pose="pointing" size="hero" interactive={false} />}>
                  <Mascot3D pose="presenting" className="h-[430px]" />
                </Suspense>
              )}
            </div>
            {!isLargeViewport && (
              <div className="mt-6 flex justify-center">
                <Suspense fallback={<Mascot pose="pointing" size="lg" interactive={false} />}>
                  <Mascot3D compact pose="presenting" />
                </Suspense>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <section className="border-t border-white/[0.06] bg-[#0B0B0D] py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-heading text-2xl font-black text-white sm:text-3xl">Как устроено обучение</h2>
              <p className="mt-2 max-w-2xl text-[14px] leading-7 text-white/48">Каждая тема собирается вокруг физической идеи, а тренажер проверяет новый сюжет, а не память на старую формулировку.</p>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-[#00E5FF]/16 bg-[#00E5FF]/[0.06] px-3 py-2 text-[12px] font-bold text-[#00E5FF]">
              <Sparkles className="h-4 w-4" />
              визуальные главы + KaTeX
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {methodSteps.map((step, index) => (
              <div key={step.title} className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFD700]/10">
                    <step.icon className="h-5 w-5 text-[#FFD700]" />
                  </div>
                  <span className="font-mono text-[11px] text-white/28">0{index + 1}</span>
                </div>
                <h3 className="font-heading text-[15px] font-bold text-white">{step.title}</h3>
                <p className="mt-2 text-[13px] leading-6 text-white/50">{step.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-[1fr_1fr_1fr]">
            {[
              { icon: Target, title: 'Оригинальные задания', text: 'Из методики берется структура: модель, ловушка, проверяемый навык. Условие пишется заново.' },
              { icon: Timer, title: 'Отдельный экзамен', text: 'ЦТ/ЦЭ не смешивается со школьным темпом: другой режим, другой результат, другой фокус.' },
              { icon: Brain, title: 'Дружелюбная теория', text: 'Короткие блоки, понятные формулы, визуальные подсказки и проверка сразу после темы.' },
            ].map((item) => (
              <div key={item.title} className="flex gap-3 rounded-2xl border border-white/[0.06] bg-black/20 p-4">
                <item.icon className="mt-1 h-4 w-4 shrink-0 text-[#00E5FF]" />
                <div>
                  <p className="text-[13px] font-bold text-white">{item.title}</p>
                  <p className="mt-1 text-[12px] leading-5 text-white/46">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
