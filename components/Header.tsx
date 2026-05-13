import { getCurrentData } from '@/lib/data-utils';
import HeaderClient from './HeaderClient';

export default async function Header({ locale }: { locale: string }) {
  const { categories } = await getCurrentData(locale);
  return <HeaderClient categories={categories} />;
}
