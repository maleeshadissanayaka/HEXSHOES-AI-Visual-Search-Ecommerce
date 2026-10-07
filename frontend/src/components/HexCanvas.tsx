import { useEffect, useRef } from 'react'
import './HexCanvas.css'

function HexCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0, h = 0, t = 0
    let animationFrameId: number
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    function resize() {
      w = canvas!.width = canvas!.offsetWidth
      h = canvas!.height = canvas!.offsetHeight
    }
    window.addEventListener('resize', resize)
    resize()

    function hex(cx: number, cy: number, r: number) {
      ctx!.beginPath()
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 180) * (60 * i - 30)
        const x = cx + r * Math.cos(a)
        const y = cy + r * Math.sin(a)
        if (i === 0) {
          ctx!.moveTo(x, y)
        } else {
          ctx!.lineTo(x, y)
        }
      }
      ctx!.closePath()
      ctx!.stroke()
    }

    function draw() {
      ctx!.clearRect(0, 0, w, h)
      const r = 46
      const dx = r * 1.732
      const dy = r * 1.5
      const offset = reduceMotion ? 0 : (t * 0.15) % dx

      for (let row = -1; row * dy < h + dy; row++) {
        for (let col = -2; col * dx < w + dx; col++) {
          const cx = col * dx + (row % 2 ? dx / 2 : 0) + offset
          const cy = row * dy
          const dist = Math.hypot(cx - w * 0.7, cy - h * 0.4)
          const alpha = Math.max(0, 0.14 - dist / 4000)
          ctx!.strokeStyle = `rgba(59,91,255,${alpha + 0.03})`
          ctx!.lineWidth = 1
          hex(cx, cy, r)
        }
      }

      if (!reduceMotion) {
        t++
        animationFrameId = requestAnimationFrame(draw)
      }
    }
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="hex-canvas" />
}

export default HexCanvas