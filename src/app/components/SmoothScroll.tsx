'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

type LenisInstance = {
  destroy: () => void;
  on: (event: 'scroll', callback: () => void) => void;
  off?: (event: 'scroll', callback: () => void) => void;
  raf: (time: number) => void;
  resize: () => void;
};

export default function SmoothScroll() {
  const pathname  = usePathname();
  const lenisRef  = useRef<LenisInstance | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Disable Lenis on mobile/tablet — native scroll is faster on touch screens
    if (window.matchMedia('(hover: none), (pointer: coarse), (max-width: 1024px)').matches) return;

    let mounted = true;
    let cleanup = () => {};

    void (async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import('lenis'),
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);

      if (!mounted) return;

      gsap.registerPlugin(ScrollTrigger);

      // Higher lerp on low-end desktops → fewer interpolation frames needed
      const cores  = (navigator as Navigator & { hardwareConcurrency?: number }).hardwareConcurrency ?? 8;
      const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
      const isLowEnd = cores <= 4 || memory <= 4;

      const lenis = new Lenis({
        lerp: isLowEnd ? 0.18 : 0.1,
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 1.0,
        touchMultiplier: 2.0,
        autoRaf: false,
        anchors: true,
        autoResize: true,
        allowNestedScroll: true,
        prevent: (node: HTMLElement) =>
          !!node.closest('.story-scroll-inner, [data-lenis-prevent], [data-lenis-prevent-wheel]'),
      });

      lenisRef.current = lenis as LenisInstance;

      const handleScroll = () => ScrollTrigger.update();

      const handleTick = (time: number) => lenis.raf(time * 1000);

      const handleRefresh = () => lenis.resize();

      lenis.on('scroll', handleScroll);
      gsap.ticker.add(handleTick);
      gsap.ticker.lagSmoothing(0);
      ScrollTrigger.addEventListener('refresh', handleRefresh);

      requestAnimationFrame(() => {
        lenis.resize();
        ScrollTrigger.refresh();
      });

      cleanup = () => {
        ScrollTrigger.removeEventListener('refresh', handleRefresh);
        gsap.ticker.remove(handleTick);
        lenis.off?.('scroll', handleScroll);
        lenis.destroy();
        lenisRef.current = null;
      };
    })();

    return () => {
      mounted = false;
      cleanup();
    };
  }, []);

  useEffect(() => {
    if (!lenisRef.current) return;
    requestAnimationFrame(() => lenisRef.current?.resize());
  }, [pathname]);

  return null;
}
