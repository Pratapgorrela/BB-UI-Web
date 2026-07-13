import type { ServiceCategory } from '../types/catalog';

interface CategoryFilterBarProps {
  categories: ServiceCategory[];
  /** Selected category ID; `undefined` = All. */
  selectedId?: string;
  onSelect: (categoryId?: string) => void;
}

const chipBase =
  'h-11 shrink-0 rounded-full px-4 text-body-sm font-medium transition-colors duration-fast ease-fast focus-visible:shadow-focus focus-visible:outline-none';

function chipStyles(selected: boolean): string {
  return [
    chipBase,
    selected
      ? 'bg-primary-500 text-neutral-0'
      : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300',
  ].join(' ');
}

function CategoryFilterBar({ categories, selectedId, onSelect }: CategoryFilterBarProps) {
  if (categories.length === 0) return null;

  return (
    <div role="group" aria-label="Filter by category" className="flex gap-2 overflow-x-auto pb-1">
      <button
        type="button"
        aria-pressed={selectedId === undefined}
        onClick={() => onSelect(undefined)}
        className={chipStyles(selectedId === undefined)}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          aria-pressed={selectedId === category.id}
          onClick={() => onSelect(category.id)}
          className={chipStyles(selectedId === category.id)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}

export { CategoryFilterBar };
export type { CategoryFilterBarProps };
