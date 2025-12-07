import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProjectDetailClient from '@/components/ProjectDetailClient';
import { projects, getProjectById } from '@/data/projects';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return projects.map((project) => ({
    id: project.id,
  }));
}

export default async function ProjectDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const project = getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <Header />
      <ProjectDetailClient project={project} />
      <Footer />
    </main>
  );
}
