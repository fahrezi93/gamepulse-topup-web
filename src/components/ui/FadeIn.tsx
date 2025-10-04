'use client'

import { useEffect, useState } from 'react'

interface FadeInProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  duration?: number
}

export default function FadeIn({ 
  children, 
  className = '', 
  delay = 0,
  direction = 'up',
  duration = 600
}: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  const getTransform = () => {
    if (isVisible) return 'translate3d(0, 0, 0)'
    
    switch (direction) {
      case 'up':
        return 'translate3d(0, 20px, 0)'
      case 'down':
        return 'translate3d(0, -20px, 0)'
      case 'left':
        return 'translate3d(20px, 0, 0)'
      case 'right':
        return 'translate3d(-20px, 0, 0)'
      default:
        return 'translate3d(0, 0, 0)'
    }
  }

  return (
    <div
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
        willChange: 'opacity, transform',
        backfaceVisibility: 'hidden'
      }}
    >
      {children}
    </div>
  )
}
