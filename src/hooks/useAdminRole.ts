'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useState, useEffect } from 'react'

export function useAdminRole() {
  const { user } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        setIsAdmin(false)
        setLoading(false)
        return
      }

      try {
        // Get Firebase token
        const token = await user.getIdToken()
        
        // Check admin role from database
        const response = await fetch('/api/auth/check-admin', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setIsAdmin(data.isAdmin || false)
        } else {
          setIsAdmin(false)
        }
      } catch (error) {
        console.error('Error checking admin role:', error)
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }

    checkAdminRole()
  }, [user])

  return { isAdmin, loading }
}
