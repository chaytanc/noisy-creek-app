import Header from '@/components/Header';
import EventDetailSkeleton from '@/components/EventDetailSkeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 to-blue-600">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <EventDetailSkeleton />
      </main>
    </div>
  );
}