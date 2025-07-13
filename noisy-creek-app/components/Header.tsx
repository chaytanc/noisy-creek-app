import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-green-800/90 border-b-4 border-green-600 sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative">
              <Image
                src="/pnwevents.png"
                alt="Pacific Northwest Events Logo"
                width={100}
                height={100}
                className="rounded-lg w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20"
              />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-300 pixel-text">
                LOCAL EVENTS
              </h1>
              <p className="text-white text-xs sm:text-sm hidden sm:block">Pacific Northwest Calendar</p>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="/events" className="text-white hover:text-yellow-300 font-semibold transition-colors">
              Events
            </a>
            {/* <a href="/categories" className="text-white hover:text-yellow-300 font-semibold transition-colors">
              Categories
            </a>
            <a href="/venues" className="text-white hover:text-yellow-300 font-semibold transition-colors">
              Venues
            </a> */}
          </nav>
          
          {/* Mobile Menu Button */}
          <button className="md:hidden text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}