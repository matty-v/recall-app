import { useEffect, useRef } from 'react'

function Particles() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container || container.children.length > 0) return

    const particleCount = 30
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div')
      particle.className = 'particle'
      particle.style.left = Math.random() * 100 + '%'
      particle.style.top = Math.random() * 100 + '%'
      const duration = 15 + Math.random() * 25
      particle.style.animationDuration = duration + 's'
      particle.style.animationDelay = Math.random() * 10 + 's'
      const drift = (Math.random() - 0.5) * 100
      particle.style.setProperty('--particle-drift', drift + 'px')
      const size = 1 + Math.random() * 2
      particle.style.width = size + 'px'
      particle.style.height = size + 'px'
      container.appendChild(particle)
    }

    return () => {
      if (container) {
        container.innerHTML = ''
      }
    }
  }, [])

  return <div className="particles" ref={containerRef} />
}

export function Background() {
  return (
    <>
      <div className="gradient-backdrop" />
      <div className="grid-overlay" />
      <Particles />
      <div className="scanline" />
      <div className="corner-accent top-left" />
      <div className="corner-accent bottom-right" />
    </>
  )
}
