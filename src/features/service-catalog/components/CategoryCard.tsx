import { Link } from 'react-router-dom';
import type { ServiceCategory } from '../types/catalog';

interface CategoryCardProps {
  category: ServiceCategory;
}

function CategoryCard({ category }: CategoryCardProps) {
  const countLabel = `${category.serviceCount} ${category.serviceCount === 1 ? 'service' : 'services'}`;

  return (
    <Link
      to={`/categories/${category.slug}`}
      className="group relative block h-36 overflow-hidden rounded-lg bg-linear-to-br from-primary-500 to-primary-700 shadow-md transition-transform duration-fast ease-fast hover:scale-[1.02] focus-visible:shadow-focus focus-visible:outline-none"
    >
      <img
        src={category.imageUrl}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute bottom-0 right-0 h-28 w-24 rounded-tl-2xl object-cover opacity-90 transition-transform duration-fast ease-fast group-hover:scale-105"
      />
      <div className="relative p-4">
        <h3 className="font-heading text-h3 font-semibold text-neutral-0">{category.name}</h3>
        <p className="text-caption text-primary-100">{countLabel}</p>
      </div>
    </Link>
  );
}

export { CategoryCard };
export type { CategoryCardProps };
