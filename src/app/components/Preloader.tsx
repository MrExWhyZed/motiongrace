'use client';

import { useEffect, useRef, useState } from 'react';

export const PRELOADER_DONE_EVENT  = 'motionGracePreloaderDone';
export const HERO_READY_EVENT      = 'motionGraceHeroReady';
export const HERO_VIDEO_READY_EVENT = 'motionGraceHeroVideoReady';

export default function Preloader() {
  const rootRef     = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef      = useRef<SVGTextElement>(null);
  const secondaryTextRef = useRef<SVGTextElement>(null);
  const mobileMotionRef = useRef<HTMLDivElement>(null);

  const [skip, setSkip] = useState<boolean>(false);

  useEffect(() => {
    try {
      const storedOrigin  = sessionStorage.getItem('mg_origin');
      const currentOrigin = String(Math.round(performance.timeOrigin));

      if (storedOrigin !== currentOrigin) {
        sessionStorage.setItem('mg_origin', currentOrigin);
        sessionStorage.removeItem('mg_preloader_done');
      } else {
        setSkip(true);
        return;
      }
    } catch { /* show preloader */ }
  }, []);

  useEffect(() => {
    if (skip) {
      window.dispatchEvent(new CustomEvent(PRELOADER_DONE_EVENT));
      return;
    }

    let mounted = true;
    let cleanup = () => {};

    void (async () => {
      const [{ gsap }] = await Promise.all([
        import('gsap'),
      ]);

      const container = containerRef.current;
      const mainText = textRef.current;
      const secondaryText = secondaryTextRef.current;

      if (!mounted || !container || !mainText || !secondaryText) return;

      const ctx = gsap.context(() => {
        // ── Initial states ────────────────────────────────────────────
        gsap.set(container, { autoAlpha: 1 });
        gsap.set(mainText, { opacity: 0 });
        gsap.set(secondaryText, { opacity: 0 });
        gsap.set(mobileMotionRef.current, { opacity: 0 });

      const tl = gsap.timeline();

      // ── Flickering Entry Animation ────────────────────────────────
      // We simulate a 'failing light' or 'cinematic boot' flicker
      const flicker = (el: Element) => {
        const ftl = gsap.timeline();
        ftl.to(el, { opacity: 0.4, duration: 0.05 })
           .to(el, { opacity: 0.1, duration: 0.03 })
           .to(el, { opacity: 0.8, duration: 0.08 })
           .to(el, { opacity: 0.2, duration: 0.04 })
           .to(el, { opacity: 1,   duration: 0.15 })
           .to(el, { opacity: 0.3, duration: 0.05 })
           .to(el, { opacity: 1,   duration: 0.2 });
        return ftl;
      };

      const motionFlicker = (el: Element) => {
        const ftl = gsap.timeline();
        ftl.to(el, { opacity: 0.18, x: -0.7, duration: 0.035 })
           .to(el, { opacity: 1, x: 0.5, duration: 0.055 })
           .to(el, { opacity: 0.28, x: 0, duration: 0.028 })
           .to(el, { opacity: 0.92, duration: 0.075 })
           .to(el, { opacity: 0.42, duration: 0.038 })
           .to(el, { opacity: 1, duration: 0.12 })
           .to(el, { opacity: 0.72, duration: 0.04 })
           .to(el, { opacity: 1, duration: 0.18 });
        return ftl;
      };

      const motionTargets: Element[] = [mainText];
      if (mobileMotionRef.current) {
        motionTargets.push(mobileMotionRef.current);
      }

      tl.add(flicker(mainText), 0.4)
        .add(flicker(secondaryText), 0.6)
        .add(mobileMotionRef.current ? motionFlicker(mobileMotionRef.current) : gsap.timeline(), 0.4)
        // Subtle continuous electrical flicker after appearing.
        .to(motionTargets, {
          opacity: 0.78,
          duration: 0.08,
          repeat: -1,
          yoyo: true,
          ease: 'none',
        })
        .to(secondaryText, {
          opacity: 0.86,
          duration: 0.16,
          repeat: -1,
          yoyo: true,
          ease: 'none',
        }, '<');

      // ── Exit Logic ────────────────────────────────────────────────
      let animDone  = false;
      let pageDone  = false;
      let heroReady = false;
      let videoReady = false;

      const tryExit = () => {
        if (!animDone || !pageDone || !heroReady || !videoReady || !containerRef.current) return;

        // Final exit sequence
        gsap.to(containerRef.current, {
          autoAlpha: 0,
          duration: 0.8,
          ease: 'power4.inOut',
          onStart: () => {
            window.dispatchEvent(new CustomEvent(PRELOADER_DONE_EVENT));
          },
          onComplete: () => {
            sessionStorage.setItem('mg_preloader_done', '1');
            if (rootRef.current) {
              rootRef.current.style.display = 'none';
            }
          }
        });
      };

      // Ensure minimum visibility time
      gsap.delayedCall(2.2, () => { animDone = true; tryExit(); });

      pageDone = true;
      tryExit();

      const heroReadyHandler = () => { heroReady = true; tryExit(); };
      window.addEventListener(HERO_READY_EVENT, heroReadyHandler, { once: true });
      gsap.delayedCall(2.5, () => { heroReady = true; tryExit(); });

      const videoReadyHandler = () => { videoReady = true; tryExit(); };
      window.addEventListener(HERO_VIDEO_READY_EVENT, videoReadyHandler, { once: true });
      gsap.delayedCall(4, () => { videoReady = true; tryExit(); });

      // Clean up event listeners on unmount
      return () => {
        window.removeEventListener(HERO_READY_EVENT, heroReadyHandler);
        window.removeEventListener(HERO_VIDEO_READY_EVENT, videoReadyHandler);
      };

      }, rootRef); // end gsap.context

      cleanup = () => ctx.revert();
    })();

    return () => { 
      mounted = false; 
      cleanup(); 
    };
  }, [skip]);

  if (skip) return null;

  return (
    <div
      ref={rootRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        pointerEvents: 'all'
      }}
      className="mg-preloader"
    >
      <div
        ref={containerRef}
        className="mg-preloader-content"
        style={{
          width: '100%',
          maxWidth: '1200px',
          padding: '0 2rem',
          opacity: 0
        }}
      >
        <div className="mg-preloader-mobile-lockup" aria-hidden="true">
          <div ref={mobileMotionRef} className="mg-preloader-mobile-motion">MOTION</div>
          <div className="mg-preloader-mobile-grace">GRACE</div>
        </div>
        <svg
          className="mg-preloader-logo"
          viewBox="0 0 800 170"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: 'auto', overflow: 'visible' }}
        >
          <defs>
            <radialGradient id="preloaderGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(8, 148, 255, 0.13)" />
              <stop offset="45%" stopColor="rgba(201, 89, 221, 0.055)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <filter id="preloaderTextGlow" x="-20%" y="-60%" width="140%" height="220%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Ambient glow behind text */}
          <rect x="0" y="0" width="800" height="200" fill="url(#preloaderGlow)" />

          {/* Main "MOTION" text with blue stroke */}
          <text
            ref={textRef}
            x="50%"
            y="48%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="mg-preloader-motion-text"
            style={{
              fontWeight: 900,
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fill: 'transparent',
              stroke: 'rgba(8,148,255,0.82)',
              strokeWidth: '0.8',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            MOTION
          </text>

          {/* "GRACE" secondary text, slightly smaller */}
          <text
            ref={secondaryTextRef}
            x="50%"
            y="82%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="mg-preloader-grace-text"
            style={{
              fontWeight: 400,
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fill: 'transparent',
              stroke: 'rgba(255,255,255,0.28)',
              strokeWidth: '0.5',
              letterSpacing: '0.8em',
              textTransform: 'uppercase',
              filter: 'url(#preloaderTextGlow)'
            }}
          >
            GRACE
          </text>
        </svg>
      </div>
      <style jsx>{`
        .mg-preloader {
          isolation: isolate;
        }
        .mg-preloader-aura,
        .mg-preloader-grid {
          display: none;
        }
        .mg-preloader-content {
          position: relative;
        }
        .mg-preloader-logo {
          display: block;
          margin: 0 auto;
        }
        .mg-preloader-mobile-lockup {
          display: none;
        }
        .mg-preloader-motion-text {
          font-size: 104px;
        }
        .mg-preloader-grace-text {
          font-size: 34px;
        }
        .mg-preloader-rail {
          display: none;
        }
        @media (max-width: 767px) {
          .mg-preloader-content {
            max-width: 21rem !important;
            padding: 0 1.35rem !important;
          }
          .mg-preloader-logo {
            display: none;
          }
          .mg-preloader-mobile-lockup {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 0.28rem;
            width: 100%;
            margin: 0 auto;
            line-height: 1;
          }
          .mg-preloader-mobile-motion {
            width: 100%;
            font-family: system-ui, -apple-system, sans-serif;
            font-size: clamp(2.15rem, 13.4vw, 3.2rem);
            font-weight: 900;
            letter-spacing: 0.045em;
            text-align: center;
            color: transparent;
            -webkit-text-stroke: 0.75px rgba(8,148,255,0.84);
            -webkit-text-fill-color: transparent;
            text-shadow:
              0 0 10px rgba(8,148,255,0.34),
              0 0 18px rgba(8,148,255,0.18);
            paint-order: stroke;
          }
          .mg-preloader-mobile-grace {
            font-family: system-ui, -apple-system, sans-serif;
            font-size: clamp(0.72rem, 4vw, 0.95rem);
            font-weight: 400;
            letter-spacing: 0.62em;
            padding-left: 0.62em;
            color: transparent;
            -webkit-text-stroke: 0.45px rgba(255,255,255,0.24);
            text-shadow: 0 0 10px rgba(255,255,255,0.08);
          }
          .mg-preloader-rail {
            display: none;
          }
          .mg-preloader-grid {
            background-size: 54px 54px;
            opacity: 0.12;
          }
        }
      `}</style>
    </div>
  );
}
