import { Suspense } from 'react';
import EventList from '@/components/EventList';
import EventListSkeleton from '@/components/EventListSkeleton';
import Header from '@/components/Header';

interface SearchParams {
  category?: string;
  start_date?: string;
  end_date?: string;
  upcoming?: string;
  page?: string;
}

interface EventsPageProps {
  searchParams: SearchParams;
}

export default function EventsPage({ searchParams }: EventsPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 to-blue-600">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-yellow-300 mb-4 pixel-text drop-shadow-lg">
            LOCAL EVENTS
          </h1>
          <p className="text-white text-lg md:text-xl font-semibold">
            Discover what's happening in the Pacific Northwest
          </p>
        </div>
        
        <Suspense fallback={<EventListSkeleton />}>
          <EventList searchParams={searchParams} />
        </Suspense>
      </main>
    </div>
  );
}