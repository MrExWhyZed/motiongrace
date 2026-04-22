'use client';

import React, { useEffect, useRef } from 'react';
import AppImage from '@/components/ui/AppImage';

const particles = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left: `${(i * 7.1 + 5) % 100}%`,
  top: `${(i * 8.7 + 8) % 88}%`,
  size: i % 3 === 0 ? 2.5 : i % 3 === 1 ? 1.5 : 1,
  delay: i * 0.6,
  duration: 7 + (i % 5) * 1.5
}));

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;
    let lastScroll = 0;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (Math.abs(scrollY - lastScroll) < 1) return;
      lastScroll = scrollY;

      if (bgRef.current) {
        bgRef.current.style.transform = `translateY(${scrollY * 0.28}px)`;
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Background Layer — parallax */}
      <div
        ref={bgRef}
        className="absolute inset-0 will-change-transform"
        style={{ top: '-15%', height: '130%' }}>

        {/* Deep cinematic gradient */}
        <div className="absolute inset-0 bg-hero-gradient" />
        <div
          className="absolute inset-0 animate-gradient"
          style={{
            background:
              'radial-gradient(ellipse 90% 70% at 50% 0%, rgba(201,169,110,0.08) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 85% 70%, rgba(74,158,255,0.05) 0%, transparent 50%), radial-gradient(ellipse 50% 40% at 15% 80%, rgba(139,92,246,0.04) 0%, transparent 50%)',
            backgroundSize: '300% 300%'
          }} />

        {/* Cinematic product image */}
        <div className="absolute inset-0 opacity-20">
          <AppImage
            src="https://img.rocket.new/generatedImages/rocket_gen_img_1a91a486c-1772984708354.png"
            alt="Luxury perfume bottle with dramatic studio lighting, deep shadow, cinematic atmosphere"
            fill
            priority
            className="object-cover object-center scale-110"
            sizes="100vw" />
        </div>

        {/* Layered vignette for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/20 to-background/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />
        {/* Subtle center light bloom */}
        <div
          className="absolute inset-0 animate-breathe"
          style={{
            background: 'radial-gradient(ellipse 50% 40% at 50% 40%, rgba(201,169,110,0.06) 0%, transparent 70%)'
          }} />
      </div>

      {/* Floating particles — more sparse, more refined */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: p.left,
              top: p.top,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background:
                p.id % 3 === 0
                  ? 'rgba(201,169,110,0.5)'
                  : p.id % 3 === 1
                  ? 'rgba(74,158,255,0.4)'
                  : 'rgba(237,233,227,0.2)',
              animation: `float-gentle ${p.duration}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
              boxShadow:
                p.id % 3 === 0
                  ? '0 0 5px rgba(201,169,110,0.6)'
                  : '0 0 4px rgba(74,158,255,0.4)'
            }} />
        ))}
      </div>

      {/* Decorative rings — more subtle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div
          className="w-[700px] h-[700px] sm:w-[1000px] sm:h-[1000px] rounded-full border border-primary/4 animate-rotate-slow"
          style={{ borderStyle: 'dashed' }} />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] sm:w-[680px] sm:h-[680px] rounded-full border border-accent/3"
          style={{ animation: 'rotate-slow 45s linear infinite reverse' }} />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-10 pt-32 pb-24 flex flex-col items-center text-center">

        {/* Eyebrow label */}
        <div
          data-reveal="up"
          data-delay="0"
          className="inline-flex items-center gap-2.5 glass-light rounded-full px-5 py-2 mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-breathe" />
          <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-primary/90">
            CGI · 3D · Beauty
          </span>
        </div>

        {/* Headline — larger, more impactful */}
        <h1
          data-reveal="up"
          data-delay="150"
          className="text-display-xl font-extrabold tracking-tighter text-foreground mb-7 max-w-4xl leading-none">
          Cinematic CGI.{' '}
          <span className="text-gradient-gold block sm:inline">
            Infinite Possibilities.
          </span>
        </h1>

        {/* Subtext — more breathing room */}
        <p
          data-reveal="up"
          data-delay="300"
          className="text-base sm:text-lg text-muted-foreground font-light max-w-lg leading-[1.8] mb-12 tracking-wide">
          Turn your product into a digital asset that can be reimagined
          endlessly — without physical production.
        </p>

        {/* CTAs — premium tactile feel */}
        <div
          data-reveal="up"
          data-delay="450"
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">

          <button
            onClick={() => {
              document.querySelector('#showreel')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group relative px-9 py-4 rounded-full text-xs font-semibold uppercase tracking-[0.18em] text-foreground/80 border border-foreground/15 hover:border-primary/40 hover:text-foreground transition-all duration-700 overflow-hidden">
            <span className="relative z-10">View Work</span>
            <div className="absolute inset-0 bg-white/3 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100">
              <div className="absolute top-0 left-0 w-1/4 h-full bg-gold-shimmer animate-light-sweep" />
            </div>
          </button>

          <button
            onClick={() => {
              document.querySelector('#cta')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="relative px-9 py-4 rounded-full text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground bg-primary hover:opacity-95 transition-all duration-500 animate-pulse-gold overflow-hidden group">
            <span className="relative z-10">Book a Call</span>
            <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100">
              <div className="absolute top-0 left-0 w-1/4 h-full bg-gold-shimmer animate-light-sweep" />
            </div>
          </button>
        </div>

        {/* Floating stat widgets */}
        <div className="relative mt-20 w-full max-w-3xl hidden sm:flex items-end justify-between gap-4">
          {/* Widget 1 */}
          <div
            data-reveal="scale"
            data-delay="600"
            className="glass-dark rounded-2xl p-5 animate-float flex items-center gap-3.5 flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground font-medium tracking-wide mb-0.5">Renders Delivered</p>
              <p className="text-lg font-bold text-foreground tracking-tight">12,400+</p>
            </div>
          </div>

          {/* Widget 2 — center, elevated */}
          <div
            data-reveal="scale"
            data-delay="500"
            className="glass-dark rounded-2xl p-5 animate-float-reverse -mb-6 flex-shrink-0"
            style={{ animationDelay: '1.2s' }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-breathe" />
              <span className="text-[10px] text-muted-foreground font-medium tracking-wide">Live Render</span>
              <span className="ml-auto text-[10px] text-accent font-mono">98%</span>
            </div>
            <div className="flex items-end gap-1 h-10">
              {[40, 65, 55, 80, 70, 90, 75, 95].map((h, i) => (
                <div
                  key={i}
                  className="w-2 rounded-sm transition-all duration-1000"
                  style={{
                    height: `${h}%`,
                    background:
                      i === 7
                        ? 'var(--accent)'
                        : i >= 5
                        ? 'rgba(74,158,255,0.45)'
                        : 'rgba(201,169,110,0.25)'
                  }} />
              ))}
            </div>
          </div>

          {/* Widget 3 */}
          <div
            data-reveal="scale"
            data-delay="700"
            className="glass-dark rounded-2xl p-5 animate-float flex items-center gap-3.5 flex-shrink-0"
            style={{ animationDelay: '2.4s' }}>
            <div className="w-10 h-10 rounded-xl bg-secondary/8 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" className="text-secondary" />
                <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-secondary" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground font-medium tracking-wide mb-0.5">Avg. Turnaround</p>
              <p className="text-lg font-bold text-foreground tracking-tight">5 Days</p>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="text-[9px] tracking-[0.25em] uppercase text-muted-foreground">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-primary/60 to-transparent animate-scroll-bounce" />
        </div>
      </div>
    </section>
  );
}
