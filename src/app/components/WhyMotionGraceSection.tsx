'use client';

import React, { useEffect, useRef, useState } from 'react';

const stats = [
  { value: 60, suffix: '%', label: 'Cost Reduction', sub: 'vs. traditional shoots', accent: '#C9A96E' },
  { value: 5, suffix: 'x', label: 'Faster Delivery', sub: 'average turnaround', accent: '#4A9EFF' },
  { value: 100, suffix: '+', label: 'Assets Per Product', sub: 'from one digital twin', accent: '#8B5CF6' },
  { value: 40, suffix: '%', label: 'Conversion Lift', sub: 'with interactive 3D', accent: '#C9A96E' },
];

const benefits = [
  {
    title: 'No Physical Shoots',
    description: 'Eliminate studio costs, photographer fees, travel, and logistics. Forever.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Faster Launches',
    description: 'From brief to final assets in 5 days. Not 5 weeks.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Infinite Variations',
    description: 'New colorway? New market? New season? Render it in hours.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Premium Visual Control',
    description: 'Perfect lighting. Perfect angle. Perfect mood. Every single time.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

function CounterItem({
  value,
  suffix,
  label,
  sub,
  accent,
}: {
  value: number;
  suffix: string;
  label: string;
  sub: string;
  accent: string;
}) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          const duration = 2200;
          const steps = 70;
          const increment = value / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, started]);

  return (
    <div ref={ref} className="flex flex-col items-center text-center py-2">
      <div className="flex items-baseline gap-0.5 mb-2">
        <span
          className="text-5xl sm:text-6xl font-extrabold tracking-tighter"
          style={{ color: accent }}
        >
          {count}
        </span>
        <span className="text-2xl sm:text-3xl font-bold" style={{ color: accent }}>
          {suffix}
        </span>
      </div>
      <p className="text-sm font-semibold text-foreground mb-1 tracking-tight">{label}</p>
      <p className="text-xs text-muted-foreground font-light tracking-wide">{sub}</p>
    </div>
  );
}

export default function WhyMotionGraceSection() {
  return (
    <section id="why" className="py-28 sm:py-36 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto">

        {/* Section divider */}
        <div className="section-divider mb-20" />

        {/* Header */}
        <div className="text-center mb-20">
          <p data-reveal="up" className="text-[10px] font-semibold tracking-[0.22em] uppercase text-primary/80 mb-4">
            Why Choose Us
          </p>
          <h2 data-reveal="up" data-delay="150" className="text-display-md font-extrabold tracking-tighter text-foreground mb-0 leading-none">
            Why Beauty Brands{' '}
            <span className="text-gradient-gold">Are Switching</span>
          </h2>
        </div>

        {/* Stats row */}
        <div
          data-reveal="up"
          data-delay="200"
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16 p-10 rounded-3xl"
          style={{
            background: 'linear-gradient(145deg, rgba(201,169,110,0.04) 0%, rgba(10,10,18,0.9) 100%)',
            border: '1px solid rgba(201,169,110,0.1)',
          }}
        >
          {stats.map((stat) => (
            <CounterItem key={stat.label} {...stat} />
          ))}
        </div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
          {benefits.map((benefit, i) => (
            <div
              key={benefit.title}
              data-reveal="up"
              data-delay={`${i * 100}`}
              className="group flex gap-5 p-7 rounded-3xl border border-border/40 hover:border-primary/15 transition-all duration-700"
              style={{ background: 'var(--card)' }}
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-primary/8 flex items-center justify-center text-primary group-hover:bg-primary/15 transition-all duration-700">
                {benefit.icon}
              </div>
              <div>
                <h3 className="text-base font-bold tracking-tight text-foreground mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-[1.8] font-light">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Closing line */}
        <div data-reveal="up" data-delay="300" className="text-center pt-4">
          <p className="text-3xl sm:text-4xl font-extrabold tracking-tighter text-foreground leading-none">
            Build once.{' '}
            <span className="text-gradient-gold">Create forever.</span>
          </p>
        </div>
      </div>
    </section>
  );
}