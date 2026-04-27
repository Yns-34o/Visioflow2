import { useState, useEffect, useRef, useCallback } from 'react'
import '../styles/globals.css'
import ShowcaseIntro     from '@/components/ShowcaseIntro'
import FloatingBackground from '@/components/FloatingBackground'
import { gsap }          from 'gsap'

/* ─────────────────────────────────────────────────────────────────────
   RevealCurtain — liaison visuelle entre l'intro et la première page.
   Un voile noir qui couvre la page au montage puis remonte et disparaît,
   en continuité avec le rideau montant de ShowcaseIntro.
───────────────────────────────────────────────────────────────────────*/
function RevealCurtain() {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    gsap.fromTo(ref.current,
      { yPercent: 0 },                          /* start: covers full screen  */
      {
        yPercent: -100,                          /* end: swept off screen upward */
        duration: 0.9,
        ease: 'power3.inOut',
        delay: 0.05,
        onComplete: () => {
          if (ref.current) ref.current.style.display = 'none'
        },
      }
    )
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        position:      'fixed',
        inset:         0,
        background:    '#000',
        zIndex:        8999,   /* above page, below ShowcaseIntro (9000) */
        pointerEvents: 'none',
      }}
    />
  )
}

/* ─────────────────────────────────────────────────────────────────────
   Scroll animations — IntersectionObserver global
───────────────────────────────────────────────────────────────────────*/
const SCROLL_SEL = [
  'h2', 'h3',
  '.sh', '.stl', '.sd',
  '.tc', '.fc',
  '.pcard',
  '.ps', '.sc',
  '.pp-card', '.sec-cell',
  '.info-card', '.menu-card',
  '.vt-section-header',
  '.band h2', '.offres-cta h2', '.av-cta h2',
  '.form-section',
].join(',')

function attachScrollObserver(io) {
  try {
    document.querySelectorAll(SCROLL_SEL).forEach((el) => {
      /* Skip already-wired elements */
      if ('scrollWired' in el.dataset) return
      /* Skip elements currently in the viewport */
      const r = el.getBoundingClientRect()
      if (r.top < window.innerHeight - 40 && r.bottom > 0) return
      /* Stagger siblings (1–4) */
      const siblings = Array.from(el.parentElement?.children ?? [])
      const idx = siblings.indexOf(el) % 4
      el.dataset.scroll  = ''
      el.dataset.sd      = idx + 1
      el.dataset.scrollWired = ''
      io.observe(el)
    })
  } catch (_) {}
}

/* ─────────────────────────────────────────────────────────────────────
   App
───────────────────────────────────────────────────────────────────────*/
export default function App({ Component, pageProps }) {
  const [ready, setReady] = useState(false)

  const handleComplete = useCallback(() => setReady(true), [])

  /* Set up scroll observer after page mounts */
  useEffect(() => {
    if (!ready) return

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('vf-in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.10, rootMargin: '0px 0px -30px 0px' }
    )

    /* Initial pass after short delay (page must render first) */
    const t1 = setTimeout(() => attachScrollObserver(io), 400)
    /* Second pass for dangerouslySetInnerHTML content */
    const t2 = setTimeout(() => attachScrollObserver(io), 1200)

    /* Watch for dynamically injected HTML (index.js SPA) */
    const mo = new MutationObserver(() => attachScrollObserver(io))
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      io.disconnect()
      mo.disconnect()
    }
  }, [ready])

  return (
    /* Black base → matches intro curtain color, zero flash */
    <div style={{ background: '#000', minHeight: '100vh' }}>

      {/* ── Floating background (always on, z-index 3) ───────────── */}
      <FloatingBackground />

      {/* ── Showcase intro ───────────────────────────────────────── */}
      {!ready && <ShowcaseIntro onComplete={handleComplete} />}

      {/* ── Main page ────────────────────────────────────────────── */}
      {ready && (
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Liaison: black curtain that sweeps off screen upward */}
          <RevealCurtain />
          <Component {...pageProps} />
        </div>
      )}

    </div>
  )
}
