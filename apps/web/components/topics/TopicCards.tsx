"use client";

import { useStore } from "@nanostores/react";
import { ArrowRight, CheckCircle, Flag, Play } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getLearningNextStep } from "../../lib/learning/next-step";
import { topics, upcomingTopics } from "../../lib/topics";
import { $examLog, getBestAttempt } from "../../lib/stores/exam-log-store";
import { $appProgress } from "../../lib/stores/progress-store";
import { Button } from "../ui/Button";
import { MathText } from "../ui/MathText";

const topicArt = {
  kinematics: "/art/production/topic-kinematics-cozy.webp",
  dynamics: "/art/production/topic-dynamics-cozy.webp",
  electrodynamics: "/art/production/topic-electricity-cozy.webp",
  thermodynamics: "/art/production/topic-thermodynamics-cozy.webp",
  optics: "/art/production/topic-optics-cozy.webp",
} as const;

const topicArtPosition = {
  kinematics: "object-[center_45%]",
  dynamics: "object-[center_55%]",
  electrodynamics: "object-[center_35%]",
  thermodynamics: "object-[center_52%]",
  optics: "object-[center_40%]",
} as const;

const routeTopics = [topics[0], topics[1], topics[2], topics[4], topics[3]] as const;

const topicTone = {
  kinematics: { border: "border-t-nova-ember", text: "text-nova-ember" },
  dynamics: { border: "border-t-nova-blue", text: "text-nova-blue" },
  electrodynamics: { border: "border-t-[#73d6eb]", text: "text-[#28758a]" },
  optics: { border: "border-t-nova-pink", text: "text-nova-pink" },
  thermodynamics: { border: "border-t-nova-gold", text: "text-nova-gold" },
} as const;

export function TopicCards() {
  const progress = useStore($appProgress);
  const examLog = useStore($examLog);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const bestExam = mounted ? getBestAttempt(examLog) : null;
  const nextStep = getLearningNextStep(progress, Boolean(bestExam));

  return (
    <div className="flex flex-col gap-9">
      <section className="relative grid overflow-hidden rounded-card border border-nova-pink/24 bg-space-900 p-5 shadow-[0_20px_52px_rgba(0,0,0,.28)] sm:p-6 lg:grid-cols-[minmax(0,1fr)_230px] lg:gap-5" aria-label="Следующий шаг обучения">
          <div className="max-w-[720px]">
            <p className="text-[11px] font-extrabold uppercase tracking-[.14em] text-nova-pink">{nextStep.label}</p>
            <h2 className="mt-2 text-[22px] font-[800] tracking-[-.02em] text-white">{nextStep.title}</h2>
            <p className="mt-2 text-[13px] leading-[1.65] text-white/64"><MathText text={nextStep.body} /></p>
          </div>
          <div className="mt-5 flex flex-col justify-between gap-4 rounded-option border border-nova-blue/24 bg-nova-indigo/[.09] p-4 lg:mt-0">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.13em] text-white/64">Ближайший навык</p>
              <p className="mt-1 text-[13px] font-bold text-white/76">Откроется сразу в тренажёре</p>
            </div>
            <Button asChild className="w-full gap-2"><Link href={nextStep.href}>{nextStep.cta}<ArrowRight size={17} weight="bold" /></Link></Button>
          </div>
      </section>

      <section aria-labelledby="route-title">
        <div className="mb-7">
          <h2 id="route-title" className="text-[26px] font-[800] tracking-[-.025em] text-white">Маршрут по темам</h2>
          <p className="mt-2 max-w-[820px] text-[13px] leading-[1.65] text-white/58">
            {routeTopics.length} тем · {routeTopics.reduce((sum, topic) => sum + topic.skillsCount, 0)} навыков · порядок построен от механики к электричеству, оптике и тепловым явлениям.
          </p>
        </div>

        <div className="relative mb-7 hidden lg:block" aria-hidden="true">
          <div className="absolute left-[8%] right-[8%] top-5 h-px bg-[linear-gradient(90deg,#F39A82_0%,#8D83F4_25%,#79D9EE_50%,#E079C7_75%,#E8B66D_100%)] opacity-65" />
          <div className="relative grid grid-cols-5 gap-3">
            {routeTopics.map((topic, index) => (
              <div key={topic.id} className="flex flex-col items-center text-center">
                <span className="grid size-10 place-items-center rounded-full border border-nova-blue/48 bg-space-950 text-[12px] font-extrabold text-nova-blue shadow-[0_0_18px_rgba(101,88,216,.16)]">{index + 1}</span>
                <span className="mt-2 text-[11px] font-bold text-white/58">{topic.title}</span>
              </div>
            ))}
          </div>
        </div>

        <ol className="relative grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {routeTopics.map((topic, index) => {
            const topicProgress = mounted ? progress.topics[topic.id] : null;
            const solved = topicProgress?.solved ?? 0;
            const sessions = topicProgress?.completedSessions ?? 0;
            const hasProgress = solved > 0 || sessions > 0;
            return (
              <li key={topic.id} id={topic.id} className="relative min-w-0 scroll-mt-28">
                <Link
                  href={topic.href}
                  className={`group block overflow-hidden rounded-card border border-t-2 border-white/[.12] bg-space-900 shadow-[0_18px_46px_rgba(0,0,0,.25)] transition-[transform,border-color,box-shadow] hover:-translate-y-1 hover:border-nova-blue/55 hover:shadow-[0_24px_58px_rgba(0,0,0,.28),0_0_22px_rgba(101,88,216,.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/70 ${topicTone[topic.id].border}`}
                >
                  <div className="relative h-[158px] overflow-hidden bg-space-950">
                    <Image src={topicArt[topic.id]} alt="" fill priority={index === 0} sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" className={`object-cover transition-transform duration-500 group-hover:scale-[1.035] ${topicArtPosition[topic.id]}`} />
                    <div className="flex items-start justify-between gap-3">
                      <span className="absolute left-4 top-4 grid size-9 place-items-center rounded-full border border-nova-pink/34 bg-space-950/75 text-[12px] font-extrabold text-nova-pink backdrop-blur-sm">{index + 1}</span>
                      <span className="absolute right-4 top-4 rounded-full border border-white/[.12] bg-space-950/72 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.1em] text-white/70 backdrop-blur-sm">{hasProgress ? "в процессе" : index === 0 ? "начни здесь" : "не начато"}</span>
                    </div>
                  </div>
                  <div className="bg-space-900 p-5">
                    <h3 className={`text-[20px] font-[800] leading-tight ${topicTone[topic.id].text}`}>{topic.title}</h3>
                    <p className="mt-2 min-h-[42px] text-[12px] leading-[1.6] text-white/64">{topic.description}</p>
                    <div className="mt-4 flex items-center justify-between text-[11px] font-bold text-white/58">
                      <span>{topic.skillsCount} навыков</span>
                      <span className="text-nova-blue">{solved} решено</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between border-t border-white/[.08] pt-3">
                      <span className="text-[11px] font-semibold text-white/46">{topic.modeLabel}</span>
                      <ArrowRight size={17} weight="bold" className="text-nova-blue transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
        <div className="rounded-card border border-nova-blue/26 bg-space-900 p-5 shadow-[0_18px_46px_rgba(0,0,0,.24)] sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-6">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.13em] text-nova-blue"><Flag size={16} weight="duotone" />Контрольная точка</p>
            <h2 className="mt-2 text-[22px] font-[800] text-white">Смешанная тренировка</h2>
            <p className="mt-2 max-w-[640px] text-[13px] leading-[1.65] text-white/60">10 задач из открытых разделов. Формулы, графики и типичные ловушки перемешаны.</p>
            {bestExam ? <p className="mt-2 text-[12px] font-bold text-nova-pink">Лучший результат: {bestExam.score}/{bestExam.total}</p> : null}
          </div>
          <Button asChild className="mt-5 shrink-0 gap-2 sm:mt-0"><Link href="/practice/exam-demo"><Play size={16} weight="fill" />Начать</Link></Button>
        </div>

        {upcomingTopics.map((topic) => (
          <div key={topic.id} className="rounded-card border border-white/[.09] bg-space-900/72 p-5 sm:p-6">
            <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.13em] text-white/46"><CheckCircle size={16} weight="duotone" />Следующий раздел</p>
            <h3 className="mt-2 text-[19px] font-[800] text-white/84">{topic.title}</h3>
            <p className="mt-2 text-[13px] leading-[1.6] text-white/52">{topic.description}</p>
            <p className="mt-4 text-[11px] font-bold uppercase tracking-[.1em] text-nova-pink/72">готовится</p>
          </div>
        ))}
      </section>
    </div>
  );
}
