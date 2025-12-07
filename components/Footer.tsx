import Link from 'next/link';
import { categories } from '@/data/projects';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-charcoal text-cream pt-16 pb-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* About */}
          <div>
            <h3 className="font-display text-2xl mb-4 text-bronze-300">ArteStudio</h3>
            <p className="text-cream/80 leading-relaxed">
              Professional scenography and event structures. Creating memorable spaces for conventions, exhibitions, fashion shows, and theater productions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-xl mb-4 text-bronze-300">Our Work</h4>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/projects/${cat.id}`}
                    className="text-cream/80 hover:text-bronze-300 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display text-xl mb-4 text-bronze-300">Contact</h4>
            <div className="space-y-3 text-cream/80">
              <p>
                Vicolo San Giorgio 5<br />
                20090 Buccinasco (MI)<br />
                Italy
              </p>
              <p>
                <a href="tel:+390289031657" className="hover:text-bronze-300 transition-colors">
                  +39 02 89031657
                </a>
              </p>
              <p>
                <a href="mailto:info@progettoartestudio.it" className="hover:text-bronze-300 transition-colors">
                  info@progettoartestudio.it
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-cream/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-cream/60 text-sm">
              © {currentYear} ArteStudio s.r.l. - P.IVA e C.F. 02513970182
            </p>
            <div className="flex gap-6">
              <Link href="/contact" className="text-cream/60 hover:text-bronze-300 transition-colors text-sm">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Blueprint decoration */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-transparent via-bronze-600 to-transparent opacity-50"
        aria-hidden="true"
      />
    </footer>
  );
}

