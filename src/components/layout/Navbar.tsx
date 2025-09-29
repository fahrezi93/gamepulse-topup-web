'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useAdminRole } from '@/hooks/useAdminRole'
import { Bars3Icon, XMarkIcon, UserCircleIcon, ArrowRightOnRectangleIcon, SparklesIcon } from '@heroicons/react/24/outline'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { user, loading, logout } = useAuth()
  const { isAdmin, loading: adminLoading } = useAdminRole()
  const profileRef = useRef<HTMLDivElement>(null)
  const navigation = [
    { name: 'Beranda', href: '/' },
    { name: 'Semua Game', href: '/games' },
    { name: 'Cek Transaksi', href: '/transaction/check' },
    { name: 'Bantuan', href: '/help' },
  ]

  const handleSignOut = () => {
    logout()
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isProfileOpen])

  return (
    <nav className="backdrop-blur-md border-b sticky top-0 z-50" style={{ backgroundColor: 'rgba(13, 17, 23, 0.95)', borderColor: '#161B22' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl" style={{ backgroundColor: '#161B22' }}>
                <span className="text-2xl">🎮</span>
              </div>
              <div>
                <span className="text-xl font-bold" style={{ color: '#F0F6FC', fontFamily: 'Playfair Display, serif' }}>
                  GamePulse
                </span>
                <div className="text-xs -mt-1" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>Top Up Center</div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative group"
                style={{ 
                  color: '#8B949E', 
                  fontFamily: 'Manrope, sans-serif',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#F0F6FC'
                  e.currentTarget.style.backgroundColor = '#161B22'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#8B949E'
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                {item.name}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300" style={{ backgroundColor: '#7C3AED' }}></div>
              </Link>
            ))}
            
            {/* Auth Section */}
            {loading ? (
              <div className="w-8 h-8 rounded-full animate-pulse ml-4" style={{ backgroundColor: '#161B22' }}></div>
            ) : user ? (
              <div className="ml-4 flex items-center space-x-3">
                {/* Admin Button - Only for admin users */}
                {isAdmin && !adminLoading && (
                  <Link
                    href="/admin"
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg"
                    style={{ 
                      backgroundColor: '#7C3AED', 
                      color: '#F0F6FC',
                      fontFamily: 'Manrope, sans-serif'
                    }}
                  >
                    Admin
                  </Link>
                )}
                
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200"
                    style={{ backgroundColor: '#161B22' }}
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#7C3AED' }}>
                      <span className="text-sm font-bold" style={{ color: '#F0F6FC' }}>
                        {user.displayName?.charAt(0) || user.email?.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm font-medium" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
                      {user.displayName || user.email?.split('@')[0] || 'User'}
                    </span>
                  </button>
                
                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-xl shadow-lg py-2 z-50 transform transition-all duration-200 ease-out" style={{ backgroundColor: '#161B22', border: '1px solid #7C3AED' }}>
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 transition-colors"
                      style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}
                      onClick={() => setIsProfileOpen(false)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#F0F6FC'
                        e.currentTarget.style.backgroundColor = 'rgba(124, 58, 237, 0.1)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#8B949E'
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                    >
                      <UserCircleIcon className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                    <Link
                      href="/profile/transactions"
                      className="flex items-center px-4 py-2 transition-colors"
                      style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}
                      onClick={() => setIsProfileOpen(false)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#F0F6FC'
                        e.currentTarget.style.backgroundColor = 'rgba(124, 58, 237, 0.1)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#8B949E'
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                    >
                      <span className="w-4 h-4 mr-2">💳</span>
                      Riwayat Transaksi
                    </Link>
                    <hr className="my-2" style={{ borderColor: '#7C3AED' }} />
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-2 transition-colors"
                      style={{ color: '#34D399', fontFamily: 'Manrope, sans-serif' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(52, 211, 153, 0.1)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
                      Keluar
                    </button>
                  </div>
                )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3 ml-4">
                <Link
                  href="/auth/signin"
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#F0F6FC'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#8B949E'}
                >
                  Masuk
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg"
                  style={{ 
                    backgroundColor: '#7C3AED', 
                    color: '#F0F6FC',
                    fontFamily: 'Manrope, sans-serif'
                  }}
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white hover:bg-gray-800 p-2 rounded-lg transition-colors duration-200"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900/95 backdrop-blur-md border-t border-gray-800">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-300 hover:text-white hover:bg-gray-800 block px-3 py-2 rounded-lg text-base font-medium transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Admin Link - Only for admin users */}
              {isAdmin && !adminLoading && (
                <Link
                  href="/admin"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white block px-3 py-2 text-base font-medium rounded-lg mt-2 transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              
              {/* Auth Section for Mobile */}
              {user ? (
                <div className="border-t border-gray-700 mt-4 pt-4">
                  <div className="flex items-center px-3 py-2 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">
                        {user.displayName?.charAt(0) || user.email?.charAt(0)}
                      </span>
                    </div>
                    <span className="text-gray-300 text-sm font-medium">
                      {user.displayName || user.email?.split('@')[0] || 'User'}
                    </span>
                  </div>
                  <Link
                    href="/profile"
                    className="text-gray-300 hover:text-white hover:bg-gray-800 block px-3 py-2 rounded-lg text-base font-medium transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut()
                      setIsMenuOpen(false)
                    }}
                    className="text-gray-300 hover:text-white hover:bg-gray-800 block px-3 py-2 rounded-lg text-base font-medium transition-colors duration-200 w-full text-left"
                  >
                    Keluar
                  </button>
                </div>
              ) : (
                <div className="border-t border-gray-700 mt-4 pt-4 space-y-2">
                  <Link
                    href="/auth/signin"
                    className="text-gray-300 hover:text-white hover:bg-gray-800 block px-3 py-2 rounded-lg text-base font-medium transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white block px-3 py-2 text-base font-medium rounded-lg transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
