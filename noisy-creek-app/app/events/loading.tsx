import Header from '@/components/Header';
import EventListSkeleton from '@/components/EventListSkeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 to-blue-600">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="h-12 md:h-16 bg-yellow-300/50 rounded mb-4 w-96 mx-auto animate-pulse"></div>
          <div className="h-6 bg-white/50 rounded w-80 mx-auto animate-pulse"></div>
        </div>
        
        <EventListSkeleton />
      </main>
    </div>
  );
}
