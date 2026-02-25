import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const IconHouse = () => (
  <svg className="w-5 h-5" viewBox="0 0 256 256" fill="currentColor" aria-hidden>
    <path d="M219.3,108.7l-80-80a16,16,0,0,0-22.6,0l-80,80A15.9,15.9,0,0,0,32,120v96a8,8,0,0,0,8,8H96a8,8,0,0,0,8-8V160h48v56a8,8,0,0,0,8,8h56a8,8,0,0,0,8-8V120A15.9,15.9,0,0,0,219.3,108.7Z" />
  </svg>
);

const IconImages = () => (
  <svg className="w-5 h-5" viewBox="0 0 256 256" fill="currentColor" aria-hidden>
    <path d="M216,32H72A16,16,0,0,0,56,48V64H40A16,16,0,0,0,24,80V208a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16V192h16a16,16,0,0,0,16-16V48A16,16,0,0,0,216,32ZM72,48H216v94.3l-33.6-33.6a16.1,16.1,0,0,0-22.6,0L116,152.5,93.7,130.3a16.1,16.1,0,0,0-22.6,0L56,145.4V80H72Zm112,160H40V80H56v96a8,8,0,0,0,13.7,5.7L96,155,138.3,197.3a8,8,0,0,0,11.4-11.4l-22.3-22.3,32.2-32.2L216,187.3V192H184Z" />
  </svg>
);

export default function NotFound() {
  return (
    <main className="min-h-screen">
      <Header />

      <section className="relative min-h-[80vh] flex items-center justify-center bg-cream">
        <div className="absolute inset-0 blueprint-grid opacity-20" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            {/* 404 Number */}
            <div className="mb-8">
              <h1 className="font-display text-9xl md:text-[12rem] text-bronze-600 leading-none">
                404
              </h1>
            </div>

            {/* Decorative line */}
            <div className="h-1 bg-bronze-600 mx-auto mb-8 w-[120px]" />

            <h2 className="font-display text-4xl md:text-5xl text-charcoal mb-6">
              Page Not Found
            </h2>

            <p className="text-xl text-charcoal/70 mb-12 leading-relaxed">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
              Let&apos;s get you back on track.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-bronze-600 text-white hover:bg-bronze-700 transition-all font-display text-lg hover:shadow-xl"
              >
                <IconHouse />
                Back to Home
              </Link>
              <Link
                href="/projects/all"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-bronze-600 text-bronze-600 hover:bg-bronze-600 hover:text-white transition-all font-display text-lg"
              >
                <IconImages />
                View Projects
              </Link>
            </div>

            {/* Blueprint decoration */}
            <div className="mt-16">
              <svg className="w-32 h-32 mx-auto text-bronze-400 opacity-30" viewBox="0 0 128 128">
                <line x1="0" y1="0" x2="128" y2="0" stroke="currentColor" strokeWidth="2" />
                <line x1="0" y1="0" x2="0" y2="128" stroke="currentColor" strokeWidth="2" />
                <line x1="128" y1="0" x2="128" y2="128" stroke="currentColor" strokeWidth="2" />
                <line x1="0" y1="128" x2="128" y2="128" stroke="currentColor" strokeWidth="2" />
                <line x1="32" y1="0" x2="0" y2="32" stroke="currentColor" strokeWidth="1" />
                <line x1="128" y1="32" x2="96" y2="0" stroke="currentColor" strokeWidth="1" />
                <line x1="0" y1="96" x2="32" y2="128" stroke="currentColor" strokeWidth="1" />
                <line x1="96" y1="128" x2="128" y2="96" stroke="currentColor" strokeWidth="1" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
