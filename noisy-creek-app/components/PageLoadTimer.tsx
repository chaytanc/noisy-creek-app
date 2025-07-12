'use client'

import { useEffect, useState } from 'react'

export default function PageLoadTimer() {
  const [loadTime, setLoadTime] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const startTime = performance.now()
    
    // Measure when the page is fully loaded
    const measureLoadTime = () => {
      const endTime = performance.now()
      const duration = Math.round(endTime - startTime)
      setLoadTime(duration)
      
      // Hide after 5 seconds
      setTimeout(() => setIsVisible(false), 5000)
    }

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(measureLoadTime)
  }, [])

  if (!isVisible || loadTime === null) return null

  return (
    <div className="fixed top-4 right-4 z-50 bg-green-800/90 text-white px-3 py-2 rounded border-2 border-green-600 shadow-lg">
      <div className="flex items-center gap-2">
        <span className="text-yellow-300">⚡</span>
        <span className="text-sm font-semibold">
          Page loaded in {loadTime}ms
        </span>
      </div>
    </div>
  )
}