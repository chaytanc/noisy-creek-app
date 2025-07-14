'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Filter, X, Search } from 'lucide-react';

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
  
  // Local state for form inputs
  const [formData, setFormData] = useState({
    category: currentParams.category || '',
    start_date: currentParams.start_date || '',
    end_date: currentParams.end_date || '',
    upcoming: currentParams.upcoming === 'true'
  });

  // Sync form data with URL params when they change
  useEffect(() => {
    setFormData({
      category: currentParams.category || '',
      start_date: currentParams.start_date || '',
      end_date: currentParams.end_date || '',
      upcoming: currentParams.upcoming === 'true'
    });
  }, [currentParams]);

  const updateFormData = (key: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    
    // Add all non-empty values to params
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'upcoming') {
        if (value) {
          params.append(key, 'true');
        }
      } else {
        params.append(key, value as string);
      }
    });
    
    router.push(`${pathname}?${params.toString()}`);
  };


  const clearFilters = () => {
    setFormData({
      category: '',
      start_date: '',
      end_date: '',
      upcoming: false
    });
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
          {/* Category Filter -- Currently hard-coded for simplicity but would ideally be tied to the categories table in Django by reading an API endpoint to list them */}
          <div>
            <label className="block text-white text-sm font-semibold mb-2" id="category-select">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => updateFormData('category', e.target.value)}
              className="w-full bg-green-700 text-white rounded px-3 py-3 border-2 border-green-600 focus:border-yellow-300 focus:outline-none min-h-[44px]"
              aria-labelledby="category-select"
            >
              <option value="">All Categories</option>
              <option value="Music">Music</option>
              <option value="Food & Drink">Food & Drink</option>
              <option value="Outdoor">Outdoor</option>
              <option value="Art & Culture">Art & Culture</option>
              <option value="Sports">Sports</option>
              <option value="Community">Community</option>
            </select>
          </div>
          
          {/* Start Date Filter */}
          <div>
            <label className="block text-white text-sm font-semibold mb-2" id="start-date">
              Start Date
            </label>
            <input
              type="date"
              value={formData.start_date}
              onChange={(e) => updateFormData('start_date', e.target.value)}
              className="w-full bg-green-700 text-white rounded px-3 py-3 border-2 border-green-600 focus:border-yellow-300 focus:outline-none min-h-[44px]"
              aria-labelledby="start-date"
            />
          </div>
          
          {/* End Date Filter */}
          <div>
            <label className="block text-white text-sm font-semibold mb-2" id="end-date">
              End Date
            </label>
            <input
              type="date"
              value={formData.end_date}
              onChange={(e) => updateFormData('end_date', e.target.value)}
              className="w-full bg-green-700 text-white rounded px-3 py-3 border-2 border-green-600 focus:border-yellow-300 focus:outline-none min-h-[44px]"
              aria-labelledby="end-date"
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
                checked={formData.upcoming}
                onChange={(e) => updateFormData('upcoming', e.target.checked)}
                className="w-4 h-4 text-yellow-300 bg-green-700 border-green-600 rounded focus:ring-yellow-300"
              />
              <span className="text-white text-sm">Upcoming Events</span>
            </label>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-between items-center gap-4">
          <button
            onClick={applyFilters}
            className="bg-yellow-500 hover:bg-yellow-600 text-green-900 px-6 py-2 rounded font-semibold transition-colors flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Search Events
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold transition-colors"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}