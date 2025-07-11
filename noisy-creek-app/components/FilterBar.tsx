'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { Filter, X } from 'lucide-react';

interface FilterBarProps {
  currentParams: {
    category?: string;
    start_date?: string;
    end_date?: string;
    upcoming?: string;
    page?: string;
  };
}

export default function FilterBar({ currentParams }: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams();
    
    // Keep existing params except the one being updated
    Object.entries(currentParams).forEach(([k, v]) => {
      if (k !== key && k !== 'page' && v) {
        params.append(k, v);
      }
    });
    
    // Add new value if it's not empty
    if (value) {
      params.append(key, value);
    }
    
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(pathname);
  };

  const hasActiveFilters = Object.entries(currentParams).some(
    ([key, value]) => key !== 'page' && value
  );

  return (
    <div className="bg-green-800/80 rounded-lg p-4 border-4 border-green-600">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-yellow-300" />
          <h3 className="text-lg font-bold text-yellow-300 pixel-text">Filters</h3>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="md:hidden text-white hover:text-yellow-300"
        >
          {isExpanded ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
        </button>
      </div>
      
      <div className={`space-y-4 ${isExpanded ? 'block' : 'hidden'} md:block`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-white text-sm font-semibold mb-2">
              Category
            </label>
            <select
              value={currentParams.category || ''}
              onChange={(e) => updateFilter('category', e.target.value)}
              className="w-full bg-green-700 text-white rounded px-3 py-2 border-2 border-green-600 focus:border-yellow-300 focus:outline-none"
            >
              <option value="">All Categories</option>
              <option value="music">Music</option>
              <option value="food">Food & Drink</option>
              <option value="outdoor">Outdoor</option>
              <option value="art">Art & Culture</option>
              <option value="sports">Sports</option>
              <option value="community">Community</option>
            </select>
          </div>
          
          {/* Start Date Filter */}
          <div>
            <label className="block text-white text-sm font-semibold mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={currentParams.start_date || ''}
              onChange={(e) => updateFilter('start_date', e.target.value)}
              className="w-full bg-green-700 text-white rounded px-3 py-2 border-2 border-green-600 focus:border-yellow-300 focus:outline-none"
            />
          </div>
          
          {/* End Date Filter */}
          <div>
            <label className="block text-white text-sm font-semibold mb-2">
              End Date
            </label>
            <input
              type="date"
              value={currentParams.end_date || ''}
              onChange={(e) => updateFilter('end_date', e.target.value)}
              className="w-full bg-green-700 text-white rounded px-3 py-2 border-2 border-green-600 focus:border-yellow-300 focus:outline-none"
            />
          </div>
          
          {/* Upcoming Toggle */}
          <div>
            <label className="block text-white text-sm font-semibold mb-2">
              Show Only
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={currentParams.upcoming === 'true'}
                onChange={(e) => updateFilter('upcoming', e.target.checked ? 'true' : '')}
                className="w-4 h-4 text-yellow-300 bg-green-700 border-green-600 rounded focus:ring-yellow-300"
              />
              <span className="text-white text-sm">Upcoming Events</span>
            </label>
          </div>
        </div>
        
        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <div className="flex justify-end">
            <button
              onClick={clearFilters}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}