import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import type { Project } from '@/types';

interface Props {
  projects: Project[];
}

export default function ImageShowcase({ projects }: Props) {
  return (
    <section className="py-0 bg-charcoal">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
        {projects.slice(0, 6).map((project) => (
          <Link
            key={project.id}
            href={`/project/${project.id}`}
            className="group relative aspect-square overflow-hidden"
          >
            <Image
              src={project.thumbnail}
              alt={project.thumbnailAlt || project.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-4">
              <h3 className="text-white font-display text-sm">{project.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
