import { Event } from '@/types/event';
import { Calendar, MapPin, Clock, Tag } from 'lucide-react';
import Link from 'next/link';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <Link href={`/events/${event.id}`}>
      <div className="bg-green-800/90 rounded-lg border-4 border-green-600 p-4 sm:p-6 hover:bg-green-700/90 transition-colors duration-200 cursor-pointer md:transform md:hover:scale-105 hover:shadow-2xl min-h-[200px] flex flex-col">
        {/* Event Title */}
        <h3 className="text-lg sm:text-xl font-bold text-yellow-300 mb-3 pixel-text line-clamp-2">
          {event.title}
        </h3>
        
        {/* Category Badge */}
        {event.category && (
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 flex-shrink-0" />
            <span className="bg-yellow-300 text-green-800 px-2 py-1 rounded text-xs sm:text-sm font-bold">
              {event.category.name}
            </span>
          </div>
        )}
        
        {/* Date and Time */}
        <div className="flex items-center gap-3 text-white mb-2">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
          <span className="text-sm sm:text-base">{formatDate(event.start_date)}</span>
        </div>
        
        <div className="flex items-center gap-3 text-white mb-3">
          <Clock className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
          <span className="text-sm sm:text-base">
            {formatTime(event.start_date)} - {formatTime(event.end_date)}
          </span>
        </div>
        
        {/* Venue */}
        <div className="flex items-center gap-3 text-white mb-3">
          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
          <span className="text-sm sm:text-base">
            {event.venue.name}
          </span>
        </div>
        
        {/* Description Preview */}
        {event.description && (
          <p className="text-white text-sm sm:text-base line-clamp-3 leading-relaxed flex-grow">
            {event.description}
          </p>
        )}
        
        {/* Decorative Mountains */}
        <div className="mt-auto pt-4 flex justify-center">
          <div className="flex items-end space-x-1">
            <div className="w-3 h-3 bg-purple-400 transform rotate-45"></div>
            <div className="w-4 h-4 bg-purple-500 transform rotate-45"></div>
            <div className="w-3 h-3 bg-purple-400 transform rotate-45"></div>
          </div>
        </div>
      </div>
    </Link>
  );
}