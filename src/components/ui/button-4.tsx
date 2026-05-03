'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

type ComponentProps = {
  label?: string;
  href?: string;
  target?: string;
  rel?: string;
  className?: string;
  onClick?: () => void;
};

export const Component = ({
  label = 'Contact me',
  href,
  target,
  rel,
  className,
  onClick,
}: ComponentProps) => {
  const content = (
    <>
      <div
        className="relative z-10 inline-flex h-12 items-center justify-center overflow-hidden rounded-full
        border-2 border-[#263381] bg-gradient-to-r from-[#f6f7ff] to-[#f5f6ff] bg-transparent px-6
        font-medium text-black transition-all duration-300
        whitespace-nowrap group-hover:-translate-x-3 group-hover:-translate-y-3 dark:border-[rgb(76_100_255)] dark:from-[#070e41] dark:to-[#263381] dark:text-white"
      >
        {label}
      </div>
      <div className="absolute inset-0 z-0 h-full w-full rounded-full transition-all duration-300 group-hover:-translate-x-3 group-hover:-translate-y-3 group-hover:[box-shadow:5px_5px_#394481,10px_10px_#5766be,15px_15px_#8898f3]" />
    </>
  );

  const baseClassName = cn('group relative inline-flex rounded-full', className);

  if (href) {
    return (
      <Link href={href} target={target} rel={rel} className={baseClassName}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={baseClassName}>
      {content}
    </button>
  );
};
