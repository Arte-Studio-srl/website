import HeaderClient from './HeaderClient';
import type { Category } from '@/types';

export default function Header({ categories }: { categories: Category[] }) {
  return <HeaderClient categories={categories} />;
}
