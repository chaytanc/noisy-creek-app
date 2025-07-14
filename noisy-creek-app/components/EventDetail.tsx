// components/EventDetail.tsx
import { Event } from '@/types/event';
import { Calendar, MapPin, Clock, Tag, ArrowLeft, Users } from 'lucide-react';
import Link from 'next/link';

interface EventDetailProps {
  event: Event;
}

export default function EventDetail({ event }: EventDetailProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const isUpcoming = new Date(event.start_date) > new Date();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <Link 
        href="/events"
        className="inline-flex items-center gap-2 mb-6 bg-green-800/80 text-white px-4 py-2 rounded-lg border-2 border-green-600 hover:bg-green-700/80 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Events
      </Link>

      {/* Main Event Card */}
      <div className="bg-green-800/90 rounded-lg border-4 border-green-600 p-8 mb-6">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-yellow-300 pixel-text">
              {event.title}
            </h1>
            {isUpcoming && (
              <span className="bg-yellow-300 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                UPCOMING
              </span>
            )}
          </div>
          
          {/* Category */}
          {event.category && (
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-5 h-5 text-yellow-300" />
              <span className="bg-yellow-300 text-green-800 px-3 py-1 rounded text-lg font-bold">
                {event.category.name}
              </span>
            </div>
          )}
        </div>

        {/* Event Details Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Date & Time Column */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-yellow-300 pixel-text">When</h3>
            
            <div className="bg-green-700/50 rounded-lg p-4 border-2 border-green-600">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-5 h-5 text-yellow-300" />
                <span className="text-white text-lg font-semibold">
                  {formatDate(event.start_date)}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-yellow-300" />
                <span className="text-white">
                  {formatTime(event.start_date)} - {formatTime(event.end_date)}
                </span>
              </div>
            </div>
          </div>

          {/* Location Column */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-yellow-300 pixel-text">Where</h3>
            
            <div className="bg-green-700/50 rounded-lg p-4 border-2 border-green-600">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-yellow-300 mt-1" />
                <div className="text-white">
                  <div>
                    <div className="font-semibold text-lg">{event.venue.name}</div>
                    {event.venue.address && (
                      <div className="text-sm opacity-90">{event.venue.address}</div>
                    )}
                    {event.venue.capacity && (
                      <div className="flex items-center gap-2 mt-2 text-sm">
                        <Users className="w-4 h-4" />
                        <span>Capacity: {event.venue.capacity}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        {event.description && (
          <div className="mb-6">
            <h3 className="text-xl font-bold text-yellow-300 pixel-text mb-4">About This Event</h3>
            <div className="bg-green-700/50 rounded-lg p-6 border-2 border-green-600">
              <p className="text-white leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </div>
          </div>
        )}

        {/* Decorative Mountains */}
        <div className="flex justify-center">
          <div className="flex items-end space-x-2">
            <div className="w-6 h-6 bg-purple-400 transform rotate-45"></div>
            <div className="w-8 h-8 bg-purple-500 transform rotate-45"></div>
            <div className="w-10 h-10 bg-purple-600 transform rotate-45"></div>
            <div className="w-8 h-8 bg-purple-500 transform rotate-45"></div>
            <div className="w-6 h-6 bg-purple-400 transform rotate-45"></div>
          </div>
        </div>
      </div>

      {/* Additional Info Cards */}
      {event.category?.description && (
        <div className="bg-green-800/80 rounded-lg border-4 border-green-600 p-6">
          <h3 className="text-lg font-bold text-yellow-300 pixel-text mb-3">
            About {event.category.name} Events
          </h3>
          <p className="text-white leading-relaxed">
            {event.category.description}
          </p>
        </div>
      )}
    </div>
  );
}