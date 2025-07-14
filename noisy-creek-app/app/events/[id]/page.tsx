// app/events/[id]/page.tsx
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import EventDetail from '@/components/EventDetail';
import EventDetailSkeleton from '@/components/EventDetailSkeleton';
import Header from '@/components/Header';
import { Event } from '@/types/event';

interface EventDetailPageProps {
  params: {
    id: string;
  };
}

async function fetchEvent(id: string): Promise<Event> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  const response = await fetch(`${baseUrl}/api/events/${id}/`, {
    cache: 'no-store',
  });
  
  if (!response.ok) {
    notFound();
  }
  
  return response.json();
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const resolvedParams = await params
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 to-blue-600">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<EventDetailSkeleton />}>
          <EventDetailContent id={resolvedParams.id} />
        </Suspense>
      </main>
    </div>
  );
}

async function EventDetailContent({ id }: { id: string }) {
  const event = await fetchEvent(id);
  return <EventDetail event={event} />;
}