'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

// ─── Data ─────────────────────────────────────────────────────────────────────
const showcaseItems = [
  {
    id: 1,
    image: 'https://res.cloudinary.com/ddgyx80f6/image/upload/v1777298360/Exploded_003_ynbnau.gif',
    mediaType: 'gif' as const,
    alt: 'Exploded product view',
    accent: '#C9A96E', accentRgb: '201,169,110', depth: 0,
  },
  {
    id: 2,
    image: 'https://res.cloudinary.com/ddgyx80f6/video/upload/v1777298274/asset4_zw2lyr.mov',
    mediaType: 'video' as const,
    alt: 'Asset video',
    accent: '#4A9EFF', accentRgb: '74,158,255', depth: 1,
  },
  {
    id: 3,
    image: 'https://res.cloudinary.com/ddgyx80f6/image/upload/v1777298110/002.1_rm3dok.gif',
    mediaType: 'gif' as const,
    alt: 'Product animation',
    accent: '#8B5CF6', accentRgb: '139,92,246', depth: 2,
  },
  {
    id: 4,
    image: 'https://res.cloudinary.com/ddgyx80f6/video/upload/v1777297860/Lipstick_ymuas8.mp4',
    mediaType: 'video' as const,
    alt: 'Lipstick product video',
    accent: '#E879A0', accentRgb: '232,121,160', depth: 1,
  },
  {
    id: 5,
    image: 'https://res.cloudinary.com/ddgyx80f6/video/upload/v1777297901/gel_pour_r64tpy.mp4',
    mediaType: 'video' as const,
    alt: 'Gel pour video',
    accent: '#34D399', accentRgb: '52,211,153', depth: 2,
  },
];

type Item = typeof showcaseItems[0];

// ─── Particles ────────────────────────────────────────────────────────────────
type Particle = { id: number; x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number };

function useParticles(activeRef: React.MutableRefObject<boolean>, accentRgb: string) {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef       = useRef<number>(0);
  const idRef        = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx2d = canvas.getContext('2d');
    if (!ctx2d) return;

    // Detect low-end desktop: throttle to ~30fps and reduce particle count
    const cores  = (navigator as Navigator & { hardwareConcurrency?: number }).hardwareConcurrency ?? 8;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    const isLowEnd = cores <= 4 || memory <= 4;
    const SPAWN_EVERY = isLowEnd ? 6 : 3; // spawn less often on low-end
    const MAX_PARTICLES = isLowEnd ? 20 : 60;

    // Pause rAF when tab is hidden
    let visible = !document.hidden;
    const onVisibility = () => { visible = !document.hidden; };
    document.addEventListener('visibilitychange', onVisibility);

    let frame = 0;
    let lastTime = 0;
    const loop = (now: number) => {
      rafRef.current = requestAnimationFrame(loop);

      // Tab hidden → skip all work
      if (!visible) return;

      // Low-end: ~30fps cap
      if (isLowEnd && now - lastTime < 32) return;
      lastTime = now;

      ctx2d.clearRect(0, 0, canvas.width, canvas.height);
      if (!activeRef.current) {
        particlesRef.current = [];
        return;
      }
      if (frame % SPAWN_EVERY === 0 && particlesRef.current.length < MAX_PARTICLES) {
        const edge = Math.random();
        let x = 0, y = 0;
        if      (edge < 0.25) { x = Math.random() * canvas.width;  y = 0; }
        else if (edge < 0.5)  { x = canvas.width;                  y = Math.random() * canvas.height; }
        else if (edge < 0.75) { x = Math.random() * canvas.width;  y = canvas.height; }
        else                  { x = 0;                              y = Math.random() * canvas.height; }
        const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
        const speed = 0.3 + Math.random() * 0.7;
        particlesRef.current.push({
          id: idRef.current++, x, y,
          vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
          life: 0, maxLife: 80 + Math.random() * 60, size: 1 + Math.random() * 2,
        });
      }
      frame++;
      particlesRef.current = particlesRef.current.filter(p => p.life < p.maxLife);
      particlesRef.current.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.life++;
        const t     = p.life / p.maxLife;
        const alpha = t < 0.3 ? t / 0.3 : 1 - (t - 0.3) / 0.7;
        ctx2d.beginPath();
        ctx2d.arc(p.x, p.y, p.size * (1 - t * 0.5), 0, Math.PI * 2);
        ctx2d.fillStyle = `rgba(${accentRgb},${alpha * 0.55})`;
        ctx2d.fill();
      });
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accentRgb]);

  return canvasRef;
}

// ─── MediaBackground ──────────────────────────────────────────────────────────
// Renders image/gif/video as the card background — flicker-free
const MediaBackground = React.memo(function MediaBackground({
  item,
  mediaRef,
}: {
  item: Item;
  mediaRef: React.MutableRefObject<HTMLVideoElement | HTMLImageElement | null>;
}) {
  const sharedStyle: React.CSSProperties = {
    position: 'absolute', inset: 0, width: '100%', height: '100%',
    objectFit: 'cover',
  };

  if (item.mediaType === 'video') {
    return (
      <video
        ref={mediaRef as React.MutableRefObject<HTMLVideoElement>}
        src={item.image}
        autoPlay
        loop
        muted
        playsInline
        disablePictureInPicture
        preload="auto"
        style={{
          ...sharedStyle,
          // GPU-composited layer prevents flicker on video elements
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
      />
    );
  }

  // image or gif
  return (
    <img
      ref={mediaRef as React.MutableRefObject<HTMLImageElement>}
      src={item.image}
      alt={item.alt}
      style={{
        ...sharedStyle,
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
      }}
    />
  );
});

// ─── ShowcaseCard ─────────────────────────────────────────────────────────────
const ShowcaseCard = React.memo(function ShowcaseCard({
  item,
  gsapRef,
  onEnter,
  onLeave,
}: {
  item: Item;
  gsapRef: React.MutableRefObject<typeof import('gsap').gsap | null>;
  onEnter: (id: number, wrapperEl: HTMLElement) => void;
  onLeave: (wrapperEl: HTMLElement) => void;
}) {
  const wrapperRef    = useRef<HTMLDivElement>(null);
  const cardRef       = useRef<HTMLDivElement>(null);
  const mediaRef      = useRef<HTMLVideoElement | HTMLImageElement | null>(null);
  const glowRef       = useRef<HTMLDivElement>(null);
  const dotRef        = useRef<HTMLDivElement>(null);
  const ringRef       = useRef<HTMLDivElement>(null);
  const sweepRef      = useRef<HTMLDivElement>(null);
  const innerGlowRef  = useRef<HTMLDivElement>(null);
  const cornersRef    = useRef<(HTMLDivElement | null)[]>([]);
  const particleCanvas = useParticles(useRef(false), item.accentRgb);
  const activeRef     = useRef(false);

  const isHoveredRef  = useRef(false);
  const mouseLive     = useRef({ x: 0.5, y: 0.5 });
  const mouseSmooth   = useRef({ x: 0.5, y: 0.5 });
  const tiltSmooth    = useRef({ rx: 0, ry: 0 });
  const magSmooth     = useRef({ x: 0, y: 0 });
  const rafRef        = useRef<number>(0);

  const depthY = [0, -24, -48][item.depth];

  // Sync activeRef with particle hook
  const particleActiveRef = (particleCanvas as any)._activeRef ?? useRef(false);

  // ── rAF tilt/parallax loop ─────────────────────────────────────────────────
  useEffect(() => {
    const LM = 0.12, LT = 0.08, LG = 0.07;
    // Epsilon: if all smoothed values are close to target, skip DOM writes
    const IDLE_EPS = 0.001;

    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);

      // Skip all work when tab is hidden
      if (document.hidden) return;

      const hov = isHoveredRef.current;
      const tx  = hov ? mouseLive.current.x : 0.5;
      const ty  = hov ? mouseLive.current.y : 0.5;

      mouseSmooth.current.x += (tx - mouseSmooth.current.x) * LM;
      mouseSmooth.current.y += (ty - mouseSmooth.current.y) * LM;

      const mx = mouseSmooth.current.x;
      const my = mouseSmooth.current.y;

      const targetRx = hov ? (my - 0.5) * -14 : 0;
      const targetRy = hov ? (mx - 0.5) *  14 : 0;
      const targetGx = hov ? (mx - 0.5) *  18 : 0;
      const targetGy = hov ? (my - 0.5) *  10 : 0;

      tiltSmooth.current.rx += (targetRx - tiltSmooth.current.rx) * LT;
      tiltSmooth.current.ry += (targetRy - tiltSmooth.current.ry) * LT;
      magSmooth.current.x   += (targetGx - magSmooth.current.x)   * LG;
      magSmooth.current.y   += (targetGy - magSmooth.current.y)   * LG;

      // Skip DOM writes if everything has settled to rest (not hovering + fully damped)
      const isIdle = !hov
        && Math.abs(tiltSmooth.current.rx) < IDLE_EPS
        && Math.abs(tiltSmooth.current.ry) < IDLE_EPS
        && Math.abs(magSmooth.current.x)   < IDLE_EPS
        && Math.abs(magSmooth.current.y)   < IDLE_EPS;
      if (isIdle) return;

      if (wrapperRef.current) {
        wrapperRef.current.style.transform =
          `translateY(${depthY}px) translate(${magSmooth.current.x * 0.4}px,${magSmooth.current.y * 0.4}px)`;
      }
      if (cardRef.current) {
        cardRef.current.style.transform =
          `perspective(900px) rotateX(${tiltSmooth.current.rx}deg) rotateY(${tiltSmooth.current.ry}deg) translate(${magSmooth.current.x * 0.6}px,${magSmooth.current.y * 0.6}px)`;
      }

      // Only apply image parallax on non-video media — never touch video transform
      if (mediaRef.current && hov && item.mediaType !== 'video') {
        (mediaRef.current as HTMLImageElement).style.transform =
          `translateZ(0) scale(1.12) translate(${(mx - 0.5) * -8}px,${(my - 0.5) * -8}px)`;
      }

      if (glowRef.current) {
        glowRef.current.style.background =
          `radial-gradient(circle at ${mx * 100}% ${my * 100}%, rgba(${item.accentRgb},0.18) 0%, transparent 55%)`;
      }
      if (dotRef.current) {
        dotRef.current.style.left = `calc(${mx * 100}% - 5px)`;
        dotRef.current.style.top  = `calc(${my * 100}% - 5px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.left = `calc(${mx * 100}% - 22px)`;
        ringRef.current.style.top  = `calc(${my * 100}% - 22px)`;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── GSAP hover-in ──────────────────────────────────────────────────────────
  const playHoverIn = useCallback(() => {
    const g = gsapRef.current;
    if (!g || !wrapperRef.current || !cardRef.current) return;
    isHoveredRef.current = true;
    activeRef.current    = true;

    g.to(wrapperRef.current, { width: 'clamp(480px,46vw,620px)', duration: 0.72, ease: 'power3.out', overwrite: 'auto' });
    g.to(cardRef.current, {
      height: 'clamp(420px,55vw,560px)',
      boxShadow: `0 40px 80px rgba(0,0,0,0.8),0 0 0 1px rgba(${item.accentRgb},0.15),0 0 80px rgba(${item.accentRgb},0.1)`,
      borderColor: `rgba(${item.accentRgb},0.3)`,
      duration: 0.72, ease: 'power3.out', overwrite: 'auto',
    });

    if (particleCanvas.current) g.to(particleCanvas.current, { opacity: 1, duration: 0.4, ease: 'power2.out' });

    // Only animate filter on non-video elements to prevent flicker
    if (mediaRef.current && item.mediaType !== 'video') {
      g.to(mediaRef.current, { filter: 'saturate(1.1) brightness(0.9)', duration: 0.5, ease: 'power2.out' });
    }

    if (glowRef.current)      g.to(glowRef.current,      { opacity: 1, duration: 0.4, ease: 'power2.out' });
    if (sweepRef.current)     g.fromTo(sweepRef.current, { yPercent: -100 }, { yPercent: 100, duration: 0.8, ease: 'power2.inOut' });
    if (innerGlowRef.current) g.to(innerGlowRef.current, { boxShadow: `inset 0 0 80px rgba(${item.accentRgb},0.2)`, duration: 0.5, ease: 'power2.out' });
    if (dotRef.current)       g.to(dotRef.current,  { opacity: 0.9, duration: 0.3, ease: 'power2.out' });
    if (ringRef.current)      g.to(ringRef.current, { opacity: 1,   duration: 0.3, ease: 'power2.out' });

    cornersRef.current.forEach((el, i) => {
      if (el) g.to(el, { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out', delay: i * 0.06 });
    });
  }, [gsapRef, item.accentRgb, item.mediaType, particleCanvas]);

  // ── GSAP hover-out ─────────────────────────────────────────────────────────
  const playHoverOut = useCallback(() => {
    const g = gsapRef.current;
    if (!g || !wrapperRef.current || !cardRef.current) return;
    isHoveredRef.current = false;
    activeRef.current    = false;

    g.to(wrapperRef.current, { width: 'clamp(260px,26vw,340px)', duration: 0.65, ease: 'power3.out', overwrite: 'auto' });
    g.to(cardRef.current, {
      height: 'clamp(340px,44vw,460px)',
      boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
      borderColor: `rgba(${item.accentRgb},0.07)`,
      duration: 0.65, ease: 'power3.out', overwrite: 'auto',
    });

    if (particleCanvas.current) g.to(particleCanvas.current, { opacity: 0, duration: 0.35, ease: 'power2.in' });

    if (mediaRef.current && item.mediaType !== 'video') {
      g.to(mediaRef.current, { scale: 1, x: 0, y: 0, filter: 'saturate(0.85) brightness(0.85)', duration: 1.8, ease: 'power3.out' });
    }

    if (glowRef.current)      g.to(glowRef.current,      { opacity: 0, duration: 0.4, ease: 'power2.in' });
    if (dotRef.current)       g.to(dotRef.current,       { opacity: 0, duration: 0.25, ease: 'power2.in' });
    if (ringRef.current)      g.to(ringRef.current,      { opacity: 0, duration: 0.25, ease: 'power2.in' });
    if (innerGlowRef.current) g.to(innerGlowRef.current, { boxShadow: `inset 0 0 80px rgba(${item.accentRgb},0.04)`, duration: 0.4, ease: 'power2.in' });

    cornersRef.current.forEach(el => {
      if (el) g.to(el, { opacity: 0, scale: 0.6, duration: 0.35, ease: 'power2.in' });
    });
  }, [gsapRef, item.accentRgb, item.mediaType, particleCanvas]);

  // Expose methods via DOM
  useEffect(() => {
    if (!wrapperRef.current) return;
    (wrapperRef.current as any).__hoverIn  = playHoverIn;
    (wrapperRef.current as any).__hoverOut = playHoverOut;
  }, [playHoverIn, playHoverOut]);

  // Set initial GSAP states
  useEffect(() => {
    const tryInit = () => {
      const g = gsapRef.current;
      if (!g) { requestAnimationFrame(tryInit); return; }

      if (glowRef.current)      g.set(glowRef.current,      { opacity: 0 });
      if (dotRef.current)       g.set(dotRef.current,       { opacity: 0 });
      if (ringRef.current)      g.set(ringRef.current,      { opacity: 0 });
      if (innerGlowRef.current) g.set(innerGlowRef.current, { boxShadow: `inset 0 0 80px rgba(${item.accentRgb},0.04)` });
      if (particleCanvas.current) g.set(particleCanvas.current, { opacity: 0 });

      // Only set filter on non-video elements
      if (mediaRef.current && item.mediaType !== 'video') {
        g.set(mediaRef.current, { filter: 'saturate(0.85) brightness(0.85)' });
      }

      cornersRef.current.forEach(el => el && g.set(el, { opacity: 0, scale: 0.6 }));
    };
    tryInit();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    mouseLive.current.x = (e.clientX - r.left) / r.width;
    mouseLive.current.y = (e.clientY - r.top)  / r.height;
  }, []);

  return (
    <div
      ref={wrapperRef}
      data-showcase-wrapper="true"
      data-cursor="image"
      style={{
        flexShrink: 0,
        width: 'clamp(260px,26vw,340px)',
        willChange: 'transform, width',
        zIndex: 1, position: 'relative',
      }}
    >
      <div
        ref={cardRef}
        onMouseEnter={() => onEnter(item.id, wrapperRef.current!)}
        onMouseLeave={() => onLeave(wrapperRef.current!)}
        onMouseMove={handleMouseMove}
        style={{
          position: 'relative', borderRadius: '18px', overflow: 'hidden',
          height: 'clamp(340px,44vw,460px)',
          cursor: 'none',
          border: `1px solid rgba(${item.accentRgb},0.07)`,
          boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
          willChange: 'transform, height',
          // Isolate stacking context to prevent paint bleed / flicker
          isolation: 'isolate',
        }}
      >
        {/* Particles */}
        <canvas
          ref={particleCanvas}
          width={620}
          height={560}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}
        />

        {/* Media background */}
        <MediaBackground item={item} mediaRef={mediaRef} />

        {/* Subtle vignette — no text gradient needed */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(2,2,8,0.55) 100%)',
          pointerEvents: 'none',
          zIndex: 2,
        }} />

        {/* Cursor glow */}
        <div ref={glowRef} style={{ position: 'absolute', inset: 0, mixBlendMode: 'screen', pointerEvents: 'none', zIndex: 3 }} />

        {/* Sweep shimmer */}
        <div ref={sweepRef} style={{
          position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none',
          background: `linear-gradient(to bottom, transparent 0%, rgba(${item.accentRgb},0.06) 50%, transparent 100%)`,
          transform: 'translateY(-100%)',
        }} />

        {/* Inner glow border */}
        <div ref={innerGlowRef} style={{ position: 'absolute', inset: 0, borderRadius: '18px', pointerEvents: 'none', zIndex: 6 }} />

        {/* Corner brackets */}
        {[
          { top: 14, left: 14,    bt: true,  bl: true  },
          { top: 14, right: 14,   bt: true,  br: true  },
          { bottom: 14, left: 14,  bb: true,  bl: true  },
          { bottom: 14, right: 14, bb: true,  br: true  },
        ].map((c, ci) => (
          <div key={ci} ref={el => { cornersRef.current[ci] = el; }} style={{
            position: 'absolute', width: '20px', height: '20px', zIndex: 7,
            top: (c as any).top, bottom: (c as any).bottom,
            left: (c as any).left, right: (c as any).right,
            borderTop:    (c as any).bt ? `1px solid rgba(${item.accentRgb},0.6)` : 'none',
            borderBottom: (c as any).bb ? `1px solid rgba(${item.accentRgb},0.6)` : 'none',
            borderLeft:   (c as any).bl ? `1px solid rgba(${item.accentRgb},0.6)` : 'none',
            borderRight:  (c as any).br ? `1px solid rgba(${item.accentRgb},0.6)` : 'none',
            pointerEvents: 'none',
          }} />
        ))}

        {/* Dot + ring cursors */}
        <div ref={dotRef} style={{
          position: 'absolute', zIndex: 20, pointerEvents: 'none',
          width: '10px', height: '10px', borderRadius: '50%',
          background: item.accent, boxShadow: `0 0 16px 4px rgba(${item.accentRgb},0.5)`,
          mixBlendMode: 'screen',
        }} />
        <div ref={ringRef} style={{
          position: 'absolute', zIndex: 19, pointerEvents: 'none',
          width: '44px', height: '44px', borderRadius: '50%',
          border: `1px solid rgba(${item.accentRgb},0.35)`,
        }} />
      </div>
    </div>
  );
});

// ─── ShowcaseSection ──────────────────────────────────────────────────────────
export default function ShowcaseSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef   = useRef<HTMLDivElement>(null);
  const headerRef  = useRef<HTMLDivElement>(null);
  const btnRef     = useRef<HTMLDivElement>(null);

  const gsapRef = useRef<typeof import('gsap').gsap | null>(null);

  const hoveredWrapperRef = useRef<HTMLElement | null>(null);
  const pendingIdRef      = useRef<number | null>(null);
  const switchTimerRef    = useRef<ReturnType<typeof setTimeout> | null>(null);

  const animFrameRef  = useRef<number>(0);
  const currentXRef   = useRef(0);
  const targetXRef    = useRef(0);
  const isPausedRef   = useRef(false);
  const velocityRef   = useRef(1);
  const arrowSpeedRef = useRef(0);
  const holdLRef      = useRef(false);
  const holdRRef      = useRef(false);

  const [sectionVisible, setSectionVisible] = useState(false);
  const [leftActive,  setLeftActive]  = useState(false);
  const [rightActive, setRightActive] = useState(false);

  const applyNeighborState = useCallback((
    hoveredWrapper: HTMLElement | null,
    g: typeof import('gsap').gsap,
  ) => {
    const allWrappers = Array.from(
      trackRef.current?.querySelectorAll<HTMLElement>('[data-showcase-wrapper="true"]') ?? []
    );
    allWrappers.forEach(w => {
      const isHov      = w === hoveredWrapper;
      const isNeighbor = hoveredWrapper !== null && !isHov;
      g.to(w, {
        opacity: isNeighbor ? 0.36 : 1,
        filter:  isNeighbor ? 'saturate(0.25) blur(1.5px)' : 'saturate(1) blur(0px)',
        duration: 0.55,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    });
  }, []);

  const handleEnter = useCallback((id: number, wrapperEl: HTMLElement) => {
    pendingIdRef.current = id;
    if (switchTimerRef.current) clearTimeout(switchTimerRef.current);

    switchTimerRef.current = setTimeout(() => {
      const g = gsapRef.current;
      if (!g) return;

      if (hoveredWrapperRef.current && hoveredWrapperRef.current !== wrapperEl) {
        const prevOut = (hoveredWrapperRef.current as any).__hoverOut;
        if (prevOut) prevOut();
      }

      hoveredWrapperRef.current = wrapperEl;
      isPausedRef.current = true;

      const hoverIn = (wrapperEl as any).__hoverIn;
      if (hoverIn) hoverIn();

      applyNeighborState(wrapperEl, g);
    }, 28);
  }, [applyNeighborState]);

  const handleLeave = useCallback((_wrapperEl: HTMLElement) => {
    pendingIdRef.current = null;
    if (switchTimerRef.current) clearTimeout(switchTimerRef.current);

    switchTimerRef.current = setTimeout(() => {
      if (pendingIdRef.current !== null) return;
      const g = gsapRef.current;
      if (!g) return;

      if (hoveredWrapperRef.current) {
        const hoverOut = (hoveredWrapperRef.current as any).__hoverOut;
        if (hoverOut) hoverOut();
      }

      hoveredWrapperRef.current = null;
      isPausedRef.current = false;
      applyNeighborState(null, g);
    }, 40);
  }, [applyNeighborState]);

  useEffect(() => {
    if (!sectionRef.current) return;
    let mounted = true;
    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      if (!mounted || !sectionRef.current) return;
      gsap.registerPlugin(ScrollTrigger);
      gsapRef.current = gsap;

      ScrollTrigger.create({
        trigger: sectionRef.current, start: 'top 88%', once: true,
        onEnter: () => setSectionVisible(true),
      });

      if (headerRef.current) {
        const kids = Array.from(headerRef.current.children) as HTMLElement[];
        gsap.fromTo(kids,
          { autoAlpha: 0, y: 28, filter: 'blur(8px)' },
          { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 1.1, stagger: 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: headerRef.current, start: 'top 88%', once: true } }
        );
      }
      if (btnRef.current) {
        gsap.fromTo(btnRef.current,
          { autoAlpha: 0, y: 20, scale: 0.95 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: btnRef.current, start: 'top 95%', once: true } }
        );
      }
      ScrollTrigger.refresh();
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const BASE = 0.42, AMAX = 6, AACC = 0.18, ADEC = 0.88;
    let last = 0;
    let inView = true;

    // Pause when section is off-screen (IntersectionObserver)
    const observer = new IntersectionObserver(
      ([entry]) => { inView = entry.isIntersecting; },
      { threshold: 0 }
    );
    if (trackRef.current) observer.observe(trackRef.current);

    const loop = (t: number) => {
      animFrameRef.current = requestAnimationFrame(loop);
      // Skip when tab hidden or section scrolled out of view
      if (document.hidden || !inView) return;

      const dt = Math.min(t - last, 50); last = t;
      if (!trackRef.current) return;
      const tw = trackRef.current.scrollWidth / 2;

      if      (holdRRef.current) arrowSpeedRef.current = Math.min(arrowSpeedRef.current + AACC,  AMAX);
      else if (holdLRef.current) arrowSpeedRef.current = Math.max(arrowSpeedRef.current - AACC, -AMAX);
      else {
        arrowSpeedRef.current *= ADEC;
        if (Math.abs(arrowSpeedRef.current) < 0.02) arrowSpeedRef.current = 0;
      }

      velocityRef.current = isPausedRef.current
        ? Math.max(velocityRef.current - 0.05, 0)
        : Math.min(velocityRef.current + 0.02, 1);

      targetXRef.current = (targetXRef.current + BASE * (dt / 16) * velocityRef.current + arrowSpeedRef.current * (dt / 16) + tw) % tw;
      currentXRef.current += (targetXRef.current - currentXRef.current) * 0.07;
      if (currentXRef.current < 0) currentXRef.current += tw;
      trackRef.current.style.transform = `translateX(-${currentXRef.current}px)`;
    };
    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      observer.disconnect();
    };
  }, []);

  const startLeft  = useCallback(() => { holdLRef.current = true;  holdRRef.current = false; setLeftActive(true);  setRightActive(false); }, []);
  const startRight = useCallback(() => { holdRRef.current = true;  holdLRef.current = false; setRightActive(true); setLeftActive(false);  }, []);
  const stopArrows = useCallback(() => { holdLRef.current = false; holdRRef.current = false; setLeftActive(false); setRightActive(false);  }, []);

  const allItems = [...showcaseItems, ...showcaseItems];

  const ArrowBtn = ({ dir }: { dir: 'left' | 'right' }) => {
    const isLeft = dir === 'left', isActive = isLeft ? leftActive : rightActive;
    return (
      <button
        onMouseDown={isLeft ? startLeft : startRight}
        onMouseUp={stopArrows} onMouseLeave={stopArrows}
        onTouchStart={e => { e.preventDefault(); isLeft ? startLeft() : startRight(); }}
        onTouchEnd={stopArrows}
        aria-label={isLeft ? 'Scroll left' : 'Scroll right'}
        style={{
          position: 'absolute', top: '50%', [isLeft ? 'left' : 'right']: '16px',
          zIndex: 30, width: '48px', height: '48px', borderRadius: '50%',
          border: `1px solid rgba(201,169,110,${isActive ? 0.6 : 0.2})`,
          background: isActive ? 'rgba(201,169,110,0.15)' : 'rgba(8,10,22,0.7)',
          backdropFilter: 'blur(12px)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
          transform: `translateY(-50%) scale(${isActive ? 0.93 : 1})`,
          boxShadow: isActive
            ? '0 0 24px rgba(201,169,110,0.25),inset 0 0 12px rgba(201,169,110,0.08)'
            : '0 4px 20px rgba(0,0,0,0.5)',
          userSelect: 'none', WebkitUserSelect: 'none',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          {isLeft
            ? <path d="M11 4L6 9L11 14" stroke={`rgba(201,169,110,${isActive ? 1 : 0.6})`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            : <path d="M7 4L12 9L7 14"  stroke={`rgba(201,169,110,${isActive ? 1 : 0.6})`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          }
        </svg>
      </button>
    );
  };

  return (
    <section
      ref={sectionRef}
      data-gsap-section="default"
      className="relative overflow-hidden py-28 sm:py-40"
      style={{ background: 'linear-gradient(180deg, #020208 0%, #04040c 50%, #030309 100%)' }}
    >
      {/* Background streaks */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { top: '18%', left: '-8%',  w: '55%', rot: '-7deg', color: '201,169,110', delay: '0s' },
          { top: '65%', right: '-8%', w: '45%', rot: '5deg',  color: '74,158,255',  delay: '3s' },
          { top: '42%', left: '20%',  w: '30%', rot: '-3deg', color: '139,92,246',  delay: '6s' },
        ].map((s, i) => (
          <div key={i} style={{
            position: 'absolute', top: s.top, left: (s as any).left, right: (s as any).right,
            width: s.w, height: '1px',
            background: `linear-gradient(90deg, transparent, rgba(${s.color},0.1), transparent)`,
            transform: `rotate(${s.rot})`,
            animation: 'streak 10s ease-in-out infinite', animationDelay: s.delay,
          }} />
        ))}
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(201,169,110,0.012) 1px, transparent 1px),linear-gradient(90deg,rgba(201,169,110,0.012) 1px,transparent 1px)`,
        backgroundSize: '100px 100px',
      }} />

      {/* Header */}
      <div ref={headerRef} className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 mb-16">
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div style={{ height: '1px', width: '28px', background: 'rgba(201,169,110,0.5)' }} />
              <span style={{ fontSize: '9px', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.55)' }}>Selected Work</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem,5vw,3.5rem)', fontWeight: 900, letterSpacing: '-0.045em', lineHeight: 1, margin: 0 }}>
              <span style={{ color: 'rgba(237,233,227,0.9)' }}>See What&apos;s </span>
              <span style={{ background: 'linear-gradient(135deg,#8B6F3E 0%,#F2E4C4 40%,#D4A96A 70%,#C9956E 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>Possible</span>
            </h2>
          </div>
          <div className="hidden sm:flex flex-col items-end gap-1">
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
              <span style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.04em', background: 'linear-gradient(135deg,#C9A96E,#f0d49a)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>48+</span>
              <span style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(237,233,227,0.25)' }}>Projects</span>
            </div>
            <p style={{ fontSize: '11px', color: 'rgba(237,233,227,0.22)', letterSpacing: '0.06em', margin: 0 }}>Where beauty meets computation</p>
          </div>
        </div>
      </div>

      {/* Catalog label */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem', opacity: sectionVisible ? 0.4 : 0, transition: 'opacity 0.6s ease' }}>
        <span style={{ fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(237,233,227,0.4)' }}>Catalog</span>
      </div>

      {/* Carousel */}
      <div style={{ position: 'relative' }}>
        <ArrowBtn dir="left" />
        <ArrowBtn dir="right" />
        <div style={{
          position: 'relative', width: '100%', overflow: 'hidden',
          maskImage: 'linear-gradient(90deg,transparent 0%,black 8%,black 92%,transparent 100%)',
          WebkitMaskImage: 'linear-gradient(90deg,transparent 0%,black 8%,black 92%,transparent 100%)',
          paddingTop: '48px', paddingBottom: '72px',
        }}>
          <div ref={trackRef} style={{ display: 'flex', gap: '14px', paddingLeft: '24px', willChange: 'transform', alignItems: 'flex-end' }}>
            {allItems.map((item, i) => (
              <ShowcaseCard
                key={`${item.id}-${i}`}
                item={item}
                gsapRef={gsapRef}
                onEnter={handleEnter}
                onLeave={handleLeave}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div ref={btnRef} style={{ display: 'flex', justifyContent: 'center', marginTop: '16px', position: 'relative', zIndex: 10 }}>
        <a href="https://app.motiongraceco.com/gallery" target="_blank" rel="noopener noreferrer" style={{
          display: 'inline-flex', alignItems: 'center', gap: '12px',
          padding: '14px 32px', borderRadius: '999px',
          border: '1px solid rgba(201,169,110,0.28)',
          background: 'rgba(201,169,110,0.06)',
          backdropFilter: 'blur(12px)',
          color: 'rgba(237,233,227,0.75)',
          fontSize: '10px', fontWeight: 700, letterSpacing: '0.22em',
          textTransform: 'uppercase', textDecoration: 'none',
          transition: 'border-color 0.3s,background 0.3s,color 0.3s,box-shadow 0.3s',
          cursor: 'pointer',
        }}
          onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor='rgba(201,169,110,0.65)'; el.style.background='rgba(201,169,110,0.13)'; el.style.color='#C9A96E'; el.style.boxShadow='0 0 32px rgba(201,169,110,0.15)'; }}
          onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor='rgba(201,169,110,0.28)'; el.style.background='rgba(201,169,110,0.06)'; el.style.color='rgba(237,233,227,0.75)'; el.style.boxShadow='none'; }}
        >
          <span>View more works</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ opacity: 0.7 }}>
            <path d="M2.5 7H11.5M8 3.5L11.5 7L8 10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>

      <style>{`
        @keyframes streak    { 0%,100% { opacity:0.4; } 50% { opacity:1; } }
        @keyframes dot-pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(0.7); } }
      `}</style>
    </section>
  );
}