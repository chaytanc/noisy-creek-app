'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function WalkingBeaver() {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ x: -100, y: 0 })
  const [isWalking, setIsWalking] = useState(false)

  useEffect(() => {
    // Random chance to show beaver (30% chance on each page load)
    const shouldShow = Math.random() < 0.3
    
    if (shouldShow) {
      // Random delay before beaver appears (1-5 seconds)
      const delay = Math.random() * 4000 + 1000
      
      setTimeout(() => {
        setIsVisible(true)
        startWalking()
      }, delay)
    }
  }, [])

  const startWalking = () => {
    setIsWalking(true)
    
    // Random Y position (middle section of screen)
    const randomY = Math.random() * (window.innerHeight * 0.4) + (window.innerHeight * 0.3)
    setPosition({ x: -100, y: randomY })
    
    // Animate beaver walking across screen
    const duration = 8000 // 8 seconds to cross screen
    const startTime = Date.now()
    const endX = window.innerWidth + 100
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = elapsed / duration
      
      if (progress < 1) {
        const currentX = -100 + (endX + 100) * progress
        setPosition(prev => ({ ...prev, x: currentX }))
        requestAnimationFrame(animate)
      } else {
        // Hide beaver after walking across
        setIsVisible(false)
        setIsWalking(false)
      }
    }
    
    requestAnimationFrame(animate)
  }

  if (!isVisible) return null

  return (
    <div
      className="fixed pointer-events-none z-40"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translateY(-50%)',
        transition: 'none'
      }}
    >
      <div className={`${isWalking ? 'animate-bounce' : ''}`}>
        <Image
          src="/beaver.png"
          alt="Walking beaver"
          width={64}
          height={64}
          className="drop-shadow-lg"
          style={{ 
            imageRendering: 'pixelated',
            filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
          }}
        />
      </div>
      
      {/* Optional: Add some "footsteps" effect */}
      {isWalking && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-brown-600 rounded-full opacity-60"></div>
            <div className="w-1 h-1 bg-brown-600 rounded-full opacity-40"></div>
          </div>
        </div>
      )}
    </div>
  )
}