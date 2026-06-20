'use client'
import { useEffect, useRef } from 'react'

export function StarField() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = ref.current!
    if (!cv) return
    const cx = cv.getContext('2d')!
    let raf: number
    let frame = 0

    type Star = {
      x: number; y: number; r: number
      base: number; spd: number; phi: number; teal: boolean
    }

    let W = 0, H = 0, stars: Star[] = [], edges: [number,number][] = []

    function build() {
      W = cv.width  = window.innerWidth
      H = cv.height = window.innerHeight
      const N = 200
      stars = Array.from({length: N}, () => ({
        x: Math.random(), y: Math.random(),
        r: Math.random() * 1.1 + 0.3,
        base: Math.random() * 0.45 + 0.12,
        spd:  Math.random() * 0.012 + 0.003,
        phi:  Math.random() * Math.PI * 2,
        teal: Math.random() < 0.13,
      }))
      edges = []
      for (let i = 0; i < N; i++)
        for (let j = i + 1; j < N && edges.length < 14; j++) {
          const dx = stars[i].x - stars[j].x
          const dy = stars[i].y - stars[j].y
          const d  = Math.sqrt(dx*dx + dy*dy)
          if (d > 0.025 && d < 0.09) edges.push([i, j])
        }
    }

    function draw() {
      cx.clearRect(0, 0, W, H)
      frame++
      // constellation lines
      edges.forEach(([a, b]) => {
        cx.beginPath()
        cx.moveTo(stars[a].x * W, stars[a].y * H)
        cx.lineTo(stars[b].x * W, stars[b].y * H)
        cx.strokeStyle = 'rgba(0,224,255,0.05)'
        cx.lineWidth = 0.6
        cx.stroke()
      })
      // stars
      stars.forEach(s => {
        const al = s.base * (0.6 + 0.4 * Math.sin(frame * s.spd + s.phi))
        const x = s.x * W, y = s.y * H
        if (s.teal && s.r > 0.7) {
          const g = cx.createRadialGradient(x, y, 0, x, y, s.r * 5)
          g.addColorStop(0, `rgba(0,224,255,${al * 0.5})`)
          g.addColorStop(1, 'rgba(0,224,255,0)')
          cx.fillStyle = g
          cx.beginPath(); cx.arc(x, y, s.r * 5, 0, Math.PI * 2); cx.fill()
        }
        cx.beginPath(); cx.arc(x, y, s.r, 0, Math.PI * 2)
        cx.fillStyle = s.teal
          ? `rgba(0,224,255,${al})`
          : `rgba(255,255,255,${al})`
        cx.fill()
      })
      raf = requestAnimationFrame(draw)
    }

    build()
    window.addEventListener('resize', build)
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', build) }
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none"
    />
  )
}
