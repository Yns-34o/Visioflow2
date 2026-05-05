/*
 * Formes elliptiques qui tombent doucement en boucle infinie.
 * Deux divs imbriquées : outer = rotation fixe, inner = chute CSS.
 * z-index 3 → visible par-dessus le contenu des pages (pointer-events:none).
 */

const SHAPES = [
  { id:  0, w: 560, h: 138, left:  -5, delay:  0, dur: 38, rot:  13, rgb: "99,91,255"  },
  { id:  1, w: 400, h:  98, left:  68, delay:  7, dur: 44, rot: -11, rgb: "244,63,94"  },
  { id:  2, w: 270, h:  70, left:  20, delay: 14, dur: 31, rot:  -7, rgb: "139,92,246" },
  { id:  3, w: 200, h:  54, left:  83, delay:  3, dur: 52, rot:  21, rgb: "245,158,11" },
  { id:  4, w: 310, h:  80, left:  44, delay: 20, dur: 36, rot: -16, rgb: "6,182,212"  },
  { id:  5, w: 460, h: 114, left:  58, delay:  9, dur: 43, rot:   9, rgb: "59,130,246" },
  { id:  6, w: 230, h:  60, left:  30, delay: 26, dur: 27, rot: -20, rgb: "168,85,247" },
  { id:  7, w: 165, h:  46, left:  88, delay: 17, dur: 47, rot:  18, rgb: "244,63,94"  },
  { id:  8, w: 370, h:  92, left:   6, delay: 22, dur: 34, rot:  -5, rgb: "99,91,255"  },
  { id:  9, w: 250, h:  64, left:  53, delay: 11, dur: 41, rot:  24, rgb: "16,185,129" },
  { id: 10, w: 185, h:  50, left:  76, delay: 29, dur: 53, rot: -13, rgb: "59,130,246" },
  { id: 11, w: 490, h: 122, left:  32, delay: 16, dur: 49, rot:   6, rgb: "139,92,246" },
  { id: 12, w: 340, h:  85, left:  10, delay:  5, dur: 39, rot: -22, rgb: "244,63,94"  },
  { id: 13, w: 145, h:  40, left:  62, delay: 33, dur: 45, rot:  15, rgb: "245,158,11" },
  { id: 14, w: 420, h: 105, left:  40, delay: 19, dur: 56, rot:  -3, rgb: "6,182,212"  },
]

/* CSS injecté une seule fois */
const CSS = `
@keyframes vf-fall {
  0%   { transform: translateY(-200px); opacity: 0;    }
  7%   { opacity: 1;                                   }
  88%  { opacity: 0.55;                                }
  100% { transform: translateY(calc(100vh + 240px)); opacity: 0; }
}
.vfbg-inner {
  animation-name: vf-fall;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  border-radius: 9999px;
  position: relative;
  pointer-events: none;
  will-change: transform, opacity;
}
`

let injected = false

export default function FloatingBackground() {
  /* Inject styles once into <head> */
  if (typeof document !== 'undefined' && !injected) {
    injected = true
    const s = document.createElement('style')
    s.textContent = CSS
    document.head.appendChild(s)
  }

  return (
    <>
      {SHAPES.map(s => (
        /* Outer div: handles rotation (never animated) */
        <div
          key={s.id}
          style={{
            position:      'fixed',
            top:           0,
            left:          `${s.left}%`,
            transform:     `rotate(${s.rot}deg)`,
            transformOrigin: 'center top',
            zIndex:        3,           /* above page content (z-index 1) */
            pointerEvents: 'none',
          }}
        >
          {/* Inner div: falls via CSS animation */}
          <div
            className="vfbg-inner"
            style={{
              width:             s.w,
              height:            s.h,
              animationDuration: `${s.dur}s`,
              animationDelay:    `-${s.delay}s`,  /* start mid-cycle */
              background:        `linear-gradient(135deg, rgba(${s.rgb},0.10) 0%, rgba(${s.rgb},0.03) 60%, transparent 100%)`,
              border:            `1px solid rgba(${s.rgb},0.13)`,
              boxShadow:         `inset 0 0 28px rgba(${s.rgb},0.04)`,
            }}
          />
        </div>
      ))}
    </>
  )
}
