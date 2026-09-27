"use client";

import dynamic from "next/dynamic";

const PhotoelectricNotebook = dynamic(() => import("./PhotoelectricNotebook").then(module => module.PhotoelectricNotebook));
const LightPressureNotebook = dynamic(() => import("./LightPressureNotebook").then(module => module.LightPressureNotebook));
const RutherfordNotebook = dynamic(() => import("./RutherfordNotebook").then(module => module.RutherfordNotebook));
const BohrTransitionNotebook = dynamic(() => import("./BohrTransitionNotebook").then(module => module.BohrTransitionNotebook));
const LaserNotebook = dynamic(() => import("./LaserNotebook").then(module => module.LaserNotebook));

export function ModernPhysicsScene({ chapterId }: { chapterId: string }) {
  switch (chapterId) {
    case "photoelectric-effect":
      return <section id="photoelectric-model" aria-label="Модель фотоэффекта и проверка гипотезы об интенсивности света"><PhotoelectricNotebook /></section>;
    case "light-pressure-and-duality":
      return <section id="light-pressure-model" aria-label="Сравнение передачи импульса при поглощении и отражении света"><LightPressureNotebook /></section>;
    case "rutherford-scattering":
      return <section id="rutherford-notebook" aria-label="Проверка предсказания модели атома опытом с золотой фольгой"><RutherfordNotebook /></section>;
    case "bohr-transitions":
      return <section id="bohr-notebook" aria-label="Проверка перехода между энергетическими уровнями атома водорода"><BohrTransitionNotebook /></section>;
    case "laser-amplification":
      return <section id="laser-notebook" aria-label="Проверка того, как активная среда усиливает лазерный свет"><LaserNotebook /></section>;
    default:
      return null;
  }
}
