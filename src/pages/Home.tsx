import { useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProductCard } from '@/components/products/ProductCard';
import { CategoryTabs } from '@/components/products/CategoryTabs';
import { SearchBar } from '@/components/products/SearchBar';
import { useProducts } from '@/contexts/ProductContext';
import { Sprout } from 'lucide-react';

type CategoryFilter = 'all' | 'crops' | 'livestock';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const { products } = useProducts();

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.subcategory.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

  return (
    <AppLayout>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Sprout className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">DalagHub</span>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 pb-2">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search crops, livestock, locations..."
          />
        </div>

        {/* Categories */}
        <CategoryTabs
          activeCategory={activeCategory}
          onChange={setActiveCategory}
        />
      </header>

      {/* Product Grid */}
      <section className="px-4 py-4">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 text-5xl">🔍</div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">No products found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </section>
    </AppLayout>
  );
}
