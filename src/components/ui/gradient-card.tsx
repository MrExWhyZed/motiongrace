import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

const cardVariants = cva(
  "relative flex h-full w-full flex-col justify-between overflow-hidden rounded-[1.65rem] border border-white/[0.11] bg-[#050509] p-5 shadow-[0_1.6rem_4rem_rgba(0,0,0,0.58)] transition-shadow duration-300",
  {
    variants: {
      gradient: {
        orange: "",
        gray: "",
        purple: "",
        green: "",
      },
    },
    defaultVariants: {
      gradient: "gray",
    },
  }
);

export interface GradientCardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  badgeText: string;
  badgeColor: string;
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  imageUrl: string;
  icon?: React.ReactNode;
}

const GradientCard = React.forwardRef<HTMLDivElement, GradientCardProps>(
  ({ className, gradient, badgeText, badgeColor, title, description, ctaText, ctaHref, imageUrl, icon, ...props }, ref) => {
    
    const accentRgb =
      badgeColor === "#0894ff" ? "8,148,255" :
      badgeColor === "#c959dd" ? "201,89,221" :
      badgeColor === "#ff2e54" ? "255,46,84" :
      badgeColor === "#ff9004" ? "255,144,4" :
      badgeColor === "#10b981" ? "16,185,129" :
      "237,233,227";

    const tone =
      gradient === 'purple' ? 'Cinema System' :
      gradient === 'orange' ? 'Interactive Layer' :
      gradient === 'green' ? 'Delivery Engine' :
      'Render System';

    const cardAnimation = {
      rest: { scale: 1, y: 0 },
      hover: { scale: 1.018, y: -4 },
    };

    return (
      <motion.div
        variants={cardAnimation}
        initial="rest"
        whileHover="hover"
        animate="rest"
        className="h-full w-full"
        ref={ref}
      >
        <div
          className={cn(cardVariants({ gradient }), className)}
          style={{
            background:
              `linear-gradient(145deg, rgba(255,255,255,0.105) 0%, rgba(255,255,255,0.035) 42%, rgba(255,255,255,0.018) 100%),
               radial-gradient(circle at 78% 18%, rgba(${accentRgb},0.12), transparent 32%),
               #06060b`,
            boxShadow:
              `0 1.4rem 4rem rgba(0,0,0,0.56),
               inset 0 1px 0 rgba(255,255,255,0.12),
               inset 0 0 0 1px rgba(${accentRgb},0.1)`,
            }}
            {...props}
        >
          <div
            className="pointer-events-none absolute inset-[1px] rounded-[calc(2rem-1px)]"
            style={{
              border: '1px solid rgba(255,255,255,0.045)',
            }}
          />
          <div
            className="pointer-events-none absolute right-5 top-5 h-24 w-24 rounded-full border"
            style={{
              borderColor: `rgba(${accentRgb},0.14)`,
            }}
          />
          <div
            className="pointer-events-none absolute right-10 top-10 h-12 w-12 rounded-full border"
            style={{ borderColor: `rgba(${accentRgb},0.22)` }}
          />
          <div
            className="pointer-events-none absolute right-8 top-8 flex h-16 w-16 items-center justify-center rounded-2xl border bg-white/[0.035] text-white/18"
            style={{
              borderColor: `rgba(${accentRgb},0.16)`,
              color: `rgba(${accentRgb},0.28)`,
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          >
            {icon}
          </div>
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[72%]"
            style={{
              background: 'linear-gradient(to top, rgba(5,5,9,0.99) 0%, rgba(5,5,9,0.83) 42%, transparent 100%)',
            }}
          />

          <div className="relative z-10 flex h-full flex-col">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div
                className="inline-flex rounded-full border bg-white/[0.035] px-3 py-1.5 text-[clamp(0.45rem,0.72vw,0.62rem)] font-bold uppercase tracking-[0.2em]"
                style={{
                  borderColor: `rgba(${accentRgb},0.2)`,
                  color: `rgba(${accentRgb},0.95)`,
                }}
              >
                {badgeText}
              </div>
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-white/[0.018] text-white/58 transition-colors duration-300 group-hover:text-white"
                style={{ borderColor: `rgba(${accentRgb},0.24)` }}
              >
                <ArrowUpRight className="h-3.5 w-3.5" />
              </div>
            </div>

            <div className="mt-auto">
              <div
                className="mb-3 flex items-center gap-2 text-[clamp(0.46rem,0.76vw,0.62rem)] font-semibold uppercase tracking-[0.2em]"
                style={{ color: `rgba(${accentRgb},0.48)` }}
              >
                <span className="h-px w-7" style={{ background: `rgba(${accentRgb},0.42)` }} />
                {tone}
              </div>
              <h3
                className="mb-3 max-w-[13rem] text-[clamp(1.05rem,1.75vw,1.55rem)] font-black leading-[0.94] tracking-[-0.045em]"
                style={{ color: 'rgba(255,255,255,0.94)' }}
              >
                {title}
              </h3>
              <p className="max-w-[15rem] text-[clamp(0.62rem,0.88vw,0.78rem)] font-light leading-[1.62] text-white/48">
                {description}
              </p>
            </div>

            <div className="mt-5 flex items-center justify-between gap-4">
              <div
                className="h-px flex-1"
                style={{ background: `linear-gradient(90deg, rgba(${accentRgb},0.45), transparent)` }}
              />
              <a
                href={ctaHref}
                className="group inline-flex shrink-0 items-center gap-1.5 text-[clamp(0.44rem,0.64vw,0.56rem)] font-bold uppercase tracking-[0.16em] text-white/42 transition-all duration-300 hover:text-white"
              >
                {ctaText}
                <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
);
GradientCard.displayName = "GradientCard";

export { GradientCard, cardVariants };
