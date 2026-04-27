'use client';

import { useEffect } from 'react';

export default function ScrollAnimationInit() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const isMobile = window.matchMedia('(hover: none), (pointer: coarse), (max-width: 1024px)').matches;

    // Also disable blur filters on low-end desktops (4-core / ≤4 GB RAM)
    const cores  = (navigator as Navigator & { hardwareConcurrency?: number }).hardwareConcurrency ?? 8;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    const isLowEnd = !isMobile && (cores <= 4 || memory <= 4);
    const useBlur = !isMobile && !isLowEnd;

    let mounted = true;
    let teardown = () => {};

    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);

      if (!mounted) return;

      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.config({
        ignoreMobileResize: true,
        autoRefreshEvents: 'DOMContentLoaded,load,visibilitychange',
      });

      const ctx = gsap.context(() => {
        gsap.fromTo(
          'header',
          { autoAlpha: 0, y: -18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            clearProps: 'transform',
          }
        );

        const reveals = gsap.utils.toArray<HTMLElement>('[data-reveal]');
        reveals.forEach((element) => {
          const type = element.dataset.reveal ?? 'up';
          const delay = Number(element.dataset.delay ?? 0) / 1000;

          // Mobile: simple fade-up only, no blur (expensive filter compositing)
          const fromVars = isMobile
            ? { autoAlpha: 0, y: 16 }
            : type === 'left'
              ? { autoAlpha: 0, x: -36, y: 0, scale: 1 }
              : type === 'right'
                ? { autoAlpha: 0, x: 36, y: 0, scale: 1 }
                : type === 'scale'
                  ? { autoAlpha: 0, x: 0, y: 18, scale: 0.94 }
                  : { autoAlpha: 0, x: 0, y: 34, scale: 1 };

          const toVars: gsap.TweenVars = {
            autoAlpha: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: isMobile ? 0.7 : 1.15,
            delay,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 90%',
              once: true,
            },
          };

          if (useBlur) {
            (fromVars as gsap.TweenVars).filter = 'blur(10px)';
            (fromVars as gsap.TweenVars).willChange = 'transform, opacity, filter';
            toVars.filter = 'blur(0px)';
            toVars.clearProps = 'willChange';
          }

          gsap.fromTo(element, fromVars as gsap.TweenVars, toVars);
        });

        const sections = gsap.utils.toArray<HTMLElement>('[data-gsap-section]');
        sections.forEach((section, index) => {
          const mode = section.dataset.gsapSection ?? 'default';
          const cards = Array.from(section.querySelectorAll<HTMLElement>('[data-gsap-card]'));
          const media = Array.from(section.querySelectorAll<HTMLElement>('[data-gsap-media]'));
          const glow = section.querySelector<HTMLElement>('[data-gsap-glow]');

          if (mode !== 'sticky' && mode !== 'hero' && mode !== 'bridge') {
            gsap.fromTo(
              section,
              { autoAlpha: 0.72, y: isMobile ? 12 : 30 },
              {
                autoAlpha: 1,
                y: 0,
                duration: isMobile ? 0.7 : 1.2,
                ease: 'power3.out',
                clearProps: 'transform',
                scrollTrigger: {
                  trigger: section,
                  start: 'top 85%',
                  once: true,
                },
              }
            );
          }

          if (cards.length > 0) {
            const cardFrom: gsap.TweenVars = { autoAlpha: 0, y: isMobile ? 12 : 24 };
            const cardTo: gsap.TweenVars = {
              autoAlpha: 1,
              y: 0,
              duration: isMobile ? 0.6 : 1,
              stagger: isMobile ? 0.05 : 0.08,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                once: true,
              },
            };
            if (useBlur) {
              cardFrom.scale = 0.985;
              cardFrom.filter = 'blur(8px)';
              cardTo.scale = 1;
              cardTo.filter = 'blur(0px)';
            } else if (!isMobile) {
              cardFrom.scale = 0.985;
              cardTo.scale = 1;
            }
            gsap.fromTo(cards, cardFrom, cardTo);
          }

          // Skip parallax on mobile and low-end desktops — causes jank
          if (!isMobile && !isLowEnd) {
            media.forEach((element) => {
              const speed = Number(element.dataset.gsapMedia ?? 10);
              gsap.to(element, {
                yPercent: speed,
                ease: 'none',
                scrollTrigger: {
                  trigger: section,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 1.4,
                },
              });
            });
          }

          if (glow) {
            gsap.fromTo(
              glow,
              { opacity: 0.45, scale: 0.94 },
              {
                opacity: 1,
                scale: 1.06,
                duration: 2.4,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1,
                delay: index * 0.08,
              }
            );
          }
        });

        gsap.utils.toArray<HTMLElement>('[data-gsap-button]').forEach((button, index) => {
          gsap.fromTo(
            button,
            { autoAlpha: 0, y: isMobile ? 10 : 18, scale: isMobile ? 1 : 0.96 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: isMobile ? 0.5 : 0.85,
              delay: index * 0.06,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: button,
                start: 'top 92%',
                once: true,
              },
            }
          );
        });
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());

      teardown = () => {
        ctx.revert();
      };
    })();

    return () => {
      mounted = false;
      teardown();
    };
  }, []);

  return null;
}
