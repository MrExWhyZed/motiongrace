'use client';

import React, { useState, useEffect, useRef } from 'react';

// ─── Ambient particle shape (built client-side only) ────────────────────────
interface AmbientParticle {
  id: number; left: string; top: string; size: number; delay: number; duration: number;
}

function buildAmbientParticles(): AmbientParticle[] {
  return Array.from({ length: 14 }, (_, i) => ({
    id: i,
    left: `${((i * 7.1 + 5) % 100).toFixed(4)}%`,
    top:  `${((i * 8.7 + 8) % 88).toFixed(4)}%`,
    size: i % 3 === 0 ? 2.5 : i % 3 === 1 ? 1.5 : 1,
    delay: i * 0.6,
    duration: 7 + (i % 5) * 1.5,
  }));
}

// ─── Seeded scroll-burst particles ──────────────────────────────────────────
function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}
interface BurstParticle {
  id: number; left: number; top: number; size: number;
  color: string; driftY: number; driftX: number;
}

// ─── useScrollProgress ──────────────────────────────────────────────────────
function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let rafId: number;
    const update = () => {
      const raw = window.scrollY / window.innerHeight;
      setProgress(Math.max(0, Math.min(1, raw)));
    };
    const onScroll = () => { cancelAnimationFrame(rafId); rafId = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(rafId); };
  }, []);
  return progress;
}

// ─── Process steps (replaces LOUD industries) ───────────────────────────────
interface ProcessStep {
  id: string;
  label: string;
  heading: string;
  tags: string;
  description: string;
  image: string;
  imageAlt: string;
  imagePosition: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  headingPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  descPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const processSteps: ProcessStep[] = [
  {
    id: 'brief',
    label: 'CREATIVE BRIEF',
    heading: 'Creative Brief',
    tags: 'Strategy · Vision · Direction',
    description: 'Every project begins with a deep discovery session. We align on brand identity, campaign goals, visual language, and deliverable formats — so every frame we produce is intentional.',
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_17e5ce72b-1764676806087.png',
    imageAlt: 'Creative brief session',
    imagePosition: 'top-right',
    headingPosition: 'top-left',
    descPosition: 'bottom-right',
  },
  {
    id: 'cgi',
    label: 'CGI PRODUCTION',
    heading: 'CGI Production',
    tags: 'Modeling · Texturing · Animation',
    description: 'Our artists build photorealistic 3D assets from scratch — product models, environments, and motion sequences crafted to match your brand standards at cinematic quality.',
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1d1b4f004-1766773766422.png',
    imageAlt: 'CGI production workflow',
    imagePosition: 'top-left',
    headingPosition: 'bottom-right',
    descPosition: 'top-right',
  },
  {
    id: 'rendering',
    label: 'RENDERING',
    heading: 'Rendering',
    tags: 'Lighting · Realism · Scale',
    description: 'We render at scale using high-fidelity pipelines — real-time lighting, physically-based materials, and multi-format output. Hundreds of assets delivered without sacrificing quality.',
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1b719e442-1772062537347.png',
    imageAlt: 'Rendering pipeline output',
    imagePosition: 'bottom-right',
    headingPosition: 'bottom-left',
    descPosition: 'top-left',
  },
  {
    id: 'delivery',
    label: 'DELIVERY',
    heading: 'Delivery',
    tags: 'On-Demand · Multi-Format · Ongoing',
    description: 'Assets are packaged and delivered in every format you need — social, web, print, broadcast. And unlike a single shoot, our pipeline keeps producing as your campaigns evolve.',
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1c9039486-1776969073592.png',
    imageAlt: 'Multi-format asset delivery',
    imagePosition: 'bottom-left',
    headingPosition: 'bottom-right',
    descPosition: 'top-left',
  },
];

const pillarsTexts = [
  'Cinematic CGI. Infinite Possibilities.',
  'Motion infrastructure for beauty brands.',
  'CGI systems that never stop creating.',
  'Cinematic assets, on demand.',
  'Scale your visual content effortlessly.',
  'Built for campaigns, seasons, and launches.',
];

export default function HeroSection() {
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const [currentPillar, setCurrentPillar] = useState(0);
  const [mobileStepsOpen, setMobileStepsOpen] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [cursorVisible, setCursorVisible] = useState(false);

  const scrollProgress = useScrollProgress();
  const sp = scrollProgress;

  // Scroll-derived animation values
  const veilOpacity = Math.max(0, Math.min(1, sp * 0.85));
  const veilTranslY = (1 - sp) * 40;
  const leftWidgetOpacity = Math.max(0, Math.min(1, 1 - sp * 2.2));
  const leftWidgetTranslX = -sp * 80;
  const rightWidgetOpacity = Math.max(0, Math.min(1, 1 - sp * 2.2));
  const rightWidgetTranslX = sp * 80;
  const contentOpacity = Math.max(0, Math.min(1, 1 - sp * 2));
  const contentTranslY = -sp * 50;

  // Particles — client-side only to prevent SSR/hydration mismatch
  const [burstParticles, setBurstParticles] = useState<BurstParticle[]>([]);
  const [ambientParticles, setAmbientParticles] = useState<AmbientParticle[]>([]);
  useEffect(() => {
    setBurstParticles(
      Array.from({ length: 28 }, (_, i) => {
        const r = (offset: number) => seededRandom(i * 7 + offset);
        return {
          id: i,
          left: r(0) * 100,
          top: r(1) * 100,
          size: 2 + r(2) * 3,
          color: r(3) < 0.55
            ? `rgba(201,169,110,${0.5 + r(4) * 0.4})`
            : r(3) < 0.8
            ? `rgba(74,158,255,${0.4 + r(4) * 0.35})`
            : `rgba(237,233,227,${0.35 + r(4) * 0.3})`,
          driftY: 80 + r(5) * 200,
          driftX: (r(6) - 0.5) * 110,
        };
      })
    );
    setAmbientParticles(buildAmbientParticles());
  }, []);

  // Pillar cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPillar((p) => (p + 1) % pillarsTexts.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  // Custom cursor
  useEffect(() => {
    const onMove = (e: MouseEvent) => { setCursorPos({ x: e.clientX, y: e.clientY }); setCursorVisible(true); };
    const onLeave = () => setCursorVisible(false);
    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    return () => { window.removeEventListener('mousemove', onMove); document.removeEventListener('mouseleave', onLeave); };
  }, []);

  const activeStepData = processSteps.find((s) => s.id === activeStep);

  const getGridClass = (pos: string, type: 'image' | 'heading' | 'desc') => {
    const map: Record<string, string> = {
      'top-right':   type === 'image' ? 'col-start-2 row-start-1' : type === 'heading' ? 'col-start-2 row-start-1 items-end justify-start' : 'col-start-2 row-start-1 items-end justify-start',
      'top-left':    type === 'image' ? 'col-start-1 row-start-1' : type === 'heading' ? 'col-start-1 row-start-1 items-end justify-end' : 'col-start-1 row-start-1 items-end justify-start',
      'bottom-right':type === 'image' ? 'col-start-2 row-start-2' : type === 'heading' ? 'col-start-2 row-start-2 items-start justify-start' : 'col-start-2 row-start-2 items-start justify-start',
      'bottom-left': type === 'image' ? 'col-start-1 row-start-2' : type === 'heading' ? 'col-start-1 row-start-2 items-start justify-end' : 'col-start-1 row-start-2 items-start justify-start',
    };
    return map[pos] ?? 'col-start-1 row-start-1';
  };

  return (
    <>
      {/* ── Injected keyframes & helpers ── */}
      <style>{`
        @keyframes mg-float {
          0%,100%{transform:translateY(0) scale(1);}
          50%{transform:translateY(-12px) scale(1.04);}
        }
        @keyframes mg-float-r {
          0%,100%{transform:translateY(0) scale(1);}
          50%{transform:translateY(10px) scale(0.97);}
        }
        @keyframes mg-breathe-gold {
          0%,100%{opacity:.5;transform:scale(1);}
          50%{opacity:1;transform:scale(1.18);}
        }
        @keyframes mg-scroll-bounce {
          0%,100%{opacity:.4;transform:scaleY(1);}
          50%{opacity:.9;transform:scaleY(1.18);}
        }
        @keyframes mg-gold-pulse {
          0%,100%{box-shadow:0 0 0 0 rgba(201,169,110,0);}
          50%{box-shadow:0 0 18px 4px rgba(201,169,110,0.28);}
        }
        .mg-float    { animation: mg-float 8s ease-in-out infinite; }
        .mg-float-r  { animation: mg-float-r 9s ease-in-out infinite; }
        .mg-breathe  { animation: mg-breathe-gold 2.8s ease-in-out infinite; }
        .mg-scroll-line { background: linear-gradient(to bottom,rgba(201,169,110,.7),transparent); animation: mg-scroll-bounce 2s ease-in-out infinite; }
        .mg-widget {
          background: rgba(4,4,10,0.78);
          border: 1px solid rgba(201,169,110,0.18);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
        }
        .mg-badge {
          background: rgba(4,4,10,0.55);
          border: 1px solid rgba(201,169,110,0.22);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .mg-cta-gold {
          background: linear-gradient(135deg,rgba(201,169,110,1) 0%,rgba(184,148,88,1) 100%);
          color: #04040A;
          font-weight: 600;
          animation: mg-gold-pulse 3s ease-in-out infinite;
        }
        .mg-cta-gold:hover { opacity:.9; }
        .mg-cta-outline {
          border: 1px solid rgba(201,169,110,.45);
          color: rgba(201,169,110,.9);
        }
        .mg-cta-outline:hover {
          background: rgba(201,169,110,.08);
          border-color: rgba(201,169,110,.85);
          color: rgba(201,169,110,1);
        }
        .mg-step-btn { color:rgba(237,233,227,.75); }
        .mg-step-btn:hover { color:rgba(201,169,110,1); }
        .mg-step-active { color:rgba(201,169,110,1) !important; }
        .mg-cursor-ring { stroke: rgba(201,169,110,.9); }
        .mg-metric { color:rgba(201,169,110,1); }
        .mg-divider { background:rgba(201,169,110,.2); }
      `}</style>

      {/* ── Custom Cursor ── */}
      <div
        className="fixed pointer-events-none z-[99999] transition-opacity duration-300"
        style={{ left: cursorPos.x, top: cursorPos.y, opacity: cursorVisible ? 1 : 0, transform: 'translate(-50%,-50%)' }}>
        <svg viewBox="0 0 50 50" width="48" height="48" fill="none">
          <circle cx="25" cy="25" r="24" className="mg-cursor-ring" fill="none" strokeWidth="1" />
          {activeStep && (
            <g transform="translate(7,10)">
              <path d="M9 15 L27.45 15" stroke="rgba(201,169,110,.9)" strokeWidth="1" fill="none"/>
              <path d="M27 15 L21 9"   stroke="rgba(201,169,110,.9)" strokeWidth="1" fill="none"/>
              <path d="M27 15 L21 21"  stroke="rgba(201,169,110,.9)" strokeWidth="1" fill="none"/>
            </g>
          )}
        </svg>
        {activeStep && (
          <p className="absolute left-14 top-1/2 -translate-y-1/2 whitespace-nowrap font-semibold"
             style={{ fontSize:'0.625rem', fontFamily:"'DM Mono',monospace", color:'rgba(201,169,110,.9)' }}>
            VIEW PROCESS
          </p>
        )}
      </div>

      {/* ── Fixed video background ── */}
      <div className="fixed top-0 left-0 w-screen z-0" style={{ height:'100vh' }}>
        <div style={{ position:'relative', width:'100%', height:'100%', overflow:'hidden' }}>
          <iframe
            allow="fullscreen;autoplay"
            allowFullScreen
            src="https://streamable.com/e/1csp7t?autoplay=1&muted=1&nocontrols=1"
            style={{
              border:'none', position:'absolute', top:'50%', left:'50%',
              transform:'translate(-50%,-50%)',
              width:'177.78vh', height:'100vh',
              minWidth:'100%', minHeight:'56.25vw',
              pointerEvents:'none',
            }}
          />
          <div className="absolute inset-0" style={{ background:'rgba(4,4,10,0.52)' }} />
          {/* Subtle gold top bloom */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background:'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(201,169,110,0.07) 0%, transparent 65%)',
          }} />
        </div>
      </div>

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden" style={{ height:'100vh' }}>

        {/* Ambient particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex:2 }}>
          {ambientParticles.map((p) => (
            <div key={p.id} className="absolute rounded-full" style={{
              left: p.left, top: p.top,
              width:`${p.size}px`, height:`${p.size}px`,
              background: p.id%3===0 ? 'rgba(201,169,110,0.55)' : p.id%3===1 ? 'rgba(74,158,255,0.4)' : 'rgba(237,233,227,0.25)',
              animation:`mg-float ${p.duration}s ease-in-out infinite`,
              animationDelay:`${p.delay}s`,
              boxShadow: p.id%3===0 ? '0 0 5px rgba(201,169,110,.6)' : '0 0 4px rgba(74,158,255,.4)',
            }} />
          ))}
        </div>

        {/* Scroll-burst particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex:3 }}>
          {burstParticles.map((p) => {
            const opacity = Math.max(0, Math.min(1, 1 - sp * 1.4));
            const scale   = 1 - sp * 0.5;
            return (
              <div key={p.id} className="absolute rounded-full" style={{
                left:`${p.left}%`, top:`${p.top}%`,
                width:`${p.size}px`, height:`${p.size}px`,
                background: p.color, opacity,
                transform:`translateY(${-sp*p.driftY}px) translateX(${sp*p.driftX}px) scale(${scale})`,
                willChange:'transform',
              }} />
            );
          })}
        </div>

        {/* Golden veil on scroll */}
        <div className="absolute inset-0 pointer-events-none" style={{
          zIndex:4, opacity:veilOpacity,
          transform:`translateY(${veilTranslY}px)`,
          willChange:'transform',
          background:'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(201,169,110,0.45) 0%, rgba(201,169,110,0.1) 40%, transparent 70%)',
        }} />

        {/* ── LEFT WIDGET — Renders Delivered ── */}
        <div
          className="absolute left-6 xl:left-10 top-1/2 hidden lg:flex pointer-events-none mg-float"
          style={{
            zIndex:10,
            opacity: leftWidgetOpacity,
            transform:`translateY(-50%) translateX(${leftWidgetTranslX}px)`,
            willChange:'transform',
          }}>
          <div className="mg-widget rounded-2xl p-5 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                 style={{ background:'rgba(201,169,110,0.1)', border:'1px solid rgba(201,169,110,0.2)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                      stroke="rgba(201,169,110,1)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p className="font-medium tracking-wide mb-0.5"
                 style={{ fontSize:'10px', color:'rgba(201,169,110,0.6)', fontFamily:"'DM Mono',monospace" }}>
                Renders Delivered
              </p>
              <p className="font-bold text-white tracking-tight"
                 style={{ fontSize:'1.15rem', fontFamily:"'DM Mono',monospace" }}>
                12,400+
              </p>
            </div>
          </div>
        </div>

        {/* ── RIGHT WIDGETS ── */}
        <div
          className="absolute right-6 xl:right-10 top-1/2 hidden lg:flex flex-col gap-4 pointer-events-none"
          style={{
            zIndex:10,
            opacity: rightWidgetOpacity,
            transform:`translateY(-50%) translateX(${rightWidgetTranslX}px)`,
            willChange:'transform',
          }}>

          {/* Live Render bar chart */}
          <div className="mg-widget rounded-2xl p-5 flex-shrink-0 mg-float-r">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background:'rgba(74,158,255,1)', animation:'mg-breathe-gold 2.4s ease-in-out infinite' }} />
              <span style={{ fontSize:'10px', color:'rgba(201,169,110,0.6)', fontFamily:"'DM Mono',monospace" }}>Live Render</span>
              <span className="ml-auto" style={{ fontSize:'10px', color:'rgba(74,158,255,1)', fontFamily:"'DM Mono',monospace" }}>98%</span>
            </div>
            <div className="flex items-end gap-1 h-10">
              {[40,65,55,80,70,90,75,95].map((h, i) => (
                <div key={i} className="w-2 rounded-sm" style={{
                  height:`${h}%`,
                  background: i===7 ? 'rgba(74,158,255,1)' : i>=5 ? 'rgba(74,158,255,0.45)' : 'rgba(201,169,110,0.25)',
                }} />
              ))}
            </div>
          </div>

          {/* Avg. Turnaround */}
          <div className="mg-widget rounded-2xl p-5 flex items-center gap-3.5 flex-shrink-0 mg-float" style={{ animationDelay:'2.4s' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                 style={{ background:'rgba(74,158,255,0.08)', border:'1px solid rgba(74,158,255,0.2)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="rgba(74,158,255,0.8)" strokeWidth="1.5"/>
                <path d="M12 6v6l4 2" stroke="rgba(74,158,255,0.8)" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <p className="font-medium tracking-wide mb-0.5"
                 style={{ fontSize:'10px', color:'rgba(201,169,110,0.6)', fontFamily:"'DM Mono',monospace" }}>
                Avg. Turnaround
              </p>
              <p className="font-bold text-white tracking-tight"
                 style={{ fontSize:'1.15rem', fontFamily:"'DM Mono',monospace" }}>
                5 Days
              </p>
            </div>
          </div>
        </div>

        {/* ── Bottom bar: process steps (left) + CTA (right) ── */}
        <div className="absolute bottom-0 left-0 w-full px-4 lg:px-10 flex flex-row gap-4 justify-between items-end pb-10 pointer-events-none" style={{ zIndex:1001 }}>

          {/* Mobile: Show Process */}
          <div className="lg:hidden pointer-events-auto">
            <button
              className="rounded-full px-4 h-[34px] flex items-center gap-2 transition-all duration-500 mg-cta-outline"
              style={{ fontSize:'11px', fontFamily:"'DM Mono',monospace", backdropFilter:'blur(8px)' }}
              onClick={() => setMobileStepsOpen(true)}>
              View Process
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m18 15-6-6-6 6"/>
              </svg>
            </button>
          </div>

          {/* Desktop: process labels */}
          <div className="hidden lg:flex flex-col items-start justify-end pointer-events-auto">
            {processSteps.map((step) => (
              <button
                key={step.id}
                className={`transition-colors duration-200 py-1 text-left mg-step-btn ${activeStep === step.id ? 'mg-step-active' : ''}`}
                style={{
                  fontSize:'0.625rem', fontWeight:600, letterSpacing:'0.16em',
                  fontFamily:"'DM Mono',monospace",
                  opacity: activeStep && activeStep !== step.id ? 0.35 : 1,
                }}
                onMouseEnter={() => setActiveStep(step.id)}
                onMouseLeave={() => setActiveStep(null)}>
                {step.label}
              </button>
            ))}
          </div>

          {/* Book a Call CTA */}
          <div className="pointer-events-auto">
            <a
              href="#cta"
              className="rounded-full flex justify-center items-center transition-all duration-300 mg-cta-gold"
              style={{ fontSize:'11px', fontFamily:"'DM Mono',monospace", height:'34px', padding:'0 18px', minWidth:'34px' }}
              onClick={(e) => { e.preventDefault(); document.querySelector('#cta')?.scrollIntoView({ behavior:'smooth' }); }}>
              <span className="hidden lg:block">Book a Call</span>
              <span className="lg:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z"/>
                  <path d="M21 16v2a4 4 0 0 1-4 4h-5"/>
                </svg>
              </span>
            </a>
          </div>
        </div>

        {/* ── Center hero content ── */}
        <div
          className="w-full flex flex-col justify-center items-center"
          style={{
            height:'100vh', position:'relative', zIndex:5,
            opacity: contentOpacity,
            transform:`translateY(${contentTranslY}px)`,
            willChange:'transform, opacity',
          }}>
          <div className="flex flex-col items-center justify-center gap-6 px-4 text-center">

            {/* Badge */}
            <div className="relative rounded-full h-[30px] flex justify-center items-center gap-1 px-4 mg-badge"
                 style={{ fontFamily:"'DM Mono',monospace", fontSize:'0.625rem', fontWeight:500, letterSpacing:'0.16em' }}>
              <div className="flex gap-2 relative z-10 items-center" style={{ color:'rgba(201,169,110,0.9)' }}>
                <span className="w-1.5 h-1.5 rounded-full inline-block mg-breathe"
                      style={{ background:'rgba(201,169,110,1)' }} />
                <span>CGI · 3D · BEAUTY</span>
              </div>
            </div>

            {/* Cycling headline */}
            <p style={{
              fontSize:'clamp(2rem,5.5vw,3.75rem)',
              lineHeight:'115%',
              maxWidth:'860px',
              fontFamily:"'DM Mono',monospace",
              fontWeight:300,
              color:'rgba(237,233,227,1)',
            }}>
              {pillarsTexts[currentPillar]}
            </p>

            {/* Gold divider */}
            <div style={{ width:'40px', height:'1px', background:'rgba(201,169,110,0.5)' }} />

            {/* Subtext */}
            <p style={{
              maxWidth:'480px',
              color:'rgba(107,107,128,1)',
              fontWeight:300,
              lineHeight:'1.8',
              letterSpacing:'0.03em',
              fontSize:'clamp(0.85rem,1.2vw,1rem)',
              fontFamily:"'DM Sans','DM Mono',sans-serif",
            }}>
              Turn your product into a digital asset that can be reimagined
              endlessly — without physical production.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 justify-center mt-1">
              <a
                href="#showreel"
                className="flex items-center gap-2 rounded-full px-6 py-2.5 transition-all duration-300 mg-cta-outline"
                style={{ fontSize:'11px', fontFamily:"'DM Mono',monospace", letterSpacing:'0.12em' }}
                onClick={(e) => { e.preventDefault(); document.querySelector('#showreel')?.scrollIntoView({ behavior:'smooth' }); }}>
                View Work
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
              <a
                href="#cta"
                className="flex items-center gap-2 rounded-full px-6 py-2.5 transition-all duration-300 mg-cta-gold"
                style={{ fontSize:'11px', fontFamily:"'DM Mono',monospace", letterSpacing:'0.12em' }}
                onClick={(e) => { e.preventDefault(); document.querySelector('#cta')?.scrollIntoView({ behavior:'smooth' }); }}>
                Book a Call
              </a>
            </div>

            {/* Metrics */}
            <div className="flex flex-wrap gap-6 justify-center mt-4">
              <div className="flex flex-col items-center gap-1">
                <span className="font-semibold mg-metric" style={{ fontSize:'clamp(1.25rem,2.5vw,1.75rem)', fontFamily:"'DM Mono',monospace" }}>12,400+</span>
                <span className="uppercase tracking-widest" style={{ fontSize:'0.55rem', fontFamily:"'DM Mono',monospace", color:'rgba(201,169,110,0.45)' }}>Renders Delivered</span>
              </div>
              <div className="w-px self-stretch hidden sm:block mg-divider" />
              <div className="flex flex-col items-center gap-1">
                <span className="font-semibold mg-metric" style={{ fontSize:'clamp(1.25rem,2.5vw,1.75rem)', fontFamily:"'DM Mono',monospace" }}>5 Days</span>
                <span className="uppercase tracking-widest" style={{ fontSize:'0.55rem', fontFamily:"'DM Mono',monospace", color:'rgba(201,169,110,0.45)' }}>Avg. Turnaround</span>
              </div>
              <div className="w-px self-stretch hidden sm:block mg-divider" />
              <div className="flex flex-col items-center gap-1">
                <span className="font-semibold mg-metric" style={{ fontSize:'clamp(1.25rem,2.5vw,1.75rem)', fontFamily:"'DM Mono',monospace" }}>∞</span>
                <span className="uppercase tracking-widest" style={{ fontSize:'0.55rem', fontFamily:"'DM Mono',monospace", color:'rgba(201,169,110,0.45)' }}>On-Demand Content</span>
              </div>
            </div>

            {/* Scroll indicator */}
            <div className="flex flex-col items-center gap-2 mt-6" style={{ opacity:0.5 }}>
              <span style={{ fontSize:'9px', letterSpacing:'0.25em', fontFamily:"'DM Mono',monospace", color:'rgba(201,169,110,0.7)' }}>SCROLL</span>
              <div className="w-px h-10 mg-scroll-line" />
            </div>
          </div>
        </div>

        {/* ── Process hover panel (desktop) ── */}
        {activeStepData && (
          <div className="fixed inset-0 pointer-events-none" style={{ backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)', zIndex:100 }}>
            <div className="absolute inset-0" style={{ background:'rgba(4,4,10,0.62)' }} />
            <div className="absolute top-0 left-0 w-full h-px" style={{ background:'linear-gradient(to right,transparent,rgba(201,169,110,0.4),transparent)' }} />
            <div className="relative z-20 h-full grid grid-cols-2 grid-rows-2 gap-5 p-4"
                 style={{ maxWidth:'calc(100vw - 300px)', maxHeight:'90vh', margin:'auto 0 0 auto' }}>

              <div className={`relative flex w-full h-full p-4 ${getGridClass(activeStepData.imagePosition, 'image')}`}>
                <div className="relative w-full h-full overflow-hidden">
                  <img src={activeStepData.image} alt={activeStepData.imageAlt}
                       className="object-contain w-full h-full" style={{ maxHeight:'320px' }} />
                </div>
              </div>

              <div className={`relative flex w-full h-full p-4 ${getGridClass(activeStepData.headingPosition, 'heading')}`}>
                <h2 className="text-white text-left"
                    style={{ fontFamily:"'DM Mono',monospace", fontSize:'clamp(2rem,4vw,3rem)', lineHeight:'1.1' }}>
                  {activeStepData.heading}
                </h2>
              </div>

              <div className={`relative flex w-full h-full p-4 ${getGridClass(activeStepData.descPosition, 'desc')}`}>
                <div className="flex flex-col gap-6 max-w-sm">
                  <p style={{ fontFamily:"'DM Mono',monospace", fontSize:'0.75rem', letterSpacing:'0.12em', color:'rgba(201,169,110,0.8)' }}>
                    {activeStepData.tags}
                  </p>
                  <div className="text-white text-sm pl-3" style={{ borderLeft:'1px solid rgba(201,169,110,0.3)' }}>
                    <p style={{ fontFamily:"'DM Mono',monospace" }}>{activeStepData.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Mobile process modal ── */}
        {mobileStepsOpen && (
          <div className="fixed inset-0 flex justify-center items-center" style={{ backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)', background:'rgba(4,4,10,0.78)', zIndex:200 }}>
            <button className="absolute top-6 right-4 w-6 h-6 flex flex-col justify-center items-center gap-1"
                    onClick={() => setMobileStepsOpen(false)}>
              <span className="block w-4 h-px bg-white rotate-45 translate-y-[5px]" />
              <span className="block w-4 h-px bg-white -rotate-45" />
            </button>
            <div className="grid grid-cols-2 gap-2 p-4">
              {processSteps.map((step) => (
                <button key={step.id}
                        className="p-4 leading-4 font-semibold transition-all duration-200 min-h-20"
                        style={{
                          fontSize:'0.625rem', letterSpacing:'0.16em',
                          fontFamily:"'DM Mono',monospace",
                          border:'1px solid rgba(201,169,110,0.3)',
                          color:'rgba(201,169,110,0.9)',
                          background:'rgba(201,169,110,0.04)',
                        }}
                        onClick={() => setMobileStepsOpen(false)}>
                  {step.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}