import React from 'react';
import Link from 'next/link';

export interface GradientCard {
  title: string;
  desc: string;
  gradientFrom: string;
  gradientTo: string;
  icon?: React.ReactNode;
  href?: string;
  number?: string;
  tag?: string;
}

export interface GradientCardShowcaseProps {
  cards: GradientCard[];
}

export default function GradientCardShowcase({ cards }: GradientCardShowcaseProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 py-10 relative z-20 w-full place-items-center">
        {cards.map(({ title, desc, gradientFrom, gradientTo, icon, href, number, tag }, idx) => (
          <div
            key={idx}
            className="group relative w-full max-w-[380px] h-[520px] rounded-[2.5rem] p-[1px] overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:hover:-translate-y-4 md:hover:shadow-[0_2rem_4rem_-1rem_rgba(0,0,0,0.5)] cursor-pointer"
          >
            {/* Animated Gradient Border Overlay */}
            <div 
              className="absolute inset-0 opacity-20 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-1000"
              style={{
                background: `linear-gradient(to bottom right, ${gradientFrom}, transparent 40%, transparent 60%, ${gradientTo})`
              }} 
            />

            {/* Default Subtle Border */}
            <div className="absolute inset-0 bg-white/5 rounded-[2.5rem] md:group-hover:opacity-0 transition-opacity duration-500" />
            
            {/* Slowly rotating glowing orb behind card content - Hidden on mobile to save GPU */}
            <div 
              className="absolute -top-32 -left-32 w-64 h-64 rounded-full blur-[70px] mix-blend-screen hidden md:block md:opacity-10 md:group-hover:opacity-60 transition-all duration-1000 md:animate-spin-slow"
              style={{ background: `radial-gradient(circle, ${gradientFrom}, ${gradientTo})` }}
            />
            
            {/* Card Inner - Reduced blur on mobile for scroll performance */}
            <div className="relative h-full bg-[#05050A]/90 backdrop-blur-xl md:backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-10 flex flex-col overflow-hidden">
                
                {/* Noise Texture */}
                <div 
                  className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" 
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} 
                />

                {/* Number & Tag Header */}
                <div className="flex justify-between items-start mb-12 relative z-10 w-full">
                  {tag && (
                    <span 
                      className="relative overflow-hidden text-[10px] font-black tracking-[0.3em] uppercase py-2 px-4 rounded-full border border-white/10 bg-white/5 transition-all duration-500 group-hover:border-transparent" 
                      style={{ 
                        color: gradientFrom,
                      }}
                    >
                      <span className="relative z-10">{tag}</span>
                      <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500" style={{ background: gradientFrom }} />
                    </span>
                  )}
                  {number && (
                    <span 
                      className="text-6xl font-black opacity-10 transition-all duration-700 group-hover:opacity-20 group-hover:scale-110 origin-top-right -mt-2 -mr-2" 
                      style={{ color: gradientFrom }}
                    >
                      {number}
                    </span>
                  )}
                </div>

                {/* Content Block */}
                <div className="relative z-10 flex-grow flex flex-col">
                  {icon && (
                    <div 
                      className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3"
                      style={{
                        background: `linear-gradient(135deg, ${gradientFrom}22, ${gradientTo}11)`,
                        border: `1px solid ${gradientFrom}44`,
                        color: gradientFrom,
                        boxShadow: `0 8px 32px ${gradientFrom}33`
                      }}
                    >
                      {icon}
                    </div>
                  )}
                  
                  <h2 className="text-2xl font-black leading-[1.1] mb-4 tracking-tight text-white transition-all duration-500">
                    {title}
                  </h2>
                  
                  <p className="text-[14px] font-light leading-[1.8] text-white/60 group-hover:text-white/80 transition-colors duration-500">
                    {desc}
                  </p>
                </div>
                
                {/* Decorative Line & Button */}
                <div className="relative z-10 mt-auto pt-6 flex items-center justify-between border-t border-white/5 group-hover:border-transparent transition-colors duration-500">
                  <div 
                    className="h-[2px] rounded-full w-8 group-hover:w-3/5 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" 
                    style={{ background: `linear-gradient(90deg, ${gradientFrom}, ${gradientTo})` }} 
                  />
                  
                  {href && (
                    <Link
                      href={href}
                      className="flex items-center justify-center h-10 w-10 rounded-full bg-white/5 border border-white/10 group-hover:bg-white text-white group-hover:text-black transition-all duration-500 shadow-xl"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500">
                        <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  )}
                </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
      `}</style>
    </>
  );
}
