import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MASCOT_IMAGES = {
  full: `${process.env.PUBLIC_URL}/mascot/avatar/lab-avatar-presenting-ui.png`,
  pointing: `${process.env.PUBLIC_URL}/mascot/avatar/lab-avatar-pointing-ui.png`,
  presenting: `${process.env.PUBLIC_URL}/mascot/avatar/lab-avatar-presenting-ui.png`,
  surprised: `${process.env.PUBLIC_URL}/mascot/avatar/lab-avatar-surprised-ui.png`,
};

export default function Mascot3D({
  className = '',
  compact = false,
  pose = 'full',
  label = 'Маскот PhysicsLab',
}) {
  const [loaded, setLoaded] = useState(false);
  const imageKey = compact && pose === 'full' ? 'pointing' : pose;
  const image = MASCOT_IMAGES[imageKey] || MASCOT_IMAGES.full;
  const frameClass = compact ? 'h-44 w-44' : 'h-full w-full min-w-0';
  const imageClass = compact ? 'max-h-44 max-w-44' : 'max-h-full max-w-full';

  return (
    <div
      className={`relative isolate flex items-end justify-center overflow-visible ${frameClass} ${className}`}
      data-testid="mascot-3d"
      aria-label={label}
    >
      {!loaded && <div className={`${compact ? 'h-32 w-32' : 'h-56 w-56'} skeleton mb-4 rounded-full`} />}

      <motion.img
        src={image}
        alt="Физа - маскот PhysicsLab"
        className={`${imageClass} h-24 md:h-auto select-none object-contain transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        style={{
          filter: 'drop-shadow(0 18px 38px rgba(0,0,0,0.62)) drop-shadow(0 8px 18px rgba(255,215,0,0.16))',
        }}
        initial={{ opacity: 0, y: 8, scale: 0.98 }}
        animate={loaded ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 8, scale: 0.98 }}
        transition={{ duration: 0.24, ease: 'easeOut' }}
        onLoad={() => setLoaded(true)}
        loading={compact ? 'lazy' : 'eager'}
        decoding="async"
        draggable={false}
      />
    </div>
  );
}
