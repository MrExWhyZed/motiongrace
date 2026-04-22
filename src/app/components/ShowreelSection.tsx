'use client';

import React, { useState, useEffect, useRef } from 'react';
import AppImage from '@/components/ui/AppImage';

const reelItems = [
  {
    id: 1,
    category: 'Fragrance',
    title: 'Nocturne Parfum',
    client: 'Maison Élite',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1063c0052-1768622315711.png",
    alt: 'Luxury perfume bottle in deep darkness with gold light refraction, cinematic still, black background',
    accent: '#C9A96E',
    accentRgb: '201,169,110',
    tag: '01',
  },
  {
    id: 2,
    category: 'Skincare',
    title: 'Lumière Serum',
    client: 'Glacé Beauty',
    image: "https://images.unsplash.com/photo-1619407884060-54145a659baf",
    alt: 'Minimalist skincare serum bottle on reflective surface, airy clean white studio lighting',
    accent: '#4A9EFF',
    accentRgb: '74,158,255',
    tag: '02',
  },
  {
    id: 3,
    category: 'Cosmetics',
    title: 'Velvet Lip Kit',
    client: 'Rouge Atelier',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_16c0b74ab-1769009930510.png",
    alt: 'Luxury lipstick cosmetics product on dark marble with warm amber light, editorial beauty',
    accent: '#8B5CF6',
    accentRgb: '139,92,246',
    tag: '03',
  },
  {
    id: 4,
    category: 'Haircare',
    title: 'Aura Oil',
    client: 'Silk & Stone',
    image: "https://images.unsplash.com/photo-1669212408620-957229726535",
    alt: 'Hair oil bottle with botanical ingredients on dark background with soft golden hour light',
    accent: '#C9A96E',
    accentRgb: '201,169,110',
    tag: '04',
  },
];

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, inView };
}

function CinemaCard({
  item,
  index,
  large = false,
  wide = false,
}: {
  item: typeof reelItems[0];
  index: number;
  large?: boolean;
  wide?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const cardRef = useRef<HTMLDivElement>(null);
  const { ref: revealRef, inView } = useInView(0.1);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  const tiltX = hovered ? (mousePos.y - 0.5) * -8 : 0;
  const tiltY = hovered ? (mousePos.x - 0.5) * 8 : 0;

  return (
    <div
      ref={(el) => {
        (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        (revealRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
      }}
      className="relative rounded-2xl overflow-hidden cursor-pointer"
      style={{
        minHeight: large ? '560px' : wide ? '300px' : '280px',
        opacity: inView ? 1 : 0,
        transform: inView
          ? `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(0)`
          : 'translateY(48px)',
        transition: inView
          ? `opacity 1s cubic-bezier(0.16,1,0.3,1) ${index * 130}ms,
             transform ${hovered ? '0.12s' : '1s'} ${hovered ? 'ease-out' : `cubic-bezier(0.16,1,0.3,1) ${index * 130}ms`}`
          : `opacity 1s cubic-bezier(0.16,1,0.3,1) ${index * 130}ms, transform 1s cubic-bezier(0.16,1,0.3,1) ${index * 130}ms`,
        willChange: 'transform',
        transformStyle: 'preserve-3d',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setMousePos({ x: 0.5, y: 0.5 }); }}
      onMouseMove={handleMouseMove}
    >
      {/* Image */}
      <div
        className="absolute inset-0"
        style={{
          transform: hovered ? 'scale(1.07)' : 'scale(1)',
          transition: 'transform 2.8s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <AppImage
          src={item.image}
          alt={item.alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Film grain overlay */}
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundSize: '128px',
        mixBlendMode: 'overlay',
      }} />

      {/* Gradient vignette */}
      <div className="absolute inset-0" style={{
        background: `linear-gradient(to top, rgba(4,4,8,0.97) 0%, rgba(4,4,8,0.4) 40%, rgba(4,4,8,0.05) 70%, transparent 100%)`,
      }} />

      {/* Accent spotlight on hover */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(${item.accentRgb},0.12) 0%, transparent 60%)`,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}
      />

      {/* Border shimmer */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          boxShadow: hovered
            ? `inset 0 0 0 1px rgba(${item.accentRgb},0.35), 0 32px 80px rgba(0,0,0,0.6)`
            : `inset 0 0 0 1px rgba(255,255,255,0.06)`,
          transition: 'box-shadow 0.7s ease',
        }}
      />

      {/* Top row: tag + category pill */}
      <div className="absolute top-0 left-0 right-0 p-5 flex items-start justify-between">
        <span
          className="font-mono text-[10px] tracking-[0.3em]"
          style={{
            color: `rgba(${item.accentRgb},0.5)`,
            opacity: hovered ? 1 : 0.4,
            transition: 'opacity 0.5s ease',
          }}
        >
          {item.tag}
        </span>
        <span
          className="text-[8px] font-bold tracking-[0.25em] uppercase px-3 py-1.5 rounded-full"
          style={{
            background: `rgba(${item.accentRgb},0.12)`,
            color: item.accent,
            border: `1px solid rgba(${item.accentRgb},0.25)`,
            backdropFilter: 'blur(8px)',
            opacity: hovered ? 1 : 0.6,
            transition: 'opacity 0.5s ease',
          }}
        >
          {item.category}
        </span>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        {/* Thin accent line */}
        <div
          className="mb-4 h-px"
          style={{
            background: `linear-gradient(to right, rgba(${item.accentRgb},0.6), transparent)`,
            width: hovered ? '60%' : '24px',
            transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)',
          }}
        />

        <h3
          className="font-black tracking-tight text-white mb-1.5 leading-none"
          style={{
            fontSize: large ? 'clamp(1.4rem,2.5vw,1.9rem)' : '1.15rem',
            transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
            transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)',
            fontFamily: '"Georgia", "Times New Roman", serif',
            letterSpacing: '-0.02em',
          }}
        >
          {item.title}
        </h3>

        <div
          className="flex items-center justify-between"
          style={{
            transform: hovered ? 'translateY(0)' : 'translateY(4px)',
            opacity: hovered ? 1 : 0.5,
            transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1) 60ms, opacity 0.6s ease 60ms',
          }}
        >
          <p className="text-[11px] tracking-[0.15em] uppercase" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'monospace' }}>
            {item.client}
          </p>
          {(large || wide) && (
            <div
              className="flex items-center gap-2"
              style={{
                transform: hovered ? 'translateX(0)' : 'translateX(8px)',
                transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1) 80ms',
              }}
            >
              <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: item.accent }}>View</span>
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: `rgba(${item.accentRgb},0.15)`, border: `1px solid rgba(${item.accentRgb},0.3)` }}
              >
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke={item.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShowreelSection() {
  const { ref: headerRef, inView: headerVisible } = useInView(0.2);

  return (
    <section id="showreel" className="py-28 sm:py-36 px-6 sm:px-10 relative overflow-hidden">

      {/* Background ambient */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 80% 40% at 50% 100%, rgba(201,169,110,0.04) 0%, transparent 70%)',
      }} />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Section divider */}
        <div className="section-divider mb-20" />

        {/* Header */}
        <div
          ref={headerRef}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-16"
        >
          <div>
            {/* Eyebrow */}
            <div
              className="flex items-center gap-3 mb-5"
              style={{
                opacity: headerVisible ? 1 : 0,
                transform: headerVisible ? 'translateY(0)' : 'translateY(16px)',
                transition: 'opacity 0.8s ease, transform 0.8s ease',
              }}
            >
              <div className="h-px w-8" style={{ background: 'rgba(201,169,110,0.5)' }} />
              <p className="text-[9px] font-bold tracking-[0.3em] uppercase" style={{ color: 'rgba(201,169,110,0.7)' }}>
                Selected Work
              </p>
            </div>

            {/* Headline */}
            <h2
              className="font-black tracking-tighter leading-none"
              style={{
                fontSize: 'clamp(2rem,5.5vw,3.8rem)',
                fontFamily: '"Georgia", "Times New Roman", serif',
                opacity: headerVisible ? 1 : 0,
                transform: headerVisible ? 'translateY(0)' : 'translateY(24px)',
                transition: 'opacity 1s ease 100ms, transform 1s ease 100ms',
                color: 'var(--foreground)',
              }}
            >
              See What&apos;s{' '}
              <span style={{
                background: 'linear-gradient(135deg,#B8935A 0%,#E8D4A0 45%,#C9A96E 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Possible
              </span>
            </h2>
          </div>

          {/* Sub-copy + counter */}
          <div
            style={{
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 1s ease 220ms, transform 1s ease 220ms',
            }}
          >
            <p className="text-sm font-light leading-relaxed tracking-wide max-w-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>
              Where beauty meets computation. Every pixel, intentional.
            </p>
            <div className="flex items-center gap-6">
              {['4 Projects', '3 Brands', '100+ Assets'].map((label, i) => (
                <div key={label} className="flex flex-col">
                  <span className="text-[10px] tracking-[0.2em] uppercase font-mono" style={{ color: 'rgba(201,169,110,0.5)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cinematic Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

          {/* Card 1: tall on lg */}
          <div className="lg:row-span-2">
            <div style={{ height: '100%', minHeight: '580px' }}>
              <CinemaCard item={reelItems[0]} index={0} large />
            </div>
          </div>

          {/* Cards 2 & 3 */}
          <CinemaCard item={reelItems[1]} index={1} />
          <CinemaCard item={reelItems[2]} index={2} />

          {/* Card 4: wide */}
          <div className="lg:col-span-2">
            <CinemaCard item={reelItems[3]} index={3} wide />
          </div>

        </div>

        {/* Footer line */}
        <div
          className="mt-12 flex items-center justify-between"
          style={{
            opacity: headerVisible ? 1 : 0,
            transition: 'opacity 1s ease 600ms',
          }}
        >
          <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.05)' }} />
          <span className="mx-6 text-[9px] tracking-[0.3em] uppercase font-mono" style={{ color: 'rgba(201,169,110,0.35)' }}>
            CGI · 3D · Motion
          </span>
          <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.05)' }} />
        </div>

      </div>
    </section>
  );
}