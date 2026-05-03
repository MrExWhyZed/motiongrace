'use client';

import React from 'react';
import { ZoomParallax, ParallaxItem } from '@/components/ui/zoom-parallax';
import { Video, Layers, Boxes, Maximize, Zap, Sparkles } from 'lucide-react';
import Link from 'next/link';

const VIDEO_URL = 'https://res.cloudinary.com/dsst5hzgf/video/upload/v1775637354/Linkedin_final_rfdz0t.mp4';

const parallaxItems: ParallaxItem[] = [
  {
    type: 'video',
    src: VIDEO_URL,
  },
  {
    type: 'feature',
    title: 'Photoreal 3D',
    description: 'Digital twins with sub-millimeter precision and uncompromised detail.',
    icon: <Boxes size={20} strokeWidth={1.5} />,
    accent: '#0894ff',
    accentRgb: '8,148,255',
    badgeText: "High Precision",
    badgeColor: "#0894ff",
    ctaText: "Explore 3D",
    ctaHref: "https://app.motiongraceco.com/gallery",
    gradient: "gray",
    imageUrl: "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-CVv0qK2DYZbOAQP2LboVFgQGt0UMfB.png&w=320&q=75",
  },
  {
    type: 'feature',
    title: 'Cinematic Quality',
    description: 'Hollywood-grade rendering that brings your products to life.',
    icon: <Video size={20} strokeWidth={1.5} />,
    accent: '#c959dd',
    accentRgb: '201,89,221',
    badgeText: "Premium",
    badgeColor: "#c959dd",
    ctaText: "Watch Showreel",
    ctaHref: "https://app.motiongraceco.com/gallery",
    gradient: "purple",
    imageUrl: "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-5i9EDsbgEZk9k7NBeKt3ImNXkx0F66.png&w=320&q=75",
  },
  {
    type: 'feature',
    title: 'Infinite Assets',
    description: 'Generate unlimited angles and environments from a single source model.',
    icon: <Layers size={20} strokeWidth={1.5} />,
    accent: '#ff2e54',
    accentRgb: '255,46,84',
    badgeText: "Scalable",
    badgeColor: "#ff2e54",
    ctaText: "See Examples",
    ctaHref: "/services/infinite-asset-kit",
    gradient: "orange",
    imageUrl: "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-5WJZLkaCfLUnCYpgNz89tPx5C4KYgJ.png&w=320&q=75",
  },
  {
    type: 'feature',
    title: 'AR / VR Ready',
    description: 'Deploy seamless interactive web experiences instantly.',
    icon: <Maximize size={20} strokeWidth={1.5} />,
    accent: '#ff9004',
    accentRgb: '255,144,4',
    badgeText: "Interactive",
    badgeColor: "#ff9004",
    ctaText: "Try AR",
    ctaHref: "/services/interactive-3d",
    gradient: "green",
    imageUrl: "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-Q24CTBwBqnBrGujxuykBW9GfOYTdeE.png&w=320&q=75",
  },
  {
    type: 'feature',
    title: '5-Day Delivery',
    description: 'Lightning fast turnaround with real-time progress tracking.',
    icon: <Zap size={20} strokeWidth={1.5} />,
    accent: '#10b981',
    accentRgb: '16,185,129',
    badgeText: "Fast Track",
    badgeColor: "#10b981",
    ctaText: "Our Process",
    ctaHref: "#process",
    gradient: "gray",
    imageUrl: "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-CVv0qK2DYZbOAQP2LboVFgQGt0UMfB.png&w=320&q=75",
  },
];

export default function ZoomParallaxSection() {
  return (
    <section className="relative z-10 w-full bg-[#020208] pt-32">
      {/* Pricing-Style Headline */}
      <div className="flex flex-col items-center justify-center text-center px-5 pb-20">
        <div className="flex items-center gap-4 mb-6">
          <div style={{ width: '28px', height: '1px', background: 'rgba(8,148,255,0.5)' }} />
          <span style={{ fontSize: '10px', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(8,148,255,0.75)', fontWeight: 800 }}>
            AT A GLANCE
          </span>
          <div style={{ width: '28px', height: '1px', background: 'rgba(8,148,255,0.5)' }} />
        </div>
        <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-[#EDE9E3]">
          Key Highlights <span style={{ color: '#0894ff', textShadow: '0 0 20px rgba(8,148,255,0.7), 0 0 40px rgba(8,148,255,0.3)' }}>.</span>
        </h2>
        <p className="mt-6 text-[#EDE9E3]/50 max-w-md mx-auto text-[15px] leading-relaxed">
          Explore the core features that power our premium production engine.
        </p>
      </div>

      {/* The Parallax Section */}
      <ZoomParallax items={parallaxItems} />

      {/* The CTA Section - Appears from the bottom as a normal scrollable section after the parallax completes */}
      <div className="relative flex min-h-[80vh] flex-col items-center justify-center bg-[#020208] px-5 py-24 z-20">
        <div className="text-center w-full max-w-2xl">
          <p className="mb-5 text-[9px] font-bold uppercase tracking-[0.28em]"
            style={{ color: 'rgba(201,169,110,0.75)', fontFamily: 'var(--font-sans)' }}>
            Ready to Begin
          </p>

          <h2 className="mb-5"
            style={{
              fontSize: 'clamp(2rem, 8vw, 5.2rem)',
              fontWeight: 800,
              letterSpacing: '-0.045em',
              lineHeight: 0.93,
              color: '#EDE9E3',
            }}>
            Let&apos;s Build Your{' '}
            <span
              className="block"
              style={{
                color: '#ffffff',
                textShadow: '0 0 30px rgba(201,89,221,0.8), 0 0 60px rgba(8,148,255,0.5), 0 0 100px rgba(255,46,84,0.3)',
                marginTop: '0.08em',
              }}>
              Product
            </span>
          </h2>

          <p style={{
            fontSize: 'clamp(0.78rem, 3vw, 1rem)',
            color: 'rgba(237,233,227,0.42)',
            lineHeight: 1.85,
            fontWeight: 300,
            maxWidth: '420px',
            margin: '0 auto 2.2rem',
            letterSpacing: '0.01em',
            padding: '0 0.5rem',
          }}>
            Create once. Scale infinitely. Your product deserves a visual
            identity as limitless as your ambition.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="https://app.motiongraceco.com/"
              className="zp-add-project-btn"
            >
              Add Project
              <span className="zp-btn-arrow">→</span>
            </Link>
            <button
              onClick={() => document.querySelector('#showreel')?.scrollIntoView({ behavior: 'smooth' })}
              className="rounded-full border border-white/[0.08] bg-white/[0.03] px-7 py-3.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/[0.48] backdrop-blur-2xl transition-all hover:bg-white/[0.08] hover:border-white/[0.18] hover:text-white/[0.88]"
            >
              View Our Work
            </button>
          </div>

          {/* Trust signals */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-5">
            {['12,400+ Assets Delivered', '5-Day Turnaround', 'No Shoot Required'].map(s => (
              <div key={s} className="flex items-center gap-1.5">
                <div className="h-[3px] w-[3px] shrink-0 rounded-full bg-[#C9A96E]/55" />
                <span className="text-[clamp(7px,2vw,9px)] font-medium uppercase tracking-[0.14em] text-[#EDE9E3]/32">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .zp-add-project-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.75rem 1.8rem;
          border-radius: 9999px;
          border: 1px solid transparent;
          background: rgba(237, 233, 227, 0.06);
          backdrop-filter: blur(16px) saturate(1.2);
          -webkit-backdrop-filter: blur(16px) saturate(1.2);
          color: rgba(237,233,227,0.95);
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          text-decoration: none;
          cursor: pointer;
          position: relative;
          transform: scale(1.03);
          transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.4s ease;
        }
        .zp-add-project-btn::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: 9999px;
          padding: 1px;
          background: linear-gradient(to right, #0894ff, #c959dd, #ff2e54, #ff9004);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0.9;
        }
        .zp-add-project-btn::after {
          content: '';
          position: absolute;
          bottom: -14px;
          left: 50%;
          transform: translateX(-50%);
          width: 75%;
          height: 22px;
          background: linear-gradient(to right, #0894ff44, #c959dd66, #ff2e5444, #ff900433);
          filter: blur(12px);
          border-radius: 50%;
          opacity: 0.7;
          transition: all 0.4s ease;
        }
        .zp-add-project-btn:hover {
          transform: scale(1.07);
          box-shadow:
            0 0 20px rgba(8,148,255,0.35),
            0 0 40px rgba(201,89,221,0.25),
            0 0 60px rgba(255,46,84,0.2);
        }
        .zp-add-project-btn:hover::after {
          opacity: 1;
          filter: blur(20px);
          transform: translateX(-50%) scale(1.15);
        }
        .zp-btn-arrow {
          display: inline-block;
          font-size: 0.75rem;
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        .zp-add-project-btn:hover .zp-btn-arrow {
          transform: translateX(4px);
        }
      `}</style>
    </section>
  );
}
