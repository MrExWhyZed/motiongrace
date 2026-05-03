'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface ExpandButtonProps {
  label?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  target?: string;
  rel?: string;
}

export const ExpandButton = ({ 
  label = "Visit", 
  href, 
  onClick, 
  className,
  target,
  rel
}: ExpandButtonProps) => {
  const content = (
    <>
      <div className="inline-flex whitespace-nowrap opacity-0 transition-all duration-300 group-hover:-translate-x-3 group-hover:opacity-100 px-4">
        {label}
      </div>
      <div className="absolute right-3.5">
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5">
          <path
            d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
            fill="#0894ff"
            fillRule="evenodd"
            clipRule="evenodd"></path>
        </svg>
      </div>
    </>
  );

  const baseStyles = "group relative inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-blue-500/5 backdrop-blur-xl font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-200 border border-blue-500/20 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:w-44 hover:bg-blue-500/10 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(8,148,255,0.25)]";

  if (href) {
    return (
      <Link 
        href={href} 
        className={cn(baseStyles, className)}
        target={target}
        rel={rel}
      >
        {content}
      </Link>
    );
  }

  return (
    <button 
      onClick={onClick} 
      className={cn(baseStyles, className)}
    >
      {content}
    </button>
  );
};
