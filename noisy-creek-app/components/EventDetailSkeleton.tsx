export default function EventDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button Skeleton */}
      <div className="h-10 bg-green-600/50 rounded w-32 mb-6 animate-pulse"></div>

      {/* Main Event Card Skeleton */}
      <div className="bg-green-800/90 rounded-lg border-4 border-green-600 p-8 mb-6 animate-pulse">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div className="h-10 bg-green-600/50 rounded w-3/4"></div>
            <div className="h-8 bg-yellow-300/50 rounded w-24"></div>
          </div>
          
          {/* Category Skeleton */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 bg-green-600/50 rounded"></div>
            <div className="h-8 bg-yellow-300/50 rounded w-32"></div>
          </div>
        </div>

        {/* Event Details Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Date & Time Column */}
          <div className="space-y-4">
            <div className="h-6 bg-green-600/50 rounded w-20"></div>
            
            <div className="bg-green-700/50 rounded-lg p-4 border-2 border-green-600">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-5 h-5 bg-green-600/50 rounded"></div>
                <div className="h-5 bg-green-600/50 rounded w-40"></div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-600/50 rounded"></div>
                <div className="h-4 bg-green-600/50 rounded w-32"></div>
              </div>
            </div>
          </div>

          {/* Location Column */}
          <div className="space-y-4">
            <div className="h-6 bg-green-600/50 rounded w-20"></div>
            
            <div className="bg-green-700/50 rounded-lg p-4 border-2 border-green-600">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-green-600/50 rounded mt-1"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-5 bg-green-600/50 rounded w-3/4"></div>
                  <div className="h-4 bg-green-600/50 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mb-6">
          <div className="h-6 bg-green-600/50 rounded w-48 mb-4"></div>
          <div className="bg-green-700/50 rounded-lg p-6 border-2 border-green-600">
            <div className="space-y-3">
              <div className="h-4 bg-green-600/50 rounded w-full"></div>
              <div className="h-4 bg-green-600/50 rounded w-5/6"></div>
              <div className="h-4 bg-green-600/50 rounded w-4/5"></div>
              <div className="h-4 bg-green-600/50 rounded w-3/4"></div>
            </div>
          </div>
        </div>

        {/* Decorative Mountains Skeleton */}
        <div className="flex justify-center">
          <div className="flex items-end space-x-2">
            <div className="w-6 h-6 bg-purple-400/50 transform rotate-45"></div>
            <div className="w-8 h-8 bg-purple-500/50 transform rotate-45"></div>
            <div className="w-10 h-10 bg-purple-600/50 transform rotate-45"></div>
            <div className="w-8 h-8 bg-purple-500/50 transform rotate-45"></div>
            <div className="w-6 h-6 bg-purple-400/50 transform rotate-45"></div>
          </div>
        </div>
      </div>

      {/* Additional Info Card Skeleton */}
      <div className="bg-green-800/80 rounded-lg border-4 border-green-600 p-6 animate-pulse">
        <div className="h-5 bg-green-600/50 rounded w-48 mb-3"></div>
        <div className="space-y-2">
          <div className="h-4 bg-green-600/50 rounded w-full"></div>
          <div className="h-4 bg-green-600/50 rounded w-3/4"></div>
        </div>
      </div>
    </div>
  );
}