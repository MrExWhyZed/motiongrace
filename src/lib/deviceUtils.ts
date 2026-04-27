/**
 * deviceUtils.ts — shared mobile/tablet + performance-tier detection
 *
 * Strategy: use BOTH pointer capability AND screen width.
 * - `(hover: none)` / `(pointer: coarse)` catches phones
 * - `max-width: 1024px` catches tablets (iPad, Android tablets) that report
 *   fine/hover because of stylus support but still can't run desktop animations
 *   smoothly and have no real mouse.
 * - The OR means either condition is enough to opt into the lite path.
 *
 * Low-end desktop detection:
 * - navigator.hardwareConcurrency ≤ 4 (quad-core or less)
 * - navigator.deviceMemory ≤ 4 (4 GB RAM or less, Chromium-only)
 * - prefers-reduced-motion media query respected everywhere
 */

export function isReducedDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(hover: none), (pointer: coarse), (max-width: 1024px)').matches
  );
}

/**
 * Returns true on low-end desktops/laptops that are NOT mobile/tablet
 * but still lack the GPU/CPU headroom for full-quality effects.
 * Used to selectively dial back expensive WebGL, blur, and canvas work.
 */
export function isLowEndDesktop(): boolean {
  if (typeof window === 'undefined') return false;
  if (isReducedDevice()) return false; // mobile path handles those separately

  const cores  = (navigator as Navigator & { hardwareConcurrency?: number }).hardwareConcurrency ?? 8;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;

  return cores <= 4 || memory <= 4;
}

/**
 * Combined check: should we use the "lite" animation path?
 * True for mobile, tablet, reduced-motion, OR low-end desktops.
 */
export function useLiteAnimations(): boolean {
  if (typeof window === 'undefined') return true;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  return isReducedDevice() || isLowEndDesktop();
}
