import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MASCOT_IMAGES = {
  smiling: process.env.PUBLIC_URL + '/mascot/avatar/lab-avatar-presenting-ui.png',
  pointing: process.env.PUBLIC_URL + '/mascot/avatar/lab-avatar-pointing-ui.png',
  explaining: process.env.PUBLIC_URL + '/mascot/avatar/lab-avatar-presenting-ui.png',
  shy: process.env.PUBLIC_URL + '/mascot/avatar/lab-avatar-surprised-ui.png',
};

const SIZES = {
  xs: 'h-16 w-16',
  sm: 'h-24 w-24',
  md: 'h-40 w-40',
  lg: 'h-56 w-56',
  xl: 'h-72 w-72',
  hero: 'h-72 w-72 sm:h-80 sm:w-80 md:h-[400px] md:w-[400px] lg:h-[460px] lg:w-[460px]',
};

const DESKTOP_MAX_HEIGHTS = {
  lg: 'md:max-h-56',
  xl: 'md:max-h-72',
  hero: 'md:max-h-[400px] lg:max-h-[460px]',
};

const LARGE_WIDTHS = {
  lg: 'w-56',
  xl: 'w-72',
  hero: 'w-72 sm:w-80 md:w-[400px] lg:w-[460px]',
};

export function Mascot({
  pose = 'smiling',
  size = 'md',
  speech,
  className = '',
  noFloat = true,
  interactive = false,
}) {
  const [loaded, setLoaded] = useState(false);
  const image = MASCOT_IMAGES[pose] || MASCOT_IMAGES.smiling;
  const sizeClass = SIZES[size] || SIZES.md;
  const isLarge = size === 'hero' || size === 'xl' || size === 'lg';
  const imageSizeClass = isLarge ? `${LARGE_WIDTHS[size] || ''} h-24 md:h-auto ${DESKTOP_MAX_HEIGHTS[size] || ''}` : sizeClass;
  const shouldFloat = interactive && !noFloat;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <motion.div
        className="relative z-10"
        animate={shouldFloat ? { y: [0, -6, 0] } : undefined}
        transition={shouldFloat ? { duration: 5, repeat: Infinity, ease: 'easeInOut' } : undefined}
      >
        {!loaded && <div className={`${sizeClass} skeleton rounded-full`} />}

        <motion.img
          src={image}
          alt="Физа - маскот PhysicsLab"
          className={`${imageSizeClass} select-none object-contain transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          style={{
            filter: 'drop-shadow(0 16px 34px rgba(0,0,0,0.55)) drop-shadow(0 8px 18px rgba(255,215,0,0.16))',
          }}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={loaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          onLoad={() => setLoaded(true)}
          loading={isLarge ? 'eager' : 'lazy'}
          decoding="async"
          draggable={false}
          data-testid={`mascot-${pose}`}
        />
      </motion.div>

      {speech && (
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.12 }}
          className="surface-overlay absolute -right-4 -top-4 z-20 max-w-[240px] rounded-2xl rounded-bl-none border border-[#FFD700]/25 px-5 py-3 shadow-[0_12px_34px_rgba(0,0,0,0.35)] md:-right-8"
        >
          <p className="text-[14px] font-medium leading-relaxed text-white">{speech}</p>
        </motion.div>
      )}
    </div>
  );
}
