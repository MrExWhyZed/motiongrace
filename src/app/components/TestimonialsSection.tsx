import React from 'react';

const testimonials = [
  {
    quote:
      'Motion Grace delivered 80 campaign-ready assets in 4 days. Our traditional agency needed 6 weeks and triple the budget for half the output.',
    name: 'Camille Fontaine',
    title: 'Brand Director',
    company: 'Maison Élite Paris',
    initials: 'CF',
    accent: '#C9A96E',
  },
  {
    quote:
      'The digital twin they built of our serum is indistinguishable from a photograph. We launched three new colorways without a single shoot day.',
    name: 'Priya Nair',
    title: 'Head of Marketing',
    company: 'Glacé Beauty London',
    initials: 'PN',
    accent: '#4A9EFF',
  },
  {
    quote:
      'Our AR try-on feature increased add-to-cart rate by 38% in the first month. The interactive 3D viewer alone paid for the entire project.',
    name: 'Sofia Marchetti',
    title: 'E-Commerce Director',
    company: 'Rouge Atelier Milan',
    initials: 'SM',
    accent: '#8B5CF6',
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-28 sm:py-36 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto">

        {/* Section divider */}
        <div className="section-divider mb-20" />

        {/* Header */}
        <div className="text-center mb-16">
          <p data-reveal="up" className="text-[10px] font-semibold tracking-[0.22em] uppercase text-primary/80 mb-4">
            Client Stories
          </p>
          <h2 data-reveal="up" data-delay="150" className="text-display-md font-extrabold tracking-tighter text-foreground leading-none">
            What Clients Say
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials?.map((t, i) => (
            <div
              key={t?.name}
              data-reveal="up"
              data-delay={`${i * 150}`}
              className="group flex flex-col justify-between p-8 rounded-3xl border border-border/40 hover:border-primary/15 transition-all duration-1000"
              style={{ background: 'var(--card)' }}
            >
              {/* Stars */}
              <div className="flex gap-1.5 mb-6">
                {[...Array(5)]?.map((_, si) => (
                  <svg key={si} width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-primary/70">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-muted-foreground leading-[1.9] flex-grow mb-8 font-light italic tracking-wide">
                &ldquo;{t?.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3.5 pt-6 border-t border-border/30">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: `${t?.accent}12`, color: t?.accent, border: `1px solid ${t?.accent}20` }}
                >
                  {t?.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground tracking-tight">{t?.name}</p>
                  <p className="text-xs text-muted-foreground font-light tracking-wide mt-0.5">
                    {t?.title} · {t?.company}
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