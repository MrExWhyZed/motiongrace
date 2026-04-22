'use client';

import React, { useState } from 'react';
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
    span: 'lg:col-span-1 lg:row-span-2'
  },
  {
    id: 2,
    category: 'Skincare',
    title: 'Lumière Serum',
    client: 'Glacé Beauty',
    image: "https://images.unsplash.com/photo-1619407884060-54145a659baf",
    alt: 'Minimalist skincare serum bottle on reflective surface, airy clean white studio lighting',
    accent: '#4A9EFF',
    span: 'lg:col-span-1'
  },
  {
    id: 3,
    category: 'Cosmetics',
    title: 'Velvet Lip Kit',
    client: 'Rouge Atelier',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_16c0b74ab-1769009930510.png",
    alt: 'Luxury lipstick cosmetics product on dark marble with warm amber light, editorial beauty',
    accent: '#8B5CF6',
    span: 'lg:col-span-1'
  },
  {
    id: 4,
    category: 'Haircare',
    title: 'Aura Oil',
    client: 'Silk & Stone',
    image: "https://images.unsplash.com/photo-1669212408620-957229726535",
    alt: 'Hair oil bottle with botanical ingredients on dark background with soft golden hour light',
    accent: '#C9A96E',
    span: 'lg:col-span-1'
  }
];

export default function ShowreelSection() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="showreel" className="py-28 sm:py-36 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto">

        {/* Section divider */}
        <div className="section-divider mb-20" />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-16">
          <div data-reveal="up">
            <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-primary/80 mb-4">
              Selected Work
            </p>
            <h2 className="text-display-md font-extrabold tracking-tighter text-foreground leading-none">
              See What&apos;s{' '}
              <span className="text-gradient-gold">Possible</span>
            </h2>
          </div>
          <p
            data-reveal="up"
            data-delay="200"
            className="text-sm text-muted-foreground font-light max-w-xs leading-relaxed tracking-wide">
            Where beauty meets computation.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">

          {/* Card 1: Fragrance — tall */}
          <div
            data-reveal="scale"
            data-delay="0"
            className="lg:row-span-2 group relative rounded-3xl overflow-hidden cursor-pointer"
            style={{ minHeight: '440px' }}
            onMouseEnter={() => setHovered(1)}
            onMouseLeave={() => setHovered(null)}>
            <div className="relative h-full w-full" style={{ minHeight: '440px' }}>
              <AppImage
                src={reelItems?.[0]?.image}
                alt={reelItems?.[0]?.alt}
                fill
                className="object-cover transition-transform duration-[3s] ease-out group-hover:scale-108"
                style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)', transform: hovered === 1 ? 'scale(1.06)' : 'scale(1)' }}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/15 to-transparent" />
              {/* Accent glow on hover */}
              <div
                className="absolute inset-0 transition-opacity duration-1000 opacity-0 group-hover:opacity-100 rounded-3xl"
                style={{ boxShadow: `inset 0 0 80px ${reelItems?.[0]?.accent}18` }} />
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-7">
                <span
                  className="inline-block text-[9px] font-semibold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full mb-4"
                  style={{ background: `${reelItems?.[0]?.accent}15`, color: reelItems?.[0]?.accent, border: `1px solid ${reelItems?.[0]?.accent}25` }}>
                  {reelItems?.[0]?.category}
                </span>
                <h3 className="text-xl font-bold tracking-tight text-foreground mb-1.5">
                  {reelItems?.[0]?.title}
                </h3>
                <p className="text-xs text-muted-foreground font-light tracking-wide">
                  {reelItems?.[0]?.client}
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Skincare */}
          <div
            data-reveal="scale"
            data-delay="120"
            className="group relative rounded-3xl overflow-hidden cursor-pointer"
            style={{ minHeight: '290px' }}
            onMouseEnter={() => setHovered(2)}
            onMouseLeave={() => setHovered(null)}>
            <div className="relative h-full w-full" style={{ minHeight: '290px' }}>
              <AppImage
                src={reelItems?.[1]?.image}
                alt={reelItems?.[1]?.alt}
                fill
                className="object-cover transition-transform duration-[3s] ease-out"
                style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)', transform: hovered === 2 ? 'scale(1.06)' : 'scale(1)' }}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/15 to-transparent" />
              <div
                className="absolute inset-0 transition-opacity duration-1000 opacity-0 group-hover:opacity-100 rounded-3xl"
                style={{ boxShadow: `inset 0 0 60px ${reelItems?.[1]?.accent}15` }} />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span
                  className="inline-block text-[9px] font-semibold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full mb-3"
                  style={{ background: `${reelItems?.[1]?.accent}15`, color: reelItems?.[1]?.accent, border: `1px solid ${reelItems?.[1]?.accent}25` }}>
                  {reelItems?.[1]?.category}
                </span>
                <h3 className="text-lg font-bold tracking-tight text-foreground">
                  {reelItems?.[1]?.title}
                </h3>
              </div>
            </div>
          </div>

          {/* Card 3: Cosmetics */}
          <div
            data-reveal="scale"
            data-delay="240"
            className="group relative rounded-3xl overflow-hidden cursor-pointer"
            style={{ minHeight: '290px' }}
            onMouseEnter={() => setHovered(3)}
            onMouseLeave={() => setHovered(null)}>
            <div className="relative h-full w-full" style={{ minHeight: '290px' }}>
              <AppImage
                src={reelItems?.[2]?.image}
                alt={reelItems?.[2]?.alt}
                fill
                className="object-cover transition-transform duration-[3s] ease-out"
                style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)', transform: hovered === 3 ? 'scale(1.06)' : 'scale(1)' }}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/15 to-transparent" />
              <div
                className="absolute inset-0 transition-opacity duration-1000 opacity-0 group-hover:opacity-100 rounded-3xl"
                style={{ boxShadow: `inset 0 0 60px ${reelItems?.[2]?.accent}15` }} />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span
                  className="inline-block text-[9px] font-semibold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full mb-3"
                  style={{ background: `${reelItems?.[2]?.accent}15`, color: reelItems?.[2]?.accent, border: `1px solid ${reelItems?.[2]?.accent}25` }}>
                  {reelItems?.[2]?.category}
                </span>
                <h3 className="text-lg font-bold tracking-tight text-foreground">
                  {reelItems?.[2]?.title}
                </h3>
              </div>
            </div>
          </div>

          {/* Card 4: Haircare — spans 2 cols on lg */}
          <div
            data-reveal="scale"
            data-delay="360"
            className="lg:col-span-2 group relative rounded-3xl overflow-hidden cursor-pointer"
            style={{ minHeight: '290px' }}
            onMouseEnter={() => setHovered(4)}
            onMouseLeave={() => setHovered(null)}>
            <div className="relative h-full w-full" style={{ minHeight: '290px' }}>
              <AppImage
                src={reelItems?.[3]?.image}
                alt={reelItems?.[3]?.alt}
                fill
                className="object-cover object-center transition-transform duration-[3s] ease-out"
                style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)', transform: hovered === 4 ? 'scale(1.04)' : 'scale(1)' }}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 66vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/15 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-background/50 to-transparent" />
              <div
                className="absolute inset-0 transition-opacity duration-1000 opacity-0 group-hover:opacity-100 rounded-3xl"
                style={{ boxShadow: `inset 0 0 80px ${reelItems?.[3]?.accent}12` }} />
              <div className="absolute bottom-0 left-0 right-0 p-7 flex items-end justify-between">
                <div>
                  <span
                    className="inline-block text-[9px] font-semibold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full mb-3"
                    style={{ background: `${reelItems?.[3]?.accent}15`, color: reelItems?.[3]?.accent, border: `1px solid ${reelItems?.[3]?.accent}25` }}>
                    {reelItems?.[3]?.category}
                  </span>
                  <h3 className="text-xl font-bold tracking-tight text-foreground mb-1.5">
                    {reelItems?.[3]?.title}
                  </h3>
                  <p className="text-xs text-muted-foreground font-light tracking-wide">
                    {reelItems?.[3]?.client}
                  </p>
                </div>
                <div className="glass-light rounded-full px-5 py-2.5 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-2 group-hover:translate-y-0">
                  <span className="text-xs font-medium text-foreground/80 tracking-wide">View Case</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
