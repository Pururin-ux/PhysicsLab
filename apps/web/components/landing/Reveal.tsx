"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

// Контент должен быть видим уже в SSR/первом кадре. Motion здесь остаётся
// только как мягкое улучшение, а не как условие отображения секции.
export function Reveal({ children, delay = 0, className }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-24px" }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
