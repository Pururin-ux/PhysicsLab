import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

const MASCOT_IMAGES = {
  smiling: process.env.PUBLIC_URL + "/mascot/avatar/lab-avatar-presenting-cutout.png",
  pointing: process.env.PUBLIC_URL + "/mascot/avatar/lab-avatar-pointing-cutout.png",
  explaining: process.env.PUBLIC_URL + "/mascot/avatar/lab-avatar-pointing-cutout.png",
  shy: process.env.PUBLIC_URL + "/mascot/avatar/lab-avatar-surprised-cutout.png",
};

// Physics particles for orbit animation
const PARTICLES = [
  { id: 1, type: 'text', content: 'E=mc²', size: 14, color: '#FFD700', radius: 100, speed: 4, angle: 0 },
  { id: 2, type: 'svg', content: 'M', size: 18, color: '#00E5FF', radius: 130, speed: -3.5, angle: Math.PI / 2 },
  { id: 3, type: 'text', content: 'a=F/m', size: 12, color: '#39FF14', radius: 90, speed: 5, angle: Math.PI },
  { id: 4, type: 'text', content: 'sin α', size: 13, color: '#FFB300', radius: 120, speed: -4.5, angle: (3 * Math.PI) / 2 },
];

export function Mascot({ pose = 'smiling', size = 'md', speech, className = '', noFloat = false, interactive = true }) {
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef(null);

  const rectX = useMotionValue(0);
  const rectY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 100, mass: 0.5 };
  const mouseX = useSpring(rectX, springConfig);
  const mouseY = useSpring(rectY, springConfig);

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);
  const hairLagX = useTransform(mouseX, [-0.5, 0.5], [10, -10]);
  const hairLagY = useTransform(mouseY, [-0.5, 0.5], [5, -6]);

  useEffect(() => {
    if (!interactive) return;
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      rectX.set(x / (rect.width / 2));
      rectY.set(y / (rect.height / 2));
    };
    
    // Add event listener to the window so the mascot follows the cursor everywhere
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [interactive, rectX, rectY]);

  const sizes = {
    xs: 'w-16 h-16',
    sm: 'w-24 h-24',
    md: 'w-40 h-40',
    lg: 'w-56 h-56',
    xl: 'w-72 h-72',
    hero: 'w-72 h-72 sm:w-80 sm:h-80 md:w-[400px] md:h-[400px] lg:w-[460px] lg:h-[460px]',
  };

  const isLarge = size === 'hero' || size === 'xl' || size === 'lg';
  const hairStrands = [
    { left: '38%', top: '7%', height: '18%', rotate: -13, delay: 0 },
    { left: '45%', top: '5%', height: '22%', rotate: -5, delay: 0.08 },
    { left: '53%', top: '6%', height: '20%', rotate: 8, delay: 0.16 },
    { left: '60%', top: '10%', height: '16%', rotate: 17, delay: 0.24 },
  ];

  return (
    <div ref={containerRef} className={`relative inline-flex items-center justify-center ${className}`} style={{ perspective: 1000 }}>
      {/* Dynamic Aura */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ background: 'radial-gradient(circle, rgba(255,215,0,0.15) 0%, transparent 70%)' }}
      />

      <motion.div
        style={interactive ? { rotateX, rotateY } : {}}
        animate={noFloat ? {} : { y: [0, -12, 0] }}
        transition={noFloat ? {} : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10"
      >
        {!loaded && (
          <div className={`${sizes[size]} skeleton rounded-full`} />
        )}
        
        {/* The Mascot */}
        <motion.img
          src={MASCOT_IMAGES[pose] || MASCOT_IMAGES.smiling}
          alt="Физа — маскот PhysicsLab"
          className={`${sizes[size]} object-contain select-none transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          style={{
            filter: 'drop-shadow(0 12px 32px rgba(255,215,0,0.25)) drop-shadow(0 4px 12px rgba(0,0,0,0.5))',
          }}
          onLoad={() => setLoaded(true)}
          draggable={false}
          data-testid={`mascot-${pose}`}
        />

        {loaded && (
          <motion.div
            className={`${sizes[size]} absolute inset-0 pointer-events-none z-20`}
            aria-hidden="true"
            style={{ x: hairLagX, y: hairLagY }}
          >
            {hairStrands.map((strand, i) => (
              <motion.span
                key={`${strand.left}-${i}`}
                className="absolute block rounded-full"
                style={{
                  left: strand.left,
                  top: strand.top,
                  width: isLarge ? 5 : 3,
                  height: strand.height,
                  background: 'linear-gradient(180deg, rgba(255,249,210,0.85), rgba(255,215,0,0.34) 42%, rgba(0,229,255,0.04))',
                  boxShadow: '0 0 14px rgba(255,215,0,0.28)',
                  transformOrigin: '50% 100%',
                  filter: 'blur(0.2px)',
                  mixBlendMode: 'screen',
                }}
                initial={{ rotate: strand.rotate, opacity: 0 }}
                animate={{
                  rotate: [strand.rotate, strand.rotate + (i % 2 ? -7 : 7), strand.rotate],
                  opacity: [0.32, 0.62, 0.32],
                }}
                transition={{ duration: 2.8 + i * 0.22, repeat: Infinity, ease: "easeInOut", delay: strand.delay }}
              />
            ))}
          </motion.div>
        )}

        {/* Floating Physical Particles (Only on large sizes) */}
        {isLarge && loaded && PARTICLES.map((p, i) => (
          <motion.div
            key={p.id}
            className="absolute top-1/2 left-1/2 pointer-events-none font-mono font-bold"
            style={{
              color: p.color,
              fontSize: p.size,
              textShadow: `0 0 10px ${p.color}`,
              x: '-50%',
              y: '-50%',
            }}
            animate={{
              rotate: [0, 360 * Math.sign(p.speed)],
            }}
            transition={{
              duration: Math.abs(20 / p.speed),
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <motion.div
              style={{
                x: Math.cos(p.angle) * p.radius,
                y: Math.sin(p.angle) * p.radius,
              }}
              animate={{
                y: [Math.sin(p.angle) * p.radius, Math.sin(p.angle) * p.radius - 15, Math.sin(p.angle) * p.radius],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 2 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {p.type === 'svg' ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19 12a7 7 0 0 0-14 0"></path>
                  <path d="M12 19a7 7 0 0 0 0-14"></path>
                  <path d="M20 12l-2-2"></path>
                </svg>
              ) : p.content}
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {speech && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10, rotate: 5 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          className="absolute -top-4 -right-4 md:-right-8 surface-overlay rounded-2xl rounded-bl-none px-5 py-3 max-w-[240px] z-20 border border-[#FFD700]/30 shadow-[0_8px_32px_rgba(255,215,0,0.15)]"
        >
          <p className="text-[14px] leading-relaxed text-white font-medium">{speech}</p>
        </motion.div>
      )}
    </div>
  );
}
