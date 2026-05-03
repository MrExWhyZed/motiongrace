'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';
import { GradientCard } from './gradient-card';

export interface ParallaxItem {
  type: 'video' | 'feature';
  src?: string;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  accent?: string;
  accentRgb?: string;
  // GradientCard props
  gradient?: "orange" | "gray" | "purple" | "green";
  badgeText?: string;
  badgeColor?: string;
  ctaText?: string;
  ctaHref?: string;
  imageUrl?: string;
  isTagline?: boolean;
}

interface ZoomParallaxProps {
  items: ParallaxItem[];
}

/* ────────────────────────────────────────────────────────
   Feature Card — glassmorphism card for surrounding items
   ──────────────────────────────────────────────────────── */
function FeatureCard({ item }: { item: ParallaxItem }) {
  if (item.gradient) {
    return (
      <GradientCard
        gradient={item.gradient}
        badgeText={item.badgeText || "Explore"}
        badgeColor={item.badgeColor || item.accent || "#0894ff"}
        title={item.title || ""}
        description={item.description || ""}
        ctaText={item.ctaText || "Learn more"}
        ctaHref={item.ctaHref || "#"}
        imageUrl={item.imageUrl || ""}
        icon={item.icon}
      />
    );
  }

  const rgb = item.accentRgb || '255,255,255';
  return (
    <div className="relative h-full w-full">
      {/* Main Card - Highly optimized: no backdrop-blur during scale animation */}
      <div
        className="relative flex h-full w-full flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl p-6 text-center"
        style={{
          background: `linear-gradient(160deg, rgba(16,16,24,0.95) 0%, rgba(4,4,8,0.98) 100%)`,
          border: `1px solid rgba(255,255,255,0.08)`,
          boxShadow: `0 20px 40px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)`,
        }}
      >
        {/* Crisp top highlight instead of expensive radial gradient */}
        <div 
          className="absolute inset-x-0 top-0 h-1/3 opacity-30 pointer-events-none"
          style={{
            background: `linear-gradient(to bottom, rgba(${rgb}, 0.15), transparent)`
          }}
        />

        {/* Icon wrapper - optimized shadows */}
        <div
          className="relative z-10 flex h-14 w-14 items-center justify-center rounded-[14px]"
          style={{
            background: `linear-gradient(135deg, rgba(${rgb},0.2) 0%, rgba(${rgb},0.05) 100%)`,
            color: item.accent || '#fff',
            border: `1px solid rgba(${rgb},0.3)`,
            boxShadow: `0 8px 16px rgba(0,0,0,0.4), inset 0 1px 4px rgba(255,255,255,0.1)`,
          }}
        >
          {item.icon}
        </div>
        
        <div className="z-10 flex flex-col items-center gap-2">
          <h3 className="text-sm font-bold tracking-[0.02em] text-white/95 leading-tight">
            {item.title}
          </h3>
          <p className="max-w-[190px] text-[10px] font-light leading-relaxed text-white/60 tracking-wide">
            {item.description}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   ZoomParallax — main component
   Exact same positioning pattern as the reference:
   absolute + flex-center wrapper, [&>div] overrides per index.
   ──────────────────────────────────────────────────────── */
export function ZoomParallax({ items }: ZoomParallaxProps) {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  // Scale values — matching original reference exactly
  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

  const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];
  const videoBorderRadius = useTransform(scrollYProgress, [0, 0.8, 1], ["2rem", "2rem", "0rem"]);

  // CTA overlay — Removed as it's now handled as a separate section below

  const positionClasses = [
    /* 0 — center */  '',
    /* 1 — top-right */ 'max-md:[&>div]:!-top-[25vh] max-md:[&>div]:!left-[10vw] max-md:[&>div]:!w-[45vw] max-md:[&>div]:!h-[20vh] md:[&>div]:!-top-[30vh] md:[&>div]:!left-[5vw] md:[&>div]:!h-[30vh] md:[&>div]:!w-[35vw]',
    /* 2 — top-left */  'max-md:[&>div]:!-top-[20vh] max-md:[&>div]:!-left-[35vw] max-md:[&>div]:!w-[45vw] max-md:[&>div]:!h-[25vh] md:[&>div]:!-top-[10vh] md:[&>div]:!-left-[25vw] md:[&>div]:!h-[45vh] md:[&>div]:!w-[20vw]',
    /* 3 — right */     'max-md:[&>div]:!top-[5vh] max-md:[&>div]:!left-[30vw] max-md:[&>div]:!w-[40vw] max-md:[&>div]:!h-[20vh] md:[&>div]:!left-[27.5vw] md:[&>div]:!h-[25vh] md:[&>div]:!w-[25vw]',
    /* 4 — bot-right */ 'max-md:[&>div]:!top-[30vh] max-md:[&>div]:!left-[15vw] max-md:[&>div]:!w-[45vw] max-md:[&>div]:!h-[25vh] md:[&>div]:!top-[27.5vh] md:[&>div]:!left-[5vw] md:[&>div]:!h-[25vh] md:[&>div]:!w-[20vw]',
    /* 5 — bot-left */  'max-md:[&>div]:!top-[25vh] max-md:[&>div]:!-left-[30vw] max-md:[&>div]:!w-[45vw] max-md:[&>div]:!h-[20vh] md:[&>div]:!top-[27.5vh] md:[&>div]:!-left-[22.5vw] md:[&>div]:!h-[25vh] md:[&>div]:!w-[30vw]',
    /* 6 — far-right */ 'max-md:[&>div]:!-top-[5vh] max-md:[&>div]:!left-[35vw] max-md:[&>div]:!w-[30vw] max-md:[&>div]:!h-[15vh] md:[&>div]:!top-[22.5vh] md:[&>div]:!left-[25vw] md:[&>div]:!h-[15vh] md:[&>div]:!w-[15vw]',
  ];

  return (
    <div ref={container} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-[#020208]">
        {items.map((item, index) => {
          const scale = scales[index % scales.length];

          return (
            <motion.div
              key={index}
              style={{ scale }}
              className={`absolute top-0 flex h-full w-full items-center justify-center pointer-events-none ${positionClasses[index] || ''} ${index !== 0 ? 'max-md:hidden' : ''}`}
            >
              <div className="relative h-[25vh] w-[25vw] max-md:h-[25vh] max-md:w-[45vw] pointer-events-auto">
                {item.type === 'video' ? (
                  <>
                    <motion.video
                      src={item.src}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      style={{ borderRadius: videoBorderRadius }}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </>
                ) : (
                  <FeatureCard item={item} />
                )}
              </div>
            </motion.div>
          );
        })}

        {/* End of cards */}
      </div>
    </div>
  );
}
