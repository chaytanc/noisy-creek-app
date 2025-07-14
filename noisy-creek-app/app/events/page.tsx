import { Suspense } from 'react';
import EventList from '@/components/EventList';
import EventListSkeleton from '@/components/EventListSkeleton';
import Header from '@/components/Header';
import ErrorBoundary from '@/components/ErrorBoundary';
import PageLoadTimer from '@/components/PageLoadTimer';
import WalkingBeaver from '@/components/WalkingBeaver';
import ErrorTestComponent from '@/components/ErrorTestComponent';

interface SearchParams {
  category?: string;
  start_date?: string;
  end_date?: string;
  upcoming?: string;
  page?: string;
}

interface EventsPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <ErrorBoundary>
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
            <EventList searchParams={resolvedSearchParams} />
          </Suspense>
        </main>
        
        {process.env.NEXT_PUBLIC_DEBUG_MODE === 'true' && (
            <>
              <PageLoadTimer />
              <ErrorTestComponent />
            </>
        )}
        <WalkingBeaver />
      </div>
    </ErrorBoundary>
  );
}