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
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari game favoritmu..."
              className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="lg:w-64">
          <select
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200"
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
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200"
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
        <button className="lg:w-auto w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2">
          <FunnelIcon className="w-5 h-5" />
          <span>Filter</span>
        </button>
      </div>

      {/* Active Filters */}
      {(selectedCategory !== 'all' || searchTerm) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {selectedCategory !== 'all' && (
            <div className="bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 px-3 py-1 rounded-full text-sm flex items-center space-x-2">
              <span>{selectedCategory}</span>
              <button
                onClick={() => onCategoryChange('all')}
                className="hover:text-white transition-colors"
              >
                ×
              </button>
            </div>
          )}
          {searchTerm && (
            <div className="bg-purple-500/20 border border-purple-500/30 text-purple-300 px-3 py-1 rounded-full text-sm flex items-center space-x-2">
              <span>"{searchTerm}"</span>
              <button
                onClick={() => onSearchChange('')}
                className="hover:text-white transition-colors"
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
