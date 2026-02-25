import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryPageClient from '@/components/CategoryPageClient';
import { getCurrentData, getProjectsByCategory } from '@/lib/data-utils';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  try {
    const { categories } = await getCurrentData();
    return categories.map((category) => ({
      category: category.id,
    }));
  } catch (e) {
    console.error('Failed to load DB for static params', e);
    return [];
  }
}

export default async function CategoryPage({ 
  params 
}: { 
  params: Promise<{ category: string }> 
}) {
  const { category } = await params;
  const { categories } = await getCurrentData();
  
  const categoryData = categories.find(c => c.id === category);
  if (!categoryData) {
    notFound();
  }

  const projects = await getProjectsByCategory(category);

  return (
    <main className="min-h-screen">
      <Header />
      <CategoryPageClient categoryData={categoryData} projects={projects} />
      <Footer />
    </main>
  );
}
