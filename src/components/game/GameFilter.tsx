'use client'

import { useState } from 'react'
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'

interface GameFilterProps {
  categories: string[]
  searchTerm: string
  selectedCategory: string
  sortBy: string
  onSearchChange: (term: string) => void
  onCategoryChange: (category: string) => void
  onSortChange: (sort: string) => void
}

export default function GameFilter({ 
  categories, 
  searchTerm, 
  selectedCategory, 
  sortBy,
  onSearchChange,
  onCategoryChange,
  onSortChange
}: GameFilterProps) {

  return (
    <div className="backdrop-blur-sm border rounded-2xl p-6" style={{ backgroundColor: '#161B22', borderColor: '#7C3AED' }}>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#8B949E' }} />
            <input
              type="text"
              placeholder="Cari game favoritmu..."
              className="w-full pl-10 pr-4 py-3 border rounded-xl transition-all duration-200"
              style={{ 
                backgroundColor: '#0D1117', 
                borderColor: '#7C3AED', 
                color: '#F0F6FC',
                fontFamily: 'Manrope, sans-serif'
              }}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="lg:w-64">
          <select
            className="w-full px-4 py-3 border rounded-xl transition-all duration-200"
            style={{ 
              backgroundColor: '#0D1117', 
              borderColor: '#7C3AED', 
              color: '#F0F6FC',
              fontFamily: 'Manrope, sans-serif'
            }}
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="all">Semua Kategori</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="lg:w-48">
          <select
            className="w-full px-4 py-3 border rounded-xl transition-all duration-200"
            style={{ 
              backgroundColor: '#0D1117', 
              borderColor: '#7C3AED', 
              color: '#F0F6FC',
              fontFamily: 'Manrope, sans-serif'
            }}
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="name">Nama A-Z</option>
            <option value="name-desc">Nama Z-A</option>
            <option value="price-low">Harga Terendah</option>
            <option value="price-high">Harga Tertinggi</option>
            <option value="popular">Terpopuler</option>
          </select>
        </div>

        {/* Filter Button */}
        <button className="lg:w-auto w-full px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2" 
                style={{ backgroundColor: '#34D399', color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}>
          <FunnelIcon className="w-5 h-5" />
          <span>Filter</span>
        </button>
      </div>

      {/* Active Filters */}
      {(selectedCategory !== 'all' || searchTerm) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {selectedCategory !== 'all' && (
            <div className="border px-3 py-1 rounded-full text-sm flex items-center space-x-2" 
                 style={{ backgroundColor: 'rgba(124, 58, 237, 0.2)', borderColor: 'rgba(124, 58, 237, 0.3)', color: '#7C3AED', fontFamily: 'Manrope, sans-serif' }}>
              <span>{selectedCategory}</span>
              <button
                onClick={() => onCategoryChange('all')}
                className="transition-colors"
                style={{ color: '#7C3AED' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#F0F6FC'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#7C3AED'}
              >
                ×
              </button>
            </div>
          )}
          {searchTerm && (
            <div className="border px-3 py-1 rounded-full text-sm flex items-center space-x-2" 
                 style={{ backgroundColor: 'rgba(52, 211, 153, 0.2)', borderColor: 'rgba(52, 211, 153, 0.3)', color: '#34D399', fontFamily: 'Manrope, sans-serif' }}>
              <span>"{searchTerm}"</span>
              <button
                onClick={() => onSearchChange('')}
                className="transition-colors"
                style={{ color: '#34D399' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#F0F6FC'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#34D399'}
              >
                ×
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
