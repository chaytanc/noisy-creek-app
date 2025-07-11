import { Event } from '@/types/event';
import EventCard from './EventCard';
import FilterBar from './FilterBar';
import Pagination from './Pagination';

interface SearchParams {
  category?: string;
  start_date?: string;
  end_date?: string;
  upcoming?: string;
  page?: string;
}

interface EventListProps {
  searchParams: SearchParams;
}

interface EventResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Event[];
}

async function fetchEvents(searchParams: SearchParams): Promise<EventResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const params = new URLSearchParams();
  
  if (searchParams.category) params.append('category', searchParams.category);
  if (searchParams.start_date) params.append('start_date', searchParams.start_date);
  if (searchParams.end_date) params.append('end_date', searchParams.end_date);
  if (searchParams.upcoming) params.append('upcoming', searchParams.upcoming);
  if (searchParams.page) params.append('page', searchParams.page);
  
  const response = await fetch(`${baseUrl}/api/events/?${params}`, {
    cache: 'no-store', // Always fetch fresh data
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch events');
  }
  
  return response.json();
}

export default async function EventList({ searchParams }: EventListProps) {
  const eventData = await fetchEvents(searchParams);
  
  return (
    <div className="space-y-6">
      <FilterBar currentParams={searchParams} />
      
      {eventData.results.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-green-800/80 rounded-lg p-8 max-w-md mx-auto border-4 border-green-600">
            <h3 className="text-2xl font-bold text-yellow-300 mb-4 pixel-text">
              No Events Found
            </h3>
            <p className="text-white">
              Try adjusting your filters or check back later for new events!
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventData.results.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          
          <Pagination 
            currentPage={parseInt(searchParams.page || '1')}
            totalResults={eventData.count}
            hasNext={!!eventData.next}
            hasPrevious={!!eventData.previous}
          />
        </>
      )}
    </div>
  );
}