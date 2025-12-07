import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryPageClient from '@/components/CategoryPageClient';
import { categories, getProjectsByCategory } from '@/data/projects';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return categories.map((category) => ({
    category: category.id,
  }));
}

export default async function CategoryPage({ 
  params 
}: { 
  params: Promise<{ category: string }> 
}) {
  const { category } = await params;
  
  const categoryData = categories.find(c => c.id === category);
  if (!categoryData) {
    notFound();
  }

  const projects = getProjectsByCategory(category);

  return (
    <main className="min-h-screen">
      <Header />
      <CategoryPageClient categoryData={categoryData} projects={projects} />
      <Footer />
    </main>
  );
}
