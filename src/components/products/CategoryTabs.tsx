import { CATEGORIES } from '@/types';
import { cn } from '@/lib/utils';

type CategoryFilter = 'all' | 'crops' | 'livestock';

interface CategoryTabsProps {
  activeCategory: CategoryFilter;
  onChange: (category: CategoryFilter) => void;
}

export function CategoryTabs({ activeCategory, onChange }: CategoryTabsProps) {
  const categories: { key: CategoryFilter; label: string; icon: string }[] = [
    { key: 'all', label: 'All', icon: '📦' },
    { key: 'crops', label: CATEGORIES.crops.label, icon: CATEGORIES.crops.icon },
    { key: 'livestock', label: CATEGORIES.livestock.label, icon: CATEGORIES.livestock.icon },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide lg:gap-3">
      {categories.map((cat) => (
        <button
          key={cat.key}
          onClick={() => onChange(cat.key)}
          className={cn(
            "flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200 lg:px-5 lg:py-3",
            activeCategory === cat.key
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          <span>{cat.icon}</span>
          <span>{cat.label}</span>
        </button>
      ))}
    </div>
  );
}
