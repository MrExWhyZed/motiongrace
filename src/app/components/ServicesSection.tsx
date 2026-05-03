'use client';

import React, { useEffect, useRef } from 'react';
import LazySection from '@/app/components/LazySection';
import Link from 'next/link';
import GradientCardShowcase, { GradientCard } from '@/components/ui/gradient-card-showcase';

const services = [
  {
    id: 1,
    number: '01',
    title: 'Cinematic Commercials',
    href: '/services/cinematic-product-commercials',
    description:
      'Luxury product films with full creative control. We craft 30–60 second hero spots that rival broadcast-quality campaigns — rendered entirely in CGI.',
    detail: 'No studio. No shoot day. No reshoot costs.',
    tag: 'Film & Motion',
    accent: '#C9A96E',
    accentRgb: '201,169,110',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="7" width="20" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M16 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8 3L4 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="14.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    stats: [{ label: 'Avg. Views', value: '2.4M+' }, { label: 'Conversion Lift', value: '3x' }],
  },
  {
    id: 2,
    number: '02',
    title: 'Infinite Asset Kits',
    href: '/services/infinite-asset-kit',
    description:
      'One product. Endless visuals. We build a digital twin of your product and generate unlimited campaign-ready assets — every angle, every mood, every season.',
    detail: 'Deliver 100+ assets in the time a photoshoot produces 20.',
    tag: 'Scale & Volume',
    accent: '#4A9EFF',
    accentRgb: '74,158,255',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    stats: [{ label: 'Assets / Week', value: '100+' }, { label: 'Cost vs. Shoot', value: '-70%' }],
  },
  {
    id: 3,
    number: '03',
    title: 'Interactive 3D & AR',
    href: '/services/interactive-3d',
    description:
      'Let your customers experience products in real time. Web-based 3D viewers and AR try-on experiences that increase conversion by up to 40%.',
    detail: 'Works on any device. No app download required.',
    tag: 'AR Commerce',
    accent: '#8B5CF6',
    accentRgb: '139,92,246',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    stats: [{ label: 'Conversion Lift', value: '+40%' }, { label: 'Return Rate Drop', value: '-25%' }],
  },
];

type Service = (typeof services)[number] & { href: string };

function BackgroundMesh() {
  const hostRef = useRef<HTMLDivElement>(null);
  const pointerGlowRef = useRef<HTMLDivElement>(null);
  const ambientRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (!hostRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let mounted = true;
    let cleanup = () => { };

    void (async () => {
      const { gsap } = await import('gsap');
      if (!mounted || !hostRef.current) return;

      const host = hostRef.current;
      const pointerGlow = pointerGlowRef.current;
      const ambients = ambientRefs.current.filter(Boolean) as HTMLDivElement[];

      if (!pointerGlow) return;

      // On touch/mobile devices, skip mouse-tracking & expensive ambient animations
      const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;
      const cores = (navigator as Navigator & { hardwareConcurrency?: number }).hardwareConcurrency ?? 8;
      const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
      const isLowOrMid = cores <= 6 || memory <= 8;

      const ctx = gsap.context(() => {
        if (!isTouchDevice) {
          gsap.set(pointerGlow, {
            xPercent: -50,
            yPercent: -50,
            x: host.clientWidth * 0.5,
            y: host.clientHeight * 0.5,
            autoAlpha: 0.38,
          });

          const xTo = gsap.quickTo(pointerGlow, 'x', { duration: 0.45, ease: 'power3.out' });
          const yTo = gsap.quickTo(pointerGlow, 'y', { duration: 0.45, ease: 'power3.out' });

          const handleMove = (event: MouseEvent) => {
            const rect = host.getBoundingClientRect();
            xTo(event.clientX - rect.left);
            yTo(event.clientY - rect.top);
          };

          host.addEventListener('mousemove', handleMove, { passive: true });
          cleanup = () => { host.removeEventListener('mousemove', handleMove); };
        }

        // Skip ambient float animations on low/mid range to prevent compositor overload
        if (!isTouchDevice && !isLowOrMid) {
          ambients.forEach((ambient, index) => {
            gsap.to(ambient, {
              x: index === 0 ? 48 : index === 1 ? -54 : 34,
              y: index === 0 ? -36 : index === 1 ? 26 : -44,
              scale: index === 1 ? 1.12 : 1.08,
              duration: 6 + index * 1.3,
              repeat: -1,
              yoyo: true,
              ease: 'sine.inOut',
            });
          });
        }
      }, host);

      const previousCleanup = cleanup;
      cleanup = () => {
        previousCleanup?.();
        ctx.revert();
      };
    })();

    return () => {
      mounted = false;
      cleanup();
    };
  }, []);

  return (
    <div ref={hostRef} className="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        ref={pointerGlowRef}
        className="absolute h-[28rem] w-[28rem] rounded-full hidden md:block"
        style={{
          background: 'radial-gradient(circle, rgba(201,169,110,0.08) 0%, rgba(201,169,110,0.02) 35%, transparent 70%)',
          filter: 'blur(34px)',
        }}
      />

      {[
        {
          className: 'top-[10%] left-[8%] h-80 w-80',
          background: 'radial-gradient(circle, rgba(201,169,110,0.05) 0%, transparent 72%)',
        },
        {
          className: 'bottom-[10%] right-[10%] h-72 w-72',
          background: 'radial-gradient(circle, rgba(74,158,255,0.045) 0%, transparent 72%)',
        },
        {
          className: 'top-[55%] left-[48%] h-60 w-60 -translate-x-1/2',
          background: 'radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 72%)',
        },
      ].map((ambient, index) => (
        <div
          key={index}
          ref={(element) => {
            ambientRefs.current[index] = element;
          }}
          className={`absolute rounded-full hidden md:block ${ambient.className}`}
          style={{
            background: ambient.background,
            filter: 'blur(40px)',
          }}
        />
      ))}

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(6,6,14,0.5) 0%, transparent 16%, transparent 84%, rgba(6,6,14,0.42) 100%)',
        }}
      />
    </div>
  );
}

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let mounted = true;
    let cleanup = () => { };

    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);

      if (!mounted || !sectionRef.current) return;

      gsap.registerPlugin(ScrollTrigger);

      const section = sectionRef.current;

      const ctx = gsap.context(() => {
        if (headerRef.current) {
          gsap.fromTo(
            Array.from(headerRef.current.children),
            {
              autoAlpha: 0,
              y: 26,
            },
            {
              autoAlpha: 1,
              y: 0,
              duration: 1,
              stagger: 0.08,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 78%',
                once: true,
              },
            }
          );
        }

        if (showcaseRef.current) {
          gsap.fromTo(
            showcaseRef.current,
            { autoAlpha: 0, y: 40 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 60%',
                once: true,
              },
            }
          );
        }
      }, section);

      cleanup = () => ctx.revert();
    })();

    return () => {
      mounted = false;
      cleanup();
    };
  }, []);

  const mappedServices: GradientCard[] = services.map(service => {
    let gradientTo = '#000000';
    if (service.id === 1) gradientTo = '#8B6A32'; 
    if (service.id === 2) gradientTo = '#1A52A0'; 
    if (service.id === 3) gradientTo = '#4B2A99'; 

    return {
      title: service.title,
      desc: service.description,
      gradientFrom: service.accent,
      gradientTo: gradientTo,
      icon: service.icon,
      href: service.href,
      number: service.number,
      tag: service.tag,
    };
  });

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative md:overflow-hidden px-6 py-16 sm:px-10 sm:py-24"
      style={{
        background: 'linear-gradient(180deg, #020208 0%, #04040c 50%, #030309 100%)',
      }}
    >
      <BackgroundMesh />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div ref={headerRef} className="mb-12">
          <div className="mb-6 inline-flex items-center gap-2.5">
            <div style={{ width: '24px', height: '1px', background: 'rgba(201,169,110,0.6)' }} />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: 'rgba(201,169,110,0.8)' }}>
              What We Create
            </span>
          </div>

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h2 className="max-w-xl text-[clamp(1.5rem,5vw,3rem)] font-black leading-[0.95] tracking-tighter">
              <span style={{ color: 'var(--foreground)' }}>Our  </span>
              <span
                style={{
                  color: 'transparent',
                  WebkitTextStroke: '1px rgba(237,233,227,0.78)',
                  WebkitTextFillColor: 'transparent',
                  textShadow: 'none',
                }}
              >
                Services.
              </span>
            </h2>

            <p className="max-w-xs text-sm font-light leading-[1.8] text-muted-foreground md:text-right">
              Three core disciplines that transform how luxury brands produce and distribute visual content.
            </p>
          </div>
        </div>

        <div ref={showcaseRef}>
          <GradientCardShowcase cards={mappedServices} />
        </div>
      </div>
    </section>
  );
}
