import { Link } from 'react-router-dom';
import type { ServiceCategory } from '../types/catalog';

interface CategoryCardProps {
  category: ServiceCategory;
}

function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      to={`/categories/${category.slug}`}
      className="group block focus-visible:outline-none"
    >
      <div className="overflow-hidden rounded-2xl transition-transform duration-fast ease-fast group-hover:scale-[1.02] group-focus-visible:shadow-focus">
        <img
          src={category.imageUrl}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="aspect-182/157 w-full object-cover"
        />
      </div>
      <p className="mt-2 text-center text-body font-medium text-neutral-900">{category.name}</p>
    </Link>
  );
}

export { CategoryCard };
export type { CategoryCardProps };
