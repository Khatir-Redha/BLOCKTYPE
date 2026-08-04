import { useState, useEffect } from 'react'

const CLOUD_COUNT = 6
const STAR_COUNT = 20
const PARTICLE_COUNT = 12

const CLOUD_HEIGHT = 2

const PARTICLE_COLORS = ['#86efac', '#4ade80', '#fcd34d', '#fbbf24']

const PIXEL = 4

const NIGHT_SKY = 'linear-gradient(to bottom, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'

const cloudsData = Array.from({ length: CLOUD_COUNT }, (_, i) => ({
  id: i,
  pixelSize: 3 + Math.floor(Math.random() * 2),
  startY: 15 + Math.random() * 25,
  duration: 50 + Math.random() * 40,
  delay: Math.random() * 15,
  opacity: 0.25 + Math.random() * 0.2,
  width: 6 + Math.floor(Math.random() * 3),
}))

const starsData = Array.from({ length: STAR_COUNT }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: 5 + Math.random() * 55,
  size: Math.random() < 0.5 ? 1 : 2,
  twinkleDelay: Math.random() * 6,
}))

const particlesData = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: 25 + Math.random() * 60,
  delay: Math.random() * 12,
  duration: 5 + Math.random() * 10,
  color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
}))

export default function PixelSky() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    let frame = 0
    const handleMouseMove = (e: MouseEvent) => {
      if (frame) cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2
        const y = (e.clientY / window.innerHeight - 0.5) * 2
        setMousePos({ x, y })
      })
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0"
        style={{ background: NIGHT_SKY }}
      />

      <div
        className="absolute inset-0 bg-gradient-to-t from-purple-950/30 via-purple-950/10 to-transparent"
        style={{
          transform: `translate(${mousePos.x * 40}px, ${mousePos.y * 20}px)`,
          transition: 'transform 0.15s ease-out',
        }}
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-blue-950/20 via-transparent to-transparent"
        style={{
          transform: `translate(${mousePos.x * 60}px, ${mousePos.y * 30}px)`,
          transition: 'transform 0.15s ease-out',
        }}
      />

      {starsData.map((star) => (
        <div
          key={`star-${star.id}`}
          className="absolute bg-green-200 animate-twinkle"
          style={{
            width: `${star.size * PIXEL}px`,
            height: `${star.size * PIXEL}px`,
            left: `${star.x}%`,
            top: `${star.y}%`,
            animationDelay: `${star.twinkleDelay}s`,
          }}
        />
      ))}

      {cloudsData.map((cloud) => (
        <div
          key={`cloud-${cloud.id}`}
          className="absolute"
          style={{
            top: `${cloud.startY}%`,
            left: '-8%',
            animation: `moveClouds ${cloud.duration}s linear ${cloud.delay}s infinite`,
            opacity: cloud.opacity,
          }}
        >
          {Array.from({ length: CLOUD_HEIGHT }).map((_, ri) =>
            Array.from({ length: cloud.width }).map((_, ci) => (
              <div
                key={`${cloud.id}-${ri}-${ci}`}
                className="absolute bg-green-200"
                style={{
                  width: `${cloud.pixelSize * PIXEL}px`,
                  height: `${cloud.pixelSize * PIXEL}px`,
                  left: `${ci * cloud.pixelSize * PIXEL}px`,
                  top: `${ri * cloud.pixelSize * PIXEL}px`,
                }}
              />
            ))
          )}
        </div>
      ))}

      {particlesData.map((p) => (
        <div
          key={`particle-${p.id}`}
          className="absolute animate-float"
          style={{
            width: `${PIXEL}px`,
            height: `${PIXEL}px`,
            backgroundColor: p.color,
            left: `${p.x}%`,
            top: `${p.y}%`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            opacity: 0.4,
          }}
        />
      ))}

      <div
        className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-green-900/30 to-transparent"
        style={{
          transform: `translate(${mousePos.x * 90}px, 0)`,
          transition: 'transform 0.15s ease-out',
        }}
      />
    </div>
  )
}
