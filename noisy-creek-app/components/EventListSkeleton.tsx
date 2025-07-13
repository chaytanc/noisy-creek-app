export default function EventListSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Filter Bar Skeleton */}
      <div className="bg-green-800/80 rounded-lg p-4 border-4 border-green-600">
        <div className="flex flex-wrap gap-2 sm:gap-4">
          <div className="h-8 sm:h-10 bg-green-600/50 rounded w-24 sm:w-32 animate-pulse"></div>
          <div className="h-8 sm:h-10 bg-green-600/50 rounded w-20 sm:w-24 animate-pulse"></div>
          <div className="h-8 sm:h-10 bg-green-600/50 rounded w-24 sm:w-28 animate-pulse"></div>
        </div>
      </div>
      
      {/* Event Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-green-800/90 rounded-lg border-4 border-green-600 p-4 sm:p-6 animate-pulse min-h-[200px]">
            {/* Title Skeleton */}
            <div className="h-5 sm:h-6 bg-green-600/50 rounded mb-3 w-3/4"></div>
            
            {/* Category Badge Skeleton */}
            <div className="h-5 sm:h-6 bg-yellow-300/50 rounded w-16 sm:w-20 mb-3"></div>
            
            {/* Date Skeleton */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-600/50 rounded flex-shrink-0"></div>
              <div className="h-4 bg-green-600/50 rounded w-24 sm:w-32"></div>
            </div>
            
            {/* Time Skeleton */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-600/50 rounded flex-shrink-0"></div>
              <div className="h-4 bg-green-600/50 rounded w-20 sm:w-24"></div>
            </div>
            
            {/* Location Skeleton */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-600/50 rounded flex-shrink-0"></div>
              <div className="h-4 bg-green-600/50 rounded w-24 sm:w-28"></div>
            </div>
            
            {/* Description Skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-green-600/50 rounded w-full"></div>
              <div className="h-4 bg-green-600/50 rounded w-5/6"></div>
              <div className="h-4 bg-green-600/50 rounded w-3/4"></div>
            </div>
            
            {/* Decorative Mountains Skeleton */}
            <div className="mt-4 flex justify-center">
              <div className="flex items-end space-x-1">
                <div className="w-3 h-3 bg-purple-400/50 transform rotate-45"></div>
                <div className="w-4 h-4 bg-purple-500/50 transform rotate-45"></div>
                <div className="w-3 h-3 bg-purple-400/50 transform rotate-45"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination Skeleton */}
      <div className="flex justify-center">
        <div className="bg-green-800/80 rounded-lg p-2 sm:p-4 border-4 border-green-600">
          <div className="flex gap-2 justify-center">
            <div className="h-8 sm:h-10 bg-green-600/50 rounded w-16 sm:w-20 animate-pulse"></div>
            <div className="h-8 sm:h-10 bg-green-600/50 rounded w-8 sm:w-10 animate-pulse"></div>
            <div className="h-8 sm:h-10 bg-green-600/50 rounded w-8 sm:w-10 animate-pulse"></div>
            <div className="h-8 sm:h-10 bg-green-600/50 rounded w-16 sm:w-20 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}