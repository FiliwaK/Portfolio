import { useRef, useState, useCallback, useEffect } from 'react'

export function Spotlight({ size = 350, color = 'rgba(0,229,255,0.10)' }) {
  const ref    = useRef(null)
  const [pos, setPos] = useState({ x: 0, y: 0, show: false })

  const onMove = useCallback((e) => {
    const p = ref.current?.parentElement
    if (!p) return
    const r = p.getBoundingClientRect()
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top, show: true })
  }, [])

  const onLeave = useCallback(() => setPos(p => ({ ...p, show: false })), [])

  useEffect(() => {
    const p = ref.current?.parentElement
    if (!p) return
    p.addEventListener('mousemove', onMove)
    p.addEventListener('mouseleave', onLeave)
    return () => {
      p.removeEventListener('mousemove', onMove)
      p.removeEventListener('mouseleave', onLeave)
    }
  }, [onMove, onLeave])

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute"
      style={{
        width: size,
        height: size,
        left: pos.x - size / 2,
        top:  pos.y - size / 2,
        opacity: pos.show ? 1 : 0,
        transition: 'opacity 0.3s',
        background: `radial-gradient(circle at center, ${color} 0%, rgba(100,150,255,0.04) 50%, transparent 80%)`,
        borderRadius: '50%',
        filter: 'blur(4px)',
        zIndex: 0,
      }}
    />
  )
}
