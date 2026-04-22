import { useEffect, useRef } from 'react';
import { CinematicHero } from './ui/cinematic-hero';

// L'animation CinematicHero joue son intro texte en ~2.5s
// On attend HOLD_MS avant de déclencher le rideau noir
const HOLD_MS = 4600;
const FADE_MS = 900;

export default function ShowcaseIntro({ onComplete }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const holdTimer = setTimeout(() => {
      const el = overlayRef.current;
      if (!el) return;
      el.style.transition = `opacity ${FADE_MS}ms cubic-bezier(0.4, 0, 1, 1)`;
      el.style.opacity = '1';
      setTimeout(() => {
        document.body.style.overflow = '';
        onComplete && onComplete();
      }, FADE_MS + 50);
    }, HOLD_MS);

    return () => {
      clearTimeout(holdTimer);
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9000, background: '#000', overflow: 'hidden' }}>
      <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
        <CinematicHero />
      </div>
      {/* Rideau noir : opacity 0 → 1 */}
      <div
        ref={overlayRef}
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, background: '#000', opacity: 0, zIndex: 9999, pointerEvents: 'none' }}
      />
    </div>
  );
}
