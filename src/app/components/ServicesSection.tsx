'use client';

import React, { useState } from 'react';

const services = [
  {
    id: 1,
    number: '01',
    title: 'Cinematic Commercials',
    description:
      'Luxury product films with full creative control. We craft 30–60 second hero spots that rival broadcast-quality campaigns — rendered entirely in CGI.',
    detail: 'No studio. No shoot day. No reshoot costs.',
    accent: '#C9A96E',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="7" width="20" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M16 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8 3L4 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="14.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: 2,
    number: '02',
    title: 'Infinite Asset Kits',
    description:
      'One product. Endless visuals. We build a digital twin of your product and generate unlimited campaign-ready assets — every angle, every mood, every season.',
    detail: 'Deliver 100+ assets in the time a photoshoot produces 20.',
    accent: '#4A9EFF',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 3,
    number: '03',
    title: 'Interactive 3D / AR Commerce',
    description:
      'Let your customers experience products in real time. Web-based 3D viewers and AR try-on experiences that increase conversion by up to 40%.',
    detail: 'Works on any device. No app download required.',
    accent: '#8B5CF6',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function ServicesSection() {
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section id="services" className="py-28 sm:py-36 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto">

        {/* Section divider */}
        <div className="section-divider mb-20" />

        {/* Header */}
        <div className="mb-16 max-w-2xl">
          <p data-reveal="up" className="text-[10px] font-semibold tracking-[0.22em] uppercase text-primary/80 mb-4">
            What We Create
          </p>
          <h2 data-reveal="up" data-delay="150" className="text-display-md font-extrabold tracking-tighter text-foreground leading-none">
            Services Built for{' '}
            <span className="text-gradient-blue">Modern Beauty</span>
          </h2>
        </div>

        {/* Desktop: 3-col cards */}
        <div className="hidden md:grid grid-cols-3 gap-4">
          {services?.map((service, i) => (
            <div
              key={service?.id}
              data-reveal="up"
              data-delay={`${i * 150}`}
              className="group relative rounded-3xl p-8 flex flex-col justify-between min-h-[400px] cursor-default transition-all duration-1000"
              style={{
                background: hoveredCard === service?.id
                  ? `linear-gradient(145deg, ${service?.accent}08 0%, rgba(10,10,18,0.97) 100%)`
                  : 'rgba(10,10,18,0.9)',
                border: `1px solid ${hoveredCard === service?.id ? service?.accent + '25' : 'rgba(24,24,42,1)'}`,
                boxShadow: hoveredCard === service?.id
                  ? `0 0 60px ${service?.accent}10, 0 30px 80px rgba(0,0,0,0.5)`
                  : '0 4px 30px rgba(0,0,0,0.35)',
              }}
              onMouseEnter={() => setHoveredCard(service?.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Number + Icon row */}
              <div className="flex items-start justify-between mb-10">
                <span
                  className="text-6xl font-extrabold tracking-tighter transition-all duration-700"
                  style={{ color: hoveredCard === service?.id ? service?.accent : 'rgba(107,107,128,0.2)' }}
                >
                  {service?.number}
                </span>
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-700"
                  style={{
                    background: hoveredCard === service?.id ? `${service?.accent}12` : 'rgba(24,24,42,0.8)',
                    color: hoveredCard === service?.id ? service?.accent : 'var(--muted-foreground)',
                  }}
                >
                  {service?.icon}
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-grow justify-end gap-5">
                <h3 className="text-xl font-bold tracking-tight text-foreground leading-snug">
                  {service?.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-[1.8] font-light">
                  {service?.description}
                </p>
                <p
                  className="text-xs font-medium tracking-wide transition-colors duration-700"
                  style={{ color: hoveredCard === service?.id ? service?.accent : 'rgba(107,107,128,0.5)' }}
                >
                  {service?.detail}
                </p>

                {/* Accent line */}
                <div className="relative h-px overflow-hidden rounded-full mt-1">
                  <div
                    className="absolute inset-0 transition-all duration-700"
                    style={{ background: hoveredCard === service?.id ? `${service?.accent}50` : 'rgba(24,24,42,1)' }}
                  />
                  {hoveredCard === service?.id && (
                    <div
                      className="absolute top-0 left-0 h-full w-1/3 animate-shimmer"
                      style={{ background: `linear-gradient(90deg, transparent, ${service?.accent}, transparent)` }}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: Accordion */}
        <div className="md:hidden flex flex-col gap-3">
          {services?.map((service) => (
            <div
              key={service?.id}
              className="rounded-3xl overflow-hidden border transition-all duration-700"
              style={{
                borderColor: activeAccordion === service?.id ? `${service?.accent}25` : 'var(--border)',
                background: activeAccordion === service?.id ? `linear-gradient(145deg, ${service?.accent}06 0%, var(--card) 100%)` : 'var(--card)',
              }}
            >
              <button
                onClick={() => setActiveAccordion(activeAccordion === service?.id ? null : service?.id)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${service?.accent}12`, color: service?.accent }}
                  >
                    {service?.icon}
                  </div>
                  <div>
                    <span className="text-[9px] font-semibold tracking-[0.2em] uppercase block mb-0.5" style={{ color: service?.accent }}>
                      {service?.number}
                    </span>
                    <h3 className="text-base font-bold tracking-tight text-foreground">
                      {service?.title}
                    </h3>
                  </div>
                </div>
                <svg
                  width="18" height="18" viewBox="0 0 24 24" fill="none"
                  className="flex-shrink-0 transition-transform duration-500 text-muted-foreground"
                  style={{ transform: activeAccordion === service?.id ? 'rotate(45deg)' : 'rotate(0deg)' }}
                >
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>

              <div
                className="overflow-hidden transition-all duration-700 ease-in-out"
                style={{ maxHeight: activeAccordion === service?.id ? '220px' : '0' }}
              >
                <div className="px-6 pb-6">
                  <p className="text-sm text-muted-foreground leading-[1.8] font-light mb-3">
                    {service?.description}
                  </p>
                  <p className="text-xs font-medium tracking-wide" style={{ color: service?.accent }}>
                    {service?.detail}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}